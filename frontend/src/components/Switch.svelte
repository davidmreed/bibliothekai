<script>
  export let label = '';
  export let value = false;

  const uid = `switch-${Math.random().toString(36).slice(2, 9)}`;
</script>

  <input
    type="checkbox"
    role="switch"
    id={uid}
    bind:checked={value}
  />
  <label for={uid}>{label}</label>
