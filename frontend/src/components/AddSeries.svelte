<script>
  import { createEventDispatcher } from 'svelte';
  import { createRecord } from '../lib/api/index.js';
  import { markInvalid, formatError } from '../lib/forms.js';

  const dispatch = createEventDispatcher();

  let name = '';
  let error = '';
  let formRef;

  async function create() {
    if (!markInvalid(formRef)) {
      return;
    }

    try {
      const result = await createRecord('series', { name });
      dispatch('save', result.id);
    } catch (err) {
      error = formatError(err);
    }
  }
</script>

<form novalidate bind:this={formRef} on:submit|preventDefault={create}>
  <label for="name">Name</label>
  <input
    id="name"
    placeholder="Name"
    type="text"
    bind:value={name}
    required
  />
  <small class="validation-feedback">The series name is required.</small>
  {#if error}
    <small class="danger">{error}</small>
  {/if}
  <button type="submit">Create</button>
</form>
