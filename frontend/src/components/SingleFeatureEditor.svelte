<script>
  import { createEventDispatcher } from 'svelte';
  import DualingListbox from './DualingListbox.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  import Switch from './Switch.svelte';

  export let feature;
  export let hasTranslation = false;

  const dispatch = createEventDispatcher();

  $: isEdited = feature?.feature === 'Edited';
  $: showDetails = !(hasTranslation && feature?.sameAsTranslation);
  $: isVisible = feature?.uiExpanded;
  $: buttonTitle = feature?.uiExpanded ? 'Done' : 'Edit';

  function notify() {
    if (!feature) {
      return;
    }
    feature = feature;
    dispatch('feature', feature);
  }

  function toggleExpanded() {
    if (!feature) {
      return;
    }
    feature.uiExpanded = !feature.uiExpanded;
    notify();
  }

  function handleAddPerson() {
    dispatch('addperson', {
      callback: (p) => {
        feature.persons = (feature.persons || []).concat([p]);
        notify();
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
            bind:value={feature.sameAsTranslation}
            on:value={notify}
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
              bind:value={feature.language}
              on:value={notify}
            />
            <label for="authors">Authors</label>
          {:else}
            <label for="authors">Editors</label>
          {/if}
          <DualingListbox
            entityName="persons"
            bind:value={feature.persons}
            on:value={notify}
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
