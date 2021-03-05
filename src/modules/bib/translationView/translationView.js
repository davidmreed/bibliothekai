import { LightningElement, wire, track } from 'lwc';
import { getRecords } from 'bib/drf';
import { FilterCriteria } from 'bib/dataTable';

export default class TranslationView extends LightningElement {
    columns = [
        { id: 'name', name: 'Name' },
        { id: 'isbn', name: 'ISBN' }
    ];
    selectedIds = [];
    allowsSelection = true;
    _records = [];
    _error;

    @wire(getRecords, { entityName: 'volumes' })
    provision({ data, error }) {
        if (data) {
            this._records = data;
        }
        if (error) {
            this._error = error;
        }
    }

    @track
    filterCriteria = new FilterCriteria([], 'name', true);

    handleSort(event) {
        this.filterCriteria = new FilterCriteria(
            this.filterCriteria.filters,
            event.detail.sortColumn,
            event.detail.sortAscending
        );
    }

    handleSelectionChange(event) {
        this.selectedIds = event.detail;
    }
}
