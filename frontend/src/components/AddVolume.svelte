<script>
  import { onMount } from 'svelte';
  import {
    createRecord,
    getRecordUiUrl,
    getRecordApiUrl,
    getRecordsFromApi
  } from '../lib/api/index.js';
  import {
    addFeature,
    createFeatures,
    getFeaturesPayload,
    hasFeature,
    isFeaturesValid,
    removeFeature,
    replaceFeature
  } from '../lib/feature.js';
  import { markInvalid, formatError } from '../lib/forms.js';
  import AddPerson from './AddPerson.svelte';
  import AddPublisher from './AddPublisher.svelte';
  import AddSeries from './AddSeries.svelte';
  import FeatureDisplay from './FeatureDisplay.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  import SingleFeatureEditor from './SingleFeatureEditor.svelte';
  import Switch from './Switch.svelte';
  import TranslationEditor from './TranslationEditor.svelte';

  let volumeDraft = {
    title: '',
    published_date: '',
    publisher: '',
    series: '',
    isbn: '',
    oclc_number: '',
    description: '',
    link: '',
    feature_glossary: false,
    feature_index: false,
    feature_bibliography: false,
    feature_maps: false
  };
  let primaryLanguage = '';

  let addingPerson = false;
  let addingPublisher = false;
  let addingSeries = false;
  let editingFeature = false;
  let detailsExpanded = true;

  let features = [];
  let generalFeatures = createFeatures(-1);
  let featureToEdit;
  let volumeHasIntroduction = false;
  let volumeHasNotes = false;
  let volumeHasEdited = false;

  let error = '';
  let creating = false;
  let detailsForm;
  let publisherInvalid = false;
  let addPersonContext = null;

  $: showingModal =
    addingPerson || addingPublisher || addingSeries || editingFeature;
  $: showingTranslationModal = editingFeature && !addingPerson;
  $: hasTranslation = features.length > 0;

  onMount(async () => {
    await getRecordsFromApi('persons');
    await getRecordsFromApi('texts');
  });

  function toggleGeneralFeature(current, featureName, enabled) {
    const exists = hasFeature(current, featureName);
    if (enabled === exists) {
      return current;
    }
    return enabled
      ? addFeature(current, featureName, true)
      : removeFeature(current, featureName);
  }

  function handleFeatureRemove(event) {
    const id = event.detail;
    features = features.filter((f) => f.id !== id);
  }

  function handleTranslationChange(event) {
    const nextFeature = event.detail;
    if (!nextFeature) {
      return;
    }

    features = features.map((f) =>
      f.id === nextFeature.id ? nextFeature : f
    );
    featureToEdit = nextFeature;
  }

  $: if (volumeDraft.publisher) {
    publisherInvalid = false;
  }

  $: if (generalFeatures) {
    let next = generalFeatures;
    const desiredLanguage = primaryLanguage || '';
    if ((generalFeatures.defaultLanguage ?? '') !== desiredLanguage) {
      next = { ...next, defaultLanguage: desiredLanguage };
    }
    next = toggleGeneralFeature(next, 'Introduction', volumeHasIntroduction);
    next = toggleGeneralFeature(next, 'Notes', volumeHasNotes);
    next = toggleGeneralFeature(next, 'Edited', volumeHasEdited);

    if (next !== generalFeatures) {
      generalFeatures = next;
    }
  }

  async function create(event) {
    event.preventDefault();

    if (!checkValidity()) {
      return;
    }

    creating = true;
    error = '';

    const record = {
      title: volumeDraft.title,
      published_date: volumeDraft.published_date,
      publisher: getRecordApiUrl('publishers', volumeDraft.publisher),
      feature_bibliography: volumeDraft.feature_bibliography,
      feature_index: volumeDraft.feature_index,
      feature_maps: volumeDraft.feature_maps,
      feature_glossary: volumeDraft.feature_glossary
    };
    if (volumeDraft.series) {
      record.series = getRecordApiUrl('series', volumeDraft.series);
    }
    const extraProps = {
      isbn: volumeDraft.isbn,
      oclc_number: volumeDraft.oclc_number,
      description: volumeDraft.description
    };
    for (const [prop, val] of Object.entries(extraProps)) {
      if (val) {
        record[prop] = val;
      }
    }

    try {
      const result = await createRecord('volumes', record);

      if (volumeDraft.link) {
        const linkRecord = {
          content_object: getRecordApiUrl('volumes', result.id),
          link: volumeDraft.link,
          source: 'Publisher',
          resource_type: 'Website'
        };
        await createRecord('links', linkRecord);
      }

      await Promise.all(
        features
          .concat([generalFeatures])
          .map((f) => getFeaturesPayload(f, result.id))
          .reduce((acc, val) => acc.concat(val), [])
          .map((f) => createRecord('features', f))
      );
      window.location.href = getRecordUiUrl('volumes', result.id);
    } catch (err) {
      error = formatError(err);
      creating = false;
    }
  }

  function addTranslation() {
    let newFeature = createFeatures(features.length + 1);
    if (primaryLanguage) {
      newFeature = { ...newFeature, defaultLanguage: primaryLanguage };
    }
    newFeature = addFeature(newFeature, 'Translation', true);

    features = [...features, newFeature];
    featureToEdit = newFeature;
    editingFeature = true;
  }

  function handleFeatureEdit(event) {
    featureToEdit = features.find((f) => f.id === event.detail);
    toggleEditingFeature();
  }

  function toggleEditingFeature() {
    editingFeature = !editingFeature;
    error = '';
  }

  function toggleAddingPerson() {
    addingPerson = !addingPerson;
  }

  function doAddPerson(event) {
    addingPerson = true;
    addPersonContext = event.detail.callback;
  }

  function savePerson(event) {
    addingPerson = false;

    if (addPersonContext) {
      addPersonContext(event.detail);
      addPersonContext = null;
    }
  }

  function toggleAddingPublisher() {
    addingPublisher = !addingPublisher;
  }

  function toggleAddingSeries() {
    addingSeries = !addingSeries;
  }

  function publisherAdded(event) {
    volumeDraft = { ...volumeDraft, publisher: event.detail };
    publisherInvalid = false;
    addingPublisher = false;
  }

  function seriesAdded(event) {
    volumeDraft = { ...volumeDraft, series: event.detail };
    addingSeries = false;
  }

  function toggleDetails(event) {
    event.preventDefault();

    if (detailsValid()) {
      detailsExpanded = !detailsExpanded;
    }
  }

  function detailsValid() {
    if (detailsExpanded) {
      let status = markInvalid(detailsForm);

      if (!volumeDraft.publisher) {
        status = false;
        publisherInvalid = true;
      }

      return status;
    }

    return true;
  }

  function checkValidity() {
    const totalValid =
      detailsValid() &&
      isFeaturesValid(generalFeatures) &&
      features
        .map((f) => isFeaturesValid(f) && !!f.text)
        .reduce((prev, cur) => prev && cur, true);

    if (!totalValid) {
      error =
        'One or more elements of the volume contain errors. Please edit the volume and try again.';
      return false;
    }

    if (!features.length) {
      error = 'Add one or more translations to this volume and try again.';
      return false;
    }

    return true;
  }
