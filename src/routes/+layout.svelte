<script>
  import { navigating } from "$app/stores";
  import DefaultTheme from "./DefaultTheme.svelte";
  import { setupI18n, isLoading, _ } from '$lib/i18n';
  import { onMount } from "svelte";
  import tinycolor from 'tinycolor2';

  let isOpenedByTelegram = false;
  onMount(() => {
    isOpenedByTelegram = window.Telegram.WebApp.platform !== "unknown";
    let lang = window.Telegram.WebApp.initDataUnsafe.user?.language_code
    if (!lang) {
      lang = 'en'
    }
    setupI18n({ withLocale: lang });

    const resolveBackgroundColor = () => {
      let bgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-bg-color');
      let bgSecondaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-secondary-bg-color');
      bgColor = tinycolor(bgColor);
      bgSecondaryColor = tinycolor(bgSecondaryColor);
      if (bgColor.getBrightness() < bgSecondaryColor.getBrightness()) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', bgSecondaryColor.toString());
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', bgColor.toString());
        window.Telegram.WebApp.setHeaderColor('secondary_bg_color');
      }
    };
    resolveBackgroundColor();

    Telegram.WebApp.onEvent("themeChanged", resolveBackgroundColor);
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
