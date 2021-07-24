import { LightningElement, wire, track } from 'lwc';
import {
    createRecord,
    updateRecord,
    getRecordUiUrl,
    getRecordApiUrl,
    getRecord
} from 'bib/api';
import { setNestedProperty } from '../utils/utils';

export default class AddUserReview extends LightningElement {
    error;

    volumeId;
    reviewId;
    @track review;

    ratingOptions = [
        { name: 'Low', value: 'Low' },
        { name: 'Average', value: 'Average' },
        { name: 'Excellent', value: 'Excellent' }
    ];

    @wire(getRecord, { entityName: 'reviews', entityId: '$reviewId' })
    provisionReview({ data, error }) {
        if (data) {
            this.review = data;
        }
        if (error) {
            this.error = error;
        }
    }

    connectedCallback() {
        if (!this.volume) {
            // Why is this if here?
            // Determine if we're creating or updating a review.
            const createRegex = /volumes\/([0-9]+)\/review\//;
            const updateRegex = /reviews\/([0-9]+)\/update\//;
            const loc = document.location.pathname;
            const volumeIdMatch = loc.match(createRegex);
            const updateMatch = loc.match(updateRegex);

            if (volumeIdMatch) {
                this.volumeId = Number(volumeIdMatch[1]);
                this.review = {
                    title: '',
                    closeness_rating: 'Average',
                    readability_rating: 'Average',
                    recommended: false,
                    content: ''
                };
            } else if (updateMatch) {
                this.reviewId = Number(updateMatch[1]);
            } else {
                this.error = 'Invalid path';
            }
        }
    }

    handleChange(event) {
        setNestedProperty(
            this,
            event.currentTarget.dataset.name,
            event.currentTarget.value
        );
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
        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }

        try {
            let record = {};
            record.volume = getRecordApiUrl('volumes', this.volumeId);
            if (this.review.title) {
                record.title = this.review.title;
            }
            if (this.review.content) {
                record.content = this.review.content;
            }
            if (this.review.readability_rating) {
                record.readability_rating = this.review.readability_rating;
            }
            if (this.review.closeness_rating) {
                record.closeness_rating = this.review.closeness_rating;
            }
            if (this.review.recommended) {
                record.recommended = this.review.recommended;
            }
            if (!this.review.id) {
                // Creating a new review.
                await createRecord('reviews', record);
            } else {
                // Updating an existing review.
                await updateRecord(
                    'reviews',
                    this.review,
                    this.review.id,
                    record
                );
            }
            window.location.href = getRecordUiUrl('volumes', this.volume);
        } catch (error) {
            this.error = error;
        }
    }
}
