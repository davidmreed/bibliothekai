import { getRecord } from 'bib/drf';
import { LightningElement } from 'lwc';

export default class CompareTranslations extends LightningElement {
    recordId;
    translationIds;
    sourceText;
    translations;
    error;

    async connectedCallback() {
        const urlParams = new URLSearchParams(document.location.search);

        this.recordId = urlParams.get('text');
        this.translationIds = urlParams.getAll('translation');
        // TODO: error handling.

        try {
            this.sourceText = await getRecord('texts', this.recordId);
            this.translations = this.translationIds.map(async (id) =>
                getRecord('translations', id)
            );
        } catch (e) {
            this.error = `The API returned an error: ${e}.`;
        }
    }
}
