import { LightningElement, api } from 'lwc';
import { sortRecordsByProperty } from 'bib/drf';

export class FilterCriteria {
    constructor(filters, sortColumn, sortAscending) {
        this.filters = filters;
        this.sortColumn = sortColumn;
        this.sortAscending = sortAscending;
    }
    filters; // { column: key, value: req }
    sortColumn;
    sortAscending;
}

function sortRecords(sortColumn, sortAscending, a, b) {
    return sortRecordsByProperty(sortColumn, sortAscending, a.record, b.record);
}

export default class DataTable extends LightningElement {
    @api allowsSelection;
    @api selectedIds;

    _columns;
    _records;
    _filterCriteria;
    _displayedRecords;

    @api
    get columns() {
        return this._columns || [];
    }

    set columns(value) {
        let that = this;

        this._columns = value.map((c) => ({
            get isSortedAscending() {
                return (
                    that.filterCriteria.sortColumn === this.id &&
                    that.filterCriteria.sortAscending
                );
            },
            get isSortedDescending() {
                return (
                    that.filterCriteria.sortColumn === this.id &&
                    !that.filterCriteria.sortAscending
                );
            },
            id: c.id,
            name: c.name
        }));
    }

    @api
    get records() {
        return this._records || [];
    }

    set records(value) {
        let that = this;
        if (value) {
            this._records = value.map((r) => ({
                get values() {
                    return that.columns.map((c) => ({
                        key: c.id,
                        value: this.record[c.id]
                    }));
                },
                get selected() {
                    return (that.selectedIds || []).includes(r.id);
                },
                record: r
            }));
            this.update();
        } else {
            this._records = [];
        }
    }

    @api
    get filterCriteria() {
        return this._filterCriteria || {};
    }

    set filterCriteria(value) {
        this._filterCriteria = value;
        this.update();
    }

    update() {
        if (this.filterCriteria) {
            this._displayedRecords = this.records.filter((f) =>
                this.filterCriteria.filters.reduce(
                    (prev, cur) => prev && f[cur.column] === cur.value,
                    true
                )
            );
            this._displayedRecords.sort(
                sortRecords.bind(
                    undefined,
                    this.filterCriteria.sortColumn,
                    this.filterCriteria.sortAscending
                )
            );
        } else {
            this._displayedRecords = [...this.records];
        }
    }

    handleSelectionChange(event) {
        event.stopPropagation();
        let ids = [...(this.selectedIds || [])];

        if (event.target.value) {
            ids.push(event.target.dataset.record);
        } else {
            ids = ids.filter((f) => f !== event.target.dataset.record);
        }

        this.dispatchEvent(new CustomEvent('selectionchange', { detail: ids }));
    }

    handleColumnClick(event) {
        let clickedColId = event.target.dataset.col;
        this.dispatchEvent(
            new CustomEvent('sort', {
                detail: {
                    sortColumn: clickedColId,
                    sortAscending:
                        this.filterCriteria.sortColumn === clickedColId
                            ? !this.filterCriteria.sortAscending
                            : true
                }
            })
        );
    }
}
