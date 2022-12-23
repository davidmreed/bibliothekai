/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateContextualWireAdapter, ContextInfo } from 'lwr/contextUtils';
import { generateMessageObject, messages } from 'lwr/routerErrors';
const CURRENT_VIEW_CONTEXT = new ContextInfo(undefined);

/**
 * Services @wire(CurrentView) requests.
 * Hooks up to an Observable from the current navigation context.
 */
export const CurrentView = class CurrentView extends generateContextualWireAdapter(CURRENT_VIEW_CONTEXT) {
  async update(config, context) {
    if (context) {
      const viewName = config && config.viewName ? config.viewName : 'default';
      const viewEntry = context.viewset[viewName]; // either ViewInfo or an importer function

      const viewInfo = viewEntry;
      const viewImporter = viewInfo && viewInfo.module || viewEntry;
      let importError;
      if (viewImporter) {
        try {
          const viewModule = await viewImporter();
          const newViewCtor = viewModule && viewModule.default;
          if (newViewCtor && newViewCtor.constructor !== undefined) {
            this._callback(newViewCtor);
          } else {
            // delegate to catch for consistent error handling
            throw new Error('error occurred with view import');
          }
        } catch (e) {
          const error = e;
          if (viewInfo.specifier) {
            importError = generateMessageObject(messages.VIEW_IMPORT_FAILED_WITH_SPECIFIER, [viewInfo.specifier, viewName, error.message, error.stack || '']);
          } else {
            importError = generateMessageObject(messages.VIEW_IMPORT_FAILED, [viewName, error.message, error.stack || '']);
          }
        }
      } else {
        importError = generateMessageObject(messages.VIEW_MISSING, [viewName]);
      }
      if (context.onComplete) {
        context.onComplete(importError);
      }
    }
  }
  /*LWC compiler v2.17.0*/
};