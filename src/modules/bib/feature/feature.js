import { getRecordApiUrl } from 'bib/drf';

export class Feature {
    text = '';
    authors = [];
    partial = false;
    language = '';
    notesLanguage = '';
    introLanguage = '';
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

    get isIntroValid() {
        return (
            !this.hasIntroduction ||
            (!!this.introAuthors.length && !!this.introLanguage)
        );
    }

    get isNotesValid() {
        return (
            !this.hasNotes ||
            (!!this.notesAuthors.length && !!this.notesLanguage)
        );
    }

    get isValid() {
        let valid = !!this.authors.length && !!this.language;
        if (this.hasIntroduction) {
            valid = valid && this.isIntroValid;
        }
        if (this.hasNotes) {
            valid = valid && this.isNotesValid;
        }

        return valid;
    }

    clone() {
        let newFeature = new Feature(this.id);
        newFeature.text = this.text;
        newFeature.partial = this.partial;
        newFeature.language = this.language;
        newFeature.introLanguage = this.introLanguage;
        newFeature.notesLanguage = this.notesLanguage;
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
        let features = [];

        if (this.text) {
            let translation = {
                volume: getRecordApiUrl('volumes', volumeId),
                persons: this.authors.map((a) => getRecordApiUrl('persons', a)),
                language: getRecordApiUrl('languages', this.language),
                text: getRecordApiUrl('texts', this.text),
                partial: this.partial,
                kind: this.proseOrVerse,
                feature: 'Translation'
            };

            if (this.title) {
                translation.title = this.title;
            }
            if (this.description) {
                translation.description = this.description;
            }

            features.push(translation);
        }

        if (this.hasNotes) {
            let notes = {
                volume: getRecordApiUrl('volumes', volumeId),
                persons: this.notesAuthors.map((a) =>
                    getRecordApiUrl('persons', a)
                ),
                language: getRecordApiUrl('languages', this.notesLanguage),
                feature: 'Notes'
            };
            if (this.text) {
                notes.text = getRecordApiUrl('texts', this.text);
            }
            if (this.notesDescription) {
                notes.description = this.notesDescription;
            }
            features.push(notes);
        }
        if (this.hasIntroduction) {
            let intro = {
                volume: getRecordApiUrl('volumes', volumeId),
                persons: this.introAuthors.map((a) =>
                    getRecordApiUrl('persons', a)
                ),
                language: getRecordApiUrl('languages', this.introLanguage),
                feature: 'Introduction'
            };
            if (this.text) {
                intro.text = getRecordApiUrl('texts', this.text);
            }
            if (this.introDescription) {
                intro.description = this.introDescription;
            }
            features.push(intro);
        }

        return features;
    }
}
