<script>
  export let values = [];

  $: useComma = values.length > 2;
</script>

{#if values.length}
  {#each values as item, index (item.id)}
    {#if index > 0}
      {#if values.length === 2}
        {' and '}
      {:else}
        {#if index === values.length - 1}
          {', and '}
        {:else}
          {#if useComma}{', '}{/if}
        {/if}
      {/if}
    {/if}
    <a href={item.href}>{item.name}</a>
  {/each}
{/if}
