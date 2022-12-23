/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Creates a filter chain as an array. Filters can return true, false or a Promise resulting in true or false.
 *
 * @returns {object}
 */
export function createFilterChain() {
  // The filter array.
  const filters = []; // Return true if this chain contains no filters.

  const empty = () => {
    return filters.length === 0;
  };
  const addSingle = filter => {
    if (typeof filter === 'function') {
      filters.push(filter);
    }
  }; // Add a filter or array of filters to the chain.

  const add = (f = []) => {
    if (Array.isArray(f)) {
      f.forEach(l => addSingle(l));
    } else {
      addSingle(f);
    }
  }; // Get the Promised results for all filters.

  const compile = arg => {
    // Call all the functions with the given arguments.
    // Return Promise<true> if there are no filters.
    return filters.length === 0 ? Promise.resolve(true) :
    // Reduce the listener array down to a single value:
    //      a false -> false
    //      all truthy -> true
    // Previous is a Promise and current is a function.
    filters.reduce((previous, current) => {
      // Chain the current to the previous listener function; reject false values.
      // Remember that previous is a Promise and current is a functions.
      return previous.then(val => {
        return val === false ? Promise.reject() : Promise.resolve(current(arg));
      }); // Start optimistically with TRUE.
    }, Promise.resolve(true)) // Handle trailing false values
    // This happens when the last listener returns a Promise that resolves to false
    .then(val => {
      return val === false ? false : true;
    }) // If caught promise rejection contains an Error, throw instead of resolving to false
    .catch(error => {
      if (error instanceof Error) {
        throw error;
      } else {
        return false;
      }
    });
  }; // Return the API methods.

  return {
    add,
    compile,
    empty
  };
}