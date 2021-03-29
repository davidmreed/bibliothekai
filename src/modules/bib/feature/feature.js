import { getRecordApiUrl } from 'bib/drf';

export class Feature {
    authors = [];
    language = '';
    description = '';
    feature = '';
    uiExpanded;

    constructor(ft, uiExpanded) {
        this.feature = ft;
        this.uiExpanded = uiExpanded;
    }

    get isValid() {
        return !!this.authors.length && !!this.language;
    }

    get isTranslation() {
        return this.feature === 'Translation';
    }

    clone() {
        let newFeature = Object.assign(new Feature(), this);
        newFeature.authors = [...this.authors];

        return newFeature;
    }
}

export class TranslationFeature extends Feature {
    partial = false;
    format = 'Prose';
    samplePassage = '';
    title = '';

    constructor(uiExpanded) {
        super('Translation', uiExpanded);
    }

    get isValid() {
        return super.isValid && !!this.text;
    }
}

export class Features {
    id;
    features = [];
    defaultLanguage = '';
    text = '';

    constructor(id) {
        this.id = id;
    }

    get hasIntroduction() {
        return this.hasFeature('Introduction');
    }

    get introduction() {
        return this.getFeature('Introduction');
    }

    get hasNotes() {
        return this.hasFeature('Notes');
    }

    get notes() {
        return this.getFeature('Notes');
    }

    get hasEdited() {
        return this.hasFeature('Edited');
    }

    get edited() {
        return this.getFeature('Edited');
    }

    get hasCommentary() {
        return this.hasFeature('Commentary');
    }

    get commentary() {
        return this.getFeature('Commentary');
    }

    get hasTranslation() {
        return this.hasFeature('Translation');
    }

    get translation() {
        return this.getFeature('Translation');
    }

    get isValid() {
        return this.features.reduce((prev, cur) => prev && cur.isValid, true);
    }

    hasFeature(ft) {
        return this.features.filter((f) => f.feature === ft).length > 0;
    }

    getFeature(ft) {
        let candidates = this.features.filter((f) => f.feature === ft);
        if (candidates.length) {
            return candidates[0];
        }

        return undefined;
    }

    addFeature(ft, uiExpanded) {
        let newFeature =
            ft === 'Translation'
                ? new TranslationFeature(uiExpanded)
                : new Feature(ft, uiExpanded);

        if (this.defaultLanguage) {
            newFeature.language = this.defaultLanguage;
        }

        this.features.push(newFeature);
    }

    removeFeature(ft) {
        this.features = this.features.filter((f) => f.feature !== ft);
    }

    replaceFeature(ft) {
        this.features.splice(this.features.findIndex(f => f.feature === ft.feature), 1, ft);
    }

    clone() {
        let newFeature = Object.assign(new Features(this.id), this);
        newFeature.features = this.features.map((f) => f.clone());

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
                format: this.format,
                feature: 'Translation'
            };

            if (this.title) {
                translation.title = this.title;
            }
            if (this.description) {
                translation.description = this.description;
            }
            if (this.samplePassage) {
                translation.sample_passage = this.samplePassage;
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
