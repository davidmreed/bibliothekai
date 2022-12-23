/**
 * This module is called in the ABS module (app bootstrap module) to perform neccesary pre initialization steps for an LWR app.
 * Note: this module should be imported before other dependencies in the ABS
 */
const lwrGlobals = globalThis.LWR;
if (globalThis.LWR.define) {
  // AMD only
  globalThis.LWR = Object.freeze({
    define: globalThis.LWR.define
  });
} else {
  delete globalThis.LWR;
}
export function getClientBootstrapConfig() {
  return lwrGlobals;
}