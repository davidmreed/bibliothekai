<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { getRecord } from '../lib/api/index.js';
  import { formatError } from '../lib/forms.js';
  import DualingListbox from './DualingListbox.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  import SingleFeatureEditor from './SingleFeatureEditor.svelte';
  import Switch from './Switch.svelte';

  export let features;

  const dispatch = createEventDispatcher();

  let textId;
  let selectedText;
  let translationExpanded = true;
  let error = '';
  let wire;
  let hasIntroduction = false;
  let hasNotes = false;
  let hasCommentary = false;

  $: textId = features?.text;
  $: hasSamplePassage = selectedText && !!selectedText.sample_passage;
  $: if (features) {
    hasIntroduction = features.hasIntroduction;
    hasNotes = features.hasNotes;
    hasCommentary = features.hasCommentary;
  }

  function updateWire() {
    if (wire && textId) {
      wire.update({ entityName: 'texts', entityId: textId });
    }
  }

  onMount(() => {
    wire = new getRecord(({ data, error: fetchError }) => {
      if (data) {
        selectedText = data;
      }
      if (fetchError) {
        error = formatError(fetchError);
      }
    });

    updateWire();
    wire.connect();

    return () => {
      if (wire) {
        wire.disconnect();
      }
    };
  });

  $: updateWire();

  function notify() {
    if (!features) {
      return;
    }
    features = features;
    dispatch('features', features);
  }

  function syncFeatureToggle(featureName, enabled) {
    if (!features) {
      return;
    }
    const hasFeature = features.hasFeature(featureName);
    if (enabled === hasFeature) {
      return;
    }
    if (enabled) {
      features.addFeature(featureName, true);
    } else {
      features.removeFeature(featureName);
    }
    notify();
  }

  $: if (features) {
    syncFeatureToggle('Introduction', hasIntroduction);
    syncFeatureToggle('Notes', hasNotes);
    syncFeatureToggle('Commentary', hasCommentary);
  }

  function handleAddPerson() {
    dispatch('addperson', {
      callback: (p) => {
        features.translation.persons = (features.translation.persons || []).concat([
          p
        ]);
        notify();
      }
    });
  }

  function handleSingleFeatureAddPerson(event) {
    dispatch('addperson', event.detail);
  }

  function save() {
    dispatch('save', { features });
  }

  function toggleTranslationExpanded(event) {
    event?.preventDefault?.();
    translationExpanded = !translationExpanded;
  }
</script>

{#if features}
  <div>
    <small
      class="form-text text-muted validity is-invalid form-control mb-2"
      class:d-none={!error}
    >
      {error}
    </small>
    <div class="card mb-2">
      <div class="card-header">
        <h5 class="card-title">Text Selection</h5>
      </div>
      <div class="card-body">
        <PopUpMenu
          entityName="texts"
          allowAdd={false}
          bind:value={features.text}
          on:value={notify}
        />
        <div class="invalid-feedback">{error}</div>
        <div class="row">
          <div class="col">
            <Switch
              label="Has Facing Text"
              bind:value={features.translation.hasFacingText}
              on:value={notify}
            />
          </div>
          <div class="col">
            <Switch
              label="Has Introduction"
              bind:value={hasIntroduction}
            />
          </div>
          <div class="col">
            <Switch
              label="Has Notes"
              bind:value={hasNotes}
            />
          </div>
          <div class="col">
            <Switch
              label="Has Commentary"
              bind:value={hasCommentary}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card mb-2">
    <div class="card-header">
      <h5 class="card-title">
        Translation
        {#if !translationExpanded}
          <button
            class="float-right btn btn-sm btn-outline-primary"
            type="button"
            on:click={toggleTranslationExpanded}
          >
            Edit
          </button>
        {/if}
      </h5>
    </div>
    {#if translationExpanded}
      <div class="card-body">
        <div class="form-group">
          <div class="form-row">
            <div class="col">
              <PopUpMenu
                labelText="Language"
                entityName="languages"
                allowAdd={false}
                bind:value={features.translation.language}
                on:value={notify}
              />
            </div>
            <div class="col">
              <label for="format">Format</label>
              <select
                class="form-control format-picklist"
                size="1"
                bind:value={features.translation.format}
                on:change={notify}
              >
                <option value="Prose">Prose</option>
                <option value="Verse">Verse</option>
              </select>
            </div>
            <div class="col">
              <label for="partial">Coverage</label>
              <select
                class="form-control coverage-picklist"
                size="1"
                bind:value={features.translation.partial}
                on:change={notify}
              >
                <option value={false}>Complete translation</option>
                <option value={true}>Partial translation</option>
              </select>
            </div>
          </div>
          <label for="title">Title</label>
          <input
            class="form-control"
            placeholder="Title, if different from text"
            type="text"
            bind:value={features.translation.title}
            on:input={notify}
          />
          <label for="original-publication-date">Original Publication Date</label>
          <input
            class="form-control"
            placeholder="If this is a republication"
            type="date"
            bind:value={features.translation.originalPublicationDate}
            on:change={notify}
          />
          <hr />
          <label for="description">Description</label>
          <textarea
            class="form-control description-field"
            placeholder="Description"
            type="text"
            bind:value={features.translation.description}
            on:input={notify}
          ></textarea>
          {#if hasSamplePassage}
            <label for="sample">Sample Passage</label>
            <textarea
              class="form-control"
              bind:value={features.translation.samplePassage}
              on:input={notify}
            ></textarea>
            <small class="text-muted">
              The sample passage for {selectedText.title} is
              {selectedText.sample_passage_spec}.
            </small>
          {/if}
          <hr />
          <label for="authors">Translators</label>
          <DualingListbox
            class="persons-listbox"
            entityName="persons"
            allowAdd={true}
            bind:value={features.translation.persons}
            on:value={notify}
            on:add={handleAddPerson}
          />

          <button
            class="btn btn-sm btn-outline-primary btn-block mt-3"
            type="button"
            on:click={toggleTranslationExpanded}
          >
            Done
          </button>
        </div>
      </div>
    {/if}
  </div>
  {#each features.features as f, index (f.feature)}
    {#if !f.isTranslation}
      <SingleFeatureEditor
        bind:feature={features.features[index]}
        hasTranslation={true}
        on:feature={notify}
        on:addperson={handleSingleFeatureAddPerson}
      />
    {/if}
  {/each}
  <hr />
  <button class="btn btn-primary btn-block mb-3" type="button" on:click={save}>
    Done with Translation
  </button>
{/if}
