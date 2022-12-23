/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ContextInfo, generateContextualWireAdapter } from 'lwr/contextUtils';
const NAVIGATION_CONTEXT = new ContextInfo(undefined);
export const NavigationContext = generateContextualWireAdapter(NAVIGATION_CONTEXT);