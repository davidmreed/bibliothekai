import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'bib/api';

export default class FeatureDisplay extends LightningElement {
    _feature;
    textId;
    textTitle = '(No text selected)';

    error;

    @api set feature(value) {
        this._feature = value;
        this.textId = value.text;
    }

    get feature() {
        return this._feature;
    }

    @wire(getRecord, { entityName: 'texts', entityId: '$textId' })
    provisionText({ data, error }) {
        if (data) {
            this.textTitle = data.title;
        }
        if (error) {
            this.error = error;
        }
    }

    get featureDescription() {
        let features = ['translation'];
        if (this.feature.hasIntroduction) {
            features.push('introduction');
        }
        if (this.feature.hasNotes) {
            features.push('notes');
        }
        if (this.feature.hasCommentary) {
            features.push('commentary');
        }

        return `Includes ${features.join(', ')}.`;
    }

    remove() {
        this.dispatchEvent(
            new CustomEvent('remove', { detail: this.feature.id })
        );
    }

    edit() {
        this.dispatchEvent(
            new CustomEvent('edit', { detail: this.feature.id })
        );
    }
}