</script>

{#if !showingModal}
  <div>
    <h2>
      Publication Details
      {#if !detailsExpanded}
        <button
          class="float-right btn btn-outline-primary"
          type="button"
          on:click={toggleDetails}
        >
          Edit
        </button>
      {/if}
    </h2>
    {#if detailsExpanded}
      <small class="form-text text-muted mb-2">
        Enter details about this volume. A title, published date, and publisher
        are required.
      </small>

      <div class="details">
        <form
          class="needs-validation"
          novalidate
          bind:this={detailsForm}
          on:submit|preventDefault={toggleDetails}
        >
          <div class="form-group">
            <div class="form-row">
              <div class="col-6">
                <label for="title">Title</label>
                <input
                  id="title"
                  class="form-control"
                  placeholder="Title"
                  type="text"
                  bind:value={volumeDraft.title}
                  required
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
              <div class="col">
                <PopUpMenu
                  labelText="Primary Language"
                  entityName="languages"
                  allowAdd={false}
                  bind:value={primaryLanguage}
                />
                <small class="text-muted">
                  Language of the majority of this volume. Translations default
                  to this language.
                </small>
              </div>
            </div>
            <div class="form-row">
              <div class="col">
                <PopUpMenu
                  labelText="Publisher"
                  entityName="publishers"
                  allowAdd={true}
                  bind:value={volumeDraft.publisher}
                  invalid={publisherInvalid}
                  on:add={toggleAddingPublisher}
                />
                <div class="invalid-feedback">
                  Please select or create a publisher.
                </div>
              </div>
              <div class="col">
                <PopUpMenu
                  labelText="Series"
                  entityName="series"
                  allowAdd={true}
                  bind:value={volumeDraft.series}
                  on:add={toggleAddingSeries}
                />
              </div>
            </div>
            <div class="form-row">
              <div class="col">
                <label for="date">Publication Date</label>
                <input
                  id="date"
                  class="form-control"
                  type="date"
                  bind:value={volumeDraft.published_date}
                  required
                />
                <small class="text-muted">If only a year is present, use January 1.</small>
                <div class="invalid-feedback">Please enter a publication date.</div>
              </div>
              <div class="col">
                <label for="isbn">ISBN</label>
                <input
                  id="isbn"
                  class="form-control"
                  placeholder="Optional: ISBN, if present"
                  type="text"
                  bind:value={volumeDraft.isbn}
                />
              </div>
            </div>
            <label for="description">Description</label>
            <textarea
              id="description"
              class="form-control"
              placeholder="Optional: describe unique features of this volume, such as maps, indices, and other supporting material. Record translations, introductions, and notes below."
              type="text"
              bind:value={volumeDraft.description}
            ></textarea>
            <label for="link">Website</label>
            <input
              id="link"
              class="form-control"
              placeholder="Optional: link to book on publisher's website"
              type="url"
              bind:value={volumeDraft.link}
            />
          </div>
          <button
            type="submit"
            class="btn btn-outline-primary btn-block mb-3"
            on:click={toggleDetails}
          >
            Done with Details
          </button>
        </form>
      </div>
    {/if}

    <h2>Contents</h2>
    <small class="text-muted">
      Bibliothekai tracks each translated text in a volume separately, including
      any introduction or notes to the text. You can also record overall
      introductions and notes that apply to the whole volume as general features
      below.
    </small>
    <h3 class="mt-3">
      Translations
      <div class="float-right">
        <button class="btn btn-outline-primary" type="button" on:click={addTranslation}>
          Add
        </button>
      </div>
    </h3>
    <small class="form-text text-muted mb-1">
      Add translations to this volume. At least one translation is required.
    </small>

    <div class="translations">
      {#each features as item (item.id)}
        <div class="mb-2">
          <FeatureDisplay
            class="feature-display"
            feature={item}
            on:edit={handleFeatureEdit}
            on:remove={handleFeatureRemove}
          />
        </div>
      {/each}
    </div>
    <h3 class="mt-3">Resources</h3>
    <small class="form-text text-muted mb-2">
      Add features of the volume as a whole, like general introductions and
      notes that aren't associated with a specific translation. Introductions to
      specific texts should be part of the translation.
    </small>
    <div class="volume-feature-switches">
      <div class="card mb-2">
        <div class="card-header">
          <h5 class="card-title">Volume Resources</h5>
        </div>
        <div class="card-body">
          <form novalidate>
            <div class="form-row">
              <div class="form-group col-md-6">
                <small class="text-muted mb-2">
                  Select authored resources offered in this volume.
                </small>
                <Switch
                  label="General Introduction"
                  bind:value={volumeHasIntroduction}
                />
                <Switch
                  label="General Notes"
                  bind:value={volumeHasNotes}
                />
                <Switch
                  label="Editors"
                  bind:value={volumeHasEdited}
                />
              </div>
              <div class="form-group col-md-6">
                <small class="text-muted mb-2">
                  Select additional resources offered in this volume.
                </small>
                <Switch
                  label="Bibliography"
                  bind:value={volumeDraft.feature_bibliography}
                />
                <Switch
                  label="Maps"
                  bind:value={volumeDraft.feature_maps}
                />
                <Switch
                  label="Glossary"
                  bind:value={volumeDraft.feature_glossary}
                />
                <Switch
                  label="Index"
                  bind:value={volumeDraft.feature_index}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="volume-features">
    {#each generalFeatures.features as f (f.feature)}
        <SingleFeatureEditor
          feature={f}
          hasTranslation={false}
          on:feature={(event) =>
            (generalFeatures = replaceFeature(generalFeatures, event.detail))}
          on:addperson={doAddPerson}
        />
      {/each}
    </div>
    <hr />
    <small class="text-danger form-validity mb-2">{error}</small>
    <div class="status text-center mb-2" class:d-none={!creating}>
      <div class="spinner-grow spinner-grow-sm mr-2" role="status"></div>
      Creating records...
    </div>
    <button
      class="btn btn-primary btn-block mb-3"
      type="button"
      on:click={create}
      disabled={creating}
    >
      Create Volume
    </button>
  </div>
{/if}
{#if showingTranslationModal}
  <h4>
    <button
      class="btn btn-outline-secondary mr-3"
      type="button"
      on:click={toggleEditingFeature}
    >
      &lt; Back
    </button>
    Editing Translation
  </h4>
  <TranslationEditor
    class="feature-editor"
    features={featureToEdit}
    on:features={handleTranslationChange}
    on:save={toggleEditingFeature}
    on:addperson={doAddPerson}
  />
{/if}
{#if addingPublisher}
  <h4>
    <button
      class="btn btn-outline-secondary mr-3"
      type="button"
      on:click={toggleAddingPublisher}
    >
      &lt; Back
    </button>
    Adding New Publisher
  </h4>
  <AddPublisher on:save={publisherAdded} />
{/if}
{#if addingSeries}
  <h4>
    <button
      class="btn btn-outline-secondary mr-3"
      type="button"
      on:click={toggleAddingSeries}
    >
      &lt; Back
    </button>
    Adding New Series
  </h4>
  <AddSeries on:save={seriesAdded} />
{/if}
{#if addingPerson}
  <h4>
    <button
      class="btn btn-outline-secondary mr-3"
      type="button"
      on:click={toggleAddingPerson}
    >
      &lt; Back
    </button>
    Adding New Person
  </h4>
  <AddPerson on:save={savePerson} />
{/if}
