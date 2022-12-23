/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateContextualWireAdapter, ContextInfo } from 'lwr/contextUtils';
const CURRENT_PAGE_REFERENCE_CONTEXT = new ContextInfo(undefined);

/**
 * Services @wire(CurrentPageReference) requests.
 * Hooks up to an Observable from the current navigation context.
 */
export const CurrentPageReference = generateContextualWireAdapter(CURRENT_PAGE_REFERENCE_CONTEXT);