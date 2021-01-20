import { LightningElement, api, track, wire } from 'lwc';
import { getRecords } from 'bib/drf';

export default class DualingListbox extends LightningElement {
    @wire(getRecords, { entityName: '$entityName', nameField: '$nameField' })
    setEntities(data) {
        this.entities = data || [];
        this.updateDisplay();
    }
    entities = [];
    @api entityName;
    @api nameField;
    @api allowAdd = false; // FIXME: allowAdd is being processed incorrectly (backwards)
    @track selectedEntities = [];
    @track filteredEntities = [];
    @track filteredSelectedEntities = [];
    @track searchKey = null;

    connectedCallback() {
    }

    doSearch(event) {
        this.searchKey = event.target.value;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.searchKey) {
            this.filteredEntities = this.entities.filter((f) => f.name.toLowerCase().includes(this.searchKey.toLowerCase()));
            this.filteredSelectedEntities = this.selectedEntities.filter((f) => f.name.toLowerCase().includes(this.searchKey.toLowerCase()));
        } else {
            this.filteredEntities = this.entities;
            this.filteredSelectedEntities = this.selectedEntities;
        }

        this.filteredEntities.sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }

    moveRight() {
        let leftBoxSelected = Array.from(this.template.querySelector('.entities').selectedOptions).map((f) => Number(f.value));

        for (let value of leftBoxSelected) {
            let index = this.entities.findIndex((f) => f.id === value);
            this.selectedEntities.splice(this.selectedEntities.length, 0, ...this.entities.splice(index, 1));
        }

        this.updateDisplay();
    }

    moveLeft() {
        let rightBoxSelected = Array.from(this.template.querySelector('.selectedEntities').selectedOptions).map((f) => Number(f.value));

        for (let value of rightBoxSelected) {
            let index = this.selectedEntities.findIndex((f) => f.id === value);
            this.entities.splice(this.entities.length, 0, ...this.selectedEntities.splice(index, 1));
        }

        this.updateDisplay();

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