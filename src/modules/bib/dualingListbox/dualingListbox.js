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
        this.template.querySelector(".spinner-grow").classList.add("d-none");
    }
    entities;
    _value;

    @api entityName;
    @api allowAdd;

    @track availableEntities = [];
    @track selectedEntities = [];
    @track filteredEntities = [];
    @track filteredSelectedEntities = [];
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
        return this._value;
    }

    set value(val) {
        this._value = val;
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
        this.availableEntities = this.entities.filter(f => !this.value.includes(f.id));
        this.selectedEntities = this.entities.filter(f => this.value.includes(f.id));

        if (this.searchKey) {
            this.filteredEntities = this.availableEntities.filter((f) =>
                f.name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
            this.filteredSelectedEntities = this.selectedEntities.filter((f) =>
                f.name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
        } else {
            this.filteredEntities = this.availableEntities;
            this.filteredSelectedEntities = this.selectedEntities;
        }

        this.filteredEntities.sort(sortRecordsByName);
        this.filteredSelectedEntities.sort(sortRecordsByName);
    }

    moveRight() {
        this.dispatchEvent(
            new CustomEvent(
                'change',
                {
                    detail: this._value.concat(Array.from(
                        this.template.querySelector('.entities').selectedOptions
                    ).map((f) => Number(f.value)))
                }
            )
        )
    }

    moveLeft() {
        let itemsUnselect = Array.from(
            this.template.querySelector('.selectedEntities').selectedOptions
        ).map((f) => Number(f.value));

        this.dispatchEvent(
            new CustomEvent(
                'change',
                {
                    detail: this._value.filter(f => !itemsUnselect.includes(f))
                }
            )
        )
    }

    add() {
        this.dispatchEvent(new CustomEvent('add'));
    }

    getValidityElement() {
        return this.template.querySelector(".validity");
    }

    setErrorStatus(message) {
        let validityElem = this.getValidityElement();
        validityElem.innerText = message;
        validityElem.classList.remove("d-none");
    }

    get selectedCount() {
        return this.selectedEntities.length;
    }

    get filteredSelectedCount() {
        return this.filteredSelectedEntities.length;
    }

    get entityCount() {
        return this.availableEntities.length;
    }

    get filteredEntityCount() {
        return this.filteredEntities.length;
    }
}
