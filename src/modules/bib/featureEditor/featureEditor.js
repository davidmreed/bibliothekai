import { LightningElement, api } from 'lwc';
import { getRecord } from 'bib/drf';
export default class FeatureEditor extends LightningElement {
    @api feature;
    @api generalFeature = false;
    selectedText;

    translationExpanded = true;
    introductionExpanded = false;
    notesExpanded = false;

    get showIntroduction() {
        return this.feature.hasIntroduction && this.introductionExpanded;
    }

    get showIntroError() {
        return !this.introductionExpanded && !this.feature.isIntroValid;
    }

    get showNotes() {
        return this.feature.hasNotes && this.notesExpanded;
    }

    get showNotesError() {
        return !this.notesExpanded && !this.feature.isNotesValid;
    }

    get partialValue() {
        return this.feature.partial.toString();
    }

    get hasSamplePassage() {
        return this.selectedText && !!this.selectedText.sample_passage;
    }

    @api
    get isValid() {
        return this.feature.isValid;
    }

    async renderedCallback() {
        if (!this.generalFeature && this.translationExpanded) {
            // Not sure why these do not bind correctly. Order of operations?
            this.template.querySelector(
                '.format-picklist'
            ).value = this.feature.proseOrVerse;
            this.template.querySelector(
                '.coverage-picklist'
            ).value = this.partialValue;
        }
        if (this.feature.text) {
            this.selectedText = await getRecord('texts', this.feature.text);
        }
    }

    dispatchUpdate(field, newValue) {
        let updates = {};
        updates[field] = newValue;
        this.dispatchUpdates(updates);
    }

    dispatchUpdates(updates) {
        let newFeature = this.feature.clone();
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
        } else if (field === 'kind') {
            this.dispatchUpdate('proseOrVerse', event.target.value);
        } else if (field === 'partial') {
            this.dispatchUpdate('partial', event.target.value === 'true');
        } else if (field === 'introDescription') {
            this.dispatchUpdate('introDescription', event.target.value);
        } else if (field === 'notesDescription') {
            this.dispatchUpdate('notesDescription', event.target.value);
        } else if (field === 'sample') {
            this.dispatchUpdate('samplePassage', event.target.value);
        }
        if (this.isFormValid) {
            this.markFormValid();
        }
    }

    handleAddPerson() {
        this.dispatchEvent(new CustomEvent('addperson'));
    }

    save() {
        this.dispatchEvent(new CustomEvent('save', { detail: this.feature }));
    }

    toggleIntroduction() {
        this.dispatchUpdates({
            hasIntroduction: !this.feature.hasIntroduction,
            introLanguage: '',
            introDescription: '',
            introAuthors: []
        });
    }

    toggleTranslationExpanded() {
        this.translationExpanded = !this.translationExpanded;
    }

    toggleIntroductionExpanded() {
        this.introductionExpanded = !this.introductionExpanded;
    }

    toggleNotes() {
        this.dispatchUpdates({
            hasNotes: !this.feature.hasNotes,
            notesLanguage: this.feature.language,
            notesDescription: '',
            notesAuthors: []
        });
    }

    toggleNotesExpanded() {
        this.notesExpanded = !this.notesExpanded;
    }
}
