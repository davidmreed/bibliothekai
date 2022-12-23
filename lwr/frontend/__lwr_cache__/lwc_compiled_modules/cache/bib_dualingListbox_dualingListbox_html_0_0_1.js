import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./dualingListbox.css";

import _implicitScopedStylesheets from "./dualingListbox.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<br${3}>`;
const $fragment2 = parseFragment`<small class="form-text text-muted validity is-invalid form-control mb-2 d-none${0}"${2}></small>`;
const $fragment3 = parseFragment`<option disabled${3}>-- No items --</option>`;
const $fragment4 = parseFragment`<br${3}>`;
const $fragment5 = parseFragment`<div class="spinner-grow spinner-grow-sm ml-1${0}" role="status"${2}><span class="sr-only${0}"${2}>Loading...</span></div>`;
const $fragment6 = parseFragment`<option disabled${3}>-- No items --</option>`;
const $fragment7 = parseFragment`<br${3}>`;
const stc0 = {
  classMap: {
    "text-muted": true
  },
  key: 0
};
const stc1 = {
  "form-control": true,
  "mb-2": true
};
const stc2 = {
  "name": "search",
  "type": "search",
  "placeholder": "Filter",
  "aria-label": "Filter"
};
const stc3 = {
  classMap: {
    "card-group": true
  },
  key: 6
};
const stc4 = {
  classMap: {
    "card": true
  },
  key: 7
};
const stc5 = {
  classMap: {
    "card-body": true,
    "form-group": true
  },
  key: 8
};
const stc6 = {
  "entities": true,
  "form-control": true
};
const stc7 = {
  "name": "entities",
  "size": "4",
  "multiple": ""
};
const stc8 = [];
const stc9 = {
  classMap: {
    "text-muted": true,
    "float-left": true
  },
  key: 15
};
const stc10 = {
  classMap: {
    "float-right": true
  },
  key: 18
};
const stc11 = {
  "btn": true,
  "btn-primary": true,
  "btn-sm": true
};
const stc12 = {
  "type": "button"
};
const stc13 = {
  classMap: {
    "btn-group": true
  },
  key: 20
};
const stc14 = {
  "btn": true,
  "btn-secondary": true,
  "btn-sm": true
};
const stc15 = {
  classMap: {
    "card": true
  },
  key: 23
};
const stc16 = {
  classMap: {
    "card-body": true,
    "form-group": true
  },
  key: 24
};
const stc17 = {
  "selectedEntities": true,
  "form-control": true
};
const stc18 = {
  "name": "selectedEntities",
  "size": "4",
  "multiple": ""
};
const stc19 = {
  classMap: {
    "text-muted": true,
    "float-right": true
  },
  key: 32
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, t: api_text, h: api_element, b: api_bind, k: api_key, d: api_dynamic_text, i: api_iterator, f: api_flatten} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9} = $ctx;
  return [api_element("small", stc0, [api_static_fragment($fragment1(), 2), api_text("Browse and filter to find records, then click Select to choose them. "), $cmp.shouldAllowAdd ? api_text("Click New to add a new record.") : null]), api_element("input", {
    classMap: stc1,
    attrs: stc2,
    key: 3,
    on: {
      "input": _m0 || ($ctx._m0 = api_bind($cmp.handleSearch)),
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment2(), 5), api_element("div", stc3, [api_element("div", stc4, [api_element("div", stc5, [api_element("select", {
    classMap: stc6,
    attrs: stc7,
    key: 9,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handleChange)),
      "dblclick": _m3 || ($ctx._m3 = api_bind($cmp.moveRight))
    }
  }, api_flatten([$cmp.filteredEntities.length ? api_iterator($cmp.filteredEntities, function (entity) {
    return api_element("option", {
      attrs: {
        "value": entity.id
      },
      key: api_key(10, entity.id)
    }, [api_text(api_dynamic_text(entity.name))]);
  }) : stc8, !$cmp.filteredEntities.length ? api_static_fragment($fragment3(), 12) : null])), api_static_fragment($fragment4(), 14), api_element("small", stc9, [api_text("Showing " + api_dynamic_text($cmp.filteredEntityCount) + " of " + api_dynamic_text($cmp.entityCount) + " available")]), api_static_fragment($fragment5(), 17), api_element("div", stc10, [!$cmp.shouldAllowAdd ? api_element("button", {
    classMap: stc11,
    attrs: stc12,
    key: 19,
    on: {
      "click": _m4 || ($ctx._m4 = api_bind($cmp.moveRight))
    }
  }, [api_text("Select »")]) : null, $cmp.shouldAllowAdd ? api_element("div", stc13, [api_element("button", {
    classMap: stc14,
    attrs: stc12,
    key: 21,
    on: {
      "click": _m5 || ($ctx._m5 = api_bind($cmp.add))
    }
  }, [api_text("New +")]), api_element("button", {
    classMap: stc11,
    attrs: stc12,
    key: 22,
    on: {
      "click": _m6 || ($ctx._m6 = api_bind($cmp.moveRight))
    }
  }, [api_text("Select »")])]) : null])])]), api_element("div", stc15, [api_element("div", stc16, [api_element("select", {
    classMap: stc17,
    attrs: stc18,
    key: 25,
    on: {
      "change": _m7 || ($ctx._m7 = api_bind($cmp.handleChange)),
      "dblclick": _m8 || ($ctx._m8 = api_bind($cmp.moveLeft))
    }
  }, api_flatten([$cmp.selectedEntities.length ? api_iterator($cmp.selectedEntities, function (entity) {
    return api_element("option", {
      attrs: {
        "value": entity.id
      },
      key: api_key(26, entity.id)
    }, [api_text(api_dynamic_text(entity.name))]);
  }) : stc8, !$cmp.selectedEntities.length ? api_static_fragment($fragment6(), 28) : null])), api_static_fragment($fragment7(), 30), api_element("button", {
    classMap: stc11,
    attrs: stc12,
    key: 31,
    on: {
      "click": _m9 || ($ctx._m9 = api_bind($cmp.moveLeft))
    }
  }, [api_text("« Unselect")]), api_element("small", stc19, [api_text("Showing " + api_dynamic_text($cmp.selectedCount) + " selected")])])])])];
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
  tmpl.stylesheetToken = "bib-dualingListbox_dualingListbox"
}
freezeTemplate(tmpl);
