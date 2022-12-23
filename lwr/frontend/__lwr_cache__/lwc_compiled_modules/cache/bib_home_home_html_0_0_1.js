import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./home.css";

import _implicitScopedStylesheets from "./home.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<h1${3}>&quot;What&#x27;s the best translation of...?&quot;</h1>`;
const stc0 = {
  key: 0
};
const stc1 = {
  "form-control": true,
  "mb-2": true
};
const stc2 = {
  "type": "search",
  "placeholder": "Search"
};
const stc3 = {
  key: 4
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, b: api_bind, h: api_element, k: api_key, d: api_dynamic_text, t: api_text, i: api_iterator} = $api;
  const {_m0, _m1, _m2} = $ctx;
  return [api_element("main", stc0, [api_static_fragment($fragment1(), 2), api_element("input", {
    classMap: stc1,
    attrs: stc2,
    props: {
      "value": $cmp.searchTerm
    },
    key: 3,
    on: {
      "input": _m0 || ($ctx._m0 = api_bind($cmp.handleSearch)),
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleSearch))
    }
  }), api_element("ul", stc3, api_iterator($cmp.filteredRecordData, function (record) {
    return api_element("li", {
      key: api_key(5, record.id)
    }, [api_element("a", {
      attrs: {
        "href": record.url,
        "data-id": record.id
      },
      key: 6,
      on: {
        "click": _m2 || ($ctx._m2 = api_bind($cmp.handleNavigation))
      }
    }, [api_text(api_dynamic_text(record.title))])]);
  }))])];
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
  tmpl.stylesheetToken = "bib-home_home"
}
freezeTemplate(tmpl);
