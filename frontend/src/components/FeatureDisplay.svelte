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

<article>
  <header>
    <h5>
      {textTitle}
      <div role="group" aria-label="Translation actions" style="float: right;">
        <button class="secondary" type="button" on:click={edit}>
          Edit
        </button>
        <button class="contrast" type="button" on:click={remove}>
          Remove
        </button>
      </div>
    </h5>
  </header>
  <div>{featureDescription}</div>
  {#if feature && !featureIsValid}
    <small class="danger">
      This translation isn't valid. Edit it before saving.
    </small>
  {/if}
  {#if error}
    <small class="danger">{error}</small>
  {/if}
</article>
