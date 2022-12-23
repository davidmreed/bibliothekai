/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Creates a simple observable object, which can have any number of observers.
 * @returns {object}
 */
export function createObservable() {
  // Keep track of the current value and error.
  let currentValue = undefined;
  let currentError = undefined; // Observer list with functions to add and remove members safely.

  let observers = [];
  const addObserver = obs => {
    observers.push(obs);
  };
  const removeObserver = obsIndex => {
    // copy on delete prevents issues when an observer unsubscribes while iterating over them
    observers = [...observers.slice(0, obsIndex), ...observers.slice(obsIndex + 1)];
  }; // On next, broadcast the value to all observers.
  // Clear out current error.

  const next = value => {
    observers.filter(obs => obs !== null).forEach(obs => obs.next && obs.next(value));
    currentValue = value;
    currentError = undefined;
  }; // On error, broadcast the error to all observers.
  // Clear out current value.

  const error = err => {
    observers.filter(obs => obs !== null).forEach(obs => obs.error && obs.error(err));
    currentValue = undefined;
    currentError = err;
  }; // On complete, call complete on all observers.
  // Clear out all observers + current value and error.

  const complete = () => {
    observers.filter(obs => obs !== null).forEach(obs => obs.complete && obs.complete());
    observers = [];
    currentValue = undefined;
    currentError = undefined;
  }; // Observable can be subscribed and unsubscribed, by multiple observers.
  // When replay is true, the currentValue will be emitted synchronously.

  const subscribe = (obs, replay = true) => {
    addObserver(obs); // Push the current value and error, if they exist.

    if (currentValue && replay) {
      obs.next(currentValue);
    }
    if (currentError) {
      error(currentError);
    } // On unsubscribe, the observer is nulled out.

    const obsIndex = observers.length - 1;
    return {
      unsubscribe: () => removeObserver(obsIndex)
    };
  }; // Return the observation methods + the associated observable.

  return {
    next,
    error,
    complete,
    subscribe
  };
}