/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateMessage, messages } from 'lwr/routerErrors';
// Keep a cache of context metadata, with their IDs as keys
const CACHE = new WeakMap();
/**
 * Return a navigation context by ID.
 * Exported API.
 *
 * @param {*} id - The ID of a navigation context.
 *
 * @return {object} - { navigate(), generateUrl(), subscribe() }
 */

export function getNavigationHelm(id) {
  const metadata = CACHE.get(id);
  if (!metadata || !metadata.value) {
    throw new Error(generateMessage(messages.MISSING_CONTEXT));
  }
  return metadata.value;
}
/**
 * Create and return the metadata for this context provider.
 * Cache the metadata by ID.
 *
 * @param {object} contextValue - Context API object
 * @param {RouteDefinition[]} data - Route data for this context
 *
 * @return {object} - The metadata object
 */

export function registerNavigationHelm(contextId, contextValue) {
  const metadata = {
    id: contextId,
    value: contextValue,
    update: newValue => {
      metadata.value = newValue;
    }
  }; // Cache and return.

  CACHE.set(metadata.id, metadata);
  return metadata;
}