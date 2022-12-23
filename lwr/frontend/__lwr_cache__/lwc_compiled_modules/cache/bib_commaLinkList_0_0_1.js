import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./commaLinkList.html";
class CommaLinkList extends LightningElement {
  constructor(...args) {
    super(...args);
    this.values = void 0;
  }
  get useComma() {
    return this.values.length > 2;
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(CommaLinkList, {
  publicProps: {
    values: {
      config: 0
    }
  }
});
export default _registerComponent(CommaLinkList, {
  tmpl: _tmpl
});