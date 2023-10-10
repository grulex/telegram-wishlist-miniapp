<script>
  import { onMount } from "svelte";
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";

  /** @type {import('./$types').PageData} */
  export let data;

  onMount(() => {
    const isTgInitialized = window.Telegram.WebApp.initData !== "";
    if (isTgInitialized) {
      const tgApp = window.Telegram.WebApp;
      const backButton = tgApp.BackButton;
      if (window.backButtonFunction) {
        backButton.offClick(window.backButtonFunction);
      }
      const back = () => {
        backButton.hide();
        gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
      };
      backButton.onClick(back);
      window.backButtonFunction = back;
      backButton.show();
    }
  });

  let removeInProgress = false;
  let bookInProgress = false;
  let unbookInProgress = false;
  let copyToMyWishlistInProgress = false;
  let copyToMyWishlistSuccess = false;

  const remove = async () => {
    const button = { id: "yes", type: "destructive", text: "Yes" };

    const callback = async (id) => {
      if (id === "yes") {
        removeInProgress = true;
        const response = await fetch("", { method: "DELETE" });
        if (response.status === 200) {
          await invalidateAll();
          await gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
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
          await gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
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
          await gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
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
      body: JSON.stringify({ action: "copy" }),
    });
    if (response.status === 200) {
      copyToMyWishlistSuccess = true;
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

  let item = data.itemsByProductId[data.productId];
  let product = item.product;
  let isOwner = data.wishlist.wishlist.is_my_wishlist;
  let isBookedByCurrentUser = item.is_booked_by_current_user;
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
      {#if item.is_booked }
        Already booked by {isBookedByCurrentUser ? "you" : "another user"}
      {:else}
        Booking {item.is_booking_available ? "is available" : "is not available"}
      {/if}
    </span>
    <!-- {#if product.price_from.number !== null}
      <span>${product.price_from.number}</span>
    {/if} -->
  </p>
  <div class="btn-block" />
</section>

<section class="share-section">
  {#if item.is_booking_available }
    {#if isBookedByCurrentUser }
      <button class="no-fill-button flex-end btn-text" on:click={unbook}>
        {#if unbookInProgress === false}
          <svg height="32" viewBox="0 -960 960 960" width="32"
          ><path
            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1ZM20 4h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
          />
          <path
            d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0ZM15 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
          />
          </svg>
        {:else}
          <div class="custom-loader" />
        {/if}
        Delete
      </button>
    {:else if !item.is_booked }
      <button class="no-fill-button flex-end btn-text" on:click={book}>
        {#if bookInProgress === false}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.2506 2.41284C14.519 2.3099 14.8147 2.3099 15.083 2.41284L24.563 6.0498C25.0255 6.22722 25.3318 6.67941 25.3318 7.18457V15.6708C25.3318 19.8487 22.6281 23.1872 20.1873 25.3721C18.942 26.4869 17.7023 27.3582 16.7763 27.9503C16.312 28.2472 15.9234 28.4759 15.6482 28.6317C15.5105 28.7097 15.401 28.7696 15.3242 28.8108C15.2859 28.8314 15.2557 28.8474 15.2343 28.8586L15.2088 28.8719L15.2011 28.8758L15.1976 28.8776C15.1972 28.8778 15.1969 28.878 14.6668 27.794C14.1368 28.878 14.1364 28.8778 14.136 28.8776L14.1325 28.8758L14.1249 28.8719L14.0994 28.8586C14.078 28.8474 14.0478 28.8314 14.0094 28.8108C13.9327 28.7696 13.8231 28.7097 13.6855 28.6317C13.4102 28.4759 13.0217 28.2472 12.5574 27.9503C11.6314 27.3582 10.3917 26.4869 9.14638 25.3721C6.70553 23.1872 4.00183 19.8487 4.00183 15.6708V7.18457C4.00183 6.67941 4.30819 6.22722 4.77065 6.0498L14.2506 2.41284ZM14.6668 27.794L14.136 28.8776C14.4697 29.0483 14.864 29.0483 15.1976 28.8776L14.6668 27.794ZM14.6668 26.4156C14.8939 26.2839 15.1843 26.1096 15.5199 25.895C16.3714 25.3506 17.5017 24.555 18.6264 23.5481C20.9255 21.49 22.9618 18.7668 22.9618 15.6708V8.02439L14.6668 4.84205L6.37183 8.02439V15.6708C6.37183 18.7668 8.40813 21.49 10.7073 23.5481C11.832 24.555 12.9623 25.3506 13.8138 25.895C14.1494 26.1096 14.4398 26.2839 14.6668 26.4156Z"
            />
            <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.746 12.7319C20.178 13.1639 20.178 13.8643 19.746 14.2963L14.7743 19.268C14.3423 19.7 13.6419 19.7 13.2099 19.268L10.724 16.7821C10.292 16.3502 10.292 15.6497 10.724 15.2177C11.156 14.7857 11.8564 14.7857 12.2884 15.2177L13.9921 16.9214L18.1816 12.7319C18.6136 12.2999 19.314 12.2999 19.746 12.7319Z"
            />
          </svg>
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
        <svg width="32" height="32" viewBox="0 0 24 24"
        ><path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1ZM20 4h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
        />
          <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0ZM15 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
          />
        </svg>
      {:else}
        <div class="custom-loader" />
      {/if}
      Unbook
    </button>
  {:else}
    <button class="no-fill-button flex-end btn-text" on:click={copyToMyWishlist}>
      {#if copyToMyWishlistInProgress === false}
        <svg width="32" height="32" viewBox="0 0 22 22">
          <path
            d="M21 19H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zM12 2a1 1 0 0 0-1 1v10.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0-1.42-1.42L13 13.59V3a1 1 0 0 0-1-1z"
          />
        </svg>
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
