import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./switch.html";
class Switch extends LightningElement {
  constructor(...args) {
    super(...args);
    this._value = false;
    this.label = void 0;
  }
  set value(v) {
    this._value = v;
    let cb = this.template.querySelector('.custom-control-input');
    if (cb) {
      cb.checked = this._value;
    }
  }
  get value() {
    return this._value;
  }
  renderedCallback() {
    let cb = this.template.querySelector('.custom-control-input');
    cb.checked = this._value;
  }
  handleClick(event) {
    event.stopPropagation();
    this._value = event.currentTarget.checked;
    this.dispatchEvent(new CustomEvent('change'));
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(Switch, {
  publicProps: {
    label: {
      config: 0
    },
    value: {
      config: 3
    }
  },
  fields: ["_value"]
});
export default _registerComponent(Switch, {
  tmpl: _tmpl
});