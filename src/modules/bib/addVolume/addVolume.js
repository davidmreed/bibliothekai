import { LightningElement } from 'lwc';
import { createRecord, getRecordUiUrl } from 'bib/drf';

export default class AddVolume extends LightningElement {
    title = '';
    published_date = '';
    publisher = '';
    series = '';
    isbn = '';
    oclc_number = '';
    description = '';
    addingPerson = false;
    features = [0];

    get isFormValid() {
        return !!this.title && !!this.published_date && !!this.publisher;
    }

    handlePublisherChange(event) {
        this.publisher = event.detail;
        if (this.isFormValid) {
            this.markTabValid("data");
        }
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

    get currentTab() {
        for (let elem of this.template.querySelectorAll('.nav-link')) {
            if (elem.classList.contains('active')) {
                return elem.dataset.tab;
            }
        }

        return null;
    }

    getTabValidityElement(tab) {
        return this.template.querySelector(`.validity-${tab}`);
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

    selectTab(tab) {
        // Select the correct tab.
        for (let elem of this.template.querySelectorAll('.nav-link')) {
            if (elem.dataset.tab === tab) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        }

        // Show the corresponding tab pane.
        for (let elem of this.template.querySelectorAll('.tab-pane')) {
            if (elem.dataset.tab === tab) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        }
    }

    changeTab(event) {
        let tabName = event.target.dataset.tab;
        let activeTab = this.currentTab;

        if (activeTab === tabName) return;

        if (
            (activeTab === 'persons' && this.selectedPersons.length === 0) ||
            (activeTab === 'data' && !this.isFormValid)
        ) {
            this.markTabInvalid(activeTab);
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.markTabValid(activeTab);
        this.selectTab(tabName);
    }

    addFeature() {
        this.features = this.features + [this.features.length + 1];
    }

    get personsListbox() {
        return this.template.querySelector('.persons-listbox');
    }

    get selectedPersons() {
        if (this.personsListbox) {
            return this.personsListbox.getSelectedRecords();
        }

        return [];
    }

    get publisherPopup() {
        return this.template.querySelector(".publisher-popup");
    }

    get selectedPublisher() {
        return this.publisherPopup.getSelectedId();
    }

    create(event) {
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
            publisher: this.publisher
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

        createRecord('volumes', record)
            .then(result => {
                let featureEditors = this.template.querySelectorAll(".feature-editor");
                Promise.all(
                    featureEditors.map(f => f.getFeatures())
                        .reduce((acc, val) => acc.concat(val), [])
                        .map(f => createRecord("features", f))
                ).then(() => {
                    window.location.href = getRecordUiUrl("volumes", result.id);
                })
            })
            .catch(error => {
                this.markTabInvalid("review", error);
            });
    }

    addPerson() {
        this.addingPerson = true;
        this.template.querySelector('.main-block').classList.add('d-none');
    }

    stopAddingPerson() {
        this.addingPerson = false;
        this.template.querySelector('.main-block').classList.remove('d-none');
    }

    personAdded(event) {
        this.addingPerson = false;
        this.template.querySelector('.main-block').classList.remove('d-none');
        this.personsListbox.preselectIds([event.detail.id]);
    }
}
