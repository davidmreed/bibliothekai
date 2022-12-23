import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./app.css";

import _implicitScopedStylesheets from "./app.scoped.css?scoped=true";

import _lwrOutlet from "lwr/outlet";
import _lwrRouterContainer from "lwr/routerContainer";
import {registerTemplate} from "lwc";
const stc0 = {
  key: 1
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {c: api_custom_element} = $api;
  return [api_custom_element("lwr-router-container", _lwrRouterContainer, {
    props: {
      "router": $cmp.router
    },
    key: 0
  }, [api_custom_element("lwr-outlet", _lwrOutlet, stc0)])];
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
  tmpl.stylesheetToken = "bib-app_app"
}
freezeTemplate(tmpl);
