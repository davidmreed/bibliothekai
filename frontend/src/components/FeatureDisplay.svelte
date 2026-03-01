<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { getRecord } from '../lib/api/index.js';
  import { formatError } from '../lib/forms.js';

  export let feature;

  const dispatch = createEventDispatcher();

  let textId;
  let textTitle = '(No text selected)';
  let error = '';
  let wire;

  $: textId = feature?.text;

  function updateWire() {
    if (wire && textId) {
      wire.update({ entityName: 'texts', entityId: textId });
    }
  }

  onMount(() => {
    wire = new getRecord(({ data, error: fetchError }) => {
      if (data) {
        textTitle = data.title;
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

  $: featureDescription = (() => {
    if (!feature) {
      return '';
    }
    const features = ['translation'];
    if (feature.hasIntroduction) {
      features.push('introduction');
    }
    if (feature.hasNotes) {
      features.push('notes');
    }
    if (feature.hasCommentary) {
      features.push('commentary');
    }

    return `Includes ${features.join(', ')}.`;
  })();

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
      {#if feature && !feature.isValid}
        <small class="text-danger">
          This translation isn't valid. Edit it before saving.
        </small>
      {/if}
      <div class="invalid-feedback">{error}</div>
    </div>
  </div>
</div>
