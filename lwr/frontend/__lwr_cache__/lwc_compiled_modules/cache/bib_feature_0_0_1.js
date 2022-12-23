import { registerDecorators as _registerDecorators3, registerDecorators as _registerDecorators2, registerDecorators as _registerDecorators } from "lwc";
import { getRecordApiUrl } from 'bib/api';
export class Feature {
  constructor(ft, uiExpanded) {
    this.persons = [];
    this.language = '';
    this.description = '';
    this.feature = '';
    this.sameAsTranslation = false;
    this.uiExpanded = void 0;
    this.feature = ft;
    this.uiExpanded = uiExpanded;
  }
  get isValid() {
    if (this.feature === 'Edited') {
      return !!this.persons.length;
    }
    return !!this.persons.length && !!this.language || this.sameAsTranslation;
  }
  get isTranslation() {
    return this.feature === 'Translation';
  }
  clone() {
    let newFeature = Object.assign(new Feature(), this);
    newFeature.persons = [...this.persons];
    return newFeature;
  }
  json(translation) {
    let persons;
    let language;
    if (!!translation && this.sameAsTranslation) {
      persons = translation.persons;
      language = translation.language;
    } else {
      persons = this.persons;
      language = this.language;
    }
    let js = {
      persons: persons.map(a => getRecordApiUrl('persons', a)),
      language: getRecordApiUrl('languages', language),
      feature: this.feature
    };
    if (this.description) {
      js.description = this.description;
    }
    return js;
  }
}
_registerDecorators(Feature, {
  fields: ["persons", "language", "description", "feature", "sameAsTranslation", "uiExpanded"]
});
export class TranslationFeature extends Feature {
  constructor(uiExpanded) {
    super('Translation', uiExpanded);
    this.partial = false;
    this.format = 'Prose';
    this.samplePassage = '';
    this.title = '';
    this.hasFacingText = false;
    this.originalPublicationDate = null;
  }
  clone() {
    let newFeature = Object.assign(new TranslationFeature(this.uiExpanded), this);
    newFeature.persons = [...this.persons];
    return newFeature;
  }
  json() {
    let js = super.json();
    js.partial = this.partial;
    js.format = this.format;
    js.has_facing_text = this.hasFacingText;
    js.original_publication_date = this.originalPublicationDate;
    if (this.samplePassage) {
      js.sample_passage = this.samplePassage;
    }
    if (this.title) {
      js.title = this.title;
    }
    return js;
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators2(TranslationFeature, {
  fields: ["partial", "format", "samplePassage", "title", "hasFacingText", "originalPublicationDate"]
});
export class Features {
  constructor(id) {
    this.id = void 0;
    this.features = [];
    this.defaultLanguage = '';
    this.text = '';
    this.id = id;
  }
  get hasIntroduction() {
    return this.hasFeature('Introduction');
  }
  get introduction() {
    return this.getFeature('Introduction');
  }
  get hasNotes() {
    return this.hasFeature('Notes');
  }
  get notes() {
    return this.getFeature('Notes');
  }
  get hasEdited() {
    return this.hasFeature('Edited');
  }
  get edited() {
    return this.getFeature('Edited');
  }
  get hasCommentary() {
    return this.hasFeature('Commentary');
  }
  get commentary() {
    return this.getFeature('Commentary');
  }
  get hasTranslation() {
    return this.hasFeature('Translation');
  }
  get translation() {
    return this.getFeature('Translation');
  }
  get isValid() {
    return this.features.reduce((prev, cur) => prev && cur.isValid, true);
  }
  hasFeature(ft) {
    return this.features.filter(f => f.feature === ft).length > 0;
  }
  getFeature(ft) {
    let candidates = this.features.filter(f => f.feature === ft);
    if (candidates.length) {
      return candidates[0];
    }
    return undefined;
  }
  addFeature(ft, uiExpanded) {
    let newFeature = ft === 'Translation' ? new TranslationFeature(uiExpanded) : new Feature(ft, uiExpanded);
    if (this.defaultLanguage) {
      newFeature.language = this.defaultLanguage;
    }
    this.features.push(newFeature);
  }
  removeFeature(ft) {
    this.features = this.features.filter(f => f.feature !== ft);
  }
  replaceFeature(ft) {
    this.features.splice(this.features.findIndex(f => f.feature === ft.feature), 1, ft);
  }
  clone() {
    let newFeature = Object.assign(new Features(this.id), this);
    newFeature.features = this.features.map(f => f.clone());
    return newFeature;
  }
  getFeatures(volumeId) {
    let features = this.features.map(f => f.json(this.translation));
    let volumeUrl = getRecordApiUrl('volumes', volumeId);
    let textUrl;
    if (this.text) {
      textUrl = getRecordApiUrl('texts', this.text);
    }
    features.forEach(f => {
      f.volume = volumeUrl;
      if (this.text) {
        f.text = textUrl;
      }
    });
    return features;
  }
}
_registerDecorators3(Features, {
  fields: ["id", "features", "defaultLanguage", "text"]
});