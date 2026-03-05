<script>
  import { onMount } from 'svelte';
  import { createRecord, getRecordApiUrl, getRecordUiUrl } from '../lib/api/index.js';
  import { markInvalid, formatError } from '../lib/forms.js';
  import DualingListbox from './DualingListbox.svelte';
  import AddPerson from './AddPerson.svelte';

  let title = '';
  let location = '';
  let source = '';
  let date = '';
  let link = '';
  let addingPerson = false;
  let persons = [];
  let volumes = [];
  let error = '';
  let formRef;

  onMount(() => {
      const regex = /volumes\/([0-9]+)\//;
      const loc = document.location.pathname;
      const volumeIdMatch = loc.match(regex);

      if (volumeIdMatch && volumeIdMatch.length === 2) {
        volumes = [Number(volumeIdMatch[1])];
      } else {
        volumes = [];
      }
  });

  async function create() {
    if (!markInvalid(formRef)) {
      return;
    }

    if (!(persons.length && volumes.length)) {
      error = 'Please add at least one author and volume.';
      return;
    }

    const record = {
      volumes: volumes.map((v) => getRecordApiUrl('volumes', v)),
      persons: persons.map((p) => getRecordApiUrl('persons', p)),
      published_date: date,
      title,
      location: `${source}, ${location}`
    };
    try {
      const result = await createRecord('published-reviews', record);
      if (link) {
        const linkRecord = {
          content_object: getRecordApiUrl('published-reviews', result.id),
          link,
          source,
          resource_type: 'Full Text'
        };
        await createRecord('links', linkRecord);
      }
      window.location.href = getRecordUiUrl('published-reviews', result.id);
    } catch (err) {
      error = formatError(err);
    }
  }

  function toggleAddingPerson() {
    addingPerson = !addingPerson;
  }

  function personAdded(event) {
    toggleAddingPerson();
    persons = [...persons, event.detail];
  }
</script>

{#if !addingPerson}
  <h2>Publication Details</h2>
  <small class="form-text text-muted validity-review">
    Enter details about this review. A date, publication, and volume, issue, or
    pages are required.
  </small>
  <form novalidate bind:this={formRef} on:submit|preventDefault={create}>
    <div class="form-group">
      <label for="title">Title</label>
      <input
        class="form-control"
        placeholder="Title of the review, if any"
        type="text"
        bind:value={title}
      />
      <label for="date">Date</label>
      <input
        class="form-control"
        type="date"
        bind:value={date}
        required
      />
      <div class="invalid-feedback">Please enter a publication date.</div>

      <label for="location">Publication</label>
      <input
        class="form-control"
        placeholder="Where was this review published?"
        type="text"
        bind:value={source}
        required
      />
      <div class="invalid-feedback">Please enter the source of this review.</div>

      <label for="location">Volume, Issue or Pages</label>
      <input
        class="form-control"
        placeholder="What volume or issue?"
        type="text"
        bind:value={location}
        required
      />
      <div class="invalid-feedback">
        Please enter the details of the publication.
      </div>
      <label for="link">Link</label>
      <input
        class="form-control"
        type="url"
        bind:value={link}
        placeholder="Link, if the review is available online"
      />
    </div>
  </form>
  <h2>Authors</h2>
  <small class="text-muted">Select one or more authors of this review.</small>
  <DualingListbox
    class="persons-listbox"
    entityName="persons"
    allowAdd={true}
    bind:value={persons}
    on:add={toggleAddingPerson}
  />

  <h2>Volumes</h2>
  <small class="text-muted">Select one or more volumes evaluated in this review.</small>
  <DualingListbox
    class="volumes-listbox"
    entityName="volumes"
    bind:value={volumes}
  />
  <hr />
  <small class="text-danger form-validity mb-2">{error}</small>
  <button class="btn btn-primary btn-block mb-3" type="button" on:click={create}>
    Create
  </button>
{:else}
  <h4>
    <button
      class="btn btn-outline-secondary mr-3"
      type="button"
      on:click={toggleAddingPerson}
    >
      &lt; Back
    </button>
    Adding New Author
  </h4>
  <AddPerson on:save={personAdded} />
{/if}
