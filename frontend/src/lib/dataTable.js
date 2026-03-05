export class FilterCriteria {
  constructor(filters, sortColumn, sortAscending) {
    this.filters = filters;
    this.sortColumn = sortColumn;
    this.sortAscending = sortAscending;
  }

  filters;
  sortColumn;
  sortAscending;
}

export const COLUMN_STRING_TYPE = 'string';
export const COLUMN_HYPERLINK_TYPE = 'link';
export const COLUMN_HYPERLINK_LIST_TYPE = 'link-list';
export const COLUMN_PILL_LIST_TYPE = 'pill-list';
export const COLUMN_YEAR_TYPE = 'year';
