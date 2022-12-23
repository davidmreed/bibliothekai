/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Utilities for parsing URLs.
 * Definitions:
 *      - URL: absolute "http://www.somewhere.com/some/path?with=params&more=params" or relative "/some/path?with=params&more=params"
 *      - path: A URL's pathname: "/some/path"
 *      - query: A URL's search parameters: "?with=params&more=params"
 */

/**
 * f("one two &") -> "one%20two%20%26"
 *
 * @param str - String to URI encode
 *
 * @returns {string}
 */
export function encode(str = '') {
  str = str || '';
  return encodeURIComponent(str);
}
/**
 * f("one%20two%20%26") -> "one two &"
 *
 * @param str - String to URI decode
 *
 * @returns {string}
 */

export function decode(str = '') {
  str = str || '';
  return decodeURIComponent(str);
}
/**
 * f(url) -> "/some/relative/path"
 * Output will...
 * - always start with '/'
 * - not contain query params or fragment
 * - akin to window.location.pathname
 *
 * @param   {string} url - URL string to parse for a path
 *
 * @returns {string}
 */

export function getPathFromUrl(url) {
  url = url || '/';
  if (url.charAt(0) !== '/') {
    url = '/' + url;
  } // can't use url object here to maintain portability

  const fullmatch = url.match(/^[^#?]+/);
  if (fullmatch !== null) {
    const path = fullmatch[0];
    return path === '/' ? '/' : path.replace(/\/$/, '');
  }
  return '/';
}
/**
 * f(url) -> { "param1": "one", "param2": "two", param3: "" }
 * Parameters without values get set to an empty string.
 *
 * @param {string} url - URL string to parse for a query object
 *
 * @returns {object}
 */

export function getQueryFromUrl(url) {
  // Ensure this is a full URL.
  url = url || ''; // Remove the fragment off the end if present

  const fragmentStart = url.indexOf('#');
  if (fragmentStart >= 0) {
    url = url.substring(0, fragmentStart);
  } // can't use url object here to maintain portability

  const queryIdx = url.indexOf('?');
  const queryStr = queryIdx >= 0 ? url.substr(queryIdx + 1) : null;
  const queryParams = {};
  if (queryStr) {
    queryStr.split('&').forEach(pair => {
      if (pair.indexOf('=') >= 0) {
        const [key, value = ''] = pair.split('=');
        queryParams[decode(key)] = decode(value);
      } else {
        // e.g, ?qKey1 => { qKey1: null }
        queryParams[decode(pair)] = null;
      }
    });
  }
  return queryParams;
}
/**
 * f({ "param1": "one", "param2": "two", param3: "" }) -> "?param1=one&param2=two&param3"
 * Query parameter values, but not keys, get URI encoded.
 *
 * @param {object} queryObject - Query object to turn into a string
 *
 * @returns {string}
 */

export function getQueryString(queryObj = {}) {
  const keys = Object.keys(queryObj);
  return keys.length // handle params without values here
  ? `?${keys.map(key => {
    const value = queryObj[key];
    if (value === null) {
      // { qKey: null } => '?qKey
      return key;
    }
    return `${key}=${encode(value)}`;
  }).join('&')}` : '';
}
/**
 * Determines if the given string is a paramter name (":paramName")
 * @param str string to test
 * @returns true if string starts with ":"
 */

export function isParam(str) {
  return str && str.length > 1 ? str.startsWith(':') : false;
}
/**
 * @param routeParamName - routeParamName from CompiledQueryResult
 * @returns the paramName without prefix; or undefined
 */

export function getParamName(routeParamName) {
  return routeParamName ? isParam(routeParamName) ? routeParamName.substr(1) : false : false;
}
export function getQueryNames(compiledQuery) {
  return Object.values(compiledQuery).reduce((paramNames, {
    routeParamName
  }) => {
    const paramName = getParamName(routeParamName);
    if (paramName) {
      paramNames.push(paramName);
    }
    return paramNames;
  }, []);
}