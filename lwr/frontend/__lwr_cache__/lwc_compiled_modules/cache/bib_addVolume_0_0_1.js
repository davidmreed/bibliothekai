import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./addVolume.html";
import { createRecord, getRecordUiUrl, getRecordApiUrl, getRecordsFromApi } from 'bib/api';
import { Features } from 'bib/feature';
class AddVolume extends LightningElement {
  constructor(...args) {
    super(...args);
    this.title = '';
    this.published_date = '';
    this.publisher = '';
    this.series = '';
    this.isbn = '';
    this.oclc_number = '';
    this.description = '';
    this.primaryLanguage = '';
    this.link = '';
    this.feature_glossary = false;
    this.feature_index = false;
    this.feature_bibliography = false;
    this.feature_maps = false;
    this.hasTranslation = false;
    this.addingPerson = false;
    this.addingPublisher = false;
    this.addingSeries = false;
    this.editingFeature = false;
    this.detailsExpanded = true;
    this.features = [];
    this.generalFeatures = new Features(-1);
    this.featureToEdit = void 0;
    this.error = void 0;
  }
  // Getters
  // -------

  get showingModal() {
    return this.addingPerson || this.addingPublisher || this.addingSeries || this.editingFeature;
  }
  get showingTranslationModal() {
    return this.editingFeature && !this.addingPerson;
  }

  // Lifecycle Handlers
  // ------------------

  async connectedCallback() {
    // Start async loads of data from DRF to improve responsiveness.
    await getRecordsFromApi('persons');
    await getRecordsFromApi('texts');
  }

  // Change Handlers
  // ---------------

  handlePrimaryLanguageChange(event) {
    this.primaryLanguage = event.currentTarget.value;
    this.generalFeatures.defaultLanguage = event.currentTarget.value;
  }
  handleFeatureChange(event) {
    let feature = event.currentTarget.features;
    this.features.splice(this.features.findIndex(f => f.id === feature.id), 1, feature);
    this.features = [...this.features];
    this.featureToEdit = this.features.filter(f => f.id === feature.id)[0];
  }
  handleSingleFeatureChange(event) {
    let newFeatures = this.generalFeatures.clone();
    newFeatures.replaceFeature(event.currentTarget.feature);
    this.generalFeatures = newFeatures;
  }
  handleFeatureRemove(event) {
    this.features.splice(this.features.findIndex(f => f.id === event.detail), 1);
  }
  handleChange(event) {
    // FIXME: Events are not being correctly retargeted outside the shadow DOM.
    this[event.currentTarget.dataset.name] = event.currentTarget.value;
  }
  handleFeatureSwitchChange(event) {
    let desiredFeature = event.currentTarget.dataset.feature;
    let newFeatures = this.generalFeatures.clone();
    if (this.generalFeatures.hasFeature(desiredFeature)) {
      newFeatures.removeFeature(desiredFeature);
    } else {
      newFeatures.addFeature(desiredFeature, true);
    }
    this.generalFeatures = newFeatures;
  }

  // Actions
  // -------

  async create(event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      return;
    }
    event.target.disabled = 'disabled';
    this.template.querySelector('.status').classList.remove('d-none');
    let record = {
      title: this.title,
      published_date: this.published_date,
      publisher: getRecordApiUrl('publishers', this.publisher),
      feature_bibliography: this.feature_bibliography,
      feature_index: this.feature_index,
      feature_maps: this.feature_maps,
      feature_glossary: this.feature_glossary
    };
    if (this.series) {
      record.series = getRecordApiUrl('series', this.series);
    }
    for (let prop of ['isbn', 'oclc_number', 'description']) {
      if (this[prop]) {
        record[prop] = this[prop];
      }
    }
    try {
      let result = await createRecord('volumes', record);
      if (this.link) {
        let link = {
          content_object: getRecordApiUrl('volumes', result.id),
          link: this.link,
          source: 'Publisher',
          resource_type: 'Website'
        };
        await createRecord('links', link);
      }
      await Promise.all(this.features.concat([this.generalFeatures]).map(f => f.getFeatures(result.id)).reduce((acc, val) => acc.concat(val), []).map(f => createRecord('features', f)));
      window.location.href = getRecordUiUrl('volumes', result.id);
    } catch (error) {
      this.error = error;
      this.template.querySelector('.status').classList.add('d-none');
    }
  }

  // Section Visibility
  // ------------------

  addTranslation() {
    let newFeature = new Features(this.features.length + 1);
    if (this.primaryLanguage) {
      newFeature.defaultLanguage = this.primaryLanguage;
    }
    newFeature.addFeature('Translation', true);
    this.features.push(newFeature);
    this.featureToEdit = newFeature;
    this.editingFeature = true;
  }
  handleFeatureEdit(event) {
    this.featureToEdit = this.features.filter(f => f.id === event.detail)[0];
    this.toggleEditingFeature();
  }
  toggleEditingFeature() {
    this.editingFeature = !this.editingFeature;
    this.error = '';
  }
  toggleAddingPerson() {
    this.addingPerson = !this.addingPerson;
  }
  doAddPerson(event) {
    this.addingPerson = true;
    this.addPersonContext = event.detail.callback;
  }
  savePerson(event) {
    this.addingPerson = false;
    this.addPersonContext(event.detail);
    this.addPersonContext = null;
  }
  toggleAddingPublisher() {
    this.addingPublisher = !this.addingPublisher;
  }
  toggleAddingSeries() {
    this.addingSeries = !this.addingSeries;
  }
  publisherAdded(event) {
    this.publisher = event.detail;
    this.toggleAddingPublisher();
  }
  seriesAdded(event) {
    this.series = event.detail;
    this.toggleAddingSeries();
  }
  toggleDetails(event) {
    event.preventDefault();
    if (this.detailsValid) {
      this.detailsExpanded = !this.detailsExpanded;
    }
  }

  // Validation
  // ----------

  get detailsValid() {
    if (this.detailsExpanded) {
      let form = this.template.querySelector('form');
      let status = form.checkValidity();
      if (!status) {
        this.template.querySelectorAll(':invalid').forEach(elem => {
          elem.classList.add('is-invalid');
          elem.addEventListener('change', () => elem.classList.remove('is-invalid'));
        });
      }
      if (!this.publisher) {
        let publisherPopup = this.template.querySelector('.publisher-popup');
        status = false;
        publisherPopup.classList.add('is-invalid');
        publisherPopup.addEventListener('change', () => publisherPopup.classList.remove('is-invalid'));
      }
      return status;
    }
    return true;
  }
  checkValidity() {
    let totalValid = this.detailsValid && this.generalFeatures.isValid && this.features.map(f => f.isValid && !!f.text).reduce((prev, cur) => prev && cur, true);
    if (!totalValid) {
      this.error = 'One or more elements of the volume contain errors. Please edit the volume and try again.';
      return false;
    }
    if (!this.features.length) {
      this.error = 'Add one or more translations to this volume and try again.';
      return false;
    }
    return true;
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(AddVolume, {
  track: {
    features: 1,
    generalFeatures: 1,
    featureToEdit: 1
  },
  fields: ["title", "published_date", "publisher", "series", "isbn", "oclc_number", "description", "primaryLanguage", "link", "feature_glossary", "feature_index", "feature_bibliography", "feature_maps", "hasTranslation", "addingPerson", "addingPublisher", "addingSeries", "editingFeature", "detailsExpanded", "error"]
});
export default _registerComponent(AddVolume, {
  tmpl: _tmpl
});