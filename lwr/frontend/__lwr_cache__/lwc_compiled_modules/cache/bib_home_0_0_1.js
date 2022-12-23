import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./home.html";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { graphQL } from 'bib/api';
import { createRouter } from '@lwrjs/router/routes';
import { NavigationContext, generateUrl, navigate } from 'lwr/navigation';
const GRAPHQL_QUERY_TEXTS = `
query getTexts {
    texts {
        id
        title
        author {
            id
            fullName
        }
    }
}
`;
class Home extends LightningElement {
  constructor(...args) {
    super(...args);
    this.searchTerm = '';
    this.recordData = void 0;
    this.filteredRecordData = [];
    this.navContext = void 0;
    this.router = createRouter();
  }
  updateRecordData({
    data,
    error
  }) {
    if (data) {
      this.recordData = data.data.texts;
      this.updateSearchResults();
    }
  }
  updateSearchResults() {
    if (this.searchTerm) {
      this.filteredRecordData = this.recordData.filter(f => f.title.includes(this.searchTerm));
    } else {
      this.filteredRecordData = this.recordData;
    }
    this.filteredRecordData = this.filteredRecordData.map(f => {
      return _objectSpread(_objectSpread({}, f), {}, {
        url: generateUrl(this.navContext, {
          type: 'textPage',
          attributes: {
            textId: f.id
          }
        })
      });
    });
  }
  handleNavigation(event) {
    event.preventDefault();
    navigate(this.navContext, {
      type: 'textPage',
      attributes: {
        textId: event.currentTarget.dataset.id
      }
    });
  }
  handleSearch(event) {
    this.searchTerm = event.currentTarget.value;
    this.updateSearchResults();
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(Home, {
  wire: {
    navContext: {
      adapter: NavigationContext,
      config: function ($cmp) {
        return {};
      }
    },
    updateRecordData: {
      adapter: graphQL,
      dynamic: [],
      method: 1,
      config: function ($cmp) {
        return {
          query: GRAPHQL_QUERY_TEXTS
        };
      }
    }
  },
  fields: ["searchTerm", "recordData", "filteredRecordData", "router"]
});
export default _registerComponent(Home, {
  tmpl: _tmpl
});