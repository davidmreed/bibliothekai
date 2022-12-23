/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Manipulates the browser history on the window.
 * Ths just uses the window.history functionality directly.
 */

/**
 * Sets a history state.

 * @param {string} path - query to set
 * @param {object} route - history state object
 */
export function set(path, route) {
  const data = route || {};
  window.history.pushState(data, '', path);
}
/**
 * Replaces the current history state.
 * @param {string} path - query to use as a replacement
 * @param {object} route - history state object
 */

export function replace(path, route) {
  const data = route || {};
  window.history.replaceState(data, '', path);
}