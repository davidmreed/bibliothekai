import { LightningElement, track } from 'lwc';
import {
    createRecord,
    getRecordUiUrl,
    getRecordApiUrl,
    getRecordsFromApi
} from 'bib/drf';
import { Features } from 'bib/feature';
import { setNestedProperty } from 'bib/utils';

export default class AddVolume extends LightningElement {
    // Data fields
    title = '';
    published_date = '';
    publisher = '';
    series = '';
    isbn = '';
    oclc_number = '';
    description = '';
    primaryLanguage = '';
    link = '';
    feature_glossary = false;
    feature_index = false;
    feature_bibliography = false;
    feature_maps = false;

    // UI state
    addingPerson = false;
    addingPublisher = false;
    addingSeries = false;
    editingFeature = false;
    detailsExpanded = true;

    // Feature storage
    @track
    features = [];
    @track
    generalFeatures = new Features(-1);
    @track
    featureToEdit;

    error;

    // Getters
    // -------

    get showingModal() {
        return (
            this.addingPerson ||
            this.addingPublisher ||
            this.addingSeries ||
            this.editingFeature
        );
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
        this.primaryLanguage = event.detail;
        this.generalFeatures.language = event.detail;
    }

    handleFeatureChange(event) {
        let feature = event.target.features;

        this.features.splice(
            this.features.findIndex((f) => f.id === feature.id),
            1,
            feature
        );
        this.features = [...this.features];
    }

    handleSingleFeatureChange(event) {
        this.generalFeatures.replaceFeature(event.target.feature);
    }

    handleFeatureRemove(event) {
        this.features.splice(
            this.features.findIndex((f) => f.id === event.detail),
            1
        );
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    handleChangeDetail(event) {
        this[event.target.dataset.name] = `${event.detail}`; // FIXME: this is wrong except for integer relationship fields.
    }

    handleChangeBoolean(event) {
        this[event.target.name] = event.target.value === 'true';
    }

    handleFeatureSwitchChange(event) {
        let desiredFeature = event.target.name;
        let newFeatures = this.generalFeatures.clone();

        if (this.generalFeatures.hasFeature(desiredFeature)) {
            newFeatures.removeFeature(desiredFeature);
        } else {
            newFeatures.addFeature(event.target.name, true);
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
            publisher: getRecordApiUrl('publishers', this.publisher)
        };
        for (let prop of ['isbn', 'oclc_number', 'description', 'series']) {
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

            await Promise.all(
                this.features
                    .concat([this.generalFeatures])
                    .map((f) => f.getFeatures(result.id))
                    .reduce((acc, val) => acc.concat(val), [])
                    .map((f) => createRecord('features', f))
            );
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
        newFeature.addFeature("Translation");

        this.features.push(newFeature);
        this.featureToEdit = newFeature;
        this.editingFeature = true;
    }

    handleFeatureEdit(event) {
        this.featureToEdit = this.features.filter(
            (f) => f.id === event.detail
        )[0];
        this.toggleEditingFeature();
    }

    toggleEditingFeature() {
        this.editingFeature = !this.editingFeature;
        this.error = '';
    }

    toggleAddingPerson() {
        this.addingPerson = !this.addingPerson;
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

        if (this.validateDetails()) {
            this.detailsExpanded = !this.detailsExpanded;
        }
    }

    // Validation
    // ----------

    validateDetails() {
        if (this.detailsExpanded) {
            let form = this.template.querySelector('form');
            let status = form.checkValidity();

            if (!status) {
                this.template.querySelectorAll(':invalid').forEach((elem) => {
                    elem.classList.add('is-invalid');
                    elem.addEventListener('change', () =>
                        elem.classList.remove('is-invalid')
                    );
                });
            }

            if (!this.publisher) {
                let publisherPopup = this.template.querySelector(
                    '.publisher-popup'
                );
                status = false;
                publisherPopup.classList.add('is-invalid');
                publisherPopup.addEventListener('change', () =>
                    publisherPopup.classList.remove('is-invalid')
                );
            }

            return status;
        }

        return true;
    }

    checkValidity() {
        let totalValid =
            this.validateDetails() &&
            this.generalFeatures.isValid &&
            this.features.isValid;

        if (!totalValid) {
            this.error =
                'One or more elements of the volume contain errors. Please edit the volume and try again.';
            return false;
        }

        if (!this.features.length) {
            this.error =
                'Add one or more translations to this volume and try again.';
            return false;
        }

        return true;
    }
}
