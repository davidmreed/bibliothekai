import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./popUpMenu.html";
import { getRecords } from 'bib/api';
import { sortRecordsByName } from 'bib/utils';
class PopUpMenu extends LightningElement {
  constructor(...args) {
    super(...args);
    this.entities = [];
    this.entityName = void 0;
    this.allowAdd = void 0;
    this.labelText = void 0;
    this.error = void 0;
    this._value = void 0;
  }
  setEntities({
    data,
    error
  }) {
    if (data) {
      this.entities = data;
      this.entities.sort(sortRecordsByName);
    } else {
      this.setErrorStatus(error);
    }
    // Handle race condition between setting value and loading entities.
    this.selectElement.value = this.value;
    this.template.querySelector('.spinner-grow').classList.add('d-none');
  }
  set value(v) {
    this._value = v;
  }
  get value() {
    return this._value;
  }
  get selectedId() {
    return Array.from(this.selectElement.selectedOptions).map(f => f.value === '' ? '' : Number(f.value))[0];
  }
  renderedCallback() {
    // Handle race condition between setting value and loading entities.
    this.selectElement.value = this.value;
  }
  get shouldAllowAdd() {
    if (typeof this.allowAdd === 'boolean') {
      return this.allowAdd;
    }
    return this.allowAdd === 'true' ? true : false;
  }
  add() {
    this.dispatchEvent(new CustomEvent('add'));
  }
  handleChange() {
    this._value = this.selectedId;
    this.dispatchEvent(new CustomEvent('change'));
  }
  setErrorStatus(message) {
    this.error = message;
    this.selectElement.classList.add('is-invalid');
  }
  get selectElement() {
    return this.template.querySelector('.entities');
  }
  get entityCount() {
    return this.entities.length;
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(PopUpMenu, {
  publicProps: {
    entityName: {
      config: 0
    },
    allowAdd: {
      config: 0
    },
    labelText: {
      config: 0
    },
    value: {
      config: 3
    }
  },
  wire: {
    setEntities: {
      adapter: getRecords,
      dynamic: ["entityName"],
      method: 1,
      config: function ($cmp) {
        return {
          entityName: $cmp.entityName
        };
      }
    }
  },
  fields: ["entities", "error", "_value"]
});
export default _registerComponent(PopUpMenu, {
  tmpl: _tmpl
});