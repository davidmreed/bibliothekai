import { LightningElement, api, track, wire } from 'lwc';
import { getRecords } from 'bib/drf';

export default class DualingListbox extends LightningElement {
    @wire(getRecords, { entityName: '$entityName', nameField: '$nameField' })
    setEntities(data) {
        this.entities = data;

        let selected = this.getSelectedIds();
        this.selectedEntities = [];
        this.selectIds(selected);
        this.updateDisplay();
    }
    entities = [];
    @api entityName;
    @api nameField;
    @api allowAdd;
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
    getSelectedIds() {
        return this.selectedEntities.map((e) => e.id);
    }

    @api
    selectIds(ids) {
        for (let value of ids) {
            let index = this.entities.findIndex((f) => f.id === value);
            if (index !== -1) {
                this.selectedEntities.splice(
                    this.selectedEntities.length,
                    0,
                    ...this.entities.splice(index, 1)
                );
            }
        }
        this.updateDisplay();
    }

    @api
    unselectIds(ids) {
        for (let value of ids) {
            let index = this.selectedEntities.findIndex((f) => f.id === value);
            if (index !== -1) {
                this.entities.splice(
                    this.entities.length,
                    0,
                    ...this.selectedEntities.splice(index, 1)
                );
            }
        }

        this.updateDisplay();
    }

    connectedCallback() {}

    doSearch(event) {
        this.searchKey = event.target.value;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.searchKey) {
            this.filteredEntities = this.entities.filter((f) =>
                f.name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
            this.filteredSelectedEntities = this.selectedEntities.filter((f) =>
                f.name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
        } else {
            this.filteredEntities = this.entities;
            this.filteredSelectedEntities = this.selectedEntities;
        }

        let sortFunction = (a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        };

        this.filteredEntities.sort(sortFunction);
        this.filteredSelectedEntities.sort(sortFunction);
    }

    moveRight() {
        this.selectIds(
            Array.from(
                this.template.querySelector('.entities').selectedOptions
            ).map((f) => Number(f.value))
        );
    }

    moveLeft() {
        this.unselectIds(
            Array.from(
                this.template.querySelector('.selectedEntities').selectedOptions
            ).map((f) => Number(f.value))
        );
    }

    add() {
        this.dispatchEvent(new CustomEvent('add'));
    }

    get selectedCount() {
        return this.selectedEntities.length;
    }

    get filteredSelectedCount() {
        return this.filteredSelectedEntities.length;
    }

    get entityCount() {
        return this.entities.length;
    }

    get filteredEntityCount() {
        return this.filteredEntities.length;
    }
}
