import { LightningElement } from 'lwc';
import { createRecord, getRecordApiUrl, getRecordUiUrl } from 'bib/drf';

export default class AddPublishedReview extends LightningElement {
    title = '';
    location = '';
    source = '';
    published_date = '';
    link = '';
    addingPerson = false;

    renderedCallback() {
        // If we're being displayed within a volume's path,
        // preselect that volume.
        const regex = /volumes\/([0-9]+)\//;
        const loc = document.location.pathname;
        const volumeIdMatch = loc.match(regex);

        if (volumeIdMatch && volumeIdMatch.length === 2) {
            this.volumesListbox.preselectIds([Number(volumeIdMatch[1])]);
        }
    }

    get isFormValid() {
        return !!this.location && !!this.published_date && !!this.source && !!this.location;
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
        } else if (field === 'source') {
            this.source = event.target.value;
        }
        if (this.isFormValid) {
            this.markTabValid("review");
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
            volumes: volumes.map(v => getRecordApiUrl("volumes", v)),
            persons: persons.map(p => getRecordApiUrl("persons", p)),
            published_date: this.published_date,
            title: this.title,
            location: `${this.source}, ${this.location}`
        };
        createRecord('published-reviews', record)
            .then(result => {
                if (this.link) {
                    let link = {
                        content_object: getRecordApiUrl("published-reviews", result.id),
                        link: this.link,
                        source: this.source,
                        resource_type: "Full Text"
                    };
                    createRecord("links", link);
                }
                window.location.href = getRecordUiUrl("published-reviews", result.id);
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
        this.personsListbox.preselectIds([event.detail]);
    }
}
