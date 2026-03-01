<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { getRecords } from '../lib/api/index.js';
  import { sortRecordsByName } from '../lib/utils.js';
  import { formatError } from '../lib/forms.js';

  export let entityName = '';
  export let allowAdd = false;
  export let labelText = '';
  export let value = '';
  export let dataName = null;
  export let invalid = false;

  const dispatch = createEventDispatcher();

  let entities = [];
  let error = '';
  let loading = true;
  let selectedValue = '';
  let wire;
  let errorInvalid = false;

  $: shouldAllowAdd = typeof allowAdd === 'boolean' ? allowAdd : allowAdd === 'true';
  $: selectedValue = value === null || value === undefined ? '' : value;

  function handleChange(event) {
    const option = event.target.selectedOptions?.[0];
    const optionValue =
      option && Object.prototype.hasOwnProperty.call(option, '__value')
        ? option.__value
        : event.target.value;
    value = optionValue === '' ? '' : optionValue;
    dispatch('change', { value, dataName });
    dispatch('value', value);
  }

  function add() {
    dispatch('add');
  }

  onMount(() => {
    wire = new getRecords(({ data, error: fetchError }) => {
      if (data) {
        entities = [...data].sort(sortRecordsByName);
        error = '';
      }
      if (fetchError) {
        error = formatError(fetchError);
        errorInvalid = true;
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

  $: isInvalid = invalid || errorInvalid;
</script>

{#if labelText}
  <label for="entities">{labelText}</label>
{/if}
<div class="form-row">
  <div class="col">
    <select
      class="entities form-control"
      name="entities"
      size="1"
      bind:value={selectedValue}
      class:is-invalid={isInvalid}
      on:change={handleChange}
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
    <div class="invalid-feedback">{error}</div>
  </div>
  <div class="spinner-grow spinner-grow-sm mt-2" role="status" class:d-none={!loading}>
    <span class="sr-only">Loading...</span>
  </div>
  {#if shouldAllowAdd}
    <div class="col-2">
      <button
        class="form-control btn btn-sm btn-outline-secondary"
        type="button"
        on:click={add}
      >
        Add
      </button>
    </div>
  {/if}
</div>
