<script>
  import { navigating } from "$app/stores";
  import DefaultTheme from "./DefaultTheme.svelte";
  import { onMount } from "svelte";
  import {
    CardPlaceholder,
    ImagePlaceholder,
    ListPlaceholder,
    Skeleton,
    TestimonialPlaceholder,
    TextPlaceholder,
    VideoPlaceholder,
    WidgetPlaceholder,
  } from "flowbite-svelte";

  let isOpenedByTelegram = false;
  onMount(() => {
    isOpenedByTelegram = window.Telegram.WebApp.platform !== "unknown";
  });
</script>

<main>
  {#if $navigating}
    <section>
      <ListPlaceholder />
    </section>
  {:else}
    <slot />
  {/if}
  {#if !isOpenedByTelegram}
    <DefaultTheme />
  {/if}
</main>
