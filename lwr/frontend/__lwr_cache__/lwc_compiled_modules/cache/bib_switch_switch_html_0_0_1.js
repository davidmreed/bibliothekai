import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./switch.css";

import _implicitScopedStylesheets from "./switch.scoped.css?scoped=true";

import {registerTemplate} from "lwc";
const stc0 = {
  classMap: {
    "custom-control": true,
    "custom-switch": true
  },
  key: 0
};
const stc1 = {
  "custom-control-input": true
};
const stc2 = {
  "custom-control-label": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, b: api_bind, h: api_element, d: api_dynamic_text, t: api_text} = $api;
  const {_m0} = $ctx;
  return [api_element("div", stc0, [api_element("input", {
    classMap: stc1,
    attrs: {
      "type": "checkbox",
      "id": api_scoped_id("custom-cb")
    },
    key: 1,
    on: {
      "change": _m0 || ($ctx._m0 = api_bind($cmp.handleClick))
    }
  }), api_element("label", {
    classMap: stc2,
    attrs: {
      "for": api_scoped_id("custom-cb")
    },
    key: 2
  }, [api_text(" " + api_dynamic_text($cmp.label) + " ")])])];
  /*LWC compiler v2.17.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];


if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets)
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets)
}
if (_implicitStylesheets || _implicitScopedStylesheets) {
  tmpl.stylesheetToken = "bib-switch_switch"
}
freezeTemplate(tmpl);
