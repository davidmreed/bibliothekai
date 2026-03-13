<script>
  import { createEventDispatcher } from 'svelte';
  import { getRecord } from '../lib/api/index.js';
  import {
    addFeature,
    getFeature,
    hasFeature,
    removeFeature,
    replaceFeature
  } from '../lib/feature.js';
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
  let hasIntroduction = false;
  let hasNotes = false;
  let hasCommentary = false;
  let translationFeature;
  let lastFeaturesRef;
  let selectedTextId = '';
  let hasFacingText = false;
  let translationLanguage = '';
  let translationFormat = 'Prose';
  let translationPartial = false;
  let translationTitle = '';
  let translationOriginalPublicationDate = '';
  let translationDescription = '';
  let translationSamplePassage = '';
  let translationPersons = [];

  $: textId = selectedTextId;
  $: hasSamplePassage = selectedText && !!selectedText.sample_passage;
  $: translationFeature = features ? getFeature(features, 'Translation') : null;

  async function loadSelectedText(id) {
    if (!id) {
      return;
    }
    try {
      const data = await getRecord('texts', id);
      if (data) {
        selectedText = data;
      }
    } catch (fetchError) {
      error = formatError(fetchError);
    }
  }

  $: if (textId) {
    loadSelectedText(textId);
  }

  const arraysEqual = (left, right) => {
    if (left === right) {
      return true;
    }
    if (!left || !right || left.length !== right.length) {
      return false;
    }
    return left.every((val, idx) => val === right[idx]);
  };

  function updateFeatures(next) {
    if (!next) {
      return;
    }
    features = next;
    dispatch('features', features);
  }

  function toggleFeatureInSet(current, featureName, enabled) {
    const exists = hasFeature(current, featureName);
    if (enabled === exists) {
      return current;
    }
    return enabled
      ? addFeature(current, featureName, true)
      : removeFeature(current, featureName);
  }

  $: if (features && features !== lastFeaturesRef) {
    lastFeaturesRef = features;
    selectedTextId = features.text || '';
    if (translationFeature) {
      hasFacingText = !!translationFeature.hasFacingText;
      translationLanguage = translationFeature.language ?? '';
      translationFormat = translationFeature.format ?? 'Prose';
      translationPartial = !!translationFeature.partial;
      translationTitle = translationFeature.title ?? '';
      translationOriginalPublicationDate =
        translationFeature.originalPublicationDate ?? '';
      translationDescription = translationFeature.description ?? '';
      translationSamplePassage = translationFeature.samplePassage ?? '';
      translationPersons = Array.isArray(translationFeature.persons)
        ? translationFeature.persons
        : [];
    }
    hasIntroduction = hasFeature(features, 'Introduction');
    hasNotes = hasFeature(features, 'Notes');
    hasCommentary = hasFeature(features, 'Commentary');
  }

  $: if (features) {
    let next = features;

    if (selectedTextId !== (features.text || '')) {
      next = { ...next, text: selectedTextId || '' };
    }
    if (translationFeature) {
      const patch = {};
      if (hasFacingText !== !!translationFeature.hasFacingText) {
        patch.hasFacingText = hasFacingText;
      }
      if (translationLanguage !== (translationFeature.language ?? '')) {
        patch.language = translationLanguage;
      }
      if (translationFormat !== (translationFeature.format ?? 'Prose')) {
        patch.format = translationFormat;
      }
      if (translationPartial !== !!translationFeature.partial) {
        patch.partial = translationPartial;
      }
      if (translationTitle !== (translationFeature.title ?? '')) {
        patch.title = translationTitle;
      }
      if (
        translationOriginalPublicationDate !==
        (translationFeature.originalPublicationDate ?? '')
      ) {
        patch.originalPublicationDate = translationOriginalPublicationDate || null;
      }
      if (translationDescription !== (translationFeature.description ?? '')) {
        patch.description = translationDescription;
      }
      if (translationSamplePassage !== (translationFeature.samplePassage ?? '')) {
        patch.samplePassage = translationSamplePassage;
      }
      if (!arraysEqual(translationPersons, translationFeature.persons || [])) {
        patch.persons = translationPersons;
      }
      if (Object.keys(patch).length) {
        next = replaceFeature(next, { ...translationFeature, ...patch });
      }
    }

    next = toggleFeatureInSet(next, 'Introduction', hasIntroduction);
    next = toggleFeatureInSet(next, 'Notes', hasNotes);
    next = toggleFeatureInSet(next, 'Commentary', hasCommentary);

    if (next !== features) {
      updateFeatures(next);
    }
  }

  function handleAddPerson() {
    if (!translationFeature) {
      return;
    }
    dispatch('addperson', {
      callback: (p) => {
        translationPersons = [...translationPersons, p];
      }
    });
  }

  function handleSingleFeatureAddPerson(event) {
    dispatch('addperson', event.detail);
  }

  function handleSingleFeatureChange(event) {
    if (!features) {
      return;
    }
    updateFeatures(replaceFeature(features, event.detail));
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
    {#if error}
      <small class="danger">{error}</small>
    {/if}
    <article>
      <header>
        <h5>Text Selection</h5>
      </header>
      <PopUpMenu
        entityName="texts"
        allowAdd={false}
        bind:value={selectedTextId}
      />
      <div class="grid">
        <div>
          {#if translationFeature}
            <Switch
              label="Has Facing Text"
              bind:value={hasFacingText}
            />
          {/if}
        </div>
        <div>
          <Switch
            label="Has Introduction"
            bind:value={hasIntroduction}
          />
        </div>
        <div>
          <Switch
            label="Has Notes"
            bind:value={hasNotes}
          />
        </div>
        <div>
          <Switch
            label="Has Commentary"
            bind:value={hasCommentary}
          />
        </div>
      </div>
    </article>
  </div>
  <article>
    <header>
      <h5>
        Translation
        {#if !translationExpanded}
          <button
            class="secondary"
            style="float: right;"
            type="button"
            on:click={toggleTranslationExpanded}
          >
            Edit
          </button>
        {/if}
      </h5>
    </header>
    {#if translationExpanded && translationFeature}
      <div>
        <div class="grid">
          <div>
            <PopUpMenu
              labelText="Language"
              entityName="languages"
              allowAdd={false}
              bind:value={translationLanguage}
            />
          </div>
          <div>
            <label for="format">Format</label>
            <select
              class="format-picklist"
              size="1"
              bind:value={translationFormat}
            >
              <option value="Prose">Prose</option>
              <option value="Verse">Verse</option>
            </select>
          </div>
          <div>
            <label for="partial">Coverage</label>
            <select
              class="coverage-picklist"
              size="1"
              bind:value={translationPartial}
            >
              <option value={false}>Complete translation</option>
              <option value={true}>Partial translation</option>
            </select>
          </div>
        </div>
        <label for="title">Title</label>
        <input
          placeholder="Title, if different from text"
          type="text"
          bind:value={translationTitle}
        />
        <label for="original-publication-date">Original Publication Date</label>
        <input
          placeholder="If this is a republication"
          type="date"
          bind:value={translationOriginalPublicationDate}
        />
        <hr />
        <label for="description">Description</label>
        <textarea
          class="description-field"
          placeholder="Description"
          type="text"
          bind:value={translationDescription}
        ></textarea>
        {#if hasSamplePassage}
          <label for="sample">Sample Passage</label>
          <textarea
            bind:value={translationSamplePassage}
          ></textarea>
          <small class="muted">
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
          bind:value={translationPersons}
          on:add={handleAddPerson}
        />

        <button
          class="secondary"
          style="width: 100%;"
          type="button"
          on:click={toggleTranslationExpanded}
        >
          Done
        </button>
      </div>
    {/if}
  </article>
  {#each features.features as f (f.feature)}
    {#if f.feature !== 'Translation'}
      <SingleFeatureEditor
        feature={f}
        hasTranslation={true}
        on:feature={handleSingleFeatureChange}
        on:addperson={handleSingleFeatureAddPerson}
      />
    {/if}
  {/each}
  <hr />
  <button style="width: 100%;" type="button" on:click={save}>
    Done with Translation
  </button>
{/if}
