import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./dualingListbox.html";
import { getRecords } from 'bib/api';
import { sortRecordsByName } from 'bib/utils';
class DualingListbox extends LightningElement {
  constructor(...args) {
    super(...args);
    this.entities = void 0;
    this._value = void 0;
    this.entityName = void 0;
    this.allowAdd = void 0;
    this.availableEntities = [];
    this.selectedEntities = [];
    this.filteredEntities = [];
    this.searchKey = null;
  }
  setEntities({
    data,
    error
  }) {
    if (data) {
      this.entities = data;
      this.update();
    } else {
      this.setErrorStatus(error);
    }
    this.template.querySelector('.spinner-grow').classList.add('d-none');
  }
  get shouldAllowAdd() {
    if (typeof this.allowAdd === 'boolean') {
      return this.allowAdd;
    }
    return this.allowAdd === 'true' ? true : false;
  }
  getSelectedRecords() {
    return this.selectedEntities;
  }
  get value() {
    return this._value || [];
  }
  set value(val) {
    this._value = val || [];
    if (this.entities) {
      this.update();
    }
  }
  handleSearch(event) {
    this.searchKey = event.target.value;
    this.update();
  }
  handleChange(event) {
    // We don't want change events from our select boxes to propagate
    event.stopPropagation();
  }
  update() {
    this.availableEntities = this.entities.filter(f => !this.value.includes(f.id));
    this.selectedEntities = this.entities.filter(f => this.value.includes(f.id));
    if (this.searchKey) {
      let splitSearchKey = this.searchKey.toLowerCase().split(/\W+/);
      this.filteredEntities = this.availableEntities.filter(f => splitSearchKey.map(s => f.name.toLowerCase().includes(s)).reduce((prev, cur) => prev && cur, true));
    } else {
      this.filteredEntities = this.availableEntities;
    }
    this.filteredEntities.sort(sortRecordsByName);
    this.selectedEntities.sort(sortRecordsByName);
  }
  moveRight() {
    this._value = this._value.concat(Array.from(this.template.querySelector('.entities').selectedOptions).map(f => Number(f.value)));
    this.update();
    this.dispatchEvent(new CustomEvent('change'));
  }
  moveLeft() {
    let itemsUnselect = Array.from(this.template.querySelector('.selectedEntities').selectedOptions).map(f => Number(f.value));
    this._value = this.value.filter(f => !itemsUnselect.includes(f));
    this.update();
    this.dispatchEvent(new CustomEvent('change'));
  }
  add() {
    this.dispatchEvent(new CustomEvent('add'));
  }
  getValidityElement() {
    return this.template.querySelector('.validity');
  }
  setErrorStatus(message) {
    let validityElem = this.getValidityElement();
    validityElem.innerText = message;
    validityElem.classList.remove('d-none');
  }
  get selectedCount() {
    return this.selectedEntities.length;
  }
  get entityCount() {
    return this.availableEntities.length;
  }
  get filteredEntityCount() {
    return this.filteredEntities.length;
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(DualingListbox, {
  publicProps: {
    entityName: {
      config: 0
    },
    allowAdd: {
      config: 0
    },
    value: {
      config: 3
    }
  },
  publicMethods: ["getSelectedRecords"],
  track: {
    availableEntities: 1,
    selectedEntities: 1,
    filteredEntities: 1,
    searchKey: 1
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
  fields: ["entities", "_value"]
});
export default _registerComponent(DualingListbox, {
  tmpl: _tmpl
});