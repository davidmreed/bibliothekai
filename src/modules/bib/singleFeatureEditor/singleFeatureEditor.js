import { LightningElement, api } from 'lwc';

export default class SingleFeatureEditor extends LightningElement {
    _feature;

    @api
    set feature(f) {
        this._feature = f.clone();
    }

    get feature() {
        return this._feature;
    }

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
        this._feature[prop] = value;
        this.dispatchEvent(new CustomEvent('update'));
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
