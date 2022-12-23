import { registerDecorators as _registerDecorators } from "lwc";
/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { DomRouterImpl } from 'lwr/domRouter';
import { getRelativeUrl, replace, set } from 'lwr/domRouterUtils';
import { hasDocument } from 'lwr/routerUtils';

/*
 * Provides a Router rooted to the window, which controls the browser history by default.
 */
export class HistoryRouter extends DomRouterImpl {
  constructor(...args) {
    super(...args);
    this.historyDisabled = false;
  }
  /**
   * Override.
   * Initialize with the current route and listen to the popstate event for future changes.
   */

  connect() {
    super.connect();
    if (!this.historyDisabled) {
      // Subscribe to the Window.popstate event to listen for URL changes.
      hasDocument && window.addEventListener('popstate', this.onpopstate.bind(this)); // Initialize using the current URL state

      this.onpopstate();
    }
  }
  onpopstate() {
    // Only the root should update the url since it has the full context
    if (!this.parent && hasDocument) {
      this.catchBrowserUpdate(getRelativeUrl(document.location.href));
    }
  }
  disconnect() {
    super.disconnect();
    hasDocument && window.removeEventListener('popstate', this.onpopstate);
  }
  /**
   * Override.
   * Update the browser history if the preNavigate hooks.
   *
   * @param {string} url - The URL to go to
   * @param {boolean} shouldReplace - True if the current history state should be replaced
   * @param {boolean} updateHistory - True if the browser history should be updated with the new URL
   *
   * @returns {boolean} - True if the processing was NOT blocked by a preNavigate listener
   */

  async process(url, shouldReplace, updateHistory = true) {
    // Run the preNavigate hooks to check if this event should be processed.
    const canContinue = await super.process(url); // Update the window location if this router is connected and is the root router

    if (canContinue && !this.historyDisabled && updateHistory && this.connected && !this.parent) {
      // Update the window history.
      if (shouldReplace) {
        replace(url);
      } else {
        set(url);
      }
    }
    return canContinue;
  }
  /**
   * Update the root route, and trickle down the router tree.
   * Redirect to use the base path, if it is missing.
   *
   * @param {string} url - The URL to go to
   */

  catchBrowserUpdate(url) {
    this.process(url, false, false);
  }
  /*LWC compiler v2.17.0*/
}
/**
 * Create a new root Router, attach to the Window.
 * This is the public, programmitic API for root router creation.
 * An application can only have ONE root router.
 *
 * @param {object} config - The router config object
 *
 * @returns {object} - { addPreNavigate, addPostNavigate, addErrorNavigate, connect, disconnect }
 */
_registerDecorators(HistoryRouter, {
  fields: ["historyDisabled"]
});
export function createHistoryRouter(config, router, target) {
  return new HistoryRouter(config, router, target);
}