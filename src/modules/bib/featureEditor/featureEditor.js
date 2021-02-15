import { LightningElement, api } from 'lwc';

export default class FeatureEditor extends LightningElement {
    @api feature;

    expanded = true;

    get isFormValid() {
        return this.feature.isValid;
    }

    dispatchUpdate(field, newValue) {
        let newFeature = this.feature.clone();
        newFeature[field] = newValue;
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
        } else if (field === 'hasIntroduction') {
            this.dispatchUpdate("hasIntroduction", event.target.value);
        } else if (field === 'hasNotes') {
            this.dispatchUpdate("hasNotes", event.target.value);
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

    getValidityElement() {
        return this.template.querySelector(".validity");
    }

    setErrorStatus(message) {
        let validityElem = this.getValidityElement();
        validityElem.innerText = message;
        validityElem.classList.remove("d-none");
    }

    markFormValid() {
        this.template.querySelector(".validity").classList.add("d-none");
    }

    toggle() {
        this.expanded = !this.expanded;
    }

    remove() {
        this.dispatchEvent(new CustomEvent('remove', { detail: this.feature.id }));
    }

    toggleIntroduction() {
        this.dispatchUpdate("hasIntroduction", !this.feature.hasIntroduction);
    }

    toggleNotes() {
        this.dispatchUpdate("hasNotes", !this.feature.hasNotes);
    }
}
