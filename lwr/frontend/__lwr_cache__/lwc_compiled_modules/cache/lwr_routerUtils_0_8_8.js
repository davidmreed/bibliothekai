/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
export { createFilterChain } from './filterUtils';
export { getPageReferenceFromUriAndRouteDef } from './routeDefUtils';
export { getUrlFromPageReference, getPageReferenceFromUrl, matchRouteByUrl, getUrlFromPageReferenceAndRouteDef } from './routeUtils';
export { isObject, freeze, guid, isValidRoute } from './typeUtils';
export { parseRoutes } from './parseUtils';
import { pathToRegexp as ptr, compile as ptrCompile } from './pathToRegexp';
export const pathToRegexp = {
  pathToRegexp: ptr,
  compile: ptrCompile
};
export { getPathFromUrl, getQueryFromUrl, getQueryString, encode, decode } from './uriUtils';
export { hasDocument } from './domUtils';