import { LightningElement, api, track, wire } from 'lwc';
import { getRecords, sortRecordsByName } from 'bib/drf';

export default class DualingListbox extends LightningElement {
    @wire(getRecords, { entityName: '$entityName' })
    setEntities({ data, error }) {
        if (data) {
            this.entities = data;
            this.update();
        } else {
            this.setErrorStatus(error);
        }
        this.template.querySelector('.spinner-grow').classList.add('d-none');
    }
    entities;
    _value;

    @api entityName;
    @api allowAdd;

    @track availableEntities = [];
    @track selectedEntities = [];
    @track filteredEntities = [];
    @track searchKey = null;

    get shouldAllowAdd() {
        if (typeof this.allowAdd === 'boolean') {
            return this.allowAdd;
        }
        return this.allowAdd === 'true' ? true : false;
    }

    @api
    getSelectedRecords() {
        return this.selectedEntities;
    }

    @api
    get value() {
        return this._value || [];
    }

    set value(val) {
        this._value = val || [];
        if (this.entities) {
            this.update();
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        this.update();
    }

    handleChange(event) {
        // We don't want change events from our select boxes to propagate
        event.stopPropagation();
    }

    update() {
        this.availableEntities = this.entities.filter(
            (f) => !this.value.includes(f.id)
        );
        this.selectedEntities = this.entities.filter((f) =>
            this.value.includes(f.id)
        );

        if (this.searchKey) {
            let splitSearchKey = this.searchKey.toLowerCase().split(/\W+/);

            this.filteredEntities = this.availableEntities.filter((f) =>
                splitSearchKey
                    .map((s) => f.name.toLowerCase().includes(s))
                    .reduce((prev, cur) => prev && cur, true)
            );
        } else {
            this.filteredEntities = this.availableEntities;
        }

        this.filteredEntities.sort(sortRecordsByName);
        this.selectedEntities.sort(sortRecordsByName);
    }

    moveRight() {
        this._value = this._value.concat(
            Array.from(
                this.template.querySelector('.entities').selectedOptions
            ).map((f) => Number(f.value))
        );
        this.update();
        this.dispatchEvent(new CustomEvent('change'));
    }

    moveLeft() {
        let itemsUnselect = Array.from(
            this.template.querySelector('.selectedEntities').selectedOptions
        ).map((f) => Number(f.value));
        this._value = this.value.filter((f) => !itemsUnselect.includes(f));
        this.update();
        this.dispatchEvent(new CustomEvent('change'));
    }

    add() {
        this.dispatchEvent(new CustomEvent('add'));
    }

    getValidityElement() {
        return this.template.querySelector('.validity');
    }

    setErrorStatus(message) {
        let validityElem = this.getValidityElement();
        validityElem.innerText = message;
        validityElem.classList.remove('d-none');
    }

    get selectedCount() {
        return this.selectedEntities.length;
    }

    get entityCount() {
        return this.availableEntities.length;
    }

    get filteredEntityCount() {
        return this.filteredEntities.length;
    }
}
