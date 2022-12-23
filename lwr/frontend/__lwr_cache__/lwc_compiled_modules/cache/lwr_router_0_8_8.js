import { registerDecorators as _registerDecorators } from "lwc";
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
import { freeze, getUrlFromPageReference, getPageReferenceFromUrl, matchRouteByUrl, getUrlFromPageReferenceAndRouteDef, parseRoutes } from 'lwr/routerUtils';
import { generateMessage, messages } from 'lwr/routerErrors';
import { createObservable } from 'lwr/observable';
class RouterImpl {
  /**
   * Create and configure the Router.
   *
   * @param {object} config - The router config object, all properties are optional
   */

  constructor(config) {
    this.deprecatedConfig = {};
    this.routeHandlerId = 0;
    this.compiledRoutes = [];
    this.routeObservable = createObservable();
    this.config = {
      basePath: config.basePath || '',
      caseSensitive: Boolean(config.caseSensitive),
      routes: config.routes || [],
      generateUrl: address => getUrlFromPageReference(address, this.compiledRoutes, this.config.basePath),
      parseUrl: url => getPageReferenceFromUrl(url, this.compiledRoutes, this.config.basePath)
    };
    const {
      DEPRECATED_getRouteFromUrl,
      DEPRECATED_getUrlFromRoute
    } = config;
    if (DEPRECATED_getRouteFromUrl) {
      this.deprecatedConfig.DEPRECATED_getRouteFromUrl = DEPRECATED_getRouteFromUrl;
    }
    if (DEPRECATED_getUrlFromRoute) {
      this.deprecatedConfig.DEPRECATED_getUrlFromRoute = DEPRECATED_getUrlFromRoute;
    }
    this.compiledRoutes = parseRoutes(this.config);
  }
  /**
   * Convert address to url string.
   *
   * @param address
   */

  generateUrl(address) {
    const {
      DEPRECATED_getUrlFromRoute: getUrlFromRoute
    } = this.deprecatedConfig;
    if (getUrlFromRoute) {
      return getUrlFromRoute(address, this.config.generateUrl);
    } else {
      return this.config.generateUrl(address);
    }
  }
  /**
   * Convert url string to address.
   *
   * @param url
   */

  parseUrl(url) {
    const {
      DEPRECATED_getRouteFromUrl: getRouteFromUrl
    } = this.deprecatedConfig;
    if (getRouteFromUrl) {
      return getRouteFromUrl(url, this.config.parseUrl);
    } else {
      return this.config.parseUrl(url);
    }
  }
  /**
   * Match the given url against the internal route definitions and return info
   * on the match.
   *
   * @param address - The address to match
   */

  matchRoute(address) {
    const url = typeof address === 'string' ? address : this.generateUrl(address);
    if (url === null) {
      return null;
    }
    const match = matchRouteByUrl(url, this.compiledRoutes, this.config.basePath);
    const pathMatch = match && getUrlFromPageReferenceAndRouteDef(match.route.pageReference, match.routeDefinition, this.config.basePath);
    if (!match || !pathMatch) {
      return null;
    }
    return {
      pathMatch,
      route: match.route,
      routeDefinition: match.routeDefinition.original
    };
  }
  /**
   * Given an address, return the associated viewset by calling the route handler.
   *
   * @param address - The address to match to a viewset
   */

  async resolveView(address) {
    return new Promise((resolve, reject) => {
      // get the RoutingMatch: { pathMatch, route, routeDefinition }
      const routingMatch = this.matchRoute(address);
      if (!routingMatch) {
        return reject(generateMessage(messages.NO_ROUTE_MATCH, [JSON.stringify(address)]));
      } // retrieve the route handler and use it to get the RouteDestination
      // handler ~= import('my/handlerModule');

      return routingMatch.routeDefinition.handler().then(handlerModule => {
        // the route handler class is the module's default export
        const routeHandlerClass = handlerModule.default;
        if (!routeHandlerClass) {
          return reject(generateMessage(messages.INVALID_ROUTE_HANDLER, [routingMatch.routeDefinition.id]));
        } // instantiate an instance of the route handler class
        // and pass in resolve() as the RouteHandlerCallback

        const routeHandler = new routeHandlerClass(resolve); // update() will invoke the resolve callback with the matching RouteDestination/viewset

        if (routeHandler) {
          routeHandler.update(routingMatch.route);
        }
      });
    });
  }
  /**
   * Process the given URL by matching it to an existing route and looking up
   * the associated view
   *
   * @param {object} address
   */

  navigate(address) {
    const routingMatch = this.matchRoute(address);
    if (!routingMatch) {
      throw new Error(generateMessage(messages.MISSING_ROUTE, [JSON.stringify(address)]));
    }
    this.pendingRoute = _objectSpread({}, routingMatch); // map the matched route to a view and notify subscribers

    this._mapView(this.pendingRoute);
  }
  /**
   * lightning/navigation
   * Subscribe a callback to the Observable on the current route of this router.
   *
   * @param {function} callback - A callback function invoked when the navigation state changes
   *                     callback(route, routeDef)
   * @param {boolean} replay - Flag to determine if callback should be called with current route and data immediately
   */

  subscribe(callback, replay) {
    return this.routeObservable.subscribe({
      next: callback,
      error: () => {// ignore
      },
      complete: () => {// nothing to clean up
      }
    }, Boolean(replay));
  }
  /**
   * Map the given route to a view set that can be emitted to subscribers. After the correct handler
   * is determined (picked from the routers routes in the config), view mapping is delegated to the
   * handler with a callback to finish processing and emit the final result.
   *
   * @param {*} route
   * @param {*} routeInfo
   */

  async _mapView(routingMatch) {
    // set an id in case _mapView is called again.
    const routeHandlerId = Math.random();
    this.routeHandlerId = routeHandlerId;
    const handlerModule = await routingMatch.routeDefinition.handler();
    const routeHandlerClass = handlerModule.default;
    if (!routeHandlerClass) {
      throw new Error(generateMessage(messages.INVALID_ROUTE_HANDLER, [routingMatch.routeDefinition.id]));
    }
    this.routeHandler = new routeHandlerClass(routeDestination => {
      // If the id in the callback no longer matches the latest id from the router, it indicates _mapView
      // was called again after this handler began loading but before the callback completed.
      this._updateView(routeHandlerId, routeDestination);
    });
    if (this.routeHandler) {
      this.routeHandler.update(routingMatch.route);
    }
    return true;
  }
  /**
   * Set internal state, notify observable with frozen data, and propagate to child router
   *
   * @param {*} viewDestination
   */

  _updateView(viewHandlerId, routeDestination) {
    if (!routeDestination || viewHandlerId !== this.routeHandlerId) {
      // no-op, a status handler stopped the action
      // or this callback does not belong to the most recent view handler.
      return;
    }
    if (!this.pendingRoute) {
      throw new Error('Trying to commit route state without a route');
    }
    const viewset = freeze(routeDestination.viewset);
    this.routeObservable.next(_objectSpread(_objectSpread(_objectSpread({}, this.pendingRoute), routeDestination), {}, {
      viewset
    }));
  }
} // export the function only instead of the class, may give us more flexibility in the future
_registerDecorators(RouterImpl, {
  fields: ["deprecatedConfig", "routeHandlerId"]
});
export function createRouter(config = {}) {
  return new RouterImpl(config);
} // export router types and interfaces