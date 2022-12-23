function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { decode, getPathFromUrl, getQueryFromUrl, isParam } from './uriUtils';

/**
 * f(route, routes[]) -> RouteDef
 * Match a route's id to a Route Definition id from the given list.
 *
 * @param {object} route - Route to match to a Route Definition
 * @param {array[object]} routeDefs - List of Route Definitions to match to the url
 *
 * @returns {object | null}
 */
export function matchRouteDefinitionByPageReference(pageReference, routeDefs) {
  if (!pageReference) {
    return null;
  }
  const {
    type: refType,
    attributes: refAttrs = {},
    state: refState = {}
  } = pageReference; // MATCH BY TYPE/ATTRIBUTES, to find a match:
  //      - a route def page type = the route type
  //      - the given pageReference has all the same attributes as the page binding attributes
  //      - the given pageReference has NO MORE attributes than defined in the page binding attributes
  //      - the given pageReference has all the state keys defined within the page binding state (but pageReference can have more)
  //      - any literals in the page bindings MUST match the values in the pageReference
  //      - if more than 1 route def matches the route, choose the first match

  if (refType) {
    // Locate all matches.
    const [matched] = routeDefs.filter(compiledDef => {
      const {
        original: {
          page: {
            type = null,
            attributes: pageAttrs = {},
            state: pageState = {}
          } = {}
        }
      } = compiledDef; // pageReference type matches page binding type

      const matchesType = type === refType; // to match this route, pageReference attribute keys match all the keys in page binding attributes

      const refAttributesHasAllPageKeys = Object.keys(pageAttrs).every(key => {
        return Object.keys(refAttrs).indexOf(key) >= 0;
      }); // Ensure the ref doesn't have extra keys

      const refAttributesHasSameNumberOfKeys = Object.keys(pageAttrs).length === Object.keys(refAttrs).length; // to match this route, the pageReference state keys should
      // match the state keys in the page binding

      const refStateHasAllPageKeys = Object.keys(pageState).every(key => {
        return Object.keys(refState).indexOf(key) >= 0;
      }); // All keys specified in `page.attributes` with literal values (not :params), does the pageReference have the same
      // exact value?

      const pageAttributeLiteralsCompletelyMatch = Object.keys(pageAttrs).filter(key => {
        const value = pageAttrs[key];
        return !value || !isParam(value);
      }).every(key => pageAttrs[key] === refAttrs[key]);
      const pageStateLiteralsCompletelyMatch = Object.keys(pageState).filter(key => {
        const value = pageState[key];
        return value === null || !isParam(value);
      }).every(key => pageState[key] === refState[key]);
      return matchesType && refAttributesHasAllPageKeys && refAttributesHasSameNumberOfKeys && pageAttributeLiteralsCompletelyMatch && refStateHasAllPageKeys && pageStateLiteralsCompletelyMatch;
    });
    return matched || null;
  } // NO MATCH:

  return null;
}
/**
 * Returns an object of paramName->pathValue pairs based on the given path string
 * and the params defined within the routeDef uri
 * @param path
 * @param routeDef
 */

export function getPathParams(path, routeDef) {
  const {
    regex,
    params: definedParams
  } = routeDef;
  const execArray = regex.exec(path);
  if (execArray) {
    // drop the full string match at idx 0
    const [, ...pathParamValues] = execArray; // For each defined param, match it up with the path value

    const pathParams = {};
    definedParams.forEach((param, index) => {
      const {
        name: paramName
      } = param;
      const paramValue = pathParamValues[index];
      pathParams[paramName] = paramValue ? decode(paramValue) : paramValue;
    });
    return pathParams;
  } // regex didn't match

  return null;
}
/**
 * Returns an object of paramName->queryValue pairs based on the given queryObject
 * and bindings defined within the routeDef uri
 * @param queryObj
 * @param routeDef
 */

export function getQueryParams(queryObj, routeDef) {
  if (queryObj && routeDef) {
    const {
      queryMatcher
    } = routeDef;
    const matchedQuery = queryMatcher(queryObj);
    if (matchedQuery) {
      // Using the MatchedQuery, build out an object of format `{ [paramName]: value }`
      const params = {};
      Object.keys(matchedQuery).forEach(queryKeyName => {
        const paramValue = matchedQuery[queryKeyName];
        const {
          value,
          routeParamName
        } = paramValue;
        const paramName = routeParamName ? routeParamName.substr(1) : queryKeyName;
        params[paramName] = value ? decode(value) : value;
      });
      return params;
    }
  }
  return null;
}
/**
 * Filters queryObject to only key/values that are not bound in routeDef page bindings
 * @param queryObj
 * @param routeDef
 * @returns queryObj without the entries that are bound in the page bindings
 */

function getUnboundQueries(queryObj, routeDef) {
  const {
    compiledQuery
  } = routeDef; // these query keys are bound

  const boundKeys = Object.keys(compiledQuery).filter(qKey => {
    const {
      literalValue
    } = compiledQuery[qKey]; // literals aren't bound

    return !literalValue;
  });
  const unbound = {};
  Object.keys(queryObj).forEach(queryKey => {
    const queryValue = queryObj[queryKey];
    if (boundKeys.indexOf(queryKey) < 0) {
      unbound[queryKey] = queryValue;
    }
  });
  return unbound;
}
/**
 * f(path, routeDef) -> { "attr1": "one", "attr2": "two" }
 * Parse a path into an object of attributes based on the Route Definition's parameterized path.
 * URI decode the path parts that are parsed as attributes.
 *
 * @param {string} path - A path (hopefully) matching the Route Definition
 * @param {object} routeDef - Route Definition containing the path to parameterize
 *
 * @returns {object}
 */

export function getPageReferenceFromUriAndRouteDef(uri, routeDef) {
  if (routeDef) {
    const {
      original: {
        page: {
          type: pageType = '',
          attributes: pageAttributes = {},
          state: pageState = {}
        } = {}
      } = {}
    } = routeDef;
    const path = getPathFromUrl(uri);
    const query = getQueryFromUrl(uri);
    const pathParams = getPathParams(path, routeDef);
    const queryParams = getQueryParams(query, routeDef);
    if (pathParams && queryParams) {
      const allParams = _objectSpread(_objectSpread({}, pathParams), queryParams);
      const boundAttributeParams = {};
      Object.keys(pageAttributes).forEach(attributeKey => {
        const attributeValue = pageAttributes[attributeKey];
        let value;
        if (attributeValue && isParam(attributeValue)) {
          const paramName = attributeValue.substr(1);
          value = allParams[paramName];
        } else {
          value = attributeValue;
        }
        boundAttributeParams[attributeKey] = value;
      });
      const boundStateParams = {};
      Object.keys(pageState).forEach(stateKey => {
        const stateValue = pageState[stateKey];
        let value;
        if (stateValue && isParam(stateValue)) {
          const paramName = stateValue.substr(1);
          value = allParams[paramName];
        } else {
          value = stateValue;
        }
        boundStateParams[stateKey] = value;
      });
      const unboundState = getUnboundQueries(query, routeDef);
      return {
        type: pageType,
        attributes: _objectSpread({}, boundAttributeParams),
        state: _objectSpread(_objectSpread({}, unboundState), boundStateParams)
      };
    }
  }
  return null;
}