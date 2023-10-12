<script>
  import { goto as gotoRoute } from "$app/navigation";
  import { onMount } from "svelte";
  import ShareSvg from "$lib/svg/ShareSvg.svelte";
  import Copy1Svg from "$lib/svg/Copy1Svg.svelte";
  import EditSvg from "$lib/svg/EditSvg.svelte";
  import AddSvg from "$lib/svg/AddSvg.svelte";

  export let data;
  console.log(data);
  console.log(data.wishlist.wishlist.avatar.link);

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
  <section>
    <div class="top">
      {#if data.wishlist.wishlist.avatar.link}
        <div class="img br-50">
          <img alt="avatar user" src={data.wishlist.wishlist.avatar.link} />
        </div>
      {/if}
      <div>
        <h1>{data.wishlist.wishlist.title}</h1>
        {#if data.wishlist.wishlist.description !== ""}
          {#each descriptionLines as { text }}
            <p>{text}</p>
          {/each}
        {/if}
      </div>
      {#if isOwner}
        <button class="no-fill-button" on:click={editWishlist}>
          <EditSvg />
        </button>
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
    <div class="top align-center mb-16">
      <h2>Wishes</h2>
      <div class="items-wrapper">
        {#if isOwner}
          <button class="no-fill-button" on:click={newWish}>
            <AddSvg />
          </button>
        {/if}
      </div>
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
              <svg width="40" height="40" viewBox="0 0 512 512">
                <path
                  d="M96 150h145v-40h30v40h145c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15h-71.035A54.647 54.647 0 0 0 351 55c0-30.327-24.673-55-55-55-15.75 0-29.964 6.665-40 17.31C245.964 6.665 231.75 0 216 0c-30.327 0-55 24.673-55 55 0 9 2.187 17.493 6.035 25H96c-8.284 0-15 6.716-15 15v40c0 8.284 6.716 15 15 15zM296 30c13.785 0 25 11.215 25 25s-11.215 25-25 25h-25V55c0-13.785 11.215-25 25-25zM191 55c0-13.785 11.215-25 25-25s25 11.215 25 25v25h-25c-13.785 0-25-11.215-25-25zM501.607 309.513c-13.55-15.243-36.85-16.727-52.224-3.327l-59.784 52.109c.026.763.058 1.525.058 2.294 0 37.21-30.272 67.483-67.483 67.483h-80.399c-8.284 0-15-6.716-15-15s6.716-15 15-15h80.412c20.695 0 37.472-16.777 37.472-37.472 0-20.704-16.791-37.484-37.495-37.472l-78.289.049c-21.398-24.333-50.967-39.073-83.286-41.507-32.384-2.437-63.885 7.748-88.708 28.684l-7.024 5.924 73.75 172.084H329.07a74.887 74.887 0 0 0 50.107-19.195l119.482-107.283c15.226-13.67 16.544-37.076 2.948-52.371z"
                />
                <path
                  d="m271 293.161 51.144-.032c24.809 0 46.521 13.426 58.255 33.389L411 299.845V180H271zM151.173 251.316c3.869 0 7.794.148 11.666.439 28.591 2.154 55.455 12.059 78.161 28.493V180H101v79.827c16.036-5.583 32.993-8.511 50.173-8.511zM10.091 343.209a14.997 14.997 0 0 0-7.879 19.695l60 140c2.438 5.688 7.975 9.095 13.794 9.095a14.95 14.95 0 0 0 5.902-1.217l28.443-12.189L38.535 331.02z"
                />
              </svg>
            </div>
            <div class="item-text">
              <p class="title-item">{item.product.title}</p>
              <p class="description-item">{item.product.description}</p>
            </div>
          </a>
          <button class="no-fill-button disabled-btn-color">
            {#if item.is_booked}
              {#if item.is_booked_by_current_user}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M8.43 19.78a1 1 0 0 1-.7-.29l-6.44-6.43a1 1 0 0 1 1.42-1.41l5.72 5.72L21.29 4.51a1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.41L9.14 19.49a1 1 0 0 1-.71.29z"
                  />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  ><path
                    d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"
                  />
                </svg>
              {/if}
            {/if}
          </button>
        </div>
      {/each}
    {:else}
      <p>No items in wishlist</p>
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
  .top {
    gap: 16px;
    display: flex;
    align-items: start;
    justify-content: space-between;
  }
  .top p {
    max-height: none;
  }
  .align-center {
    align-items: center;
  }
  .mb-16 {
    margin-bottom: 12px;
  }
  .img {
    border-radius: 0;
  }
  .img path {
    fill: var(--tg-theme-hint-color);
  }
  .disabled-btn-color path {
    fill: var(--tg-theme-hint-color);
  }
  .disabled-btn-color:active path {
    fill: var(--tg-theme-hint-color);
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
    padding: 16px 0;
    display: flex;
    gap: 1rem;
    color: var(--tg-theme-text-color);
  }
  .list-item {
    border-top: 1px solid var(--tg-theme-secondary-bg-color);
  }
  .item-text {
    width: 100%;
  }
  .list-item p {
    margin: 0;
    word-break: break-word;
    max-height: 2.3em;
    overflow: hidden;
  }
  .list-item p:not(:last-child) {
    margin-bottom: 6px;
  }
  .list-item .title-item {
    color: var(--tg-theme-text-color);
    max-height: 1.2em;
    overflow: hidden;
  }
  .description-item {
    color: var(--tg-theme-hint-color);
    font-size: 14px;
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
  p {
    max-height: 2.3em;
    margin-top: 0.5rem;
    overflow: hidden;
  }
  section:last-child {
    padding-bottom: 0;
  }
</style>
