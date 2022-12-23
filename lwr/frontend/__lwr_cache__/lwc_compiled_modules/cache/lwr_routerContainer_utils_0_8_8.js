/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { HistoryRouter } from 'lwr/historyRouter';
import { invariant, messages } from 'lwr/routerErrors';
import { DomRouterImpl } from 'lwr/domRouter';

/*
 * Provides programmatic routing capabilities.
 */
// The application may create 1 root router at a time.
let hasRoot = false;

/**
 * Create a new navigation context, attach to the given node.
 * An application can only have ONE root router.
 *
 * @param {HTMLElement} - The DOM node where the navigation context should be established
 * @param {object} config - The router config object, all properties are optional
 *
 * @returns {object} - { addPreNavigate, addPostNavigate, addErrorNavigate, connect, disconnect }
 */
export function createNavigationContext(node, config = {}, portableRouter) {
  // Create a DOM or History Router
  const newRouter = config.historyDisabled ? new DomRouterImpl(config, portableRouter, node) : new HistoryRouter(config, portableRouter, node); // Return a subset of the new router's capabilities.

  const routerAPI = {
    /**
     * Surface the preNavigate hook register function.
     *
     * @param {function} listener - The preNavigate hook listener function
     * @returns {object} - This bag of Router functions, for chaining
     */
    addPreNavigate: listener => {
      newRouter.addPreNavigate(listener);
      return routerAPI;
    },
    /**
     * Surface the postNavigate hook register function.
     *
     * @param {function} listener - The postNavigate hook listener function
     * @returns {object} - This bag of Router functions, for chaining
     */
    addPostNavigate: listener => {
      newRouter.subscribe(listener);
      return routerAPI;
    },
    /**
     * Surface the errorNavigate hook register function.
     *
     * @param {function} listener - The errorNavigate hook listener function
     * @returns {object} - This bag of Router functions, for chaining
     */
    addErrorNavigate: listener => {
      newRouter.addErrorNavigate(listener);
      return routerAPI;
    },
    /**
     * Connect the root router if there isn't already one connected.
     */
    connect: () => {
      // Connect and expose this router's navigation context.
      newRouter.connect(); // If there is already a root router, the new router must be a child (have a parent).

      invariant(!hasRoot || !!newRouter.parent, messages.MULTIPLE_ROOTS);
      hasRoot = hasRoot || !newRouter.parent;
      routerAPI.id = newRouter.contextId;
    },
    /**
     * Disconnect the router, and reset the root tracking variable.
     */
    disconnect: () => {
      hasRoot = hasRoot && !!newRouter.parent;
      newRouter.disconnect();
    }
  }; // Return the public Router functions.

  return routerAPI;
}