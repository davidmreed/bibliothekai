<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { getRecords } from '../lib/api/index.js';
  import { sortRecordsByName } from '../lib/utils.js';
  import { formatError } from '../lib/forms.js';

  export let entityName = '';
  export let allowAdd = false;
  export let value = [];

  const dispatch = createEventDispatcher();

  let entities = [];
  let availableEntities = [];
  let selectedEntities = [];
  let filteredEntities = [];
  let searchKey = '';
  let error = '';
  let loading = true;
  let wire;
  let availableSelect;
  let selectedSelect;

  $: shouldAllowAdd = typeof allowAdd === 'boolean' ? allowAdd : allowAdd === 'true';
  $: normalizedValue = Array.isArray(value) ? value : value ? [value] : [];
  const getEntityLabel = (entity) =>
    entity?.name ||
    entity?.sort_name ||
    entity?.full_name ||
    entity?.display_name ||
    entity?.title ||
    '';
  const normalizeEntity = (entity) => ({
    ...entity,
    name: getEntityLabel(entity)
  });

  $: {
    if (!entities.length) {
      availableEntities = [];
      selectedEntities = [];
      filteredEntities = [];
    } else {
      availableEntities = entities.filter((f) => !normalizedValue.includes(f.id));
      selectedEntities = entities.filter((f) => normalizedValue.includes(f.id));

      if (searchKey) {
        const splitSearchKey = searchKey.toLowerCase().split(/\W+/);

        filteredEntities = availableEntities.filter((f) => {
          const name = f.name || '';
          return splitSearchKey
            .map((s) => name.toLowerCase().includes(s))
            .reduce((prev, cur) => prev && cur, true);
        });
      } else {
        filteredEntities = availableEntities;
      }

      filteredEntities = [...filteredEntities].sort(sortRecordsByName);
      selectedEntities = [...selectedEntities].sort(sortRecordsByName);
    }
  }

  function moveRight() {
    if (!availableSelect) {
      return;
    }
    const selected = Array.from(availableSelect.selectedOptions).map((f) =>
      Number(f.value)
    );
    value = [...new Set([...normalizedValue, ...selected])];
  }

  function moveLeft() {
    if (!selectedSelect) {
      return;
    }
    const itemsUnselect = Array.from(selectedSelect.selectedOptions).map((f) =>
      Number(f.value)
    );
    value = normalizedValue.filter((f) => !itemsUnselect.includes(f));
  }

  function add() {
    dispatch('add');
  }

  onMount(() => {
    wire = new getRecords(({ data, error: fetchError }) => {
      if (data) {
        entities = data.map(normalizeEntity);
        error = '';
      } else if (fetchError) {
        error = formatError(fetchError);
      }
      loading = false;
    });

    wire.update({ entityName });
    wire.connect();

    return () => {
      if (wire) {
        wire.disconnect();
      }
    };
  });

  $: if (wire) {
    wire.update({ entityName });
  }
</script>

<small class="text-muted">
  <br />
  Browse and filter to find records, then click Select to choose them.&nbsp;
  {#if shouldAllowAdd}
    Click New to add a new record.
  {/if}
</small>
<input
  class="form-control mb-2"
  name="search"
  type="search"
  placeholder="Filter"
  aria-label="Filter"
  bind:value={searchKey}
/>
<small
  class="form-text text-muted validity is-invalid form-control mb-2"
  class:d-none={!error}
>
  {error}
</small>
<div class="card-group">
  <div class="card">
    <div class="card-body form-group">
      <select
        class="entities form-control"
        name="entities"
        size="4"
        multiple
        bind:this={availableSelect}
        on:dblclick={moveRight}
      >
        {#if filteredEntities.length}
          {#each filteredEntities as entity (entity.id)}
            <option value={entity.id}>{getEntityLabel(entity)}</option>
          {/each}
        {:else}
          <option disabled>-- No items --</option>
        {/if}
      </select>
      <br />

      <small class="text-muted float-left">
        Showing {filteredEntities.length} of {availableEntities.length} available
      </small>
      <div
        class="spinner-grow spinner-grow-sm ml-1"
        role="status"
        class:d-none={!loading}
      >
        <span class="sr-only">Loading...</span>
      </div>
      <div class="float-right">
        {#if !shouldAllowAdd}
          <button class="btn btn-primary btn-sm" type="button" on:click={moveRight}>
            Select &raquo;
          </button>
        {:else}
          <div class="btn-group">
            <button
              class="btn btn-secondary btn-sm"
              type="button"
              on:click={add}
            >
              New +
            </button>
            <button
              class="btn btn-primary btn-sm"
              type="button"
              on:click={moveRight}
            >
              Select &raquo;
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-body form-group">
      <select
        class="selectedEntities form-control"
        name="selectedEntities"
        size="4"
        multiple
        bind:this={selectedSelect}
        on:dblclick={moveLeft}
      >
        {#if selectedEntities.length}
          {#each selectedEntities as entity (entity.id)}
            <option value={entity.id}>{getEntityLabel(entity)}</option>
          {/each}
        {:else}
          <option disabled>-- No items --</option>
        {/if}
      </select>
      <br />
      <button class="btn btn-primary btn-sm" type="button" on:click={moveLeft}>
        &laquo; Unselect
      </button>
      <small class="text-muted float-right">
        Showing {selectedEntities.length} selected
      </small>
    </div>
  </div>
</div>
