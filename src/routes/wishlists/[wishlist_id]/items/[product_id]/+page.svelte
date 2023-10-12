<script>
  import { onMount } from "svelte";
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import RemoveSvg from "$lib/svg/RemoveSvg.svelte";
  import UnbookSvg from "$lib/svg/UnbookSvg.svelte";
  import BookSvg from "$lib/svg/BookSvg.svelte";
  import CopySvg from "$lib/svg/CopySvg.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let item = data.itemsByProductId[data.productId];
  let product = item.product;
  let isOwner = data.wishlist.wishlist.is_my_wishlist;
  let isBookedByCurrentUser = item.is_booked_by_current_user;

  const goBack = () => {
    window.Telegram.WebApp.BackButton.hide();
    gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
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
    const button = { id: "yes", type: "destructive", text: "Yes" };

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
      "Removing",
      "Do you want to remove this wish?",
      button,
      callback
    );
  };
  const book = async () => {
    const button = { id: "yes", type: "ok", text: "Yes!" };

    const callback = async (id) => {
      if (id === "yes") {
        bookInProgress = true;
        const response = await fetch("", {
          method: "POST",
          body: JSON.stringify({ action: "book" }),
        });
        if (response.status === 200) {
          await invalidateAll();
          goBack();
        }
        bookInProgress = false;
      }
    };

    await showDialog(
      "Booking",
      "Are you planning to fulfill this wish?",
      button,
      callback
    );
  };
  const unbook = async () => {
    const button = { id: "yes", type: "ok", text: "Yes" };

    const callback = async (id) => {
      if (id === "yes") {
        unbookInProgress = true;
        const response = await fetch("", {
          method: "POST",
          body: JSON.stringify({ action: "unbook" }),
        });
        if (response.status === 200) {
          await invalidateAll();
          goBack();
        }
        unbookInProgress = false;
      }
    };

    await showDialog(
      "Unbooking",
      "Do you no longer want to fulfill this desire?",
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
      window.Telegram.WebApp.showAlert("Item copied to your wishlist!");
      await invalidateAll();
    }
    copyToMyWishlistInProgress = false;
  };

  const showDialog = async (title, message, button, callback) => {
    const params = {
      title: title,
      message: message,
      buttons: [{ type: "cancel", text: "No" }, button],
    };
    await window.Telegram.WebApp.showPopup(params, callback);
  };

  const descriptionLines = product.description.split(/\n|\r\n/g).map((v, i) => {
    return { text: v, br: "<br>" };
  });
</script>

