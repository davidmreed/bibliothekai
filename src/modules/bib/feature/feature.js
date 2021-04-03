import { getRecordApiUrl } from 'bib/drf';

export class Feature {
    persons = [];
    language = '';
    description = '';
    feature = '';
    uiExpanded;

    constructor(ft, uiExpanded) {
        this.feature = ft;
        this.uiExpanded = uiExpanded;
    }

    get isValid() {
        return !!this.persons.length && !!this.language;
    }

    get isTranslation() {
        return this.feature === 'Translation';
    }

    clone() {
        let newFeature = Object.assign(new Feature(), this);
        newFeature.persons = [...this.persons];

        return newFeature;
    }

    json() {
        let js = {
            persons: this.persons.map((a) => getRecordApiUrl('persons', a)),
            language: getRecordApiUrl('languages', this.language),
            feature: this.feature
        };

        if (this.description) {
            js.description = this.description;
        }

        return js;
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

    json() {
        let js = super.json();

        js.partial = this.partial;
        js.format = this.format;
        if (this.samplePassage) {
            js.sample_passage = this.samplePassage;
        }
        if (this.title) {
            js.title = this.title;
        }

        return js;
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
        this.features.splice(
            this.features.findIndex((f) => f.feature === ft.feature),
            1,
            ft
        );
    }

    clone() {
        let newFeature = Object.assign(new Features(this.id), this);
        newFeature.features = this.features.map((f) => f.clone());

        return newFeature;
    }

    getFeatures(volumeId) {
        let features = this.features.map((f) => f.json());
        let volumeUrl = getRecordApiUrl('volumes', volumeId);
        let textUrl;

        if (this.text) {
            textUrl = getRecordApiUrl('texts', this.text);
        }

        features.forEach((f) => {
            f.volume = volumeUrl;
            if (this.text) {
                f.text = textUrl;
            }
        });

        return features;
    }
}
