<script>
  import { goto as gotoRoute } from "$app/navigation";
  import { onMount } from "svelte";
  import { _ } from "$lib/i18n";
  import AddSvg from "$lib/svg/AddSvg.svelte";
  import PresentSvg from "$lib/svg/PresentSvg.svelte";
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsFiles from "svelte-icons-pack/bs/BsFiles";
  import BsUpload from "svelte-icons-pack/bs/BsUpload";
  import BsChevronRight from "svelte-icons-pack/bs/BsChevronRight";
  import {getMinSize} from "$lib/resizer.js";

  export let data;

  let newWish = () =>
    gotoRoute(`/wishlists/${data.wishlist.wishlist.id}/items/new/edit`);
  let editWishlist = () =>
    gotoRoute(`/wishlists/${data.wishlist.wishlist.id}/edit`);
  let share = () => {
    window.Telegram.WebApp.switchInlineQuery(data.wishlist.wishlist.id, [
      "users",
      "groups",
      "channels",
      "bots",
    ]);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(
      data.tgAppUrl + `?startapp=${data.wishlist.wishlist.id}`
    );
    window.Telegram.WebApp.showAlert($_('app.link_copied'));
  };
  const mustPmAccess = (callback) => {
    const grantAccess = (allowed) => {
      if (allowed) {
        callback();
      }
    };
    if (window.Telegram.WebApp.platform === "ios" || window.Telegram.WebApp.platform === "android") {
      window.Telegram.WebApp.requestWriteAccess(grantAccess);
    } else {
      callback();
    }
  };
  const goMyWishlist = () => {
    if (window.Telegram.WebApp.initDataUnsafe.user?.allows_write_to_pm) {
      gotoRoute(`/wishlists/${data.profile.default_wishlist.id}`);
      return;
    }
    const goToBot = () => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/wishboxbot");
    };
    mustPmAccess(goToBot);
  };

  let isMessagesAllowed = false;
  onMount(() => {
    if (window.Telegram.WebApp.initDataUnsafe.user?.allows_write_to_pm) {
      isMessagesAllowed = true;
    }
  });

  let isOwner = data.wishlist.wishlist.is_my_wishlist;

  const descriptionLines = data.wishlist.wishlist.descriptionHtml
    .split(/\n|\r\n/g)
    .map((v, i) => {
      return { html: v };
    });
</script>

