import { registerDecorators as _registerDecorators5, registerComponent as _registerComponent, registerDecorators as _registerDecorators4, registerDecorators as _registerDecorators3, registerDecorators as _registerDecorators2, registerDecorators as _registerDecorators, LightningElement } from "lwc";
import _tmpl from "./volumePage.html";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { CurrentPageReference, generateUrl, NavigationContext } from 'lwr/navigation';
import { graphQL } from 'bib/api';
const VOLUME_DETAILS_QUERY = `
query getVolumeDetails($volumeId: Int) {
    volume(id: $volumeId) {
        title
        publisher {
            id
            name
        }
        series {
            id
            name
        }
        description
        isbn
        featureGlossary
        featureIndex
        featureBibliography
        featureMaps
        features {
            id
            title
            persons {
                id
                fullName
            }
            language {
                id
                name
            }
            feature
            partial
            format
            featureFacingText
            samplePassage
            sourceText {
                title
                author {
                    id
                    fullName
                }
                language {
                    id
                    name
                }
                format
            }
        }
        publishedDate
        publishedReviews {
            persons {
                id
                fullName
            }
            volumes {
                id
                title
                publishedDate
            }
            location
            publishedDate
            title
        }
    }
}
`;

// TODO: alternate names + links

class VolumeElementResource {
  constructor(resourceType, persons, language) {
    this.resourceType = void 0;
    this.persons = void 0;
    this.language = void 0;
    this.resourceType = resourceType;
    this.persons = persons;
    this.language = language;
  }
}
_registerDecorators(VolumeElementResource, {
  fields: ["resourceType", "persons", "language"]
});
class VolumeElementTranslation {
  constructor(data) {
    this.format = void 0;
    this.language = void 0;
    this.persons = void 0;
    this.title = void 0;
    this.partial = void 0;
    this.feature = data.feature;
    this.language = data.language;
    this.persons = data.persons;
    this.title = data.title;
    this.partial = data.partial;
  }
}
_registerDecorators2(VolumeElementTranslation, {
  fields: ["format", "language", "persons", "title", "partial"]
});
class VolumeElement {
  constructor(sourceText, translation) {
    this.sourceText = void 0;
    this.translation = void 0;
    this.resources = void 0;
    this.sourceText = sourceText;
    this.translation = translation;
    this.resources = [];
  }
}
_registerDecorators3(VolumeElement, {
  fields: ["sourceText", "translation", "resources"]
});
class Volume {
  constructor(data) {
    this.title = void 0;
    this.description = void 0;
    this.isbn = void 0;
    this.publisher = void 0;
    this.featureGlossary = void 0;
    this.featureIndex = void 0;
    this.featureBibliography = void 0;
    this.featureMaps = void 0;
    this.publishedDate = void 0;
    this.elements = void 0;
    // process the inbound data from GraphQL into something easier to work with.
    // First, find all of the volume data
    console.log(JSON.stringify(data));
    for (let key of ["title", "description", "isbn", "publisher", "featureGlossary", "featureIndex", "featureBibliography", "featureMaps", "publishedDate"]) {
      this[key] = data[key];
    }

    // Now, group the features by source text and construct VolumeElements for them.
    let translationFeatures = data.features.filter(f => f.feature === 'TR');
    let otherFeatures = data.features.filter(f => f.feature !== 'TR');
    let elements = {};
    for (let feature of translationFeatures) {
      elements[feature.sourceText] = new VolumeElement(feature.sourceText, new VolumeElementTranslation(feature));
    }
    for (let feature of otherFeatures) {
      let element = elements[feature.sourceText];
      element.resources.push(new VolumeElementResource(feature.feature, feature.persons, feature.language));
    }
    this.elements = Array.from(Object.values(elements));
    console.log(JSON.stringify(this.elements));
  }
}
_registerDecorators4(Volume, {
  fields: ["title", "description", "isbn", "publisher", "featureGlossary", "featureIndex", "featureBibliography", "featureMaps", "publishedDate", "elements"]
});
class VolumePage extends LightningElement {
  constructor(...args) {
    super(...args);
    this.pageReference = void 0;
    this.navContext = void 0;
    this.volume = void 0;
    this.crumbs = void 0;
    this.queryParameters = void 0;
  }
  // FIXME: the wire adapter doesn't catch returns that have the `errors` key w/a 200
  provisionVolume({
    data,
    error
  }) {
    if (data && data.data) {
      this.volume = new Volume(data.data.volume);
      this.updateBreadcrumbs();
    } else {
      alert(`Got an error: ${JSON.stringify(error)}`);
    }
  }
  updateBreadcrumbs() {
    this.crumbs = [{
      pageReference: {
        type: 'home'
      },
      title: "Home"
    }, {
      pageReference: {
        type: 'volumeListPage',
        attributes: {
          publisherId: this.volume.publisher.id
        }
      },
      title: this.volume.publisher.name
    }, {
      pageReference: {
        type: 'volumePage',
        attributes: {
          volumeId: String(this.volume.id)
        }
      },
      title: this.volume.title,
      currentPage: true
    }].map(p => _objectSpread({
      url: generateUrl(this.navContext, p.pageReference)
    }, p));
  }
  connectedCallback() {
    this.queryParameters = {
      'volumeId': Number(this.pageReference.attributes.volumeId)
    };
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators5(VolumePage, {
  wire: {
    pageReference: {
      adapter: CurrentPageReference,
      config: function ($cmp) {
        return {};
      }
    },
    navContext: {
      adapter: NavigationContext,
      config: function ($cmp) {
        return {};
      }
    },
    provisionVolume: {
      adapter: graphQL,
      dynamic: ["variables"],
      method: 1,
      config: function ($cmp) {
        return {
          query: VOLUME_DETAILS_QUERY,
          variables: $cmp.queryParameters
        };
      }
    }
  },
  fields: ["volume", "crumbs", "queryParameters"]
});
export default _registerComponent(VolumePage, {
  tmpl: _tmpl
});