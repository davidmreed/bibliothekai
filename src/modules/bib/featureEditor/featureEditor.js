import { LightningElement, api } from 'lwc';

export default class FeatureEditor extends LightningElement {
    @api feature;
    @api availableAuthors;

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

    handleChange(event) {
        const field = event.target.name;
        event.stopPropagation();

        if (field === 'title') {
            this.dispatchUpdate("title", event.target.value);
        } else if (field === 'description') {
            this.dispatchUpdate("description", event.target.value);
        } else if (field === 'kind') {
            this.dispatchUpdate("proseOrVerse", event.target.value);
        } else if (field === 'authors') {
            this.dispatchUpdate(
                "authors",
                Array.from(event.target.selectedOptions).map((f) => Number(f.value))
            );
        } else if (field === 'hasIntroduction') {
            this.dispatchUpdate("hasIntroduction", event.target.value);
        } else if (field === 'hasNotes') {
            this.dispatchUpdate("hasNotes", event.target.value);
        } else if (field === 'partial') {
            this.dispatchUpdate("partial", event.target.value);
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
}
