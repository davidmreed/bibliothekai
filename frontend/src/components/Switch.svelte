<script>
  export let label = '';
  export let value = false;

  const uid = `switch-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="custom-control custom-switch">
  <input
    type="checkbox"
    class="custom-control-input"
    id={uid}
    bind:checked={value}
  />
  <label class="custom-control-label" for={uid}>{label}</label>
</div>
