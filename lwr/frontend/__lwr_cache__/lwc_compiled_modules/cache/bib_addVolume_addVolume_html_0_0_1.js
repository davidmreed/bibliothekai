import { freezeTemplate } from "lwc";

import _implicitStylesheets from "./addVolume.css";

import _implicitScopedStylesheets from "./addVolume.scoped.css?scoped=true";

import _bibPopUpMenu from "bib/popUpMenu";
import _bibFeatureDisplay from "bib/featureDisplay";
import _bibSwitch from "bib/switch";
import _bibSingleFeatureEditor from "bib/singleFeatureEditor";
import _bibTranslationEditor from "bib/translationEditor";
import _bibAddPublisher from "bib/addPublisher";
import _bibAddSeries from "bib/addSeries";
import _bibAddPerson from "bib/addPerson";
import {parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<small class="form-text text-muted mb-2${0}"${2}>Enter details about this volume. A title, published date, and publisher are required.</small>`;
const $fragment2 = parseFragment`<div class="invalid-feedback${0}"${2}>Please enter a title.</div>`;
const $fragment3 = parseFragment`<small class="text-muted${0}"${2}>Language of the majority of this volume. Translations default to this language.</small>`;
const $fragment4 = parseFragment`<div class="invalid-feedback${0}"${2}>Please select or create a publisher.</div>`;
const $fragment5 = parseFragment`<small class="text-muted${0}"${2}>If only a year is present, use January 1.</small>`;
const $fragment6 = parseFragment`<div class="invalid-feedback${0}"${2}>Please enter a publication date.</div>`;
const $fragment7 = parseFragment`<h2${3}>Contents</h2>`;
const $fragment8 = parseFragment`<small class="text-muted${0}"${2}>Bibliothekai tracks each translated text in a volume separately, including any introduction or notes to the text. You can also record overall introductions and notes that apply to the whole volume as general features below.</small>`;
const $fragment9 = parseFragment`<small class="form-text text-muted mb-1${0}"${2}>Add translations to this volume. At least one translation is required.</small>`;
const $fragment10 = parseFragment`<h3 class="mt-3${0}"${2}>Resources</h3>`;
const $fragment11 = parseFragment`<small class="form-text text-muted mb-2${0}"${2}>Add features of the volume as a whole, like general introductions and notes that aren&#x27;t associated with a specific translation. Introductions to specific texts should be part of the translation.</small>`;
const $fragment12 = parseFragment`<div class="card-header${0}"${2}><h5 class="card-title${0}"${2}>Volume Resources</h5></div>`;
const $fragment13 = parseFragment`<small class="text-muted mb-2${0}"${2}>Select authored resources offered in this volume.</small>`;
const $fragment14 = parseFragment`<small class="text-muted mb-2${0}"${2}>Select additional resources offered in this volume.</small>`;
const $fragment15 = parseFragment`<hr${3}>`;
const $fragment16 = parseFragment`<div class="status text-center mb-2 d-none${0}"${2}><div class="spinner-grow spinner-grow-sm mr-2${0}" role="status"${2}></div>Creating records...</div>`;
const stc0 = {
  key: 0
};
const stc1 = {
  key: 1
};
const stc2 = {
  "float-right": true,
  "btn": true,
  "btn-outline-primary": true
};
const stc3 = {
  classMap: {
    "details": true
  },
  key: 5
};
const stc4 = {
  classMap: {
    "needs-validation": true
  },
  attrs: {
    "novalidate": ""
  },
  key: 6
};
const stc5 = {
  classMap: {
    "form-group": true
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
    "col-6": true
  },
  key: 9
};
const stc8 = {
  "form-control": true
};
const stc9 = {
  classMap: {
    "col": true
  },
  key: 14
};
const stc10 = {
  classMap: {
    "form-row": true
  },
  key: 18
};
const stc11 = {
  classMap: {
    "col": true
  },
  key: 19
};
const stc12 = {
  "publisher-popup": true
};
const stc13 = {
  "data-name": "publisher"
};
const stc14 = {
  classMap: {
    "col": true
  },
  key: 23
};
const stc15 = {
  "series-popup": true
};
const stc16 = {
  "data-name": "series"
};
const stc17 = {
  classMap: {
    "form-row": true
  },
  key: 25
};
const stc18 = {
  classMap: {
    "col": true
  },
  key: 26
};
const stc19 = {
  classMap: {
    "col": true
  },
  key: 33
};
const stc20 = {
  "btn": true,
  "btn-outline-primary": true,
  "btn-block": true,
  "mb-3": true
};
const stc21 = {
  "type": "submit"
};
const stc22 = {
  classMap: {
    "mt-3": true
  },
  key: 45
};
const stc23 = {
  classMap: {
    "float-right": true
  },
  key: 46
};
const stc24 = {
  "btn": true,
  "btn-outline-primary": true
};
const stc25 = {
  classMap: {
    "translations": true
  },
  key: 50
};
const stc26 = {
  "mb-2": true
};
const stc27 = {
  "feature-display": true
};
const stc28 = {
  classMap: {
    "volume-feature-switches": true
  },
  key: 57
};
const stc29 = {
  classMap: {
    "card": true,
    "mb-2": true
  },
  key: 58
};
const stc30 = {
  classMap: {
    "card-body": true
  },
  key: 61
};
const stc31 = {
  attrs: {
    "novalidate": ""
  },
  key: 62
};
const stc32 = {
  classMap: {
    "form-row": true
  },
  key: 63
};
const stc33 = {
  classMap: {
    "form-group": true,
    "col-md-6": true
  },
  key: 64
};
const stc34 = {
  "data-feature": "Introduction"
};
const stc35 = {
  "data-feature": "Notes"
};
const stc36 = {
  "data-feature": "Edited"
};
const stc37 = {
  classMap: {
    "form-group": true,
    "col-md-6": true
  },
  key: 70
};
const stc38 = {
  "data-name": "feature_bibliography"
};
const stc39 = {
  "data-name": "feature_maps"
};
const stc40 = {
  "data-name": "feature_glossary"
};
const stc41 = {
  "data-name": "feature_index"
};
const stc42 = {
  classMap: {
    "volume-features": true
  },
  key: 77
};
const stc43 = {
  classMap: {
    "text-danger": true,
    "form-validity": true,
    "mb-2": true
  },
  key: 81
};
const stc44 = {
  "btn": true,
  "btn-primary": true,
  "btn-block": true,
  "mb-3": true
};
const stc45 = {
  key: 85
};
const stc46 = {
  "btn": true,
  "btn-outline-secondary": true,
  "mr-3": true
};
const stc47 = {
  "feature-editor": true
};
const stc48 = {
  key: 88
};
const stc49 = {
  key: 91
};
const stc50 = {
  key: 94
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {t: api_text, b: api_bind, h: api_element, st: api_static_fragment, gid: api_scoped_id, c: api_custom_element, k: api_key, i: api_iterator, d: api_dynamic_text} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15, _m16, _m17, _m18, _m19, _m20, _m21, _m22, _m23, _m24, _m25, _m26, _m27, _m28, _m29, _m30, _m31, _m32, _m33, _m34} = $ctx;
  return [!$cmp.showingModal ? api_element("div", stc0, [api_element("h2", stc1, [api_text("Publication Details"), !$cmp.detailsExpanded ? api_element("button", {
    classMap: stc2,
    key: 2,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.toggleDetails))
    }
  }, [api_text("Edit")]) : null]), $cmp.detailsExpanded ? api_static_fragment($fragment1(), 4) : null, $cmp.detailsExpanded ? api_element("div", stc3, [api_element("form", stc4, [api_element("div", stc5, [api_element("div", stc6, [api_element("div", stc7, [api_element("label", {
    attrs: {
      "for": api_scoped_id("title")
    },
    key: 10
  }, [api_text("Title")]), api_element("input", {
    classMap: stc8,
    attrs: {
      "id": api_scoped_id("title"),
      "data-name": "title",
      "placeholder": "Title",
      "type": "text",
      "required": ""
    },
    props: {
      "value": $cmp.title
    },
    key: 11,
    on: {
      "change": _m1 || ($ctx._m1 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment2(), 13)]), api_element("div", stc9, [api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    props: {
      "labelText": "Primary Language",
      "entityName": "languages",
      "allowAdd": "false",
      "value": $cmp.primaryLanguage
    },
    key: 15,
    on: {
      "change": _m2 || ($ctx._m2 = api_bind($cmp.handlePrimaryLanguageChange))
    }
  }), api_static_fragment($fragment3(), 17)])]), api_element("div", stc10, [api_element("div", stc11, [api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    classMap: stc12,
    attrs: stc13,
    props: {
      "labelText": "Publisher",
      "entityName": "publishers",
      "allowAdd": "true",
      "value": $cmp.publisher
    },
    key: 20,
    on: {
      "change": _m3 || ($ctx._m3 = api_bind($cmp.handleChange)),
      "add": _m4 || ($ctx._m4 = api_bind($cmp.toggleAddingPublisher))
    }
  }), api_static_fragment($fragment4(), 22)]), api_element("div", stc14, [api_custom_element("bib-pop-up-menu", _bibPopUpMenu, {
    classMap: stc15,
    attrs: stc16,
    props: {
      "labelText": "Series",
      "entityName": "series",
      "allowAdd": "true",
      "value": $cmp.series
    },
    key: 24,
    on: {
      "change": _m5 || ($ctx._m5 = api_bind($cmp.handleChange)),
      "add": _m6 || ($ctx._m6 = api_bind($cmp.toggleAddingSeries))
    }
  })])]), api_element("div", stc17, [api_element("div", stc18, [api_element("label", {
    attrs: {
      "for": api_scoped_id("date")
    },
    key: 27
  }, [api_text("Publication Date")]), api_element("input", {
    classMap: stc8,
    attrs: {
      "id": api_scoped_id("date"),
      "data-name": "published_date",
      "type": "date",
      "required": ""
    },
    props: {
      "value": $cmp.published_date
    },
    key: 28,
    on: {
      "change": _m7 || ($ctx._m7 = api_bind($cmp.handleChange))
    }
  }), api_static_fragment($fragment5(), 30), api_static_fragment($fragment6(), 32)]), api_element("div", stc19, [api_element("label", {
    attrs: {
      "for": api_scoped_id("isbn")
    },
    key: 34
  }, [api_text("ISBN")]), api_element("input", {
    classMap: stc8,
    attrs: {
      "id": api_scoped_id("isbn"),
      "data-name": "isbn",
      "placeholder": "Optional: ISBN, if present",
      "type": "text"
    },
    props: {
      "value": $cmp.isbn
    },
    key: 35,
    on: {
      "change": _m8 || ($ctx._m8 = api_bind($cmp.handleChange))
    }
  })])]), api_element("label", {
    attrs: {
      "for": api_scoped_id("description")
    },
    key: 36
  }, [api_text("Description")]), api_element("textarea", {
    classMap: stc8,
    attrs: {
      "id": api_scoped_id("description"),
      "data-name": "description",
      "placeholder": "Optional: describe unique features of this volume, such as maps, indices, and other supporting material. Record translations, introductions, and notes below.",
      "type": "text",
      "value": $cmp.description
    },
    key: 37,
    on: {
      "change": _m9 || ($ctx._m9 = api_bind($cmp.handleChange))
    }
  }), api_element("label", {
    attrs: {
      "for": api_scoped_id("link")
    },
    key: 38
  }, [api_text("Website")]), api_element("input", {
    classMap: stc8,
    attrs: {
      "id": api_scoped_id("link"),
      "data-name": "link",
      "placeholder": "Optional: link to book on publisher's website",
      "type": "url"
    },
    props: {
      "value": $cmp.link
    },
    key: 39,
    on: {
      "change": _m10 || ($ctx._m10 = api_bind($cmp.handleChange))
    }
  })]), api_element("button", {
    classMap: stc20,
    attrs: stc21,
    key: 40,
    on: {
      "click": _m11 || ($ctx._m11 = api_bind($cmp.toggleDetails))
    }
  }, [api_text("Done with Details")])])]) : null, api_static_fragment($fragment7(), 42), api_static_fragment($fragment8(), 44), api_element("h3", stc22, [api_text("Translations"), api_element("div", stc23, [api_element("button", {
    classMap: stc24,
    key: 47,
    on: {
      "click": _m12 || ($ctx._m12 = api_bind($cmp.addTranslation))
    }
  }, [api_text("Add")])])]), api_static_fragment($fragment9(), 49), api_element("div", stc25, api_iterator($cmp.features, function (item) {
    return api_element("div", {
      classMap: stc26,
      key: api_key(51, item.id)
    }, [api_custom_element("bib-feature-display", _bibFeatureDisplay, {
      classMap: stc27,
      attrs: {
        "data-item": item.id
      },
      props: {
        "feature": item
      },
      key: 52,
      on: {
        "edit": _m13 || ($ctx._m13 = api_bind($cmp.handleFeatureEdit)),
        "remove": _m14 || ($ctx._m14 = api_bind($cmp.handleFeatureRemove))
      }
    })]);
  })), api_static_fragment($fragment10(), 54), api_static_fragment($fragment11(), 56), api_element("div", stc28, [api_element("div", stc29, [api_static_fragment($fragment12(), 60), api_element("div", stc30, [api_element("form", stc31, [api_element("div", stc32, [api_element("div", stc33, [api_static_fragment($fragment13(), 66), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc34,
    props: {
      "label": "General Introduction",
      "value": $cmp.generalFeatures.hasIntroduction
    },
    key: 67,
    on: {
      "change": _m15 || ($ctx._m15 = api_bind($cmp.handleFeatureSwitchChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc35,
    props: {
      "label": "General Notes",
      "value": $cmp.generalFeatures.hasNotes
    },
    key: 68,
    on: {
      "change": _m16 || ($ctx._m16 = api_bind($cmp.handleFeatureSwitchChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc36,
    props: {
      "label": "Editors",
      "value": $cmp.generalFeatures.hasEdited
    },
    key: 69,
    on: {
      "change": _m17 || ($ctx._m17 = api_bind($cmp.handleFeatureSwitchChange))
    }
  })]), api_element("div", stc37, [api_static_fragment($fragment14(), 72), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc38,
    props: {
      "label": "Bibliography",
      "value": $cmp.feature_bibliography
    },
    key: 73,
    on: {
      "change": _m18 || ($ctx._m18 = api_bind($cmp.handleChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc39,
    props: {
      "label": "Maps",
      "value": $cmp.feature_maps
    },
    key: 74,
    on: {
      "change": _m19 || ($ctx._m19 = api_bind($cmp.handleChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc40,
    props: {
      "label": "Glossary",
      "value": $cmp.feature_glossary
    },
    key: 75,
    on: {
      "change": _m20 || ($ctx._m20 = api_bind($cmp.handleChange))
    }
  }), api_custom_element("bib-switch", _bibSwitch, {
    attrs: stc41,
    props: {
      "label": "Index",
      "value": $cmp.feature_index
    },
    key: 76,
    on: {
      "change": _m21 || ($ctx._m21 = api_bind($cmp.handleChange))
    }
  })])])])])])]), api_element("div", stc42, api_iterator($cmp.generalFeatures.features, function (f) {
    return api_custom_element("bib-single-feature-editor", _bibSingleFeatureEditor, {
      props: {
        "feature": f,
        "hasTranslation": $cmp.hasTranslation
      },
      key: api_key(78, f.feature),
      on: {
        "update": _m22 || ($ctx._m22 = api_bind($cmp.handleSingleFeatureChange)),
        "addperson": _m23 || ($ctx._m23 = api_bind($cmp.doAddPerson))
      }
    });
  })), api_static_fragment($fragment15(), 80), api_element("small", stc43, [api_text(api_dynamic_text($cmp.error))]), api_static_fragment($fragment16(), 83), api_element("button", {
    classMap: stc44,
    key: 84,
    on: {
      "click": _m24 || ($ctx._m24 = api_bind($cmp.create))
    }
  }, [api_text("Create Volume")])]) : null, $cmp.showingTranslationModal ? api_element("h4", stc45, [api_element("button", {
    classMap: stc46,
    key: 86,
    on: {
      "click": _m25 || ($ctx._m25 = api_bind($cmp.toggleEditingFeature))
    }
  }, [api_text("< Back")]), api_text("Editing Translation")]) : null, $cmp.showingTranslationModal ? api_custom_element("bib-translation-editor", _bibTranslationEditor, {
    classMap: stc47,
    props: {
      "features": $cmp.featureToEdit
    },
    key: 87,
    on: {
      "update": _m26 || ($ctx._m26 = api_bind($cmp.handleFeatureChange)),
      "save": _m27 || ($ctx._m27 = api_bind($cmp.toggleEditingFeature)),
      "addperson": _m28 || ($ctx._m28 = api_bind($cmp.doAddPerson))
    }
  }) : null, $cmp.addingPublisher ? api_element("h4", stc48, [api_element("button", {
    classMap: stc46,
    key: 89,
    on: {
      "click": _m29 || ($ctx._m29 = api_bind($cmp.toggleAddingPublisher))
    }
  }, [api_text("< Back")]), api_text("Adding New Publisher")]) : null, $cmp.addingPublisher ? api_custom_element("bib-add-publisher", _bibAddPublisher, {
    key: 90,
    on: {
      "save": _m30 || ($ctx._m30 = api_bind($cmp.publisherAdded))
    }
  }) : null, $cmp.addingSeries ? api_element("h4", stc49, [api_element("button", {
    classMap: stc46,
    key: 92,
    on: {
      "click": _m31 || ($ctx._m31 = api_bind($cmp.toggleAddingSeries))
    }
  }, [api_text("< Back")]), api_text("Adding New Series")]) : null, $cmp.addingSeries ? api_custom_element("bib-add-series", _bibAddSeries, {
    key: 93,
    on: {
      "save": _m32 || ($ctx._m32 = api_bind($cmp.seriesAdded))
    }
  }) : null, $cmp.addingPerson ? api_element("h4", stc50, [api_element("button", {
    classMap: stc46,
    key: 95,
    on: {
      "click": _m33 || ($ctx._m33 = api_bind($cmp.toggleAddingPerson))
    }
  }, [api_text("< Back")]), api_text("Adding New Person")]) : null, $cmp.addingPerson ? api_custom_element("bib-add-person", _bibAddPerson, {
    key: 96,
    on: {
      "save": _m34 || ($ctx._m34 = api_bind($cmp.savePerson))
    }
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
  tmpl.stylesheetToken = "bib-addVolume_addVolume"
}
freezeTemplate(tmpl);
