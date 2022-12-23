import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./breadcrumbs.css";

import _implicitScopedStylesheets from "./breadcrumbs.scoped.css?scoped=true";

import {registerTemplate} from "lwc";
const stc0 = {
  attrs: {
    "aria-label": "breadcrumb"
  },
  key: 0
};
const stc1 = {
  classMap: {
    "breadcrumb": true
  },
  key: 1
};
const stc2 = {
  "breadcrumb-item": true,
  "active": true
};
const stc3 = {
  "aria-current": "page"
};
const stc4 = {
  "breadcrumb-item": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {k: api_key, b: api_bind, d: api_dynamic_text, t: api_text, h: api_element, i: api_iterator} = $api;
  const {_m0, _m1} = $ctx;
  return [$cmp.crumbs ? api_element("nav", stc0, [api_element("ul", stc1, api_iterator($cmp.crumbs, function (crumb, index) {
    return [crumb.currentPage ? api_element("li", {
      classMap: stc2,
      attrs: stc3,
      key: api_key(2, crumb.title)
    }, [api_element("a", {
      attrs: {
        "href": crumb.url,
        "data-index": index
      },
      key: 3,
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.handleNavigation))
      }
    }, [api_text(api_dynamic_text(crumb.title))])]) : null, !crumb.currentPage ? api_element("li", {
      classMap: stc4,
      key: api_key(4, crumb.title)
    }, [api_element("a", {
      attrs: {
        "href": crumb.url,
        "data-index": index
      },
      key: 5,
      on: {
        "click": _m1 || ($ctx._m1 = api_bind($cmp.handleNavigation))
      }
    }, [api_text(api_dynamic_text(crumb.title))])]) : null];
  }))]) : null];
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
  tmpl.stylesheetToken = "bib-breadcrumbs_breadcrumbs"
}
freezeTemplate(tmpl);
