import { LightningElement, api } from 'lwc';
import { getRecord } from 'bib/drf';

export default class TranslationEditor extends LightningElement {
    @api features;
    selectedText;

    get partialValue() {
        return this.features.translation.partial.toString();
    }

    get hasSamplePassage() {
        return this.selectedText && !!this.selectedText.sample_passage;
    }

    @api
    get isValid() {
        return this.features.isValid;
    }

    async renderedCallback() {
        if (!this.generalFeature && this.translationExpanded) {
            // Not sure why these do not bind correctly. Order of operations?
            this.template.querySelector(
                '.format-picklist'
            ).value = this.features.translation.format;
            this.template.querySelector(
                '.coverage-picklist'
            ).value = this.partialValue;
        }
        if (this.features.text) {
            this.selectedText = await getRecord('texts', this.features.text);
        }
    }

    dispatchUpdate(field, newValue) {
        let updates = {};
        updates[field] = newValue;
        this.dispatchUpdates(updates);
    }

    dispatchUpdates(updates) {
        let newFeature = this.features.clone();
        for (const key in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                newFeature[key] = updates[key];
            }
        }

        this.dispatchEvent(new CustomEvent('change', { detail: newFeature }));
    }

    async changeText(event) {
        event.stopPropagation();
        this.dispatchUpdate('text', event.detail);
        this.selectedText = await getRecord('texts', event.detail);
    }

    changeLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate('language', event.detail);
    }

    changeNotesLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate('notesLanguage', event.detail);
    }

    changeIntroLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate('introLanguage', event.detail);
    }

    changePersons(event) {
        this.dispatchUpdate('authors', event.detail);
    }

    changeIntroPersons(event) {
        this.dispatchUpdate('introAuthors', event.detail);
    }

    changeNotesPersons(event) {
        this.dispatchUpdate('notesAuthors', event.detail);
    }

    handleChange(event) {
        const field = event.target.name;
        event.stopPropagation();

        if (field === 'title') {
            this.dispatchUpdate('title', event.target.value);
        } else if (field === 'description') {
            this.dispatchUpdate('description', event.target.value);
        } else if (field === 'format') {
            this.dispatchUpdate('format', event.target.value);
        } else if (field === 'partial') {
            this.dispatchUpdate('partial', event.target.value === 'true');
        } else if (field === 'sample') {
            this.dispatchUpdate('samplePassage', event.target.value);
        }
    }

    handleSingleFeatureChange() {
        // FIXME: implement
    }

    handleAddPerson() {
        // TODO: pass a detail in the event to denote the context.
        // Have addVolume add the newly-added person to the appropriate lists
        // when a save event is received.
        this.dispatchEvent(new CustomEvent('addperson'));
    }

    save() {
        this.dispatchEvent(new CustomEvent('save', { detail: this.feature }));
    }

    toggleTranslationExpanded() {
        this.translationExpanded = !this.translationExpanded;
    }
}
