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

    detailsExpanded = true;

    get isFormValid() {
        return !!this.title && !!this.published_date && !!this.publisher;
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

    async create() {
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
            console.log(`error: ${JSON.stringify(error)}`);
        }
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

    toggleDetails() {
        this.detailsExpanded = !this.detailsExpanded;
    }
}
