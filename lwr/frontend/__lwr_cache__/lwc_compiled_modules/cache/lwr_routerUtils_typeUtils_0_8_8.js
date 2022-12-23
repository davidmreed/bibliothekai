/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Utilities for checking type, including route types.
 */

/**
 * @param {*} o - Item to check if it's an object
 * @returns {boolean}
 */
export function isObject(o) {
  return typeof o === 'object' && o !== null && !Array.isArray(o);
}
/**
 * true if input is string
 * @param o
 */

export function isString(o) {
  return typeof o === 'string';
}
function objectHasKey(o, key) {
  return key in o;
}
/**
 * @param {*} o - Object to freeze N layers deep (e.g. { prop: 'p', o: { one: 1, two: 2 } })
 */

export function freeze(o, depthLimit = 2) {
  if (isObject(o)) {
    try {
      Object.freeze(o);
      if (depthLimit > 0) {
        Object.keys(o).forEach(key => {
          if (objectHasKey(o, key)) {
            const val = o[key];
            if (val && typeof val === 'object') {
              freeze(val, depthLimit - 1);
            }
          }
        });
      }
    } catch (e) {// Squash errors that occur when trying to freeze a Proxy.
      // This can happen when the Object has previously been sent over the wire-service.
    }
  }
  return o;
}
/**
 * Return a 4 character identifier.
 */

export function guid() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
/**
 * f(route) -> true/false
 *
 * @param {*} route - Item to check if it's a valid route
 *
 * @returns {boolean}
 */

export function isValidRoute(object) {
  const expected = ['id', 'attributes', 'state', 'pageReference']; // Ensure the type is Object with properties defined in RouteInstance

  const {
    pageReference = null
  } = object || {};
  return isObject(object) && hasExactProperties(object, expected) && isValidPageReference(pageReference);
}
/**
 * Returns true if the given object is a valid pageReference.
 * @param object
 */

export function isValidPageReference(object) {
  const expected = ['type', 'state', 'attributes'];
  const {
    type,
    state,
    attributes
  } = object || {};
  const validTypes = isObject(object) && isString(type) && isObject(state) && validNullableString(state) && isObject(attributes) && validNullableString(attributes);
  return hasExactProperties(object, expected) && validTypes;
}
/**
 * Returns true if the given object has strings for keys and string or null for values
 * @param object
 */

function validNullableString(object) {
  return Object.keys(object).every(key => {
    const val = object[key];
    return typeof key === 'string' && (typeof val === 'string' || val === null);
  });
}
/**
 * Returns true if the given object contains all the expectedKeys, and no extras
 * @param object to test
 * @param {string[]} expectedKeys list of keys object should have (and ONLY have)
 */

function hasExactProperties(object, expectedKeys) {
  if (isObject(object)) {
    const hasAllExpected = expectedKeys.every(expectedKey => objectHasKey(object, expectedKey));
    const actual = Object.keys(expectedKeys);
    const actualHasNoExtraProperties = actual.length === expectedKeys.length;
    return hasAllExpected && actualHasNoExtraProperties;
  }
  return false;
}