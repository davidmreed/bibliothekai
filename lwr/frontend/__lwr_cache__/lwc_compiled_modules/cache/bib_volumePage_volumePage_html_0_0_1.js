import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./volumePage.css";

import _implicitScopedStylesheets from "./volumePage.scoped.css?scoped=true";

import _bibBreadcrumbs from "bib/breadcrumbs";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<strong${3}>Translated</strong>`;
const stc0 = {
  key: 1
};
const stc1 = {
  "volumeElement": true
};
const stc2 = {
  classMap: {
    "card": true
  },
  key: 3
};
const stc3 = {
  classMap: {
    "card-header": true
  },
  key: 4
};
const stc4 = {
  classMap: {
    "card-body": true
  },
  key: 5
};
const stc5 = {
  classMap: {
    "card-text": true
  },
  key: 6
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {c: api_custom_element, d: api_dynamic_text, t: api_text, h: api_element, k: api_key, st: api_static_fragment, i: api_iterator, f: api_flatten} = $api;
  return api_flatten([api_custom_element("bib-breadcrumbs", _bibBreadcrumbs, {
    props: {
      "crumbs": $cmp.crumbs
    },
    key: 0
  }), api_element("h1", stc0, [api_text(api_dynamic_text($cmp.volume.title))]), api_iterator($cmp.volume.elements, function (element) {
    return api_element("div", {
      classMap: stc1,
      key: api_key(2, element.sourceText.id)
    }, [api_element("div", stc2, [api_element("h5", stc3, [api_text(api_dynamic_text(element.sourceText.author.fullName) + ": " + api_dynamic_text(element.sourceText.title))]), api_element("div", stc4, [api_element("p", stc5, [api_static_fragment($fragment1(), 8), api_text(" by " + api_dynamic_text(element.persons) + " into " + api_dynamic_text(element.translation.language.name) + " " + api_dynamic_text(element.translation.format) + ".")])])])]);
  })]);
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
  tmpl.stylesheetToken = "bib-volumePage_volumePage"
}
freezeTemplate(tmpl);
