<script>
  import { navigating } from "$app/stores";
  import DefaultTheme from "./DefaultTheme.svelte";
  import { onMount } from "svelte";

  let isOpenedByTelegram = false;
  onMount(() => {
    isOpenedByTelegram = window.Telegram.WebApp.platform !== "unknown";
  });
</script>

<main>
  {#if $navigating}
    <section>Loading...</section>
  {:else}
    <slot />
  {/if}
  {#if !isOpenedByTelegram}
    <DefaultTheme />
  {/if}
</main>
