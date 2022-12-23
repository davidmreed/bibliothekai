function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/** @hidden */

/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ERROR_CODE_PREFIX = 'LWR';
const DiagnosticLevel = {
  Fatal: 0,
  Error: 1,
  Warning: 2,
  Log: 3
};
function replaceArgs(message, args) {
  return Array.isArray(args) ? message.replace(/\{([0-9]+)\}/g, (_, index) => {
    return args[index];
  }) : message;
}
export function generateMessage(info, args) {
  return `${info.code}: ${replaceArgs(info.message, args)}`;
}
export function generateMessageObject(info, args) {
  const messageObject = _objectSpread(_objectSpread({}, info), {}, {
    message: replaceArgs(info.message, args)
  });
  if (info.address) {
    messageObject.address = replaceArgs(info.address, args);
  }
  if (info.stack) {
    messageObject.stack = replaceArgs(info.stack, args);
  }
  return messageObject;
}
export function invariant(condition, errorInfo, args) {
  if (!condition) {
    throw new Error(generateMessage(errorInfo, args));
  }
}
export const messages = {
  INVALID_MIXIN_CMP: {
    code: `${ERROR_CODE_PREFIX}4001`,
    message: '{0} must be an Element type',
    level: DiagnosticLevel.Error
  },
  MISSING_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4002`,
    message: 'Could not find context to perform navigation action.',
    level: DiagnosticLevel.Error
  },
  INVALID_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4003`,
    message: 'Cannot register navigation context; it must have this shape: { navigate, generateUrl, subscribe }',
    level: DiagnosticLevel.Error
  },
  MULTIPLE_ROOTS: {
    code: `${ERROR_CODE_PREFIX}4004`,
    message: 'Router connection failed. There can only be one root router.',
    level: DiagnosticLevel.Error
  },
  MULTIPLE_CHILDREN: {
    code: `${ERROR_CODE_PREFIX}4005`,
    message: 'Could not add to the navigation hierarchy. There can only be one child per navigation node.',
    level: DiagnosticLevel.Error
  },
  MISSING_ROUTE: {
    code: `${ERROR_CODE_PREFIX}4006`,
    message: 'A route cannot be created to navigate to URL "{0}"',
    level: DiagnosticLevel.Error,
    address: '{0}'
  },
  MISSING_URL: {
    code: `${ERROR_CODE_PREFIX}4007`,
    message: 'A URL cannot be created to navigate to route "{0}"',
    level: DiagnosticLevel.Error,
    address: '{0}'
  },
  PRENAV_FAILED: {
    code: `${ERROR_CODE_PREFIX}4008`,
    message: 'A preNavigate hook listener blocked routing to "{0}"',
    level: DiagnosticLevel.Warning,
    address: '{0}'
  },
  MISSING_ROUTE_TEMPLATE: {
    code: `${ERROR_CODE_PREFIX}4009`,
    message: 'A route definition must contain a "uri" property.',
    level: DiagnosticLevel.Error
  },
  MISSING_ROUTE_CMP: {
    code: `${ERROR_CODE_PREFIX}4016`,
    message: 'Expected a route view component with a default export.',
    level: DiagnosticLevel.Error
  },
  MISSING_DATA_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4018`,
    message: 'Could not find context to retrieve navigation data.',
    level: DiagnosticLevel.Error
  },
  INVALID_ROUTE_QUERY: {
    code: `${ERROR_CODE_PREFIX}4019`,
    message: 'Invalid query param in route definition.',
    level: DiagnosticLevel.Error
  },
  MISSING_PAGE_BINDING: {
    code: `${ERROR_CODE_PREFIX}4020`,
    message: 'Route definition must provide page binding',
    level: DiagnosticLevel.Error
  },
  INVALID_PAGE_BINDING: {
    code: `${ERROR_CODE_PREFIX}4021`,
    message: 'Invalid page binding in route definition',
    level: DiagnosticLevel.Error
  },
  INVALID_URI_SYNTAX: {
    code: `${ERROR_CODE_PREFIX}4022`,
    message: 'Invalid uri syntax. URI cannot contain *, +, (, ), ',
    level: DiagnosticLevel.Error
  },
  VIEW_IMPORT_FAILED: {
    code: `${ERROR_CODE_PREFIX}4023`,
    message: 'Error importing view with name "{0}", failure was: {1}',
    level: DiagnosticLevel.Error,
    stack: '{2}'
  },
  VIEW_MISSING: {
    code: `${ERROR_CODE_PREFIX}4024`,
    message: 'Expected a view with name "{0}" in the viewset',
    level: DiagnosticLevel.Error
  },
  VIEW_IMPORT_FAILED_WITH_SPECIFIER: {
    code: `${ERROR_CODE_PREFIX}4025`,
    message: 'Error importing module "{0}" from view with name "{1}", failure was: {2}',
    level: DiagnosticLevel.Error,
    stack: '{3}'
  },
  NO_ROUTE_MATCH: {
    code: `${ERROR_CODE_PREFIX}4026`,
    message: 'A routing match cannot be found for: {0}',
    level: DiagnosticLevel.Error
  },
  INVALID_ROUTE_HANDLER: {
    code: `${ERROR_CODE_PREFIX}4027`,
    message: 'Route definition "{0}" does not have a valid route handler module',
    level: DiagnosticLevel.Error
  },
  DESTINATION_NOT_FOUND: {
    code: `${ERROR_CODE_PREFIX}4028`,
    message: 'Route handler returned 404: Not Found',
    level: DiagnosticLevel.Error
  },
  DESTINATION_ERROR: {
    code: `${ERROR_CODE_PREFIX}4029`,
    message: 'Route handler returned error status {0}: {1}',
    level: DiagnosticLevel.Error,
    stack: '{2}'
  }
};