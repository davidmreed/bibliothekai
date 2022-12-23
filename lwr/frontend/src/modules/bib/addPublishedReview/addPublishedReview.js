import { LightningElement } from 'lwc';
import { createRecord, getRecordApiUrl, getRecordUiUrl } from 'bib/api';

export default class AddPublishedReview extends LightningElement {
    title = '';
    location = '';
    source = '';
    date = '';
    link = '';
    addingPerson = false;
    persons = [];
    volumes;
    error;

    renderedCallback() {
        if (!this.volumes) {
            // If we're being displayed within a volume's path,
            // preselect that volume.
            const regex = /volumes\/([0-9]+)\//;
            const loc = document.location.pathname;
            const volumeIdMatch = loc.match(regex);

            if (volumeIdMatch && volumeIdMatch.length === 2) {
                this.volumes = [Number(volumeIdMatch[1])];
            } else {
                this.volumes = [];
            }
        }
    }

    handleChange(event) {
        this[event.currentTarget.dataset.name] = event.currentTarget.value;
    }

    checkValidity() {
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

        return status;
    }

    async create(event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }

        if (!(this.persons.length && this.volumes.length)) {
            this.error = 'Please add at least one author and volume.';
            return;
        }

        let record = {
            volumes: this.volumes.map((v) => getRecordApiUrl('volumes', v)),
            persons: this.persons.map((p) => getRecordApiUrl('persons', p)),
            published_date: this.date,
            title: this.title,
            location: `${this.source}, ${this.location}`
        };
        try {
            let result = await createRecord('published-reviews', record);
            if (this.link) {
                let link = {
                    content_object: getRecordApiUrl(
                        'published-reviews',
                        result.id
                    ),
                    link: this.link,
                    source: this.source,
                    resource_type: 'Full Text'
                };
                await createRecord('links', link);
            }
            window.location.href = getRecordUiUrl(
                'published-reviews',
                result.id
            );
        } catch (error) {
            this.error = error;
        }
    }

    toggleAddingPerson() {
        this.addingPerson = !this.addingPerson;
    }

    personAdded(event) {
        this.toggleAddingPerson();
        this.persons.push(event.detail);
    }
}
