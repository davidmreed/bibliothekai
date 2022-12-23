import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./textPage.css";

import _implicitScopedStylesheets from "./textPage.scoped.css?scoped=true";

import _bibBreadcrumbs from "bib/breadcrumbs";
import _bibTranslationView from "bib/translationView";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<dt${3}>Author</dt>`;
const $fragment2 = parseFragment`<dt${3}>Date</dt>`;
const $fragment3 = parseFragment`<dt${3}>Description</dt>`;
const $fragment4 = parseFragment`<dt${3}>Language</dt>`;
const stc0 = {
  key: 1
};
const stc1 = {
  key: 2
};
const stc2 = {
  key: 5
};
const stc3 = {
  key: 8
};
const stc4 = {
  key: 11
};
const stc5 = {
  key: 14
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {c: api_custom_element, d: api_dynamic_text, t: api_text, h: api_element, st: api_static_fragment} = $api;
  return [$cmp.text ? api_custom_element("bib-breadcrumbs", _bibBreadcrumbs, {
    props: {
      "crumbs": $cmp.crumbs
    },
    key: 0
  }) : null, $cmp.text ? api_element("h1", stc0, [api_text(api_dynamic_text($cmp.text.title))]) : null, $cmp.text ? api_element("dl", stc1, [api_static_fragment($fragment1(), 4), api_element("dd", stc2, [api_text(api_dynamic_text($cmp.text.author.fullName))]), api_static_fragment($fragment2(), 7), api_element("dd", stc3, [$cmp.text.date ? api_text(api_dynamic_text($cmp.text.date)) : null, !$cmp.text.date ? api_text("Unknown") : null]), api_static_fragment($fragment3(), 10), api_element("dd", stc4, [api_text(api_dynamic_text($cmp.text.description))]), api_static_fragment($fragment4(), 13), api_element("dd", stc5, [api_text(api_dynamic_text($cmp.text.language.name) + ", " + api_dynamic_text($cmp.text.format))])]) : null, $cmp.text ? api_custom_element("bib-translation-view", _bibTranslationView, {
    props: {
      "textId": $cmp.pageReference.attributes.textId
    },
    key: 15
  }) : null];
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
  tmpl.stylesheetToken = "bib-textPage_textPage"
}
freezeTemplate(tmpl);
