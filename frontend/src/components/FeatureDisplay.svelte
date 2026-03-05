<script>
  import { createEventDispatcher } from 'svelte';
  import { getRecord } from '../lib/api/index.js';
  import { formatError } from '../lib/forms.js';
  import { hasFeature, isFeaturesValid } from '../lib/feature.js';

  export let feature;

  const dispatch = createEventDispatcher();

  let textId;
  let textTitle = '(No text selected)';
  let error = '';

  $: textId = feature?.text;

  async function loadTextTitle(id) {
    if (!id) {
      return;
    }
    try {
      const data = await getRecord('texts', id);
      if (data) {
        textTitle = data.title;
      }
    } catch (fetchError) {
      error = formatError(fetchError);
    }
  }

  $: if (textId) {
    loadTextTitle(textId);
  }

  $: featureDescription = (() => {
    if (!feature) {
      return '';
    }
    const featuresList = ['translation'];
    if (hasFeature(feature, 'Introduction')) {
      featuresList.push('introduction');
    }
    if (hasFeature(feature, 'Notes')) {
      featuresList.push('notes');
    }
    if (hasFeature(feature, 'Commentary')) {
      featuresList.push('commentary');
    }

    return `Includes ${featuresList.join(', ')}.`;
  })();

  $: featureIsValid = feature ? isFeaturesValid(feature) : true;

  function remove() {
    dispatch('remove', feature.id);
  }

  function edit() {
    dispatch('edit', feature.id);
  }
</script>

<div>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title">
        {textTitle}
        <div class="float-right">
          <div
            class="btn-group btn-group-sm"
            role="group"
            aria-label="Translation actions"
          >
            <button class="btn btn-outline-primary" type="button" on:click={edit}>
              Edit
            </button>
            <button class="btn btn-outline-danger" type="button" on:click={remove}>
              Remove
            </button>
          </div>
        </div>
      </h5>
      <div>{featureDescription}</div>
      {#if feature && !featureIsValid}
        <small class="text-danger">
          This translation isn't valid. Edit it before saving.
        </small>
      {/if}
      <div class="invalid-feedback">{error}</div>
    </div>
  </div>
</div>
