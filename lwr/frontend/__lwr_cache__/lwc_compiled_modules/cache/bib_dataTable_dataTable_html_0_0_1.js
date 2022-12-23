import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./dataTable.css";

import _implicitScopedStylesheets from "./dataTable.scoped.css?scoped=true";

import _bibCommaLinkList from "bib/commaLinkList";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<th scope="col"${3}></th>`;
const $fragment2 = parseFragment`<small class="ml-1${0}"${2}>▲</small>`;
const $fragment3 = parseFragment`<small class="ml-1${0}"${2}>▼</small>`;
const $fragment4 = parseFragment`<hr${3}>`;
const stc0 = {
  classMap: {
    "table": true,
    "table-striped": true
  },
  key: 0
};
const stc1 = {
  key: 1
};
const stc2 = {
  key: 2
};
const stc3 = {
  key: 10
};
const stc4 = {
  key: 12
};
const stc5 = [];
const stc6 = {
  classMap: {
    "text-muted": true
  },
  key: 20
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, k: api_key, b: api_bind, d: api_dynamic_text, t: api_text, h: api_element, i: api_iterator, f: api_flatten, c: api_custom_element} = $api;
  const {_m0, _m1} = $ctx;
  return [api_element("table", stc0, [api_element("thead", stc1, [api_element("tr", stc2, api_flatten([$cmp.allowsSelection ? api_static_fragment($fragment1(), 4) : null, api_iterator($cmp.columns, function (col) {
    return api_element("th", {
      attrs: {
        "scope": "col",
        "data-col": col.id
      },
      key: api_key(5, col.id),
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.handleColumnClick))
      }
    }, [api_text(api_dynamic_text(col.name)), col.isSortedAscending ? api_static_fragment($fragment2(), 7) : null, col.isSortedDescending ? api_static_fragment($fragment3(), 9) : null]);
  })]))]), api_element("tbody", stc3, api_iterator($cmp._displayedRecords, function (rec) {
    return api_element("tr", {
      key: api_key(11, rec.record.id)
    }, api_flatten([$cmp.allowsSelection ? api_element("td", stc4, [api_element("input", {
      attrs: {
        "type": "checkbox",
        "data-record": rec.id
      },
      props: {
        "checked": rec.selected
      },
      key: 13,
      on: {
        "change": _m1 || ($ctx._m1 = api_bind($cmp.handleSelectionChange))
      }
    })]) : null, api_iterator(rec.values, function (entry) {
      return api_element("td", {
        key: api_key(14, entry.key)
      }, api_flatten([entry.isStringType ? api_text(api_dynamic_text(entry.value)) : null, entry.isHyperlinkType ? api_element("a", {
        attrs: {
          "href": entry.href
        },
        key: 15
      }, [api_text(api_dynamic_text(entry.value))]) : null, entry.isHyperlinkListType ? api_custom_element("bib-comma-link-list", _bibCommaLinkList, {
        props: {
          "values": entry.value
        },
        key: 16
      }) : null, entry.isYearType ? api_text(api_dynamic_text(entry.value)) : null, entry.isPillListType ? api_iterator(entry.value, function (pill) {
        return api_element("span", {
          className: pill.pillClass,
          key: api_key(17, pill.id)
        }, [api_text(api_dynamic_text(pill.value))]);
      }) : stc5]));
    })]));
  }))]), api_static_fragment($fragment4(), 19), api_element("small", stc6, [api_text("Showing " + api_dynamic_text($cmp.recordsShown) + " of " + api_dynamic_text($cmp.recordCount) + ".")])];
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
  tmpl.stylesheetToken = "bib-dataTable_dataTable"
}
freezeTemplate(tmpl);
