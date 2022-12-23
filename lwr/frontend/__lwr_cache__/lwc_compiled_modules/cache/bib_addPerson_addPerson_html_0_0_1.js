import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./addPerson.css";

import _implicitScopedStylesheets from "./addPerson.scoped.css?scoped=true";

import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<small class="form-text text-muted${0}"${2}>Enter information about this person. The first and last name are required.</small>`;
const $fragment2 = parseFragment`<div class="invalid-feedback${0}"${2}>Please enter a first name.</div>`;
const $fragment3 = parseFragment`<div class="invalid-feedback${0}"${2}>Please enter a last name.</div>`;
const stc0 = {
  attrs: {
    "novalidate": ""
  },
  key: 0
};
const stc1 = {
  classMap: {
    "form-group": true
  },
  key: 3
};
const stc2 = {
  "form-control": true
};
const stc3 = {
  "data-name": "firstName",
  "placeholder": "First name",
  "type": "text",
  "required": ""
};
const stc4 = {
  "data-name": "middleName",
  "placeholder": "Middle name",
  "type": "text"
};
const stc5 = {
  "data-name": "lastName",
  "placeholder": "Last name",
  "type": "text",
  "required": ""
};
const stc6 = {
  "data-name": "description",
  "placeholder": "Optional: enter a brief description or bio for this person.",
  "type": "text"
};
const stc7 = {
  classMap: {
    "text-danger": true
  },
  key: 16
};
const stc8 = {
  "btn": true,
  "btn-primary": true,
  "mt-3": true
};
const stc9 = {
  "type": "submit"
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, gid: api_scoped_id, t: api_text, h: api_element, b: api_bind, d: api_dynamic_text} = $api;
  const {_m0, _m1, _m2, _m3, _m4} = $ctx;
  return [api_element("form", stc0, [api_static_fragment($fragment1(), 2), api_element("div", stc1, [api_element("label", {
    attrs: {
      "for": api_scoped_id("first_name")
    },
    key: 4
  }, [api_text("First Name")]), api_element("input", {
    classMap: stc2,
    attrs: stc3,
    props: {
      "value": $cmp.firstName
    },
    key: 5,
    on: {
      "change": _m0 || ($ctx._m0 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment2(), 7), api_element("label", {
    attrs: {
      "for": api_scoped_id("middle_name")
    },
    key: 8
  }, [api_text("Middle Name")]), api_element("input", {
    classMap: stc2,
    attrs: stc4,
    props: {
      "value": $cmp.middleName
    },
    key: 9,
    on: {
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleChange))
    }
  }), api_element("label", {
    attrs: {
      "for": api_scoped_id("last_name")
    },
    key: 10
  }, [api_text("Last Name")]), api_element("input", {
    classMap: stc2,
    attrs: stc5,
    props: {
      "value": $cmp.lastName
    },
    key: 11,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment3(), 13), api_element("label", {
    attrs: {
      "for": api_scoped_id("description")
    },
    key: 14
  }, [api_text("Description")]), api_element("input", {
    classMap: stc2,
    attrs: stc6,
    props: {
      "value": $cmp.description
    },
    key: 15,
    on: {
      "change": _m3 || ($ctx._m3 = api_bind($cmp.handleChange))
    }
  }), api_element("div", stc7, [api_text(api_dynamic_text($cmp.error))]), api_element("button", {
    classMap: stc8,
    attrs: stc9,
    key: 17,
    on: {
      "click": _m4 || ($ctx._m4 = api_bind($cmp.create))
    }
  }, [api_text("Create")])])])];
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
  tmpl.stylesheetToken = "bib-addPerson_addPerson"
}
freezeTemplate(tmpl);
