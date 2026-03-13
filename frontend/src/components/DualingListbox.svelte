<script>
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

  async function loadEntities(name) {
    if (!name) {
      return;
    }
    loading = true;
    try {
      const data = await getRecords(name);
      if (data) {
        entities = data.map(normalizeEntity);
        error = '';
      }
    } catch (fetchError) {
      error = formatError(fetchError);
    } finally {
      loading = false;
    }
  }

  $: if (entityName) {
    loadEntities(entityName);
  }
</script>

<small class="muted">
  Browse and filter to find records, then click Select to choose them.&nbsp;
  {#if shouldAllowAdd}
    Click New to add a new record.
  {/if}
</small>
<input
  name="search"
  type="search"
  placeholder="Filter"
  aria-label="Filter"
  bind:value={searchKey}
/>
{#if error}
  <small class="danger">{error}</small>
{/if}
<div class="grid">
  <article>
    <select
      class="entities"
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

    <small class="muted">
      Showing {filteredEntities.length} of {availableEntities.length} available
    </small>
    {#if loading}
      <progress aria-label="Loading"></progress>
    {/if}
    {#if !shouldAllowAdd}
      <button type="button" on:click={moveRight}>
        Select &raquo;
      </button>
    {:else}
      <div role="group">
        <button class="secondary" type="button" on:click={add}>
          New +
        </button>
        <button type="button" on:click={moveRight}>
          Select &raquo;
        </button>
      </div>
    {/if}
  </article>
  <article>
    <select
      class="selectedEntities"
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
    <button type="button" on:click={moveLeft}>
      &laquo; Unselect
    </button>
    <small class="muted">
      Showing {selectedEntities.length} selected
    </small>
  </article>
</div>
