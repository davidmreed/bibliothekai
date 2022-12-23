import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./addSeries.css";

import _implicitScopedStylesheets from "./addSeries.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="invalid-feedback${0}"${2}>The series name is required.</div>`;
const stc0 = {
  attrs: {
    "novalidate": ""
  },
  key: 0
};
const stc1 = {
  classMap: {
    "form-group": true
  },
  key: 1
};
const stc2 = {
  "form-control": true
};
const stc3 = {
  "data-name": "name",
  "placeholder": "Name",
  "type": "text",
  "required": ""
};
const stc4 = {
  classMap: {
    "text-danger": true
  },
  key: 6
};
const stc5 = {
  "btn": true,
  "btn-primary": true,
  "mt-3": true
};
const stc6 = {
  "type": "submit"
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, t: api_text, h: api_element, b: api_bind, st: api_static_fragment, d: api_dynamic_text} = $api;
  const {_m0, _m1} = $ctx;
  return [api_element("form", stc0, [api_element("div", stc1, [api_element("label", {
    attrs: {
      "for": api_scoped_id("name")
    },
    key: 2
  }, [api_text("Name")]), api_element("input", {
    classMap: stc2,
    attrs: stc3,
    props: {
      "value": $cmp.name
    },
    key: 3,
    on: {
      "change": _m0 || ($ctx._m0 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment1(), 5), api_element("div", stc4, [api_text(api_dynamic_text($cmp.error))]), api_element("button", {
    classMap: stc5,
    attrs: stc6,
    key: 7,
    on: {
      "click": _m1 || ($ctx._m1 = api_bind($cmp.create))
    }
  }, [api_text("Create")])])])];
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
  tmpl.stylesheetToken = "bib-addSeries_addSeries"
}
freezeTemplate(tmpl);
