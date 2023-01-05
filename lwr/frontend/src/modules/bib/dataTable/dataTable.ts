import { LightningElement, api } from 'lwc';
import { Crumb } from 'bib/link';

export const COLUMN_STRING_TYPE = 'string';
export const COLUMN_HYPERLINK_TYPE = 'link';
export const COLUMN_HYPERLINK_LIST_TYPE = 'link-list';
export const COLUMN_PILL_LIST_TYPE = 'pill-list';
export const COLUMN_YEAR_TYPE = 'year';

export interface DataTableRecord {
    id: string;
}

interface BaseColumn {
    columnId: string;
    name: string;
}

export interface Pill {
    name: string;
    className: string;
}

export interface StringColumn extends BaseColumn {
    valueType: typeof COLUMN_STRING_TYPE;
    valueGetter: (r: DataTableRecord) => string;
}

export interface HyperlinkColumn extends BaseColumn {
    valueType: typeof COLUMN_HYPERLINK_TYPE;
    valueGetter: (r: DataTableRecord) => Crumb;
}

export interface HyperlinkListColumn extends BaseColumn {
    valueType: typeof COLUMN_HYPERLINK_LIST_TYPE;
    valueGetter: (r: DataTableRecord) => Crumb[];
}

export interface PillListColumn extends BaseColumn {
    valueType: typeof COLUMN_PILL_LIST_TYPE;
    valueGetter: (r: DataTableRecord) => Pill[];
}

export interface YearColumn extends BaseColumn {
    valueType: typeof COLUMN_YEAR_TYPE;
    valueGetter: (r: DataTableRecord) => string;
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
    value: string | Pill[] | Crumb | Crumb[];
    column: Column;
    recordId: string;

    constructor(column: Column, record: DataTableRecord) {
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

export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc'
};

export default class DataTable extends LightningElement {
    @api columns: Column[] = [];
    _records: DataTableRecord[] = [];

    @api records: DataTableRecord[] = [];
    @api sortColumn: string | null = null;
    @api sortDirection: SortDirection = SortDirection.Ascending;
    @api filters: ((r: DataTableRecord) => boolean)[] = [];

    get enrichedColumns() {
        return [...this.columns].map((c) => ({
            ...c,
            isSortedAscending: this.sortColumn === c.columnId && this.sortDirection === SortDirection.Ascending,
            isSortedDescending: this.sortColumn === c.columnId && this.sortDirection !== SortDirection.Ascending
        }));

    }

    get recordsShown(): number {
        return this.displayedRecords.length;
    }

    get recordCount(): number {
        return this.records.length;
    }

    get displayedRecords(): DisplayedRecord[] {
        return this.records
            .filter((r: DataTableRecord) =>
                this.filters.reduce(
                    (prev, cur) => prev && cur(r),
                    true
                )
            )
            .map(
                (r: DataTableRecord): DisplayedRecord => ({
                    id: r.id,
                    entries: this.enrichedColumns.map((c) => new ValueEntry(c, r))
                })
            ).sort(
                (a, b) => {
                    // Make sure that we have a sortColumn set and that it is a sortable column type.
                    if (this.sortColumn) {
                        let columnValueType = this.columns.filter((c) => c.columnId === this.sortColumn)[0].valueType;
                        if (columnValueType === COLUMN_STRING_TYPE || columnValueType === COLUMN_YEAR_TYPE || columnValueType === COLUMN_HYPERLINK_TYPE) {
                            let aValue = a.entries.filter((v) => v.column.columnId === this.sortColumn)[0].value;
                            let bValue = b.entries.filter((v) => v.column.columnId === this.sortColumn)[0].value;
                            let sortModifier = this.sortDirection === SortDirection.Ascending ? 1 : -1;

                            if (columnValueType === COLUMN_HYPERLINK_TYPE) {
                                // TODO: allow consumers to provide sort keys.
                                aValue = (aValue as Crumb).title;
                                bValue = (bValue as Crumb).title;
                            }

                            if (aValue < bValue) {
                                return -1 * sortModifier;
                            } else if (bValue < aValue) {
                                return 1 * sortModifier;
                            }
                        }
                    }
                    return 0;

                }
            );
    }

    handleColumnClick(event: MouseEvent) {
        let eventTarget = event.currentTarget;
        if (eventTarget && eventTarget instanceof HTMLElement) {
            let clickedColId = eventTarget.dataset.col;
            let clickedColumn = this.columns.filter(
                (c) => c.columnId === clickedColId
            )[0];

            if (
                clickedColumn.valueType === COLUMN_STRING_TYPE ||
                clickedColumn.valueType === COLUMN_HYPERLINK_TYPE ||
                clickedColumn.valueType === COLUMN_YEAR_TYPE
            ) {
                let sortState = {
                    sortColumn: clickedColId,
                    sortDirection:
                        this.sortColumn === clickedColId
                            ? (this.sortDirection === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending)
                            : SortDirection.Ascending
                };

                this.dispatchEvent(
                    new CustomEvent('sort', {
                        detail: sortState
                    })
                );
            }
        }
    }
}