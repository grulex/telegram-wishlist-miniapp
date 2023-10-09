<script>
  import { navigating } from "$app/stores";
</script>

<main>
  {#if $navigating}
    loading...
  {:else}
    <slot />
  {/if}
</main>
