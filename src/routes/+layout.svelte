<script>
  import { navigating } from "$app/stores";
  import DefaultTheme from "./DefaultTheme.svelte";
  import { setupI18n, isLoading, _ } from '$lib/i18n';
  import { onMount } from "svelte";

  let isOpenedByTelegram = false;
  onMount(() => {
    isOpenedByTelegram = window.Telegram.WebApp.platform !== "unknown";
    let lang = window.Telegram.WebApp.initDataUnsafe.user?.language_code
    if (!lang) {
      lang = 'ru'
    }
    setupI18n({ withLocale: lang });
  });
</script>

<main>
  {#if $navigating || isLoading}
    <section>{$_('app.loading')}...</section>
  {:else}
    <slot />
  {/if}
  {#if !isOpenedByTelegram}
    <DefaultTheme />
  {/if}
</main>
