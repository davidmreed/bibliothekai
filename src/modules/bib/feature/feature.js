export class Feature {
    text = '';
    authors = [];
    partial = false;
    language = '';
    proseOrVerse = 'Prose';
    hasIntroduction = false;
    introductionAuthors = null;
    hasNotes = false;
    notesAuthors = null;
    title = '';
    description = '';
    expanded = true;
    id;

    constructor(id) {
        this.id = id;
    }

    get isValid() {
        return this.authors.length && !!this.language && !!this.text;
    }

    clone() {
        let newFeature = new Feature(this.id);
        newFeature.text = this.text;
        newFeature.partial = this.partial;
        newFeature.language = this.language;
        newFeature.proseOrVerse = this.proseOrVerse;
        newFeature.hasIntroduction = this.hasIntroduction;
        newFeature.hasNotes = this.hasNotes;
        newFeature.title = this.title;
        newFeature.description = this.description;
        newFeature.expanded = this.expanded;
        newFeature.authors = [...this.authors];
        newFeature.introductionAuthors = this.introductionAuthors ? [...this.introductionAuthors] : this.introductionAuthors;
        newFeature.notesAuthors = this.notesAuthors ? [...this.notesAuthors] : this.notesAuthors;
        return newFeature;
    }

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
}