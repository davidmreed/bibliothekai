import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./textPage.html";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { CurrentPageReference, NavigationContext, generateUrl } from 'lwr/navigation';
import { graphQL } from 'bib/api';
const TEXT_DETAILS_QUERY = `
query getTextDetails($textId: Int) {
    text(id: $textId) {
        id
        title
        author {
            id
            fullName
        }
        language {
            name
        }
        format
        date
        description
    }
}
`;
// TODO: alternate names + links

class TextPage extends LightningElement {
  constructor(...args) {
    super(...args);
    this.pageReference = void 0;
    this.navContext = void 0;
    this.text = void 0;
    this.queryParameters = void 0;
    this.crumbs = [];
  }
  provisionText({
    data,
    error
  }) {
    if (data) {
      this.text = data.data.text;
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
        type: 'authorPage',
        attributes: {
          authorId: this.text.author.id
        }
      },
      title: this.text.author.fullName
    }, {
      pageReference: {
        type: 'textPage',
        attributes: {
          textId: String(this.text.id)
        }
      },
      title: this.text.title,
      currentPage: true
    }].map(p => _objectSpread({
      url: generateUrl(this.navContext, p.pageReference)
    }, p));
  }
  connectedCallback() {
    this.queryParameters = {
      'textId': Number(this.pageReference.attributes.textId)
    };
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(TextPage, {
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
    provisionText: {
      adapter: graphQL,
      dynamic: ["variables"],
      method: 1,
      config: function ($cmp) {
        return {
          query: TEXT_DETAILS_QUERY,
          variables: $cmp.queryParameters
        };
      }
    }
  },
  fields: ["text", "queryParameters", "crumbs"]
});
export default _registerComponent(TextPage, {
  tmpl: _tmpl
});