/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Wires and their return types
export { NavigationContext } from 'lwr/navigationContext'; // provides ContextId

export { CurrentPageReference } from 'lwr/currentPageReference'; // provides PageReference

export { CurrentView } from 'lwr/currentView'; // Provides Constructable

// The LWR Navigation context singleton (i.e. CACHE in lwr/contextUtils#navigationApiStore)
// These functions and classes must only be included in an app ONCE:
//      - 'lwr/navigation' must be excluded from bundling
//      - ALWAYS import these from 'lwr/navigation', even internally
export { ContextInfo, getNavigationHelm, registerNavigationHelm, generateContextualWireAdapter } from 'lwr/contextUtils'; // NavigationMixin has a dependency on navigate and generateUrl
// They need to be sibling exports in order to avoid a circular dependency

export { navigate, generateUrl } from './navigationApi';
export { NavigationMixin } from './navigationMixin';