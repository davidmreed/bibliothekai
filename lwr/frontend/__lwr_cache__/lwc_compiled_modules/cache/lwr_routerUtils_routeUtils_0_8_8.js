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
import { getPathFromUrl, getQueryFromUrl, getQueryString, isParam, getParamName, getQueryNames } from './uriUtils';
import { getPageReferenceFromUriAndRouteDef, matchRouteDefinitionByPageReference, getPathParams, getQueryParams } from './routeDefUtils';

/**
 * Returns true if the given path & queryObj match the patterns (if any) defined in the routeDef
 *
 * @param path the path to match patterns against
 * @param queryObj queryObject to match patterns against
 * @param routeDef RouteDef with given patterns
 */
function isRoutePatternsMatched(path, queryObj, routeDef) {
  const {
    original: {
      patterns = null
    } = {}
  } = routeDef || {};
  if (patterns) {
    // If patterns are defined, validate param values match pattern.
    const pathParams = getPathParams(path, routeDef);
    const queryParams = getQueryParams(queryObj, routeDef);
    const params = _objectSpread(_objectSpread({}, pathParams), queryParams); // For each entry in patterns, ensure the given pattern matches the input for the
    // param that has the same name

    return Object.keys(patterns).every(paramKey => {
      const pattern = patterns[paramKey]; // pattern must match full value

      const regex = new RegExp(pattern);
      const paramValue = params[paramKey] || '';
      return regex.test(paramValue);
    });
  } // If no patterns, this route matches.

  return true;
}
/**
 * Returns the CompiledRouteDefinition that matches the given input path and queryObj. This will return
 * the CompieldRouteDefinition that matches both the path and the largest number of given query params.
 *
 * For example:
 * Given: /?qParam=val1&anotherParam=val2 AND
 * Routes: [{ id: 'home',  uri: '/' }, { id: 'home-qParam', uri: '/?:qParam' },{ id: 'home-qParam-anotherParam', uri: '/?:qParam&:anotherParam' }]
 * Return "home-qParam-anotherParam" since it matches the path AND the most number of query params
 *
 * @param {string} path - Path section for the current navigation
 * @param {QueryObject} queryObj - object representing the query string for the current navigation
 * @param {CompiledRouteDefinition[]} routeDefs - array of compiled route definitions to match the
 * input path and queryObj against.
 * @returns {CompiledRouteDefinition | null} - The matching CompiledRouteDefinition, or null if none match
 */

function getRouteDefinitionForUri(uri, routeDefs) {
  // Try to match the URL to a Route Definition
  // RouteDefintions that match the path segments.
  const path = getPathFromUrl(uri);
  const queryObj = getQueryFromUrl(uri);
  const matchedPaths = routeDefs ? routeDefs.filter(def => def.regex.test(path)) : [];
  const [matched] = matchedPaths.filter(def => {
    const {
      queryMatcher
    } = def;
    return queryMatcher(queryObj) && isRoutePatternsMatched(path, queryObj, def);
  });
  return matched || null;
}
/**
 * f(URL, routes[]?) -> route
 * Match a URL's path to a Route Definition, use these to build a route.
 *
 * @param {string} url - URL string to turn into a route
 * @param {array[object]} routeDefs - List of Route Definitions to match to the url
 * @param {string} basePath - Optional: if provided, remove the base path before conversion.
 *
 * @returns {object}
 */

export function matchRouteByUrl(url, routeDefs, basePath = '') {
  // Pass in the rest of the URL for matching, without the prefix.
  if (basePath && url.indexOf(basePath) === 0) {
    url = url.replace(basePath, '');
  } // Parse the URL.

  const routeDef = getRouteDefinitionForUri(url, routeDefs);
  let matchInfo; // If there is no Route Definition match, return null

  if (!routeDef) {
    return null;
  } else {
    const pageReference = getPageReferenceFromUriAndRouteDef(url, routeDef);
    if (pageReference) {
      // Return the route with the Route Definition as data.
      const originalRouteDef = routeDef.original;
      matchInfo = {
        route: {
          id: originalRouteDef.id,
          attributes: _objectSpread({}, pageReference.attributes),
          state: _objectSpread({}, pageReference.state),
          pageReference: {
            type: pageReference.type,
            attributes: _objectSpread({}, pageReference.attributes),
            state: _objectSpread({}, pageReference.state)
          }
        },
        routeDefinition: routeDef
      };
      return matchInfo;
    }
  } // if pageReference is null here we didn't match

  return null;
}
/**
 * Serializes the given pageReference into a url based on the first route definition
 * with a binding the pageReference matches against.
 * @param pageReference pageReference to serialize into url
 * @param routeDefs RouteDefs to match pageReference against
 * @param basePath Base path for the url
 * @returns the url or null if no match
 */

