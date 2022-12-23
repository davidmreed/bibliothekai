import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./featureDisplay.css";

import _implicitScopedStylesheets from "./featureDisplay.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<small class="text-danger${0}"${2}>This translation isn&#x27;t valid. Edit it before saving.</small>`;
const stc0 = {
  key: 0
};
const stc1 = {
  classMap: {
    "card": true
  },
  key: 1
};
const stc2 = {
  classMap: {
    "card-header": true
  },
  key: 2
};
const stc3 = {
  classMap: {
    "card-title": true
  },
  key: 3
};
const stc4 = {
  classMap: {
    "float-right": true
  },
  key: 4
};
const stc5 = {
  classMap: {
    "btn-group": true,
    "btn-group-sm": true
  },
  attrs: {
    "role": "group",
    "aria-label": "Translation actions"
  },
  key: 5
};
const stc6 = {
  "btn": true,
  "btn-outline-primary": true
};
const stc7 = {
  "type": "button"
};
const stc8 = {
  "btn": true,
  "btn-outline-danger": true
};
const stc9 = {
  key: 8
};
const stc10 = {
  classMap: {
    "invalid-feedback": true
  },
  key: 11
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, t: api_text, b: api_bind, h: api_element, st: api_static_fragment} = $api;
  const {_m0, _m1} = $ctx;
  return [api_element("div", stc0, [api_element("div", stc1, [api_element("div", stc2, [api_element("h5", stc3, [api_text(api_dynamic_text($cmp.textTitle)), api_element("div", stc4, [api_element("div", stc5, [api_element("button", {
    classMap: stc6,
    attrs: stc7,
    key: 6,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.edit))
    }
  }, [api_text("Edit")]), api_element("button", {
    classMap: stc8,
    attrs: stc7,
    key: 7,
    on: {
      "click": _m1 || ($ctx._m1 = api_bind($cmp.remove))
    }
  }, [api_text("Remove")])])])]), api_element("div", stc9, [api_text(api_dynamic_text($cmp.featureDescription))]), !$cmp.feature.isValid ? api_static_fragment($fragment1(), 10) : null, api_element("div", stc10, [api_text(api_dynamic_text($cmp.error))])])])])];
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
  tmpl.stylesheetToken = "bib-featureDisplay_featureDisplay"
}
freezeTemplate(tmpl);
