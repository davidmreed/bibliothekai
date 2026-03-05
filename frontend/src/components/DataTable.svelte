<script>
  import { createEventDispatcher } from 'svelte';
  import { getRecordUiUrl } from '../lib/api/index.js';
  import { getNestedProperty, sortRecordsByProperty } from '../lib/utils.js';
  import {
    COLUMN_STRING_TYPE,
    COLUMN_HYPERLINK_TYPE,
    COLUMN_HYPERLINK_LIST_TYPE,
    COLUMN_PILL_LIST_TYPE,
    COLUMN_YEAR_TYPE
  } from '../lib/dataTable.js';
  import CommaLinkList from './CommaLinkList.svelte';

  export let columns = [];
  export let records = [];
  export let filterCriteria = null;
  export let allowsSelection = false;
  export let selectedIds = [];

  const dispatch = createEventDispatcher();

  function makeRecordValueEntry(c, record) {
    let value;
    let href;

    switch (c.valueType) {
      case COLUMN_HYPERLINK_LIST_TYPE:
        value = (getNestedProperty(record, c.id) || []).map((e) => ({
          id: getNestedProperty(e, c.targetEntityId),
          href: getRecordUiUrl(
            c.targetEntity,
            getNestedProperty(e, c.targetEntityId)
          ),
          name: getNestedProperty(e, c.targetEntityName)
        }));
        break;
      case COLUMN_PILL_LIST_TYPE:
        value = (getNestedProperty(record, c.id) || []).map((i) => ({
          id: i,
          value: i,
          pillClass: `badge badge-pill badge-${c.pills[i]} mr-1 mb-1`
        }));
        break;
      case COLUMN_YEAR_TYPE:
        value = (getNestedProperty(record, c.id) || '').substring(0, 4);
        break;
      case COLUMN_HYPERLINK_TYPE:
        href = getRecordUiUrl(
          c.targetEntity,
          getNestedProperty(record, c.targetEntityId)
        );
      // fall through
      default:
        value = getNestedProperty(record, c.id);
        break;
    }

    return {
      key: c.id,
      value,
      href,
      isStringType: c.valueType === COLUMN_STRING_TYPE,
      isYearType: c.valueType === COLUMN_YEAR_TYPE,
      isHyperlinkType: c.valueType === COLUMN_HYPERLINK_TYPE,
      isHyperlinkListType: c.valueType === COLUMN_HYPERLINK_LIST_TYPE,
      isPillListType: c.valueType === COLUMN_PILL_LIST_TYPE
    };
  }

  $: normalizedColumns = columns.map((c) => ({
    ...c,
    isSortedAscending:
      filterCriteria &&
      filterCriteria.sortColumn === c.id &&
      filterCriteria.sortAscending,
    isSortedDescending:
      filterCriteria &&
      filterCriteria.sortColumn === c.id &&
      !filterCriteria.sortAscending
  }));

  $: normalizedRecords = (records || []).map((r) => ({
    record: r,
    values: normalizedColumns.map((c) => makeRecordValueEntry(c, r)),
    selected: (selectedIds || []).includes(r.id)
  }));

  $: displayedRecords = (() => {
    let next = normalizedRecords;

    if (filterCriteria?.filters?.length) {
      next = next.filter((f) =>
        filterCriteria.filters.reduce(
          (prev, cur) =>
            prev && getNestedProperty(f.record, cur.column) === cur.value,
          true
        )
      );
    }

    if (filterCriteria?.sortColumn) {
      next = [...next].sort((a, b) =>
        sortRecordsByProperty(
          filterCriteria.sortColumn,
          filterCriteria.sortAscending,
          a.record,
          b.record
        )
      );
    }

    return next;
  })();

  $: recordsShown = displayedRecords.length;
  $: recordCount = normalizedRecords.length;

  function handleColumnClick(event) {
    const clickedColId = event.currentTarget.dataset.col;
    const clickedColumn = normalizedColumns.find((c) => c.id === clickedColId);

    if (
      clickedColumn?.valueType === COLUMN_STRING_TYPE ||
      clickedColumn?.valueType === COLUMN_HYPERLINK_TYPE ||
      clickedColumn?.valueType === COLUMN_YEAR_TYPE
    ) {
      dispatch('sort', {
        sortColumn: clickedColId,
        sortAscending:
          filterCriteria?.sortColumn === clickedColId
            ? !filterCriteria.sortAscending
            : true
      });
    }
  }
</script>

<table class="table table-striped">
  <thead>
    <tr>
      {#if allowsSelection}
        <th scope="col"></th>
      {/if}
      {#each normalizedColumns as col (col.id)}
        <th scope="col" data-col={col.id} on:click={handleColumnClick}>
          {col.name}
          {#if col.isSortedAscending}
            <small class="ml-1">&#9650;</small>
          {/if}
          {#if col.isSortedDescending}
            <small class="ml-1">&#9660;</small>
          {/if}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each displayedRecords as rec (rec.record.id)}
      <tr>
        {#if allowsSelection}
          <td>
            <input
              type="checkbox"
              bind:group={selectedIds}
              value={rec.record.id}
            />
          </td>
        {/if}
        {#each rec.values as entry (entry.key)}
          <td>
            {#if entry.isStringType}
              {entry.value}
            {/if}
            {#if entry.isHyperlinkType}
              <a href={entry.href}>{entry.value}</a>
            {/if}
            {#if entry.isHyperlinkListType}
              <CommaLinkList values={entry.value} />
            {/if}
            {#if entry.isYearType}
              {entry.value}
            {/if}
            {#if entry.isPillListType}
              {#each entry.value as pill (pill.id)}
                <span class={pill.pillClass}>{pill.value}</span>
              {/each}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<hr />
<small class="text-muted">Showing {recordsShown} of {recordCount}.</small>
