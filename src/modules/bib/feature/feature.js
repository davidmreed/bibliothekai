import { getRecordApiUrl } from 'bib/drf';

export class Feature {
    text = '';
    authors = [];
    partial = false;
    language = '';
    proseOrVerse = 'Prose';
    hasIntroduction = false;
    introAuthors = [];
    introDescription = '';
    hasNotes = false;
    notesAuthors = [];
    notesDescription = '';
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
        newFeature.introDescription = this.introDescription;
        newFeature.hasNotes = this.hasNotes;
        newFeature.notesDescription = this.notesDescription;
        newFeature.title = this.title;
        newFeature.description = this.description;
        newFeature.expanded = this.expanded;
        newFeature.authors = [...this.authors];
        newFeature.introAuthors = [...this.introAuthors];
        newFeature.notesAuthors = [...this.notesAuthors];
        return newFeature;
    }

    getFeatures(volumeId) {
        let translation = {
            volume: getRecordApiUrl("volumes", volumeId),
            persons: this.authors.map(a => getRecordApiUrl("persons", a)),
            language: getRecordApiUrl("languages", this.language),
            text: getRecordApiUrl("texts", this.text),
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
                volume: getRecordApiUrl("volumes", volumeId),
                persons: this.notesAuthors.map(a => getRecordApiUrl("persons", a)),
                language: getRecordApiUrl("languages", this.language),
                text: getRecordApiUrl("texts", this.text),
                description: this.notesDescription,
                feature: "Notes"
            });
        }
        if (this.hasIntroduction) {
            features.push({
                volume: getRecordApiUrl("volumes", volumeId),
                persons: this.introAuthors.map(a => getRecordApiUrl("persons", a)),
                language: getRecordApiUrl(this.language),
                text: getRecordApiUrl(this.text),
                description: this.introDescription,
                feature: "Introduction"
            });
        }

        return features;
    }
}