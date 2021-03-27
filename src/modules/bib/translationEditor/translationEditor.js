import { LightningElement, api } from 'lwc';
import { getRecord } from 'bib/drf';

export default class TranslationEditor extends LightningElement {
    @api features;
    selectedText;
    translationExpanded = true;

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
        let update = {};
        update[prop] = value;
        this.dispatchEvent(new CustomEvent('update', { detail: update }));
    }

    async changeText(event) {
        event.stopPropagation();
        this.dispatchUpdate('text', event.detail);
        this.selectedText = await getRecord('texts', event.detail);
    }

    handleChange(event) {
        event.stopPropagation();
        this.dispatchUpdate(event.target.name, event.target.value);
    }

    handleChangeBoolean(event) {
        event.stopPropagation();
        this.dispatchUpdate(event.target.name, event.target.value === 'true');
    }

    handleChangeDetail(event) {
        event.stopPropagation();
        this.dispatchUpdate(event.target.dataset.name, event.detail);
    }

    handleFeatureSwitchChange(event) {
        // TODO: figure out a new way to do this, probably different custom events.

        event.stopPropagation();

        let desiredFeature = event.target.name;
        let newFeatures = this.features.clone();

        if (newFeatures.hasFeature(desiredFeature)) {
            newFeatures.removeFeature(desiredFeature);
        } else {
            newFeatures.addFeature(event.target.name, true);
        }

        this.dispatchEvent(new CustomEvent('change', { detail: newFeatures }));
    }

    handleSingleFeatureChange(event) {
        event.stopPropagation();

        let detail = event.detail;
        detail.path = (detail.path || []);
        detail.path.push(event.target.dataset.path);

        this.dispatchEvent('update', { detail: detail });
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
