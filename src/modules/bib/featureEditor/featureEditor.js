import { LightningElement, api, track } from 'lwc';

export default class FeatureEditor extends LightningElement {
    @track text = { id: "" };
    authors = [];
    partial = false;
    language = "";
    proseOrVerse = 'Prose';
    hasIntroduction = false;
    introductionAuthors = null;
    hasNotes = false;
    notesAuthors = null;
    title = '';
    description = '';
    expanded = true;

    @api
    availableAuthors;

    @api
    getFeatures() {
        let translation = {
            persons: this.authors,
            language: this.language,
            text: this.text,
            partial: this.partial,
            kind: this.proseOrVerse,
            feature: "Translation"
        };

        if (this.title) {
            translation.title = this.title;
        }
        if (this.description) {
            translation.description = this.description;
        }

        let features = [
            translation
        ];

        if (this.hasNotes) {
            features.push({
                persons: this.notesAuthors || this.authors, language: this.language, text: this.text.id, feature: "Notes"
            });
        }
        if (this.hasIntroduction) {
            features.push({
                persons: this.introductionAuthors || this.authors, language: this.language, text: this.text, feature: "Introduction"
            });
        }

        return features;
    }

    get isFormValid() {
        return !!this.text && !!this.language && !!this.authors.length;
    }

    changeText(event) {
        this.text = event.detail;
    }

    changeLanguage(event) {
        this.language = event.detail.id;
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'title') {
            this.title = event.target.value;
        } else if (field === 'description') {
            this.description = event.target.value;
        } else if (field === 'kind') {
            this.proseOrVerse = event.target.value;
        } else if (field === 'authors') {
            this.authors = Array.from(event.target.selectedOptions)
                .map((f) => Number(f.value));
        } else if (field === 'hasIntroduction') {
            this.hasIntroduction = event.target.value;
        } else if (field === 'hasNotes') {
            this.hasNotes = event.target.value;
        } else if (field === 'partial') {
            this.partial = event.target.value;
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
