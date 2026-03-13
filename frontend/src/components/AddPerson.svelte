<script>
  import { createEventDispatcher } from 'svelte';
  import { createRecord } from '../lib/api/index.js';
  import { markInvalid, formatError } from '../lib/forms.js';

  const dispatch = createEventDispatcher();

  let firstName = '';
  let middleName = '';
  let lastName = '';
  let description = '';
  let error = '';
  let formRef;

  async function create() {
    if (!markInvalid(formRef)) {
      return;
    }

    const record = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      description
    };

    try {
      const result = await createRecord('persons', record);
      dispatch('save', result.id);
    } catch (err) {
      error = formatError(err);
    }
  }
</script>

<form novalidate bind:this={formRef} on:submit|preventDefault={create}>
  <small class="muted">
    Enter information about this person. The first and last name are required.
  </small>
  <label for="first_name">First Name</label>
  <input
    id="first_name"
    placeholder="First name"
    type="text"
    bind:value={firstName}
    required
  />
  <small class="validation-feedback">Please enter a first name.</small>
  <label for="middle_name">Middle Name</label>
  <input
    id="middle_name"
    placeholder="Middle name"
    type="text"
    bind:value={middleName}
  />
  <label for="last_name">Last Name</label>
  <input
    id="last_name"
    placeholder="Last name"
    type="text"
    bind:value={lastName}
    required
  />
  <small class="validation-feedback">Please enter a last name.</small>
  <label for="description">Description</label>
  <input
    id="description"
    placeholder="Optional: enter a brief description or bio for this person."
    type="text"
    bind:value={description}
  />
  {#if error}
    <small class="danger">{error}</small>
  {/if}
  <button type="submit">Create</button>
</form>
