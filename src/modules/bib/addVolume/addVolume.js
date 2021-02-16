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
    generalFeatures = new Feature(-1);
    featureToEdit;
    error;

    detailsExpanded = true;

    // Getters
    // -------

    get showingModal() {
        return this.addingPerson || this.addingPublisher || this.editingFeature;
    }

    get showingTranslationModal() {
        return this.editingFeature && !this.addingPerson;
    }

    // Change Handlers
    // ---------------

    handlePublisherChange(event) {
        this.publisher = event.detail;
    }

    handlePrimaryLanguageChange(event) {
        this.primaryLanguage = event.detail;
        this.generalFeatures.language = event.detail;
    }

    handleFeatureChange(event) {
        let newFeature = event.detail;
        this.features[newFeature.id - 1] = newFeature;
        if (this.editingFeature) {
            this.featureToEdit = newFeature;
        }
    }

    handleGeneralFeatureChange(event) {
        this.generalFeatures = event.detail;
    }

    handleFeatureRemove(event) {
        this.features.splice(this.features.findIndex(f => f.id === event.detail), 1);
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
    }

    // Actions
    // -------

    async create(event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }

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
                this.features
                    .concat([this.generalFeatures])
                    .map(f => f.getFeatures(result.id))
                    .reduce((acc, val) => acc.concat(val), [])
                    .map(f => createRecord("features", f))
            );
            window.location.href = getRecordUiUrl("volumes", result.id);
        } catch (error) {
            this.error = `The API returned an error: ${error}`;
        }
    }

    // Section Visibility
    // ------------------

    addFeature() {
        let newFeature = new Feature(this.features.length + 1);
        if (this.primaryLanguage) {
            newFeature.language = newFeature.introLanguage = newFeature.notesLanguage = this.primaryLanguage;
        }
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
    }

    toggleAddingPerson() {
        this.addingPerson = !this.addingPerson;
    }

    toggleAddingPublisher() {
        this.addingPublisher = !this.addingPublisher;
    }

    publisherAdded(event) {
        this.publisher = event.detail;
        this.toggleAddingPublisher();
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
            let form = this.template.querySelector("form");
            let status = form.checkValidity();

            if (!status) {
                this.template.querySelectorAll(":invalid").forEach(elem => {
                    elem.classList.add('is-invalid');
                    elem.addEventListener('change', () => elem.classList.remove('is-invalid'));
                });
            }

            if (!this.publisher) {
                let publisherPopup = this.template.querySelector(".publisher-popup");
                status = false;
                publisherPopup.classList.add("is-invalid");
                publisherPopup.addEventListener('change', () => publisherPopup.classList.remove('is-invalid'));
            }

            return status;
        }

        return true;
    }

    checkValidity() {
        let totalValid = this.validateDetails()
            && this.generalFeatures.isNotesValid
            && this.generalFeatures.isIntroValid
            && this.features.map(f => f.isValid).reduce((cur, next) => cur && next, true);

        if (!totalValid) {
            this.error = "One or more elements of the volume contain errors. Please edit the volume and try again.";
            return false;
        }

        if (!this.features.length) {
            this.error = "Add one or more translations to this volume and try again.";
            return false;
        }

        return true;
    }

}
