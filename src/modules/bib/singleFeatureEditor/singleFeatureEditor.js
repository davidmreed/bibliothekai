import { LightningElement, api } from 'lwc';

export default class SingleFeatureEditor extends LightningElement {
    @api feature;

    get isValid() {
        return this.feature.isValid;
    }

    get isVisible() {
        return this.feature.uiExpanded;
    }

    get buttonTitle() {
        return this.feature.uiExpanded ? 'Done' : 'Edit';
    }

    postUpdate(prop, value) {
        //if (Object.prototype.hasOwnProperty.call(this.feature, prop)) {
        let newFeature = this.feature.clone();

        newFeature[prop] = value;
        this.dispatchEvent(new CustomEvent('change', { detail: newFeature }));
        //}
    }

    handleChangeValueInvert(event) {
        event.stopPropagation();

        this.postUpdate(event.target.name, !this.feature[event.target.name]);
    }

    handleChangeDetail(event) {
        event.stopPropagation();

        this.postUpdate(event.target.dataset.name, event.detail);
    }

    handleChangeValue(event) {
        event.stopPropagation();
        this.postUpdate(event.target.name, event.target.value);
    }

    handleAddPerson() {
        // FIXME: implement
    }
}
