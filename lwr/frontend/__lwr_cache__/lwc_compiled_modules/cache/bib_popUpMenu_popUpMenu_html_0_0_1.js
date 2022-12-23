import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./popUpMenu.css";

import _implicitScopedStylesheets from "./popUpMenu.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<option value=""${3}>-- No selection --</option>`;
const $fragment2 = parseFragment`<option disabled${3}>-- No items --</option>`;
const $fragment3 = parseFragment`<div class="spinner-grow spinner-grow-sm mt-2${0}" role="status"${2}><span class="sr-only${0}"${2}>Loading...</span></div>`;
const stc0 = {
  classMap: {
    "form-row": true
  },
  key: 1
};
const stc1 = {
  classMap: {
    "col": true
  },
  key: 2
};
const stc2 = {
  "entities": true,
  "form-control": true
};
const stc3 = [];
const stc4 = {
  classMap: {
    "invalid-feedback": true
  },
  key: 9
};
const stc5 = {
  classMap: {
    "col-2": true
  },
  key: 12
};
const stc6 = {
  "form-control": true,
  "btn": true,
  "btn-sm": true,
  "btn-outline-secondary": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, d: api_dynamic_text, t: api_text, h: api_element, b: api_bind, st: api_static_fragment, k: api_key, i: api_iterator, f: api_flatten} = $api;
  const {_m0, _m1} = $ctx;
  return [$cmp.labelText ? api_element("label", {
    attrs: {
      "for": api_scoped_id("entities")
    },
    key: 0
  }, [api_text(api_dynamic_text($cmp.labelText))]) : null, api_element("div", stc0, [api_element("div", stc1, [api_element("select", {
    classMap: stc2,
    attrs: {
      "name": "entities",
      "size": "1",
      "value": $cmp.value
    },
    key: 3,
    on: {
      "change": _m0 || ($ctx._m0 = api_bind($cmp.handleChange))
    }
  }, api_flatten([$cmp.entities.length ? api_flatten([api_static_fragment($fragment1(), 5), api_iterator($cmp.entities, function (entity) {
    return api_element("option", {
      attrs: {
        "value": entity.id
      },
      key: api_key(6, entity.id)
    }, [api_text(api_dynamic_text(entity.name))]);
  })]) : stc3, !$cmp.entities.length ? api_static_fragment($fragment2(), 8) : null])), api_element("div", stc4, [api_text(api_dynamic_text($cmp.error))])]), api_static_fragment($fragment3(), 11), $cmp.shouldAllowAdd ? api_element("div", stc5, [api_element("button", {
    classMap: stc6,
    key: 13,
    on: {
      "click": _m1 || ($ctx._m1 = api_bind($cmp.add))
    }
  }, [api_text("Add")])]) : null])];
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
  tmpl.stylesheetToken = "bib-popUpMenu_popUpMenu"
}
freezeTemplate(tmpl);
