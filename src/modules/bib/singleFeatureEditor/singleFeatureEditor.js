import { LightningElement, api, track } from 'lwc';

export default class SingleFeatureEditor extends LightningElement {
    @track _feature;
    @api hasTranslation = false;

    @api
    set feature(f) {
        this._feature = f.clone();
    }

    get feature() {
        return this._feature;
    }

    get showDetails() {
        return !(this.hasTranslation && this._feature.sameAsTranslation);
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

    handleChange(event) {
        event.stopPropagation();
        this.postUpdate(
            event.currentTarget.dataset.name,
            event.currentTarget.value
        );
    }

    handleChangeCheckbox(event) {
        event.stopPropagation();
        this.postUpdate(
            event.currentTarget.dataset.name,
            event.currentTarget.checked
        );
    }

    handleChangeValueInvert(event) {
        event.stopPropagation();

        this.postUpdate(
            event.currentTarget.dataset.name,
            !this._feature[event.currentTarget.dataset.name]
        );
    }

    handleAddPerson() {
        this.dispatchEvent(
            new CustomEvent('addperson', {
                detail: {
                    callback: (p) =>
                        this.postUpdate(
                            'persons',
                            this.feature.persons.concat([p])
                        )
                }
            })
        );
    }
}
