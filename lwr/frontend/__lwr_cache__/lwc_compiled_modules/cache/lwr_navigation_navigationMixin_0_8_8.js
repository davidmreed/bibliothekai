/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// TODO: The way NavigationMixin is currently set up, we need to use unique
// symbols as indexes, which typescript does not like, necessitating 'any'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { invariant, generateMessage, messages } from 'lwr/routerErrors';
import { generateUrl, navigate } from './navigationApi';
import { CONTEXT_ID_BACKDOOR } from 'lwr/navigationMixinHacks';
/*
 * Exports the NavigationMixin and CurrentPageReference wire adapter.
 * Uses the NavigationContext wire to retrieve the current navigation context/node.
 */

/**
 * Provides navigate() and generateUrl() functionality.
 * Here, navigate() can take either a route OR a string URL.
 * Functionality pulled in from the current navigation context.
 * Used by components as a Mixin to extend their own functionality.
 *
 * @param {HTMLElement} Base - A class instance
 */

const Navigate = Symbol('Navigate');
const GenerateUrl = Symbol('GenerateUrl');
const NavContext = Symbol('NavContext');
const GetContext = Symbol('NavContext');
function NavigationMixin(Base) {
  invariant(typeof Base.prototype.dispatchEvent === 'function', messages.INVALID_MIXIN_CMP, [Base.toString()]);
  class Mixin extends Base {
    [GetContext]() {
      /*
       * NavigationMixin is a special snowflake that needs to use the DOM to lookup its parent ContextId,
       * but is not allowed to use the traditional means: @wire(NavigationContext) to do so, because it's
       * part of the navigation API, which must be importable into the priming environment, and thus cannot
       * import anything from LWC. Best solution we have so far is a CustomEvent that allows the module to
       * be imported, but cannot be RAN in the priming environment. This is acceptable because it's generally
       * a component that extends LightningElement that's using the NavigationMixin, rather than any priming code.
       */
      if (!this[NavContext]) {
        this.dispatchEvent(
        // eslint exception reason: this code is safe to be imported into the priming environment, but is not runnable, and not expected to be runnable
        // eslint-disable-next-line no-undef
        new CustomEvent(CONTEXT_ID_BACKDOOR, {
          bubbles: true,
          composed: true,
          detail: {
            callback: contextId => {
              this[NavContext] = contextId;
            }
          }
        }));
        if (!this[NavContext]) {
          throw new Error(generateMessage(messages.MISSING_CONTEXT));
        }
      }
    }
    [Navigate](pageRef, replace) {
      this[GetContext]();
      navigate(this[NavContext], pageRef, replace);
    }
    async [GenerateUrl](pageRef) {
      this[GetContext]();
      return generateUrl(this[NavContext], pageRef);
    }
    /*LWC compiler v2.17.0*/
  }
  return Mixin;
}
NavigationMixin.Navigate = Navigate;
NavigationMixin.GenerateUrl = GenerateUrl;
NavigationMixin.NavContext = NavContext;
export { NavigationMixin };