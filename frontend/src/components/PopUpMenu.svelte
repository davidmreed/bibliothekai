<script>
  import { createEventDispatcher } from 'svelte';
  import { getRecords } from '../lib/api/index.js';
  import { sortRecordsByName } from '../lib/utils.js';
  import { formatError } from '../lib/forms.js';

  export let entityName = '';
  export let allowAdd = false;
  export let labelText = '';
  export let value = '';
  export let invalid = false;

  const dispatch = createEventDispatcher();

  let entities = [];
  let error = '';
  let loading = true;
  let errorInvalid = false;

  $: shouldAllowAdd = typeof allowAdd === 'boolean' ? allowAdd : allowAdd === 'true';
  $: if (value === null || value === undefined) {
    value = '';
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
        entities = [...data].sort(sortRecordsByName);
        error = '';
      }
    } catch (fetchError) {
      error = formatError(fetchError);
      errorInvalid = true;
    } finally {
      loading = false;
    }
  }

  $: if (entityName) {
    loadEntities(entityName);
  }

  $: isInvalid = invalid || errorInvalid;
</script>

{#if labelText}
  <label for="entities">{labelText}</label>
{/if}
<div class="grid">
  <div>
    <select
      class="entities"
      name="entities"
      size="1"
      bind:value={value}
      class:is-invalid={isInvalid}
    >
      {#if entities.length}
        <option value="">-- No selection --</option>
        {#each entities as entity (entity.id)}
          <option value={entity.id}>{entity.name}</option>
        {/each}
      {:else}
        <option disabled>-- No items --</option>
      {/if}
    </select>
    {#if error}
      <small class="danger">{error}</small>
    {/if}
  </div>
  {#if shouldAllowAdd}
    <div>
      <button class="secondary" type="button" on:click={add}>
        Add
      </button>
    </div>
  {/if}
</div>
{#if loading}
  <progress aria-label="Loading"></progress>
{/if}
