import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./singleFeatureEditor.html";
class SingleFeatureEditor extends LightningElement {
  constructor(...args) {
    super(...args);
    this._feature = void 0;
    this.hasTranslation = false;
  }
  set feature(f) {
    this._feature = f.clone();
  }
  get feature() {
    return this._feature;
  }
  get isEdited() {
    return this._feature === 'Edited';
  }
  get showDetails() {
    return !(this.hasTranslation && this._feature.sameAsTranslation);
  }
  get isValid() {
    return this.feature.isValid;
  }
  get isVisible() {
    return this.feature.uiExpanded;
  }
  get buttonTitle() {
    return this.feature.uiExpanded ? 'Done' : 'Edit';
  }
  postUpdate(prop, value) {
    this._feature[prop] = value;
    this.dispatchEvent(new CustomEvent('update'));
  }
  handleChange(event) {
    event.stopPropagation();
    this.postUpdate(event.currentTarget.dataset.name, event.currentTarget.value);
  }
  handleChangeValueInvert(event) {
    event.stopPropagation();
    this.postUpdate(event.currentTarget.dataset.name, !this._feature[event.currentTarget.dataset.name]);
  }
  handleAddPerson() {
    this.dispatchEvent(new CustomEvent('addperson', {
      detail: {
        callback: p => this.postUpdate('persons', this.feature.persons.concat([p]))
      }
    }));
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(SingleFeatureEditor, {
  publicProps: {
    hasTranslation: {
      config: 0
    },
    feature: {
      config: 3
    }
  },
  track: {
    _feature: 1
  }
});
export default _registerComponent(SingleFeatureEditor, {
  tmpl: _tmpl
});