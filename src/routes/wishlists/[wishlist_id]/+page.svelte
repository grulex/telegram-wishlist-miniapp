<script>
  import { goto as gotoRoute } from "$app/navigation";
  import { onMount } from "svelte";
  import ShareSvg from "$lib/svg/ShareSvg.svelte";
  import Copy1Svg from "$lib/svg/Copy1Svg.svelte";
  import EditSvg from "$lib/svg/EditSvg.svelte";
  import AddSvg from "$lib/svg/AddSvg.svelte";
  import PresentSvg from "$lib/svg/PresentSvg.svelte";

  export let data;
  console.log(data);

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
    window.Telegram.WebApp.showAlert("Link copied to clipboard!");
  };
  const goMyWishlist = () => {
    if (window.Telegram.WebApp.initDataUnsafe.user?.allows_write_to_pm) {
      gotoRoute(`/wishlists/${data.profile.default_wishlist.id}`);
      return
    }
    const goToBot = (allowed) => {
      if (allowed) {
        window.Telegram.WebApp.openTelegramLink("https://t.me/FastWishlistBot");
      }
    };
    window.Telegram.WebApp.requestWriteAccess(goToBot);
  };

  let isMessagesAllowed = false;
  onMount(() => {
    if (window.Telegram.WebApp.initDataUnsafe.user?.allows_write_to_pm) {
      isMessagesAllowed = true;
    }
  });

  let isOwner = data.wishlist.wishlist.is_my_wishlist;

  const descriptionLines = data.wishlist.wishlist.description
    .split(/\n|\r\n/g)
    .map((v, i) => {
      return { text: v };
    });
</script>

<div class="flex-column">
  <section class="header">
    <div class="flex content-center">
      {#if data.wishlist.wishlist.avatar?.link}
        <div class="img br-50 wh-100">
          <img alt="avatar user" src={data.wishlist.wishlist.avatar.link} />
        </div>
    {/if}
    </div>
    <div class="header-bottom">
      <div class="flex content-between items-start">
        <h1>{data.wishlist.wishlist.title}</h1>
        {#if isOwner}
          <button
            class="no-fill-button flex content-center"
            on:click={editWishlist}
          >
            <EditSvg />
          </button>
        {/if}
      </div>
      {#if data.wishlist.wishlist.description !== ""}
        {#each descriptionLines as { text }}
          <p>{text}</p>
        {/each}
      {/if}
    </div>
  </section>

  <section class="share-section">
    <button class="no-fill-button btn-text" on:click={copyLink}>
      <Copy1Svg />
      Copy
    </button>
    <button class="no-fill-button btn-text" on:click={share}>
      <ShareSvg />
      Share
    </button>
  </section>

  <section>
    <div class="flex content-between items-center mb-16">
      <h2>Wishes</h2>
      {#if isOwner}
        <button class="no-fill-button" on:click={newWish}>
          <AddSvg />
        </button>
      {/if}
    </div>
    {#if data.items.items.length !== 0}
      {#each data.items.items as item}
        <div class="list-item">
          <a
            class="list-link"
            href="/wishlists/{data.wishlist.wishlist.id}/items/{item.product
              .id}"
          >
            <div class="img">
              <PresentSvg />
            </div>
            <div class="item-text">
              <div class="flex content-between gap-1">
                <p class="title-item">{item.product.title}</p>
                {#if item.is_booked}
                  <p class="booked-item">
                    {#if item.is_booked_by_current_user}
                      <span class="tg-theme-link-color">Booked by you</span>
                    {:else}
                      Booked
                    {/if}
                  </p>
                {/if}
              </div>
              <p class="description-item">{item.product.description}</p>
            </div>
          </a>
        </div>
      {/each}
    {:else}
      <p class="bad-description">You don't have wishes yet</p>
      <button class="border-button" on:click={newWish}>
        <AddSvg />
        Create the first item
      </button>
    {/if}
  </section>

  <div class="decot-dark flex-shrink" />

  {#if !isOwner}
    {#if isMessagesAllowed}
      <button class="no-fill-button create-button" on:click={goMyWishlist}>
        Go to my Wishlist
      </button>
    {:else}
      <button class="no-fill-button create-button" on:click={goMyWishlist}>
        Create your Wishlist!
      </button>
    {/if}
  {/if}
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .flex {
    display: flex;
  }
  .items-start {
    align-items: start;
  }
  .items-center {
    align-items: center;
  }
  .content-between {
    justify-content: space-between;
  }
  .content-center {
    justify-content: center;
  }
  .content-end {
    justify-content: end;
  }
  .header p {
    max-height: none;
  }
  .wh-100 {
    width: 100px;
    height: 100px;
  }
  .mb-16 {
    margin-bottom: 12px;
  }
  .gap-1 {
    gap: 1rem;
  }
  .img {
    border-radius: 0;
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
    gap: 1rem;
    color: var(--tg-theme-text-color);
    border-top: 1px solid var(--tg-theme-secondary-bg-color);
  }
  /* .list-item .title-item {
    margin-bottom: 1em;
  } */
  .list-item:not(:last-child) {
    padding-bottom: 1rem;
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
  .list-item p:not(:last-child) {
    margin-bottom: 6px;
  }
  .list-item .title-item {
    color: var(--tg-theme-text-color);
    max-height: 1.2em;
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
  .tg-theme-link-color {
    color: var(--tg-theme-link-color);
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
  }
  p {
    max-height: 5.3em;
    overflow: hidden;
  }
  section:last-child {
    padding-bottom: 0;
  }
</style>
