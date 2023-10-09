<script>
  import { goto as gotoRoute } from "$app/navigation";

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
  let copyLink = () => {
    navigator.clipboard.writeText(
      data.tgAppUrl + `?startapp=${data.wishlist.wishlist.id}`
    );
  };
</script>

<section>
  <div class="top">
    <div class="items-wrapper">
      <div class="img">
        <img
          alt="avatar"
          src="https://sun9-26.userapi.com/impf/c836735/v836735245/396c7/rsXJjQRbHjk.jpg?size=2097x2048&quality=96&sign=0587231e938deed707b5f490865e2226&type=album"
        />
      </div>
      <h1>{data.wishlist.wishlist.title}</h1>
    </div>
    <button class="no-fill-button" on:click={editWishlist}>
      <svg width="20" height="20" viewBox="0 0 484 484">
        <path
          d="M401.648 18.234c-24.394-24.351-63.898-24.351-88.293 0l-22.101 22.223-235.27 235.145-.5.503c-.12.122-.12.25-.25.25-.25.375-.625.747-.87 1.122 0 .125-.13.125-.13.25-.25.375-.37.625-.625 1-.12.125-.12.246-.246.375-.125.375-.25.625-.379 1 0 .12-.12.12-.12.25L.663 437.32a12.288 12.288 0 0 0 2.996 12.735 12.564 12.564 0 0 0 8.867 3.625c1.356-.024 2.7-.235 3.996-.625l156.848-52.325c.121 0 .121 0 .25-.12a4.523 4.523 0 0 0 1.121-.505.443.443 0 0 0 .254-.12c.371-.25.871-.505 1.246-.755.371-.246.75-.62 1.125-.87.125-.13.246-.13.246-.25.13-.126.38-.247.504-.5l257.371-257.372c24.352-24.394 24.352-63.898 0-88.289zM169.375 371.383l-86.914-86.91L299.996 66.938l86.914 86.91zm-99.156-63.809 75.93 75.926-114.016 37.96zm347.664-184.82-13.238 13.363L317.727 49.2l13.367-13.36c14.62-14.609 38.32-14.609 52.945 0l33.965 33.966c14.512 14.687 14.457 38.332-.121 52.949zm0 0"
        />
      </svg>
    </button>
  </div>
  {#if data.wishlist.wishlist.description !== ""}
    <p>{data.wishlist.wishlist.description}</p>
  {/if}
</section>
<div class="divider" />
<section class="share-section">
  <button class="no-fill-button" on:click={copyLink}>
    <svg width="24" height="24" viewBox="0 0 512 512"
      ><path
        d="M271 512H80c-44.113 0-80-35.887-80-80V161c0-44.113 35.887-80 80-80h191c44.113 0 80 35.887 80 80v271c0 44.113-35.887 80-80 80zM80 121c-22.055 0-40 17.945-40 40v271c0 22.055 17.945 40 40 40h191c22.055 0 40-17.945 40-40V161c0-22.055-17.945-40-40-40zm351 261V80c0-44.113-35.887-80-80-80H129c-11.047 0-20 8.953-20 20s8.953 20 20 20h222c22.055 0 40 17.945 40 40v302c0 11.047 8.953 20 20 20s20-8.953 20-20zm0 0"
      /></svg
    >
  </button>
  <button class="no-fill-button" on:click={share}>
    <svg width="24" height="24" viewBox="0 0 128 128">
      <path
        d="M8 116c-.305 0-.613-.035-.918-.105A4.007 4.007 0 0 1 4 112c0-36.348 4.598-66.578 60-67.953V16a4 4 0 0 1 6.715-2.937l52 48c.82.753 1.285 1.82 1.285 2.937s-.465 2.184-1.285 2.938l-52 48a3.985 3.985 0 0 1-4.32.727A4.002 4.002 0 0 1 64 112V84.047c-38.004.91-45.016 14.93-52.422 29.742A3.998 3.998 0 0 1 8 116zm60-40c2.211 0 4 1.789 4 4v22.863L114.102 64 72 25.137V48c0 2.211-1.789 4-4 4-44.188 0-53.703 17.09-55.574 44.387C20.711 85.258 34.832 76 68 76z"
      />
    </svg>
  </button>
</section>
<div class="divider" />
<section>
  <div class="top">
    <h2>Wishes</h2>
    <div class="items-wrapper">
      <button class="no-fill-button" on:click={newWish}>
        <svg width="20" height="20" viewBox="0 0 512 512">
          <path
            d="M256 512a25 25 0 0 1-25-25V25a25 25 0 0 1 50 0v462a25 25 0 0 1-25 25z"
          />
          <path d="M487 281H25a25 25 0 0 1 0-50h462a25 25 0 0 1 0 50z" />
        </svg>
      </button>
    </div>
  </div>
  {#if data.items.items.length !== 0}
    {#each data.items.items as item}
      <div class="list-item">
        <a
          href="/wishlists/{data.wishlist.wishlist.id}/items/{item.product.id}"
        >
          {item.product.title}
        </a>
      </div>
    {/each}
  {:else}
    <p>No items in wishlist</p>
  {/if}
</section>

<style>
  section {
    padding: 16px 20px;
    background-color: var(--tg-theme-secondary-bg-color);
  }
  .divider {
    min-height: 8px;
    background-color: var(--tg-theme-bg-color);
  }
  .img {
    position: relative;
    min-width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  .img > img {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    height: 100%;
  }
  h1 {
    font-size: 24px;
    color: var(--tg-theme-button-color);
  }
  h2 {
    font-size: 20px;
    color: var(--tg-theme-button-color);
  }
  p {
    margin-top: 1rem;
    color: var(--tg-theme-hint-color);
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .list-item {
    padding: 8px 0;
  }
  .list-item:not(:last-child) {
    padding: 8px 0;
  }
  .list-item > a {
    color: var(--tg-theme-text-color);
  }
  .items-wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .no-fill-button {
    background-color: var(--tg-theme-secondary-bg-color);
  }
  .no-fill-button path {
    fill: var(--tg-theme-hint-color);
    transition: 0.2s;
  }
  .no-fill-button:active path {
    fill: var(--tg-theme-button-color);
  }
</style>
