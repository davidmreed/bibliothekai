<script>
  import { createEventDispatcher } from 'svelte';
  import DualingListbox from './DualingListbox.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  import Switch from './Switch.svelte';

  export let feature;
  export let hasTranslation = false;

  const dispatch = createEventDispatcher();

  let lastFeatureRef;
  let sameAsTranslation = false;
  let language = '';
  let persons = [];
  let uiExpanded = false;

  $: isEdited = feature?.feature === 'Edited';
  $: showDetails = !(hasTranslation && sameAsTranslation);
  $: isVisible = uiExpanded;
  $: buttonTitle = uiExpanded ? 'Done' : 'Edit';

  const arraysEqual = (left, right) => {
    if (left === right) {
      return true;
    }
    if (!left || !right || left.length !== right.length) {
      return false;
    }
    return left.every((val, idx) => val === right[idx]);
  };

  function updateFeature(patch) {
    if (!feature) {
      return;
    }
    const next = { ...feature, ...patch };
    feature = next;
    dispatch('feature', feature);
  }

  $: if (feature && feature !== lastFeatureRef) {
    lastFeatureRef = feature;
    sameAsTranslation = !!feature.sameAsTranslation;
    language = feature.language ?? '';
    persons = Array.isArray(feature.persons) ? feature.persons : [];
    uiExpanded = !!feature.uiExpanded;
  }

  $: if (feature) {
    if (sameAsTranslation !== !!feature.sameAsTranslation) {
      updateFeature({ sameAsTranslation });
    }
    if (language !== (feature.language ?? '')) {
      updateFeature({ language });
    }
    if (!arraysEqual(persons, feature.persons || [])) {
      updateFeature({ persons });
    }
    if (uiExpanded !== !!feature.uiExpanded) {
      updateFeature({ uiExpanded });
    }
  }

  function toggleExpanded() {
    uiExpanded = !uiExpanded;
  }

  function handleAddPerson() {
    dispatch('addperson', {
      callback: (p) => {
        persons = [...persons, p];
      }
    });
  }
</script>

{#if feature}
  <div class="card mb-2">
    <div class="card-header">
      <h5 class="card-title">
        {feature.feature}
        {#if showDetails}
          <button
            class="float-right btn btn-sm btn-outline-secondary"
            type="button"
            on:click={toggleExpanded}
          >
            {buttonTitle}
          </button>
        {/if}
      </h5>
    </div>
    {#if isVisible}
      <div class="card-body">
        {#if hasTranslation}
          <Switch
            label="Same language and authors as translation"
            bind:value={sameAsTranslation}
          />
        {/if}
        {#if showDetails}
          {#if !isEdited}
            <div>
              <small>A language and authors are required.</small>
            </div>

            <PopUpMenu
              labelText="Language"
              entityName="languages"
              allowAdd={false}
              bind:value={language}
            />
            <label for="authors">Authors</label>
          {:else}
            <label for="authors">Editors</label>
          {/if}
          <DualingListbox
            entityName="persons"
            bind:value={persons}
            allowAdd={true}
            on:add={handleAddPerson}
          />
          <button
            class="btn btn-sm btn-outline-primary btn-block mb-2 mt-3"
            type="button"
            on:click={toggleExpanded}
          >
            Done with Resource
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
