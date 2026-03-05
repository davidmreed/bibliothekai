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
  <div class="form-group">
    <label for="name">Name</label>
    <input
      class="form-control"
      placeholder="Name"
      type="text"
      bind:value={name}
      required
    />
    <div class="invalid-feedback">The series name is required.</div>
    <div class="text-danger">{error}</div>
    <button class="btn btn-primary mt-3" type="submit">Create</button>
  </div>
</form>
