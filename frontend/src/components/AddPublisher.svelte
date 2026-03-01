<script>
  import { createEventDispatcher } from 'svelte';
  import { createRecord, getRecordApiUrl } from '../lib/api/index.js';
  import { markInvalid, formatError } from '../lib/forms.js';

  const dispatch = createEventDispatcher();

  let name = '';
  let link = '';
  let error = '';
  let formRef;

  async function create() {
    if (!markInvalid(formRef)) {
      return;
    }

    try {
      const result = await createRecord('publishers', { name });
      if (link) {
        const linkRecord = {
          content_object: getRecordApiUrl('publishers', result.id),
          link,
          source: name,
          resource_type: 'Website'
        };
        await createRecord('links', linkRecord);
      }

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
    <div class="invalid-feedback">The publisher name is required.</div>
    <label for="link">Website</label>
    <input
      class="form-control"
      placeholder="Optional: link to publisher's website"
      type="url"
      bind:value={link}
    />
    <div class="text-danger">{error}</div>
    <button class="btn btn-primary mt-3" type="submit">Create</button>
  </div>
</form>