<section>
  <div class="list-link">
    <div class="img">
      <svg width="50" height="50" viewBox="0 0 512 512">
        <path
          d="M96 150h145v-40h30v40h145c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15h-71.035A54.647 54.647 0 0 0 351 55c0-30.327-24.673-55-55-55-15.75 0-29.964 6.665-40 17.31C245.964 6.665 231.75 0 216 0c-30.327 0-55 24.673-55 55 0 9 2.187 17.493 6.035 25H96c-8.284 0-15 6.716-15 15v40c0 8.284 6.716 15 15 15zM296 30c13.785 0 25 11.215 25 25s-11.215 25-25 25h-25V55c0-13.785 11.215-25 25-25zM191 55c0-13.785 11.215-25 25-25s25 11.215 25 25v25h-25c-13.785 0-25-11.215-25-25zM501.607 309.513c-13.55-15.243-36.85-16.727-52.224-3.327l-59.784 52.109c.026.763.058 1.525.058 2.294 0 37.21-30.272 67.483-67.483 67.483h-80.399c-8.284 0-15-6.716-15-15s6.716-15 15-15h80.412c20.695 0 37.472-16.777 37.472-37.472 0-20.704-16.791-37.484-37.495-37.472l-78.289.049c-21.398-24.333-50.967-39.073-83.286-41.507-32.384-2.437-63.885 7.748-88.708 28.684l-7.024 5.924 73.75 172.084H329.07a74.887 74.887 0 0 0 50.107-19.195l119.482-107.283c15.226-13.67 16.544-37.076 2.948-52.371z"
        />
        <path
          d="m271 293.161 51.144-.032c24.809 0 46.521 13.426 58.255 33.389L411 299.845V180H271zM151.173 251.316c3.869 0 7.794.148 11.666.439 28.591 2.154 55.455 12.059 78.161 28.493V180H101v79.827c16.036-5.583 32.993-8.511 50.173-8.511zM10.091 343.209a14.997 14.997 0 0 0-7.879 19.695l60 140c2.438 5.688 7.975 9.095 13.794 9.095a14.95 14.95 0 0 0 5.902-1.217l28.443-12.189L38.535 331.02z"
        />
      </svg>
    </div>
    <h1>{product.title}</h1>
    {#if product.url !== ""}
      <a class="link-btn no-fill-button" href={product.url} target="_blank">
        <svg width="24" height="24" viewBox="0 0 515.283 515.283"
          ><path
            d="M372.149 515.283H85.881c-22.941 0-44.507-8.934-60.727-25.155S.001 452.34.001 429.402V143.134c0-22.94 8.934-44.506 25.154-60.726s37.786-25.154 60.727-25.154h114.507c15.811 0 28.627 12.816 28.627 28.627s-12.816 28.627-28.627 28.627H85.881c-7.647 0-14.835 2.978-20.241 8.384s-8.385 12.595-8.385 20.242v286.268c0 7.647 2.978 14.835 8.385 20.243 5.406 5.405 12.594 8.384 20.241 8.384h286.267c7.647 0 14.835-2.978 20.242-8.386 5.406-5.406 8.384-12.595 8.384-20.242V314.895c0-15.811 12.817-28.626 28.628-28.626s28.628 12.816 28.628 28.626v114.507c0 22.94-8.934 44.505-25.155 60.727-16.221 16.22-37.788 25.154-60.726 25.154zm-171.76-171.762c-7.327 0-14.653-2.794-20.242-8.384-11.179-11.179-11.179-29.306 0-40.485L417.544 57.254H314.896c-15.811 0-28.626-12.816-28.626-28.627S299.085 0 314.896 0h171.761a28.542 28.542 0 0 1 19.997 8.144l.002.002.056.056.017.016.044.044.029.029.032.032.062.062.062.062.031.032.029.029a.62.62 0 0 1 .06.061l.056.057.002.002a28.55 28.55 0 0 1 8.144 19.998v171.761c0 15.811-12.817 28.627-28.628 28.627s-28.626-12.816-28.626-28.627V97.739l-237.4 237.399c-5.585 5.59-12.911 8.383-20.237 8.383z"
          />
        </svg>
      </a>
    {/if}
  </div>

  <p class="detale">
    <span>
      {#if item.is_booked}
        Already booked by {isBookedByCurrentUser ? "you" : "another user"}
      {:else}
        Booking {item.is_booking_available
          ? "is available"
          : "is not available"}
      {/if}
    </span>
  </p>
  <div class="btn-block" />
</section>

<section class="share-section">
  {#if item.is_booking_available}
    {#if isBookedByCurrentUser}
      <button class="no-fill-button flex-end btn-text" on:click={unbook}>
        {#if unbookInProgress === false}
          <UnbookSvg />
        {:else}
          <div class="custom-loader" />
        {/if}
        Unbook
      </button>
    {:else if !item.is_booked}
      <button class="no-fill-button flex-end btn-text" on:click={book}>
        {#if bookInProgress === false}
          <BookSvg />
        {:else}
          <div class="custom-loader" />
        {/if}
        Book
      </button>
    {/if}
  {/if}
  {#if isOwner}
    <button class="no-fill-button flex-end btn-text" on:click={remove}>
      {#if removeInProgress === false}
        <RemoveSvg />
      {:else}
        <div class="custom-loader" />
      {/if}
      Delete
    </button>
  {:else}
    <button
      class="no-fill-button flex-end btn-text"
      on:click={copyToMyWishlist}
    >
      {#if copyToMyWishlistInProgress === false}
        <CopySvg />
      {:else}
        <div class="custom-loader" />
      {/if}
      Copy
    </button>
  {/if}
</section>

<section>
  {#if product.description !== ""}
    {#each descriptionLines as { text }}
      <p>{text}</p>
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
    border-radius: 0;
    min-width: 50px;
    min-height: 50px;
  }
  .img path {
    fill: var(--tg-theme-hint-color);
  }
  .detale {
    display: flex;
    justify-content: space-between;
  }
  .btn-block {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .link-btn {
    margin-left: auto;
  }
</style>
