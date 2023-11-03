<script>
  import { onMount } from "svelte";
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import { _ } from "$lib/i18n";
  import BsBagCheck from "svelte-icons-pack/bs/BsBagCheck";
  import BsBagX from "svelte-icons-pack/bs/BsBagX";
  import BsArchive from "svelte-icons-pack/bs/BsArchive";
  import BsBoxArrowUpRight from "svelte-icons-pack/bs/BsBoxArrowUpRight";
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsDownload from "svelte-icons-pack/bs/BsDownload";
  import BsPencilSquare from "svelte-icons-pack/bs/BsPencilSquare";
  import PresentSvg from "$lib/svg/PresentSvg.svelte";
  import {getMinSize} from "$lib/resizer.js";

  /** @type {import('./$types').PageData} */
  export let data;

  let item = data.itemsByProductId[data.productId];
  let product = item.product;
  let isOwner = data.wishlist.wishlist.is_my_wishlist;
  let isBooked = item.is_booked;
  let isBookedByCurrentUser = item.is_booked_by_current_user;

  const goBack = () => {
    window.Telegram.WebApp.BackButton.hide();
    gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
  };

  const goEdit = () => {
    gotoRoute(`/wishlists/${data.wishlist.wishlist.id}/items/${item.product.id}/edit`);
  };

  onMount(() => {
    const isTgInitialized = window.Telegram.WebApp.initData !== "";
    if (isTgInitialized) {
      const tgApp = window.Telegram.WebApp;
      const backButton = tgApp.BackButton;
      if (window.backButtonFunction) {
        backButton.offClick(window.backButtonFunction);
      }
      backButton.onClick(goBack);
      window.backButtonFunction = goBack;
      backButton.show();
    }
  });

  let removeInProgress = false;
  let bookInProgress = false;
  let unbookInProgress = false;
  let copyToMyWishlistInProgress = false;

  const remove = async () => {
    const button = { id: "yes", type: "destructive", text: $_('app.remove') };

    const callback = async (id) => {
      if (id === "yes") {
        removeInProgress = true;
        const response = await fetch("", { method: "DELETE" });
        if (response.status === 200) {
          await invalidateAll();
          goBack();
        }
        removeInProgress = false;
      }
    };

    await showDialog(
      $_('app.removing'),
      $_('app.removing_question'),
      button,
      callback
    );
  };

  const showBookedAlert = async () => {
    window.Telegram.WebApp.showAlert($_('app.already_booked'));
  };

  const book = async () => {
    const button = { id: "yes", type: "default", text: $_('app.book') };

    const callback = async (id) => {
      if (id === "yes") {
        bookInProgress = true;
        const response = await fetch("", {
          method: "POST",
          body: JSON.stringify({ action: "book" }),
        });
        if (response.status === 200) {
          await invalidateAll();
          isBookedByCurrentUser = true;
          isBooked = true;
        }
        bookInProgress = false;
      }
    };

    await showDialog(
      $_('app.booking'),
      isOwner ? $_('app.booking_question_owner') : $_('app.booking_question'),
      button,
      callback
    );
  };
  const unbook = async () => {
    const button = { id: "yes", type: "destructive", text: $_('app.unbook') };

    const callback = async (id) => {
      if (id === "yes") {
        unbookInProgress = true;
        const response = await fetch("", {
          method: "POST",
          body: JSON.stringify({ action: "unbook" }),
        });
        if (response.status === 200) {
          await invalidateAll();
          isBookedByCurrentUser = false;
          isBooked = false;
        }
        unbookInProgress = false;
      }
    };

    await showDialog(
      $_('app.unbooking'),
      isOwner && !isBookedByCurrentUser ? $_('app.unbooking_question_owner') : $_('app.unbooking_question'),
      button,
      callback
    );
  };

  const copyToMyWishlist = async () => {
    copyToMyWishlistInProgress = true;
    const response = await fetch("", {
      method: "POST",
      body: JSON.stringify({
        action: "copy",
        target_wishlist_id: data.profile.default_wishlist.id,
        is_booking_available: item.is_booking_available,
      }),
    });
    if (response.status === 200) {
      window.Telegram.WebApp.showAlert($_('app.wish_copied'));
      await invalidateAll();
    }
    copyToMyWishlistInProgress = false;
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

  const showDialog = async (title, message, button, callback) => {
    const params = {
      title: title,
      message: message,
      buttons: [{ type: "cancel" }, button],
    };
    await window.Telegram.WebApp.showPopup(params, callback);
  };

  const descriptionLines = product.descriptionHtml.split(/\n|\r\n/g).map((v, i) => {
    return { html: v,};
  });
</script>

<section>
  <div class="list-link">
    <div class="img">
      {#if (product.image?.['link'])}
        <img alt="product" src={getMinSize(item.product.image['link'], item.product.image['sizes'], 100)} />
      {:else}
        <svg width="50" height="50" viewBox="0 0 512 512">
          <path
                  d="M96 150h145v-40h30v40h145c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15h-71.035A54.647 54.647 0 0 0 351 55c0-30.327-24.673-55-55-55-15.75 0-29.964 6.665-40 17.31C245.964 6.665 231.75 0 216 0c-30.327 0-55 24.673-55 55 0 9 2.187 17.493 6.035 25H96c-8.284 0-15 6.716-15 15v40c0 8.284 6.716 15 15 15zM296 30c13.785 0 25 11.215 25 25s-11.215 25-25 25h-25V55c0-13.785 11.215-25 25-25zM191 55c0-13.785 11.215-25 25-25s25 11.215 25 25v25h-25c-13.785 0-25-11.215-25-25zM501.607 309.513c-13.55-15.243-36.85-16.727-52.224-3.327l-59.784 52.109c.026.763.058 1.525.058 2.294 0 37.21-30.272 67.483-67.483 67.483h-80.399c-8.284 0-15-6.716-15-15s6.716-15 15-15h80.412c20.695 0 37.472-16.777 37.472-37.472 0-20.704-16.791-37.484-37.495-37.472l-78.289.049c-21.398-24.333-50.967-39.073-83.286-41.507-32.384-2.437-63.885 7.748-88.708 28.684l-7.024 5.924 73.75 172.084H329.07a74.887 74.887 0 0 0 50.107-19.195l119.482-107.283c15.226-13.67 16.544-37.076 2.948-52.371z"
          />
          <path
                  d="m271 293.161 51.144-.032c24.809 0 46.521 13.426 58.255 33.389L411 299.845V180H271zM151.173 251.316c3.869 0 7.794.148 11.666.439 28.591 2.154 55.455 12.059 78.161 28.493V180H101v79.827c16.036-5.583 32.993-8.511 50.173-8.511zM10.091 343.209a14.997 14.997 0 0 0-7.879 19.695l60 140c2.438 5.688 7.975 9.095 13.794 9.095a14.95 14.95 0 0 0 5.902-1.217l28.443-12.189L38.535 331.02z"
          />
        </svg>
      {/if}
    </div>
    <h1>{product.title}</h1>
  </div>
  <div class="btn-block" />
</section>

<section class="share-section wrap">
  {#if item.is_booking_available}
    {#if isBookedByCurrentUser || (isBooked && isOwner) }
      <button class="no-fill-button flex-end btn-text" on:click={unbook}>
        {#if unbookInProgress === false}
          <Icon src={BsBagX} size="25" />
        {:else}
          <div class="custom-loader" />
        {/if}
        {$_('app.unbook')}
      </button>
    {:else if !isBooked}
      <button class="no-fill-button flex-end btn-text" on:click={() => { mustPmAccess(book) }}>
        {#if bookInProgress === false}
          <Icon src={BsBagCheck} size="25" />
        {:else}
          <div class="custom-loader" />
        {/if}
        {$_('app.book')}
      </button>
    {:else}
      <button class="no-fill-button flex-end btn-text disabled" on:click={showBookedAlert}>
        <Icon src={BsBagX} size="25" />
        <i>{$_('app.booked')}</i>
      </button>
    {/if}
  {/if}
  {#if isOwner}
    <button class="no-fill-button flex-end btn-text" on:click={goEdit}>
      <Icon src={BsPencilSquare} size="25" />
      {$_('app.edit_button')}
    </button>
    <button class="no-fill-button flex-end btn-text" on:click={remove}>
      {#if removeInProgress === false}
        <Icon src={BsArchive} size="25" />
      {:else}
        <div class="custom-loader" />
      {/if}
      {$_('app.remove')}
    </button>
  {:else}
    <button
      class="no-fill-button flex-end btn-text"
      on:click={copyToMyWishlist}
    >
      {#if copyToMyWishlistInProgress === false}
        <Icon src={BsDownload} size="25" />
      {:else}
        <div class="custom-loader" />
      {/if}
      {$_('app.copy_wish')}
    </button>
  {/if}
  {#if product.url !== ""}
    <a
      class="no-fill-button flex-end btn-text link-btn"
      href={product.url}
      target="_blank"
    >
        <Icon src={BsBoxArrowUpRight} size="20" />
      {$_('app.open_wish_link')}
    </a>
  {/if}
</section>

<section class="description-item-section">
  {#if product.descriptionHtml !== ""}
    {#each descriptionLines as { html }}
      <p>{@html html}</p>
    {/each}
  {/if}
</section>

<style>
  .list-link {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .img {
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 70px;
    height: 70px;
  }
  .img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .img path {
    fill: var(--tg-theme-hint-color);
  }
  .btn-block {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .description-item-section {
    padding-top: 20px;
  }
  .link-btn {
    flex: 1 1 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1em;
    display: flex;
    padding: 1rem 0;
    border-radius: 0.5rem;
  }
</style>
