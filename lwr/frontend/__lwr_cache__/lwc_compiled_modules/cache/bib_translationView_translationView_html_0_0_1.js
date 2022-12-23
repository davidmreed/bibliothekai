import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./translationView.css";

import _implicitScopedStylesheets from "./translationView.scoped.css?scoped=true";

import _bibSwitch from "bib/switch";
import _bibDataTable from "bib/dataTable";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<small class="text-muted${0}"${2}>Select desired translation features to filter the list. Note that not all translation features may be in the database.</small>`;
const $fragment2 = parseFragment`<option value=""${3}>-- All formats --</option>`;
const $fragment3 = parseFragment`<option value="Verse"${3}>Verse</option>`;
const $fragment4 = parseFragment`<option value="Prose"${3}>Prose</option>`;
const $fragment5 = parseFragment`<option value=""${3}>-- All languages --</option>`;
const $fragment6 = parseFragment`<option value=""${3}>-- All coverage --</option>`;
const $fragment7 = parseFragment`<option value="Complete"${3}>Complete</option>`;
const $fragment8 = parseFragment`<option value="Partial"${3}>Partial</option>`;
const $fragment9 = parseFragment`<div class="spinner-grow spinner-grow-sm mt-2${0}" role="status"${2}><span class="sr-only${0}"${2}>Loading...</span></div>`;
const stc0 = {
  classMap: {
    "mt-4": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "float-right": true,
    "btn-group": true,
    "btn-group-sm": true
  },
  attrs: {
    "role": "group",
    "aria-label": "Translation actions"
  },
  key: 1
};
const stc2 = {
  "btn": true,
  "btn-outline-secondary": true
};
const stc3 = {
  "btn": true,
  "btn-outline-primary": true
};
const stc4 = {
  "data-page-type": "addVolume",
  "href": "/volumes/add"
};
const stc5 = {
  attrs: {
    "novalidate": ""
  },
  key: 7
};
const stc6 = {
  classMap: {
    "form-row": true
  },
  key: 8
};
const stc7 = {
  classMap: {
    "form-group": true,
    "col-md-6": true
  },
  key: 9
};
const stc8 = {
  "data-feature": "featureAccompanyingIntroduction"
};
const stc9 = {
  "label": "Introduction"
};
const stc10 = {
  "data-feature": "featureAccompanyingNotes"
};
const stc11 = {
  "label": "Notes"
};
const stc12 = {
  "data-feature": "featureAccompanyingCommentary"
};
const stc13 = {
  "label": "Commentary"
};
const stc14 = {
  "data-feature": "volume.featureGlossary"
};
const stc15 = {
  "label": "Glossary"
};
const stc16 = {
  "data-feature": "volume.featureIndex"
};
const stc17 = {
  "label": "Index"
};
const stc18 = {
  classMap: {
    "form-group": true,
    "col-md-6": true
  },
  key: 15
};
const stc19 = {
  "data-feature": "volume.featureBibliography"
};
const stc20 = {
  "label": "Bibliography"
};
const stc21 = {
  "data-feature": "volume.featureMaps"
};
const stc22 = {
  "label": "Maps"
};
const stc23 = {
  "data-feature": "featureSamplePassage"
};
const stc24 = {
  "label": "Sample Passage"
};
const stc25 = {
  "data-feature": "featureFacingText"
};
const stc26 = {
  "label": "Facing Text"
};
const stc27 = {
  classMap: {
    "form-row": true
  },
  key: 20
};
const stc28 = {
  classMap: {
    "form-group": true,
    "col-md-4": true
  },
  key: 21
};
const stc29 = {
  "form-control": true,
  "form-control-sm": true,
  "format-picklist": true
};
const stc30 = {
  classMap: {
    "form-group": true,
    "col-md-4": true
  },
  key: 30
};
const stc31 = {
  "form-control": true,
  "form-control-sm": true,
  "language-picklist": true
};
const stc32 = {
  classMap: {
    "form-group": true,
    "col-md-4": true
  },
  key: 36
};
const stc33 = {
  "form-control": true,
  "form-control-sm": true,
  "coverage-picklist": true
};
const stc34 = {
  classMap: {
    "text-danger": true,
    "form-validity": true,
    "mb-2": true
  },
  key: 48
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {t: api_text, b: api_bind, d: api_dynamic_text, h: api_element, st: api_static_fragment, c: api_custom_element, gid: api_scoped_id, k: api_key, i: api_iterator, f: api_flatten} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15} = $ctx;
  return [api_element("h2", stc0, [api_text("Translations"), api_element("div", stc1, [api_element("button", {
    classMap: stc2,
    key: 2,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.handleToggleFilters))
    }
  }, [api_text(api_dynamic_text($cmp.filterTitle))]), api_element("a", {
    classMap: stc3,
    attrs: stc4,
    key: 3,
    on: {
      "click": _m1 || ($ctx._m1 = api_bind($cmp.handleNavigation))
    }
  }, [api_text("Add Translation")]), $cmp.allowComparisons ? api_element("a", {
    classMap: stc3,
    attrs: {
      "href": $cmp.translationCompareUrl
    },
    key: 4
  }, [api_text("Compare Translations")]) : null])]), $cmp.showingFilters ? api_static_fragment($fragment1(), 6) : null, $cmp.showingFilters ? api_element("form", stc5, [api_element("div", stc6, [api_element("div", stc7, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc8,
    props: stc9,
    key: 10,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc10,
    props: stc11,
    key: 11,
    on: {
      "change": _m3 || ($ctx._m3 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc12,
    props: stc13,
    key: 12,
    on: {
      "change": _m4 || ($ctx._m4 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc14,
    props: stc15,
    key: 13,
    on: {
      "change": _m5 || ($ctx._m5 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc16,
    props: stc17,
    key: 14,
    on: {
      "change": _m6 || ($ctx._m6 = api_bind($cmp.handleFilterChange))
    }
  })]), api_element("div", stc18, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc19,
    props: stc20,
    key: 16,
    on: {
      "change": _m7 || ($ctx._m7 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc21,
    props: stc22,
    key: 17,
    on: {
      "change": _m8 || ($ctx._m8 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc23,
    props: stc24,
    key: 18,
    on: {
      "change": _m9 || ($ctx._m9 = api_bind($cmp.handleFilterChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc25,
    props: stc26,
    key: 19,
    on: {
      "change": _m10 || ($ctx._m10 = api_bind($cmp.handleFilterChange))
    }
  })])]), api_element("div", stc27, [api_element("div", stc28, [api_element("label", {
    attrs: {
      "for": api_scoped_id("format")
    },
    key: 22
  }, [api_text("Format")]), api_element("select", {
    classMap: stc29,
    attrs: {
      "name": "format",
      "size": "1",
      "value": $cmp.selectedFilterFormat
    },
    key: 23,
    on: {
      "change": _m11 || ($ctx._m11 = api_bind($cmp.handleFilterChange))
    }
  }, [api_static_fragment($fragment2(), 25), api_static_fragment($fragment3(), 27), api_static_fragment($fragment4(), 29)])]), api_element("div", stc30, [api_element("label", {
    attrs: {
      "for": api_scoped_id("language")
    },
    key: 31
  }, [api_text("Language")]), api_element("select", {
    classMap: stc31,
    attrs: {
      "name": "language",
      "size": "1",
      "value": $cmp.selectedFilterLanguage
    },
    key: 32,
    on: {
      "change": _m12 || ($ctx._m12 = api_bind($cmp.handleFilterChange))
    }
  }, api_flatten([api_static_fragment($fragment5(), 34), api_iterator($cmp.availableLanguages, function (item) {
    return api_element("option", {
      attrs: {
        "value": item.id
      },
      key: api_key(35, item.id)
    }, [api_text(api_dynamic_text(item.name))]);
  })]))]), api_element("div", stc32, [api_element("label", {
    attrs: {
      "for": api_scoped_id("coverage")
    },
    key: 37
  }, [api_text("Coverage")]), api_element("select", {
    classMap: stc33,
    attrs: {
      "name": "coverage",
      "size": "1",
      "value": $cmp.selectedFilterCoverage
    },
    key: 38,
    on: {
      "change": _m13 || ($ctx._m13 = api_bind($cmp.handleFilterChange))
    }
  }, [api_static_fragment($fragment6(), 40), api_static_fragment($fragment7(), 42), api_static_fragment($fragment8(), 44)])])])]) : null, api_custom_element("bib-data-table", _bibDataTable, {
    props: {
      "columns": $cmp.columns,
      "records": $cmp.records,
      "filterCriteria": $cmp.filterCriteria,
      "allowsSelection": $cmp.allowsSelection,
      "selectedIds": $cmp.selectedIds
    },
    key: 45,
    on: {
      "sort": _m14 || ($ctx._m14 = api_bind($cmp.handleSort)),
      "selectionchange": _m15 || ($ctx._m15 = api_bind($cmp.handleSelectionChange))
    }
  }), api_static_fragment($fragment9(), 47), api_element("small", stc34, [api_text(api_dynamic_text($cmp.error))])];
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
  tmpl.stylesheetToken = "bib-translationView_translationView"
}
freezeTemplate(tmpl);
