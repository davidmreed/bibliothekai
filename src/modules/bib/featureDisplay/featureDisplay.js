import { LightningElement, api } from 'lwc';
import { getRecord } from 'bib/drf';

export default class FeatureDisplay extends LightningElement {
    @api feature;
    textTitle;

    async connectedCallback() {
        if (this.feature.text) {
            let record = await getRecord("texts", this.feature.text);
            this.textTitle = record.title;
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

        return 'Includes ' + features.join(', ');
    }

    remove() {
        this.dispatchEvent(new CustomEvent('remove', { detail: this.feature.id }));
    }

    edit() {
        this.dispatchEvent(new CustomEvent('edit', { detail: this.feature.id }));
    }
}
