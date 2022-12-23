import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./translationEditor.css";

import _implicitScopedStylesheets from "./translationEditor.scoped.css?scoped=true";

import _bibPopUpMenu from "bib/popUpMenu";
import _bibSwitch from "bib/switch";
import _bibDualingListbox from "bib/dualingListbox";
import _bibSingleFeatureEditor from "bib/singleFeatureEditor";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<small class="form-text text-muted validity is-invalid form-control mb-2 d-none${0}"${2}></small>`;
const $fragment2 = parseFragment`<div class="card-header${0}"${2}><h5 class="card-title${0}"${2}>Text Selection</h5></div>`;
const $fragment3 = parseFragment`<option value="Prose"${3}>Prose</option>`;
const $fragment4 = parseFragment`<option value="Verse"${3}>Verse</option>`;
const $fragment5 = parseFragment`<option value="false"${3}>Complete translation</option>`;
const $fragment6 = parseFragment`<option value="true"${3}>Partial translation</option>`;
const $fragment7 = parseFragment`<hr${3}>`;
const $fragment8 = parseFragment`<hr${3}>`;
const $fragment9 = parseFragment`<hr${3}>`;
const stc0 = {
  key: 0
};
const stc1 = {
  classMap: {
    "card": true,
    "mb-2": true
  },
  key: 3
};
const stc2 = {
  classMap: {
    "card-body": true
  },
  key: 6
};
const stc3 = {
  "data-name": "text"
};
const stc4 = {
  classMap: {
    "invalid-feedback": true
  },
  key: 8
};
const stc5 = {
  classMap: {
    "row": true
  },
  key: 9
};
const stc6 = {
  classMap: {
    "col": true
  },
  key: 10
};
const stc7 = {
  "data-name": "translation.hasFacingText"
};
const stc8 = {
  classMap: {
    "col": true
  },
  key: 12
};
const stc9 = {
  "data-feature": "Introduction"
};
const stc10 = {
  classMap: {
    "col": true
  },
  key: 14
};
const stc11 = {
  "data-feature": "Notes"
};
const stc12 = {
  classMap: {
    "col": true
  },
  key: 16
};
const stc13 = {
  "data-feature": "Commentary"
};
const stc14 = {
  classMap: {
    "card": true,
    "mb-2": true
  },
  key: 18
};
const stc15 = {
  classMap: {
    "card-header": true
  },
  key: 19
};
const stc16 = {
  classMap: {
    "card-title": true
  },
  key: 20
};
const stc17 = {
  "float-right": true,
  "btn": true,
  "btn-sm": true,
  "btn-outline-primary": true
};
const stc18 = {
  classMap: {
    "card-body": true
  },
  key: 22
};
const stc19 = {
  classMap: {
    "form-group": true
  },
  key: 23
};
const stc20 = {
  classMap: {
    "form-row": true
  },
  key: 24
};
const stc21 = {
  classMap: {
    "col": true
  },
  key: 25
};
const stc22 = {
  "data-name": "translation.language"
};
const stc23 = {
  classMap: {
    "col": true
  },
  key: 27
};
const stc24 = {
  "form-control": true,
  "format-picklist": true
};
const stc25 = {
  classMap: {
    "col": true
  },
  key: 34
};
const stc26 = {
  "form-control": true,
  "coverage-picklist": true
};
const stc27 = {
  "form-control": true
};
const stc28 = {
  "data-name": "translation.title",
  "placeholder": "Title, if different from text",
  "type": "text"
};
const stc29 = {
  "data-name": "translation.originalPublicationDate",
  "placeholder": "If this is a republication",
  "type": "date"
};
const stc30 = {
  "form-control": true,
  "description-field": true
};
const stc31 = {
  classMap: {
    "text-muted": true
  },
  key: 51
};
const stc32 = {
  "persons-listbox": true
};
const stc33 = {
  "data-name": "translation.persons"
};
const stc34 = {
  "btn": true,
  "btn-sm": true,
  "btn-outline-primary": true,
  "btn-block": true,
  "mt-3": true
};
const stc35 = {
  "btn": true,
  "btn-primary": true,
  "btn-block": true,
  "mb-3": true
};
const stc36 = [];
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, b: api_bind, c: api_custom_element, d: api_dynamic_text, t: api_text, h: api_element, gid: api_scoped_id, k: api_key, i: api_iterator, f: api_flatten} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15, _m16, _m17, _m18} = $ctx;
  return !$cmp.addingPerson ? api_flatten([api_element("div", stc0, [api_static_fragment($fragment1(), 2), api_element("div", stc1, [api_static_fragment($fragment2(), 5), api_element("div", stc2, [api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    attrs: stc3,
    props: {
      "entityName": "texts",
      "allowAdd": "false",
      "value": $cmp.features.text
    },
    key: 7,
    on: {
      "change": _m0 || ($ctx._m0 = api_bind($cmp.changeText))
    }
  }), api_element("div", stc4, [api_text(api_dynamic_text($cmp.error))]), api_element("div", stc5, [api_element("div", stc6, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc7,
    props: {
      "label": "Has Facing Text",
      "value": $cmp.features.translation.hasFacingText
    },
    key: 11,
    on: {
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleChange))
    }
  })]), api_element("div", stc8, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc9,
    props: {
      "label": "Has Introduction",
      "value": $cmp.features.hasIntroduction
    },
    key: 13,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handleFeatureSwitchChange))
    }
  })]), api_element("div", stc10, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc11,
    props: {
      "label": "Has Notes",
      "value": $cmp.features.hasNotes
    },
    key: 15,
    on: {
      "change": _m3 || ($ctx._m3 = api_bind($cmp.handleFeatureSwitchChange))
    }
  })]), api_element("div", stc12, [api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc13,
    props: {
      "label": "Has Commentary",
      "value": $cmp.features.hasCommentary
    },
    key: 17,
    on: {
      "change": _m4 || ($ctx._m4 = api_bind($cmp.handleFeatureSwitchChange))
    }
  })])])])])]), api_element("div", stc14, [api_element("div", stc15, [api_element("h5", stc16, [api_text("Translation"), !$cmp.translationExpanded ? api_element("button", {
    classMap: stc17,
    key: 21,
    on: {
      "click": _m5 || ($ctx._m5 = api_bind($cmp.toggleTranslationExpanded))
    }
  }, [api_text("Edit")]) : null])]), $cmp.translationExpanded ? api_element("div", stc18, [api_element("div", stc19, [api_element("div", stc20, [api_element("div", stc21, [api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    attrs: stc22,
    props: {
      "labelText": "Language",
      "entityName": "languages",
      "allowAdd": "false",
      "value": $cmp.features.translation.language
    },
    key: 26,
    on: {
      "change": _m6 || ($ctx._m6 = api_bind($cmp.handleChange))
    }
  })]), api_element("div", stc23, [api_element("label", {
    attrs: {
      "for": api_scoped_id("format")
    },
    key: 28
  }, [api_text("Format")]), api_element("select", {
    classMap: stc24,
    attrs: {
      "data-name": "translation.format",
      "size": "1",
      "value": $cmp.features.translation.format
    },
    key: 29,
    on: {
      "change": _m7 || ($ctx._m7 = api_bind($cmp.handleChange))
    }
  }, [api_static_fragment($fragment3(), 31), api_static_fragment($fragment4(), 33)])]), api_element("div", stc25, [api_element("label", {
    attrs: {
      "for": api_scoped_id("partial")
    },
    key: 35
  }, [api_text("Coverage")]), api_element("select", {
    classMap: stc26,
    attrs: {
      "data-name": "translation.partial",
      "size": "1",
      "value": $cmp.partialValue
    },
    key: 36,
    on: {
      "change": _m8 || ($ctx._m8 = api_bind($cmp.handleChangeBoolean))
    }
  }, [api_static_fragment($fragment5(), 38), api_static_fragment($fragment6(), 40)])])]), api_element("label", {
    attrs: {
      "for": api_scoped_id("title")
    },
    key: 41
  }, [api_text("Title")]), api_element("input", {
    classMap: stc27,
    attrs: stc28,
    props: {
      "value": $cmp.features.translation.title
    },
    key: 42,
    on: {
      "change": _m9 || ($ctx._m9 = api_bind($cmp.handleChange))
    }
  }), api_element("label", {
    attrs: {
      "for": api_scoped_id("original-publication-date")
    },
    key: 43
  }, [api_text("Original Publication Date")]), api_element("input", {
    classMap: stc27,
    attrs: stc29,
    props: {
      "value": $cmp.features.translation.originalPublicationDate
    },
    key: 44,
    on: {
      "change": _m10 || ($ctx._m10 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment7(), 46), api_element("label", {
    attrs: {
      "for": api_scoped_id("description")
    },
    key: 47
  }, [api_text("Description")]), api_element("textarea", {
    classMap: stc30,
    attrs: {
      "data-name": "translation.description",
      "placeholder": "Description",
      "type": "text",
      "value": $cmp.features.translation.description
    },
    key: 48,
    on: {
      "change": _m11 || ($ctx._m11 = api_bind($cmp.handleChange))
    }
  }), $cmp.hasSamplePassage ? api_element("label", {
    attrs: {
      "for": api_scoped_id("sample")
    },
    key: 49
  }, [api_text("Sample Passage")]) : null, $cmp.hasSamplePassage ? api_element("textarea", {
    classMap: stc27,
    attrs: {
      "data-name": "translation.samplePassage",
      "value": $cmp.features.translation.samplePassage
    },
    key: 50,
    on: {
      "change": _m12 || ($ctx._m12 = api_bind($cmp.handleChange))
    }
  }) : null, $cmp.hasSamplePassage ? api_element("small", stc31, [api_text("The sample passage for " + api_dynamic_text($cmp.selectedText.title) + " is " + api_dynamic_text($cmp.selectedText.sample_passage_spec) + ".")]) : null, api_static_fragment($fragment8(), 53), api_element("label", {
    attrs: {
      "for": api_scoped_id("authors")
    },
    key: 54
  }, [api_text("Translators")]), api_custom_element("bib-dualing-listbox", _bibDualingListbox, {
    classMap: stc32,
    attrs: stc33,
    props: {
      "entityName": "persons",
      "allowAdd": "true",
      "value": $cmp.features.translation.persons
    },
    key: 55,
    on: {
      "add": _m13 || ($ctx._m13 = api_bind($cmp.handleAddPerson)),
      "change": _m14 || ($ctx._m14 = api_bind($cmp.handleChange))
    }
  }), api_element("button", {
    classMap: stc34,
    key: 56,
    on: {
      "click": _m15 || ($ctx._m15 = api_bind($cmp.toggleTranslationExpanded))
    }
  }, [api_text("Done")])])]) : null]), api_iterator($cmp.features.features, function (f) {
    return !f.isTranslation ? api_custom_element("bib-single-feature-editor", _bibSingleFeatureEditor, {
      props: {
        "feature": f,
        "hasTranslation": $cmp.hasTranslation
      },
      key: api_key(57, f.feature),
      on: {
        "update": _m16 || ($ctx._m16 = api_bind($cmp.handleSingleFeatureChange)),
        "addperson": _m17 || ($ctx._m17 = api_bind($cmp.handleSingleFeatureAddPerson))
      }
    }) : null;
  }), api_static_fragment($fragment9(), 59), api_element("button", {
    classMap: stc35,
    key: 60,
    on: {
      "click": _m18 || ($ctx._m18 = api_bind($cmp.save))
    }
  }, [api_text("Done with Translation")])]) : stc36;
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
  tmpl.stylesheetToken = "bib-translationEditor_translationEditor"
}
freezeTemplate(tmpl);
