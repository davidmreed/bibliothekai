import { LightningElement, api, track, wire } from 'lwc';
import { getRecords, sortRecordsByName } from 'bib/drf';

export default class DualingListbox extends LightningElement {
    @wire(getRecords, { entityName: '$entityName', nameField: '$nameField' })
    setEntities({ data, error }) {
        if (data) {
            this.entities = data;

            let selected = this.getSelectedIds();
            this.selectedEntities = [];
            this.selectIds(selected);

            if (this.preselectedIds) {
                this.selectIds(this.preselectedIds);
                this.preselectedIds = null;
            }

            this.updateDisplay();
        } else {
            this.setErrorStatus(error);
        }
        this.template.querySelector(".spinner-grow").classList.add("d-none");
    }
    entities = [];
    preselectedIds;
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
    getSelectedRecords() {
        return this.selectedEntities;
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

    @api
    preselectIds(ids) {
        // Sometimes we need to select an entity id that is not in our entities yet,
        // as it's just been created and is pending a wire refresh.
        // Likewise, we may need to preselect an entity before the first wire refresh
        // completes.

        if (ids.map(id => this.entities.includes(id)).reduce((a, b) => a && b)) {
            this.selectIds(ids);
        } else {
            this.preselectedIds = ids;
        }
    }

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

        this.filteredEntities.sort(sortRecordsByName);
        this.filteredSelectedEntities.sort(sortRecordsByName);
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
        return this.entities.length;
    }

    get filteredEntityCount() {
        return this.filteredEntities.length;
    }
}
