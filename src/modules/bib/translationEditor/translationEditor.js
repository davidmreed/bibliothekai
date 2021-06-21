import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'bib/api';
import { setNestedProperty } from 'bib/utils';

export default class TranslationEditor extends LightningElement {
    @track _features;

    textId;
    selectedText;
    translationExpanded = true;
    hasTranslation = true; // For binding to singleFeatureEditor

    error;

    @wire(getRecord, { entityName: 'texts', entityId: '$textId' })
    provisionText({ data, error }) {
        if (data) {
            this.selectedText = data;
        }
        if (error) {
            this.error = error;
        }
    }

    @api
    set features(f) {
        this._features = f.clone();
    }

    get features() {
        return this._features;
    }

    get partialValue() {
        return this.features.translation.partial.toString();
    }

    get hasSamplePassage() {
        return this.selectedText && !!this.selectedText.sample_passage;
    }

    @api
    get isValid() {
        return this.features.isValid;
    }

    async renderedCallback() {
        if (this.translationExpanded) {
            // Not sure why these do not bind correctly. Order of operations?
            this.template.querySelector(
                '.format-picklist'
            ).value = this.features.translation.format;
            this.template.querySelector(
                '.coverage-picklist'
            ).value = this.partialValue;
            this.template.querySelector(
                '.description-field'
            ).value = this.features.translation.description;
        }
        if (this.features.text) {
            this.textId = this.features.text;
        }
    }

    dispatchUpdate(prop, value) {
        setNestedProperty(this._features, prop, value);
        this.dispatchEvent(new CustomEvent('update'));
    }

    changeText(event) {
        event.stopPropagation();
        this.dispatchUpdate('text', event.currentTarget.value);
        this.textId = event.currentTarget.value;
    }

    handleChange(event) {
        event.stopPropagation();
        this.dispatchUpdate(
            event.currentTarget.dataset.name,
            event.currentTarget.value
        );
    }

    handleChangeBoolean(event) {
        event.stopPropagation();
        this.dispatchUpdate(
            event.currentTarget.dataset.name,
            event.currentTarget.value === 'true'
        );
    }

    handleFeatureSwitchChange(event) {
        event.stopPropagation();

        let desiredFeature = event.target.dataset.feature;
        let newFeatures = this._features.clone();

        if (newFeatures.hasFeature(desiredFeature)) {
            newFeatures.removeFeature(desiredFeature);
        } else {
            newFeatures.addFeature(desiredFeature, true);
        }
        this._features = newFeatures;

        this.dispatchEvent(new CustomEvent('update'));
    }

    handleSingleFeatureChange(event) {
        event.stopPropagation();

        let f = event.target.feature;
        let newFeatures = this._features.clone();

        newFeatures.replaceFeature(f);
        this._features = newFeatures;

        this.dispatchEvent(new CustomEvent('update'));
    }

    handleAddPerson() {
        this.dispatchEvent(
            new CustomEvent('addperson', {
                detail: {
                    callback: (p) =>
                        this.dispatchUpdate(
                            'translation.persons',
                            this.features.translation.persons.concat([p])
                        )
                }
            })
        );
    }

    handleSingleFeatureAddPerson(event) {
        this.dispatchEvent(
            new CustomEvent('addperson', { detail: event.detail })
        );
    }

    save() {
        this.dispatchEvent(new CustomEvent('save', { detail: this.feature }));
    }

    toggleTranslationExpanded() {
        this.translationExpanded = !this.translationExpanded;
    }
}
