<script>
  import { createEventDispatcher } from 'svelte';

  export let label = '';
  export let value = false;
  export let dataName = null;
  export let dataFeature = null;

  const dispatch = createEventDispatcher();
  const uid = `switch-${Math.random().toString(36).slice(2, 9)}`;

  function handleChange(event) {
    value = event.currentTarget.checked;
    dispatch('change', { value, dataName, dataFeature });
    dispatch('value', value);
  }
</script>

<div class="custom-control custom-switch">
  <input
    type="checkbox"
    class="custom-control-input"
    id={uid}
    bind:checked={value}
    on:change={handleChange}
  />
  <label class="custom-control-label" for={uid}>{label}</label>
</div>
