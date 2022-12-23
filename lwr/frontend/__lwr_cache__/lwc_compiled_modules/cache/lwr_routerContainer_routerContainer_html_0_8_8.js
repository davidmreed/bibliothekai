import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./routerContainer.css";

import _implicitScopedStylesheets from "./routerContainer.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<span class="router-title${0}" aria-live="polite" aria-atomic="true"${2}></span>`;
const stc0 = {
  key: 0
};
const stc1 = [];
function tmpl($api, $cmp, $slotset, $ctx) {
  const {s: api_slot, st: api_static_fragment, f: api_flatten} = $api;
  return api_flatten([api_slot("", stc0, stc1, $slotset), api_static_fragment($fragment1(), 2)]);
  /*LWC compiler v2.17.0*/
}
export default registerTemplate(tmpl);
tmpl.slots = [""];
tmpl.stylesheets = [];
tmpl.renderMode = "light";


if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets)
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets)
}
if (_implicitStylesheets || _implicitScopedStylesheets) {
  tmpl.stylesheetToken = "lwr-routerContainer_routerContainer"
}
freezeTemplate(tmpl);
