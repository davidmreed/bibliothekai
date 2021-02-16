import { LightningElement, api } from 'lwc';

export default class FeatureEditor extends LightningElement {
    @api feature;
    @api generalFeature = false;

    @api
    get isValid() {
        return this.feature.isValid;
    }

    dispatchUpdate(field, newValue) {
        let updates = {};
        updates[field] = newValue;
        this.dispatchUpdates(updates);
    }

    dispatchUpdates(updates) {
        let newFeature = this.feature.clone();
        for (const key in updates) {
            newFeature[key] = updates[key];
        }

        this.dispatchEvent(new CustomEvent('change', { detail: newFeature }));
    }

    changeText(event) {
        event.stopPropagation();
        this.dispatchUpdate("text", event.detail);
    }

    changeLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate("language", event.detail);
    }

    changeNotesLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate("notesLanguage", event.detail);
    }

    changeIntroLanguage(event) {
        event.stopPropagation();
        this.dispatchUpdate("introLanguage", event.detail);
    }

    changePersons(event) {
        this.dispatchUpdate("authors", event.detail);
    }

    changeIntroPersons(event) {
        this.dispatchUpdate("introAuthors", event.detail);
    }

    changeNotesPersons(event) {
        this.dispatchUpdate("notesAuthors", event.detail);
    }

    handleChange(event) {
        const field = event.target.name;
        event.stopPropagation();

        if (field === 'title') {
            this.dispatchUpdate("title", event.target.value);
        } else if (field === 'description') {
            this.dispatchUpdate("description", event.target.value);
        } else if (field === 'kind') {
            this.dispatchUpdate("proseOrVerse", event.target.value);
        } else if (field === 'authors' || field === 'introAuthors' || field === 'notesAuthors') {
            this.dispatchUpdate(
                field,
                Array.from(event.target.selectedOptions).map((f) => Number(f.value))
            );
        } else if (field === 'partial') {
            this.dispatchUpdate("partial", event.target.value);
        } else if (field === 'introDescription') {
            this.dispatchUpdate("introDescription", event.target.value);
        } else if (field === 'notesDescription') {
            this.dispatchUpdate("notesDescription", event.target.value);
        }
        if (this.isFormValid) {
            this.markFormValid();
        }
    }

    save() {
        this.dispatchEvent(new CustomEvent('save', { detail: this.feature }));
    }

    toggleIntroduction() {
        if (this.feature.introLanguage === '') {
            this.dispatchUpdates({
                "introLanguage": this.feature.language,
                "hasIntroduction": !this.feature.hasIntroduction
            });
        } else {
            this.dispatchUpdate("hasIntroduction", !this.feature.hasIntroduction);
        }
    }

    toggleNotes() {
        if (this.feature.notesLanguage === '') {
            this.dispatchUpdates({
                "notesLanguage": this.feature.language,
                "hasNotes": !this.feature.hasNotes
            });
        } else {
            this.dispatchUpdate("hasNotes", !this.feature.hasNotes);
        }
    }
}
