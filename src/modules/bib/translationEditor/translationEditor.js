import { LightningElement, api, track } from 'lwc';
import { getRecord } from 'bib/drf';
import setNestedProperty from 'bib/utils';

export default class TranslationEditor extends LightningElement {
    @track _features;

    selectedText;
    translationExpanded = true;

    @api
    set features(f) {
        this._features = f;
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
        }
        if (this.features.text) {
            this.selectedText = await getRecord('texts', this.features.text);
        }
    }

    dispatchUpdate(prop, value) {
        setNestedProperty(this._features, prop, value);
        this.dispatchEvent(new CustomEvent('update'));
    }

    async changeText(event) {
        event.stopPropagation();
        this.dispatchUpdate('text', event.currentTarget.value);
        this.selectedText = await getRecord('texts', event.currentTarget.value);
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
            event.target.dataset.name,
            event.target.value === 'true'
        );
    }

    handleFeatureSwitchChange(event) {
        event.stopPropagation();

        let desiredFeature = event.target.name;

        if (this._features.hasFeature(desiredFeature)) {
            this._features.removeFeature(desiredFeature);
        } else {
            this._features.addFeature(desiredFeature, true);
        }

        this.dispatchEvent(new CustomEvent('update'));
    }

    handleSingleFeatureChange(event) {
        event.stopPropagation();

        let f = event.target.feature;
        this._features.replaceFeature(f);
        this.dispatchEvent('update');
    }

    handleAddPerson() {
        // TODO: pass a detail in the event to denote the context.
        // Have addVolume add the newly-added person to the appropriate lists
        // when a save event is received.
        this.dispatchEvent(new CustomEvent('addperson'));
    }

    save() {
        this.dispatchEvent(new CustomEvent('save', { detail: this.feature }));
    }

    toggleTranslationExpanded() {
        this.translationExpanded = !this.translationExpanded;
    }
}
