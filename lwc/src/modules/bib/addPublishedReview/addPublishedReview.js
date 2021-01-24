import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddPublishedReview extends LightningElement {
    title = '';
    location = '';
    published_date = '';
    link = '';
    addingPerson = false;

    get isFormValid() {
        return !!this.title && !!this.location && !!this.published_date;
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'title') {
            this.title = event.target.value;
        } else if (field === 'location') {
            this.location = event.target.value;
        } else if (field === 'date') {
            this.published_date = event.target.value;
        } else if (field === 'link') {
            this.link = event.target.value;
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

    markTabInvalid(tab) {
        let validityElem = this.getTabValidityElement(tab);
        validityElem.classList.add('is-invalid');
        validityElem.classList.add('form-control');
        validityElem.classList.add('mb-2');
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
            (activeTab === 'volumes' &&
                this.selectedVolumes.length === 0 &&
                tabName !== 'persons')
        ) {
            this.markTabInvalid(activeTab);
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.markTabValid(activeTab);
        this.selectTab(tabName);
    }

    get personsListbox() {
        return this.template.querySelector('.persons-listbox');
    }

    get volumesListbox() {
        return this.template.querySelector('.volumes-listbox');
    }

    get selectedPersons() {
        return this.personsListbox.getSelectedIds();
    }

    get selectedVolumes() {
        return this.volumesListbox.getSelectedIds();
    }

    create(event) {
        // Validate data.
        // We must have at least one Volume and at least one Author.
        let persons = this.selectedPersons;
        let volumes = this.selectedVolumes;

        if (!this.isFormValid) {
            this.markTabInvalid('review');
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.markTabValid('review');

        let record = {
            volumes: volumes,
            persons: persons,
            published_date: this.published_date,
            title: this.title,
            location: this.location
        };
        /*if (this.link) {
            record.links = [
                {
                    link: this.link,
                    resource_type: "Full Text"
                }
            ]
        }*/
        createRecord('published-reviews', record);
    }

    addPerson() {
        this.addingPerson = true;
        this.template.querySelector('.main-block').classList.add('d-none');
    }

    stopAddingPerson() {
        this.addingPerson = false;
        this.template.querySelector('.main-block').classList.remove('d-none');
    }

    personAdded() {
        this.addingPerson = false;
        this.template.querySelector('.main-block').classList.remove('d-none');
        // TODO: We can't auto-select the new entity in the dualing listbox
        // because its wire refresh hasn't happened yet.
    }
}
