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
  <small class="form-text text-muted">
    Enter information about this person. The first and last name are required.
  </small>
  <div class="form-group">
    <label for="first_name">First Name</label>
    <input
      class="form-control"
      placeholder="First name"
      type="text"
      bind:value={firstName}
      required
    />
    <div class="invalid-feedback">Please enter a first name.</div>
    <label for="middle_name">Middle Name</label>
    <input
      class="form-control"
      placeholder="Middle name"
      type="text"
      bind:value={middleName}
    />
    <label for="last_name">Last Name</label>
    <input
      class="form-control"
      placeholder="Last name"
      type="text"
      bind:value={lastName}
      required
    />
    <div class="invalid-feedback">Please enter a last name.</div>
    <label for="description">Description</label>
    <input
      class="form-control"
      placeholder="Optional: enter a brief description or bio for this person."
      type="text"
      bind:value={description}
    />
    <div class="text-danger">{error}</div>
    <button class="btn btn-primary mt-3" type="submit">Create</button>
  </div>
</form>
