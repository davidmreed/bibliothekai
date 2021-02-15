import { LightningElement, track } from 'lwc';
import { createRecord, getRecordUiUrl, getRecordApiUrl } from 'bib/drf';
import { Feature } from 'bib/feature';

export default class AddVolume extends LightningElement {
    title = '';
    published_date = '';
    publisher = '';
    series = '';
    isbn = '';
    oclc_number = '';
    description = '';
    primaryLanguage = '';
    addingPerson = false;
    addingPublisher = false;
    editingFeature = false;
    @track features = [];
    @track generalFeatures = [];
    featureToEdit;

    detailsExpanded = true;

    get isFormValid() {
        return !!this.title && !!this.published_date && !!this.publisher;
    }

    handlePublisherChange(event) {
        this.publisher = event.detail;
        if (this.isFormValid) {
            this.markTabValid("data");
        }
    }

    handleFeatureChange(event) {
        let newFeature = event.detail;
        this.features[newFeature.id - 1] = newFeature;
        if (this.editingFeature) {
            this.featureToEdit = newFeature;
        }
    }

    handleFeatureRemove(event) {
        this.features.splice(this.features.findIndex(f => f.id === event.detail));
    }

    handleChange(event) {
        const field = event.target.name;

        if (field === 'title') {
            this.title = event.target.value;
        } else if (field === 'date') {
            this.published_date = event.target.value;
        } else if (field === 'isbn') {
            this.isbn = event.target.value;
        } else if (field === 'oclc') {
            this.oclc_number = event.target.value;
        } else if (field === 'description') {
            this.description = event.target.value;
        }
        if (this.isFormValid) {
            this.markTabValid("data");
        }
    }

    markTabInvalid(tab, message) {
        let validityElem = this.getTabValidityElement(tab);
        validityElem.classList.add('is-invalid');
        validityElem.classList.add('form-control');
        validityElem.classList.add('mb-2');
        if (message) {
            validityElem.innerText = message;
        }
    }

    markTabValid(tab) {
        let validityElem = this.getTabValidityElement(tab);
        if (validityElem.classList.contains('is-invalid')) {
            validityElem.classList.remove('is-invalid');
            validityElem.classList.remove('form-control');
            validityElem.classList.remove('mb-2');
        }
    }

    get publisherPopup() {
        return this.template.querySelector(".publisher-popup");
    }

    get selectedPublisher() {
        return this.publisherPopup.getSelectedId();
    }

    async create(event) {
        if (!this.features.length) {
            this.markTabInvalid('features');
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.markTabValid('features');

        let record = {
            title: this.title,
            published_date: this.published_date,
            publisher: getRecordApiUrl("publishers", this.publisher)
        };
        if (this.isbn) {
            record.isbn = this.isbn;
        }
        if (this.oclc_number) {
            record.oclc_number = this.oclc_number;
        }
        if (this.description) {
            record.description = this.description;
        }
        if (this.series) {
            record.series = this.series;
        }

        try {
            let result = await createRecord('volumes', record);

            await Promise.all(
                this.features.map(f => f.getFeatures(result.id))
                    .reduce((acc, val) => acc.concat(val), [])
                    .map(f => createRecord("features", f))
            );
            window.location.href = getRecordUiUrl("volumes", result.id);
        } catch (error) {
            this.markTabInvalid("data", error);
        }
    }

    done(event) {
        let section = event.target.name;
        // TODO: complete
        // Collapse this section and expand the next one.
    }

    changePrimaryLanguage(event) {
        this.primaryLanguage = event.detail;
    }

    toggleDetails() {
        this.detailsExpanded = !this.detailsExpanded;
    }

    addGeneralFeature() {
        // TODO
    }

    addFeature() {
        this.hideMainSection();

        let newFeature = new Feature(this.features.length + 1);
        if (this.primaryLanguage) {
            newFeature.language = newFeature.introLanguage = newFeature.notesLanguage = this.primaryLanguage;
        }
        this.features.push(newFeature);
        this.featureToEdit = newFeature;
        this.editingFeature = true;
    }

    handleFeatureEdit(event) {
        this.hideMainSection();
        this.featureToEdit = this.features.filter(f => f.id === event.detail)[0];
        this.editingFeature = true;
    }

    stopEditingFeature() {
        this.editingFeature = false;
        this.showMainSection();
    }

    hideMainSection() {
        this.template.querySelector('.main-block').classList.add('d-none');
    }

    showMainSection() {
        this.template.querySelector('.main-block').classList.remove('d-none');
    }

    addPerson() {
        this.addingPerson = true;
        this.hideMainSection();
    }

    stopAddingPerson() {
        this.addingPerson = false;
        this.showMainSection();
    }

    personAdded() {
        this.addingPerson = false;
        this.showMainSection();
    }

    addPublisher() {
        this.addingPublisher = true;
        this.hideMainSection();
    }

    stopAddingPublisher() {
        this.addingPublisher = false;
        this.showMainSection();
    }

    publisherAdded(event) {
        this.addingPublisher = false;
        this.showMainSection();
        this.publisher = event.detail;
    }
}
