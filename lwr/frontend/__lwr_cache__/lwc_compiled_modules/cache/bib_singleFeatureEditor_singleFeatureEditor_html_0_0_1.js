import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./singleFeatureEditor.css";

import _implicitScopedStylesheets from "./singleFeatureEditor.scoped.css?scoped=true";

import _bibSwitch from "bib/switch";
import _bibPopUpMenu from "bib/popUpMenu";
import _bibDualingListbox from "bib/dualingListbox";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div${3}><small${3}>A language and authors are required.</small></div>`;
const stc0 = {
  classMap: {
    "card": true,
    "mb-2": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "card-header": true
  },
  key: 1
};
const stc2 = {
  classMap: {
    "card-title": true
  },
  key: 2
};
const stc3 = {
  "float-right": true,
  "btn": true,
  "btn-sm": true,
  "btn-outline-secondary": true
};
const stc4 = {
  classMap: {
    "card-body": true
  },
  key: 4
};
const stc5 = {
  "data-name": "sameAsTranslation"
};
const stc6 = {
  "data-name": "language"
};
const stc7 = {
  "data-name": "persons"
};
const stc8 = {
  "btn": true,
  "btn-sm": true,
  "btn-outline-primary": true,
  "btn-block": true,
  "mb-2": true,
  "mt-3": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, t: api_text, b: api_bind, h: api_element, c: api_custom_element, st: api_static_fragment, gid: api_scoped_id} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5} = $ctx;
  return [api_element("div", stc0, [api_element("div", stc1, [api_element("h5", stc2, [api_text(api_dynamic_text($cmp.feature.feature)), $cmp.showDetails ? api_element("button", {
    classMap: stc3,
    attrs: {
      "data-name": "uiExpanded",
      "value": $cmp.uiExpanded
    },
    key: 3,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.handleChangeValueInvert))
    }
  }, [api_text(api_dynamic_text($cmp.buttonTitle))]) : null])]), $cmp.isVisible ? api_element("div", stc4, [$cmp.hasTranslation ? api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc5,
    props: {
      "label": "Same language and authors as translation",
      "value": $cmp.feature.sameAsTranslation
    },
    key: 5,
    on: {
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleChange))
    }
  }) : null, $cmp.showDetails ? !$cmp.isEdited ? api_static_fragment($fragment1(), 7) : null : null, $cmp.showDetails ? !$cmp.isEdited ? api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    attrs: stc6,
    props: {
      "labelText": "Language",
      "entityName": "languages",
      "allowAdd": "false",
      "value": $cmp.feature.language
    },
    key: 8,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handleChange))
    }
  }) : null : null, $cmp.showDetails ? !$cmp.isEdited ? api_element("label", {
    attrs: {
      "for": api_scoped_id("authors")
    },
    key: 9
  }, [api_text("Authors")]) : null : null, $cmp.showDetails ? $cmp.isEdited ? api_element("label", {
    attrs: {
      "for": api_scoped_id("authors")
    },
    key: 10
  }, [api_text("Editors")]) : null : null, $cmp.showDetails ? api_custom_element("bib-dualing-listbox", _bibDualingListbox, {
    attrs: stc7,
    props: {
      "entityName": "persons",
      "value": $cmp.feature.persons,
      "allowAdd": "true"
    },
    key: 11,
    on: {
      "change": _m3 || ($ctx._m3 = api_bind($cmp.handleChange)),
      "add": _m4 || ($ctx._m4 = api_bind($cmp.handleAddPerson))
    }
  }) : null, $cmp.showDetails ? api_element("button", {
    classMap: stc8,
    attrs: {
      "value": $cmp.uiExpanded,
      "data-name": "uiExpanded"
    },
    key: 12,
    on: {
      "click": _m5 || ($ctx._m5 = api_bind($cmp.handleChangeValueInvert))
    }
  }, [api_text("Done with Resource")]) : null]) : null])];
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
  tmpl.stylesheetToken = "bib-singleFeatureEditor_singleFeatureEditor"
}
freezeTemplate(tmpl);
