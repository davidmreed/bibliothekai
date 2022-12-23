import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./featureDisplay.html";
import { getRecord } from 'bib/api';
class FeatureDisplay extends LightningElement {
  constructor(...args) {
    super(...args);
    this._feature = void 0;
    this.textId = void 0;
    this.textTitle = '(No text selected)';
    this.error = void 0;
  }
  set feature(value) {
    this._feature = value;
    this.textId = value.text;
  }
  get feature() {
    return this._feature;
  }
  provisionText({
    data,
    error
  }) {
    if (data) {
      this.textTitle = data.title;
    }
    if (error) {
      this.error = error;
    }
  }
  get featureDescription() {
    let features = ['translation'];
    if (this.feature.hasIntroduction) {
      features.push('introduction');
    }
    if (this.feature.hasNotes) {
      features.push('notes');
    }
    if (this.feature.hasCommentary) {
      features.push('commentary');
    }
    return `Includes ${features.join(', ')}.`;
  }
  remove() {
    this.dispatchEvent(new CustomEvent('remove', {
      detail: this.feature.id
    }));
  }
  edit() {
    this.dispatchEvent(new CustomEvent('edit', {
      detail: this.feature.id
    }));
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(FeatureDisplay, {
  publicProps: {
    feature: {
      config: 3
    }
  },
  wire: {
    provisionText: {
      adapter: getRecord,
      dynamic: ["entityId"],
      method: 1,
      config: function ($cmp) {
        return {
          entityName: 'texts',
          entityId: $cmp.textId
        };
      }
    }
  },
  fields: ["_feature", "textId", "textTitle", "error"]
});
export default _registerComponent(FeatureDisplay, {
  tmpl: _tmpl
});