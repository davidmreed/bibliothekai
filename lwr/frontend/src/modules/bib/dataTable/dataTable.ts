import { LightningElement, api } from 'lwc';
import { Crumb } from '../link/link.js';

export interface FilterCriteria {
    filters: Array<{ column: string; value: string }>;
    sortColumn: string;
    sortAscending: boolean;
}

export const COLUMN_STRING_TYPE = 'string';
export const COLUMN_HYPERLINK_TYPE = 'link';
export const COLUMN_HYPERLINK_LIST_TYPE = 'link-list';
export const COLUMN_PILL_LIST_TYPE = 'pill-list';
export const COLUMN_YEAR_TYPE = 'year';

export interface Record {
    id: string;
}

interface BaseColumn {
    columnId: string;
    name: string;
}

export interface StringColumn<K extends Record> extends BaseColumn {
    valueType: typeof COLUMN_STRING_TYPE;
    valueGetter: (r: K) => string;
}

export interface HyperlinkColumn extends BaseColumn {
    valueType: typeof COLUMN_HYPERLINK_TYPE;
    valueGetter: (r: Record) => Crumb;
}

export interface HyperlinkListColumn extends BaseColumn {
    valueType: typeof COLUMN_HYPERLINK_LIST_TYPE;
    valueGetter: (r: Record) => Crumb[];
}

export interface PillListColumn extends BaseColumn {
    valueType: typeof COLUMN_PILL_LIST_TYPE;
    valueGetter: (r: Record) => string[];
    pillClasses: { [key: string]: string };
}

export interface YearColumn extends BaseColumn {
    valueType: typeof COLUMN_YEAR_TYPE;
    valueGetter: (r: Record) => string;
}

export type Column =
    | StringColumn
    | HyperlinkColumn
    | HyperlinkListColumn
    | PillListColumn
    | YearColumn;

interface DisplayedRecord {
    id: string;
    entries: ValueEntry[];
}

// This is a full class so that we can provide getters
// to support conditional rendering in the template.
class ValueEntry {
    value: string | string[] | Crumb | Crumb[];
    column: Column;
    recordId: string;

    constructor(column: Column, record: Record) {
        this.value = column.valueGetter(record);
        this.column = column;
        this.recordId = record.id;
    }

    get uniqueId() {
        return `${this.column.columnId}_${this.recordId}`;
    }

    get isStringType() {
        return this.column.valueType === COLUMN_STRING_TYPE;
    }

    get isYearType() {
        return this.column.valueType === COLUMN_YEAR_TYPE;
    }

    get isHyperlinkType() {
        return this.column.valueType === COLUMN_HYPERLINK_TYPE;
    }

    get isHyperlinkListType() {
        return this.column.valueType === COLUMN_HYPERLINK_LIST_TYPE;
    }

    get isPillListType() {
        return this.column.valueType === COLUMN_PILL_LIST_TYPE;
    }
}

export default class DataTable extends LightningElement {
    _columns: Column[] = [];
    _records: Record[] = [];
    _filterCriteria: FilterCriteria | null = null;
    _displayedRecords: DisplayedRecord[] = [];

    @api
    get columns(): Column[] {
        return this._columns || [];
    }

    set columns(value: Column[]) {
        let sortColumn = this.filterCriteria.sortColumn;
        let sortAscending = this.filterCriteria.sortAscending;

        this._columns = [...value].map((c) => ({
            ...c,
            isSortedAscending: sortColumn === c.columnId && sortAscending,
            isSortedDescending: sortColumn === c.columnId && !sortAscending
        }));

        this.update();
    }

    @api
    get records(): Record[] {
        return this._records || [];
    }

    set records(value: Record[]) {
        this._records = value;

        this.update();
    }

    @api
    get filterCriteria(): FilterCriteria | null {
        return this._filterCriteria;
    }

    set filterCriteria(value: FilterCriteria | null) {
        this._filterCriteria = value;
        this.update();
    }

    get recordsShown(): number {
        return this._displayedRecords.length;
    }

    get recordCount(): number {
        return this.records.length;
    }

    update() {
        let filters = this.filterCriteria?.filters || [];

        this._displayedRecords = this.records
            .filter((r: Record) =>
                filters.reduce(
                    (prev, cur) => prev && r.value === cur.value, // TODO: this is not quite right.
                    true
                )
            )
            .map(
                (r: Record): DisplayedRecord => ({
                    id: r.id,
                    entries: this.columns.map((c) => new ValueEntry(c, r))
                })
            );
        /*        this._displayedRecords.sort(
            sortRecords.bind(
                undefined,
                this.filterCriteria?.sortColumn,
                this.filterCriteria?.sortAscending
            )
        );*/ // FIXME
    }

    handleColumnClick(event: MouseEvent) {
        let clickedColId = event.target.dataset.col;
        let clickedColumn = this.columns.filter(
            (c) => c.columnId === clickedColId
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