<div class="flex-column">
  <section class="header relative">
    {#if isOwner}
      <button class="edit-btn absolute" on:click={editWishlist}> {$_('app.edit_link')} </button>
    {/if}
    <div class="flex content-center">
      {#if data.wishlist.wishlist.avatar?.link}
        <div class="img br-50 wh-100">
          <img alt="avatar user" src={getMinSize(data.wishlist.wishlist.avatar.link, data.wishlist.wishlist.avatar.sizes, 100)} />
        </div>
      {/if}
    </div>
    <h1>{data.wishlist.wishlist.title}</h1>
    {#if data.wishlist.wishlist.description !== ""}
      {#each descriptionLines as { html }}
        <p>{@html html}</p>
      {/each}
    {/if}
  </section>

  <section class="share-section">
    <button class="no-fill-button btn-text" on:click={copyLink}>
      <Icon src={BsFiles} size="25"/>
      {$_('app.copy_link')}
    </button>
    <button class="no-fill-button btn-text" on:click={share}>
      <Icon src={BsUpload} size="25"/>
      {$_('app.share')}
    </button>
  </section>

  <section class="wishes-section">
    <div class="flex content-between items-center mb-16">
      <h2>{$_('app.wishes')}</h2>
      {#if isOwner}
        <button class="no-fill-button" on:click={newWish}>
          <AddSvg />
        </button>
      {/if}
    </div>
    {#if data.items.items.length !== 0}
      {#each data.items.items as item}
        <a
          class="list-link list-item"
          href="/wishlists/{data.wishlist.wishlist.id}/items/{item.product.id}"
        >
          <div class="img">
            {#if (item.product.image?.['link'])}
              <img alt="product" src={getMinSize(item.product.image['link'], item.product.image['sizes'], 100)} />
            {:else}
              <PresentSvg />
            {/if}
          </div>
          <div class="item-text">
            <div class="flex content-between gap-1">
              <p class="title-item">{item.product.title}</p>
              {#if item.is_booked}
                <p class="booked-item">
                  {#if item.is_booked_by_current_user}
                    <span class="tg-theme-button-color">{$_('app.booked_by_you')}</span>
                  {:else}
                    {$_('app.booked')}
                  {/if}
                </p>
              {/if}
            </div>
            <p class="description-item">{item.product.description}</p>
          </div>
          <Icon src={BsChevronRight} size="25" className="chevron-item"/>
        </a>
      {/each}
    {:else}
      {#if isOwner }
        <p class="bad-description">{$_('app.you_didnt_add_wishes')}</p>
        <button class="border-button" on:click={newWish}>
          <AddSvg />
          {$_('app.create_first_wish')}
        </button>
      {:else}
        <p class="bad-description">{$_('app.didnt_add_wishes')}</p>
      {/if}
    {/if}
  </section>

  <div class="decot-dark flex-shrink" />

  {#if !isOwner}
    {#if isMessagesAllowed}
      <button class="no-fill-button create-button" on:click={goMyWishlist}>
        {$_('app.go_my_list')}
      </button>
    {:else}
      <button class="no-fill-button create-button" on:click={goMyWishlist}>
        {$_('app.create_your_list')}
      </button>
    {/if}
  {/if}
</div>

<style>
  .relative {
    position: relative;
  }
  .wishes-section {
    padding-top: 10px;
  }
  .absolute {
    position: absolute;
    top: 0px;
    right: 20px;
    color: var(--tg-theme-button-color);
    font-size: 16px;
    padding: 1rem 0 24px 14px;
  }
  .edit-btn {
    background-color: var(--tg-theme-bg-color);
    min-height: 0;
  }
  .edit-btn:active {
    color: var(--tg-theme-link-color);
  }
  .header {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .header h1 {
    text-align: center;
  }
  .flex {
    display: flex;
  }
  .items-start {
    align-items: start;
  }
  .items-center {
    align-items: center;
    min-height: 40px;
  }
  .content-between {
    justify-content: space-between;
  }
  .content-center {
    justify-content: center;
  }
  .header p {
    max-height: none;
  }
  .wh-100 {
    width: 100px;
    height: 100px;
  }
  .mb-16 {
    margin-bottom: 6px;
  }
  .gap-1 {
    gap: 1rem;
  }
  .img {
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img img {
    object-fit: cover;
  }
  .share-section {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    background-color: var(--tg-theme-secondary-bg-color);
  }
  .share-section > button {
    border-radius: 12px;
    flex: 1 1 100%;
    padding: 16px 0;
  }
  .list-link {
    display: flex;
    gap: 1rem;
    width: 100%;
    align-items: center;
  }
  .list-item {
    max-width: 100%;
    overflow: auto;
    padding-top: 1rem;
    display: flex;
    gap: 0.5rem;
    color: var(--tg-theme-text-color);
    border-top: 1px solid var(--tg-theme-secondary-bg-color);
  }
  /* .list-item .title-item {
    margin-bottom: 1em;
  } */
  .list-item:not(:last-child) {
    padding-bottom: 1rem;
  }
  .list-item:last-child {
    padding-bottom: 0.5rem;
  }
  .item-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .list-item p {
    margin: 0;
    word-break: break-word;
    max-height: 3.6em;
    overflow: hidden;
    position: relative;
  }
  .list-item .title-item {
    color: var(--tg-theme-text-color);
    max-height: 1.5em;
  }
  .description-item {
    color: var(--tg-theme-hint-color);
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .title-item {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .booked-item {
    line-height: 1.1rem;
    font-size: 0.7rem;
    max-height: 1em;
    overflow: hidden;
    display: block;
    flex: 0 0 auto;
  }
  .decot-dark {
    width: 100%;
    min-height: 8px;
    background-color: var(--tg-theme-secondary-bg-color);
  }
  .create-button {
    color: var(--tg-theme-button-color);
    font-weight: 400;
    font-size: 1rem;
    padding: 0.7rem 0 0.8rem;
    min-height: 1rem;
    border-radius: 8px 8px 0 0;
  }
  .flex-column {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  .flex-shrink {
    flex: 1 0 100%;
  }
  .br-50 {
    border-radius: 50%;
  }
  .tg-theme-button-color {
    color: var(--tg-theme-button-color);
  }
  .border-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border: 2px solid var(--tg-theme-button-color);
    border-radius: 12px;
    color: var(--tg-theme-button-color);
    background-color: var(--tg-theme-bg-color);
    width: 100%;
    padding: 0.7rem 0;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  .bad-description {
    text-align: center;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--tg-theme-secondary-bg-color);
  }
  p {
    max-height: 5.3em;
    overflow: hidden;
  }
  section:last-child {
    padding-bottom: 0;
  }
</style>
