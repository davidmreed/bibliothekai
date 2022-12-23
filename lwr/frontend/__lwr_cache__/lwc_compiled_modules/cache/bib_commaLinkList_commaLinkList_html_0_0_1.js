import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./commaLinkList.css";

import _implicitScopedStylesheets from "./commaLinkList.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<span${3}> and </span>`;
const $fragment2 = parseFragment`<span${3}>, </span>`;
const stc0 = {
  key: 1
};
const stc1 = {
  key: 5
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {k: api_key, st: api_static_fragment, h: api_element, d: api_dynamic_text, t: api_text, i: api_iterator} = $api;
  return api_iterator($cmp.values, function (itValue, itIndex, itFirst, itLast) {
    const it = {
      value: itValue,
      index: itIndex,
      first: itFirst,
      last: itLast
    };
    return api_element("span", {
      key: api_key(0, it.value.id)
    }, [it.last ? api_element("span", stc0, [!it.first ? api_static_fragment($fragment1(), 3) : null]) : null, api_element("a", {
      attrs: {
        "href": it.value.href
      },
      key: 4
    }, [api_text(api_dynamic_text(it.value.name))]), !it.last ? api_element("span", stc1, [$cmp.useComma ? api_static_fragment($fragment2(), 7) : null]) : null]);
  });
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
  tmpl.stylesheetToken = "bib-commaLinkList_commaLinkList"
}
freezeTemplate(tmpl);
