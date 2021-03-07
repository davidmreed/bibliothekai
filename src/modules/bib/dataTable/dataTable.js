import { LightningElement, api } from 'lwc';
import { sortRecordsByProperty, getNestedProp, getRecordUiUrl } from 'bib/drf';

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

export const COLUMN_STRING_TYPE = 'string';
export const COLUMN_HYPERLINK_TYPE = 'link';
export const COLUMN_HYPERLINK_LIST_TYPE = 'link-list';
export const COLUMN_PILL_LIST_TYPE = 'pill-list';
export const COLUMN_YEAR_TYPE = 'year';

function sortRecords(sortColumn, sortAscending, a, b) {
    return sortRecordsByProperty(sortColumn, sortAscending, a.record, b.record);
}

function makeRecordValueEntry(c, record) {
    let value;
    let href;

    switch (c.valueType) {
        case COLUMN_HYPERLINK_LIST_TYPE:
            // `value` is an array of objects, each of which has an `id`, a `href`, and a `name`.
            value = getNestedProp(record, c.id).map((e) => ({
                id: getNestedProp(e, c.targetEntityId),
                href: getRecordUiUrl(
                    c.targetEntity,
                    getNestedProp(e, c.targetEntityId)
                ),
                name: getNestedProp(e, c.targetEntityName)
            }));
            break;
        case COLUMN_PILL_LIST_TYPE:
            // `value` is an array, whose items each have an `id`, `pillClass` and a `value`.
            // `c`, the column, must have a mapping between string values in the record
            // and pill colors.
            // The inbound property value is an array of strings.
            value = getNestedProp(record, c.id).map((i) => ({
                id: i,
                value: i,
                pillClass: `badge badge-pill badge-${c.pills[i]} mr-1 mb-1`
            }));
            break;
        case COLUMN_YEAR_TYPE:
            // `value` is a year derived from an ISO8601 date.
            value = getNestedProp(record, c.id).substring(0, 4);
            break;
        case COLUMN_HYPERLINK_TYPE:
            href = getRecordUiUrl(
                c.targetEntity,
                getNestedProp(record, c.targetEntityId)
            );
        // fall through
        default:
            value = getNestedProp(record, c.id);
            break;
    }

    return {
        key: c.id,
        value: value,
        href: href,
        isStringType: c.valueType === COLUMN_STRING_TYPE,
        isYearType: c.valueType === COLUMN_YEAR_TYPE,
        isHyperlinkType: c.valueType === COLUMN_HYPERLINK_TYPE,
        isHyperlinkListType: c.valueType === COLUMN_HYPERLINK_LIST_TYPE,
        isPillListType: c.valueType === COLUMN_PILL_LIST_TYPE
    };
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

        this._columns = value.map((c) =>
            Object.assign(
                {
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
                    }
                },
                c
            )
        );
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
                    return that.columns.map((c) => makeRecordValueEntry(c, r));
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
            if (this.filterCriteria.filters) {
                this._displayedRecords = this.records.filter((f) =>
                    this.filterCriteria.filters.reduce(
                        (prev, cur) =>
                            prev &&
                            getNestedProp(f.record, cur.column) === cur.value,
                        true
                    )
                );
            } else {
                this._displayedRecords = [...this.records];
            }
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
        let clickedColumn = this.columns.filter(
            (c) => c.id === clickedColId
        )[0];

        if (
            clickedColumn.valueType === COLUMN_STRING_TYPE ||
            clickedColumn.valueType === COLUMN_HYPERLINK_TYPE ||
            clickedColumn.valueType === COLUMN_YEAR_TYPE
        ) {
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
}