export function getUrlFromPageReference(pageReference, routeDefs, basePath = '') {
  const routeDef = matchRouteDefinitionByPageReference(pageReference, routeDefs);
  if (routeDef) {
    return getUrlFromPageReferenceAndRouteDef(pageReference, routeDef, basePath);
  }
  return null;
}
/**
 * Extracts out the pageReference values for the given parameters defined within the pageBindings
 * @param parameters array of strings to retrieve values for
 * @param pageReference pageReference that binds the values for the parameters
 * @param pageBindings Specifies the attribute and state bindings
 * @returns key value map where the key is parameterName and the value is the parameter value as specified in the pageReference
 */

function extractBindingValues(parameters, pageReference, pageBindings) {
  const {
    attributeBindings,
    stateBindings
  } = pageBindings;
  const {
    attributes: refAttributes,
    state: refState
  } = pageReference;
  const parameterValueMapping = {};
  parameters.forEach(paramName => {
    const [attributeBindingKey] = Object.keys(attributeBindings).filter(attributeBindingKey => {
      return getParamName(attributeBindings[attributeBindingKey]) === paramName;
    });
    if (attributeBindingKey) {
      parameterValueMapping[paramName] = refAttributes[attributeBindingKey];
    } else {
      const [stateBindingKey] = Object.keys(stateBindings).filter(stateBindingKey => {
        return getParamName(stateBindings[stateBindingKey]) === paramName;
      });
      if (stateBindingKey) {
        parameterValueMapping[paramName] = refState[stateBindingKey];
      }
    }
  });
  return parameterValueMapping;
}
/**
 * Generates a url for the given pageReference using the given routeDef
 * @param pageReference pageReference to serialize
 * @param routeDef routeDef to that defines how serialize the given pageReference
 * @returns url for the given pageReference
 */

export function getUrlFromPageReferenceAndRouteDef(pageReference, routeDef, basePath = '') {
  const {
    params,
    original: {
      page = {}
    } = {},
    toPath,
    compiledQuery
  } = routeDef;
  const {
    attributes: attributeBindings = {},
    state: stateBindings = {}
  } = page; //

  const pathParamNames = params.filter(({
    name
  }) => {
    // We don't support unnamed params, strip them out.
    return typeof name === 'string';
  }).map(({
    name
  }) => {
    // type checking doesn't recognize that this is always a string.
    return name;
  }); // For each pathParam, get the corresponding pageReference attribute or state value.

  const pathParameters = extractBindingValues(pathParamNames, pageReference, {
    attributeBindings,
    stateBindings
  }); // Use the toPath for this routeDef to get path portion of URL

  const toPathUrl = toPath(pathParameters); // Get all the route params specified in the query string

  const queryParamNames = getQueryNames(compiledQuery); // For each queryParam, get the corresponding pageReference attribute or state value.

  const queryParameters = extractBindingValues(queryParamNames, pageReference, {
    attributeBindings,
    stateBindings
  });
  const queryObject = getQueryObjectForParametersAndPageReference(pageReference, queryParameters, routeDef);
  const queryString = getQueryString(queryObject);
  return `${basePath}${toPathUrl}${queryString}`;
}
/**
 * Create a queryObject using the given pageReference, queryParameters, using the routeDef to specify
 * which state is bound via query bindings.
 * @param pageReference
 * @param queryParameters
 * @param routeDef
 * @returns queryObject
 */

function getQueryObjectForParametersAndPageReference(pageReference, queryParameters, routeDef) {
  const {
    compiledQuery,
    original: {
      page: {
        state: stateBindings = {}
      }
    }
  } = routeDef;
  const {
    state: refState = {}
  } = pageReference || {};
  const nonParamState = {};
  Object.keys(refState).filter(stateKey => {
    const bindingValue = stateBindings[stateKey];
    return !isParam(bindingValue);
  }).forEach(key => nonParamState[key] = refState[key]);
  const queryParamKeyValueMap = {};
  Object.keys(queryParameters).forEach(paramName => {
    const paramValue = queryParameters[paramName];
    const [compiledQueryMatch] = Object.keys(compiledQuery).filter(key => {
      const compiledValue = compiledQuery[key];
      const {
        routeParamName
      } = compiledValue;
      return getParamName(routeParamName) === paramName;
    });
    if (compiledQueryMatch) {
      const queryKey = compiledQueryMatch;
      queryParamKeyValueMap[queryKey] = paramValue;
    }
  });
  return _objectSpread(_objectSpread({}, nonParamState), queryParamKeyValueMap);
}
/**
 * Obtains the pageReference for the given URL
 */

export function getPageReferenceFromUrl(url, routeDefs, basePath = '') {
  const routingMatch = matchRouteByUrl(url, routeDefs, basePath);
  if (routingMatch && routingMatch.route && routingMatch.route.pageReference) {
    return routingMatch.route.pageReference;
  }
  return null;
}