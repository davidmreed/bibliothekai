import { LightningElement } from 'lwc';
import { createRecord, getRecordUiUrl, getRecord } from 'bib/api';

export default class AddUserReview extends LightningElement {
    error;

    volume;
    review;

    content;
    readability_rating;
    closeness_rating;
    recommended;
    title;

    async connectedCallback() {
        if (!this.volume) {
            // Determine if we're creating or updating a review.
            const createRegex = /volumes\/([0-9]+)\/review/;
            const updateRegex = /reviews\/([0-9]+)\/update/;
            const loc = document.location.pathname;
            const volumeIdMatch = loc.match(createRegex);
            const updateMatch = loc.match(updateRegex);

            if (volumeIdMatch) {
                this.volume = Number(volumeIdMatch[1]);
            } else if (updateMatch) {
                this.review = Number(updateMatch[1]);

                try {
                    let record = await getRecord("reviews", this.review);
                    this.recommended = record.recommended;
                    this.title = record.title;
                    this.content = record.content;
                    this.readability_rating = String(record.readability_rating);
                    this.closeness_rating = String(record.closeness_rating);
                    this.volume = record.volume;
                } catch (e) {
                    this.error = e;
                }
            } else {
                this.error = 'Invalid path';
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

    async save(event) {
        // Validate data.
        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }

        try {
            let record = {};
            if (this.title) {
                record.title = this.title;
            }
            if (this.content) {
                record.content = this.content;
            }
            if (this.readability_rating) {
                record.readability_rating = Number(this.readability_rating);
            }
            if (this.closeness_rating) {
                record.closeness_rating = Number(this.closeness_rating);
            }
            if (this.recommended) {
                record.recommended = this.recommended;
            }
            if (!this.review) {
                // Creating a new review.
                await createRecord('reviews', record);
            } else {
                // Updating an existing review.
                await updateRecord("reviews", this.review, record);
            }
            window.location.href = getRecordUiUrl(
                'volumes',
                this.volume
            );
        } catch (error) {
            this.error = error;
        }
    }
}
