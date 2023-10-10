<script>
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";

  import { onMount } from "svelte";
  export let data;

  let mainButton = false;
  let loading = false;

  const startLoading = () => {
    loading = true;
    if (mainButton) {
      mainButton.showProgress();
    }
  };
  const finishLoading = () => {
    loading = false;
    if (mainButton) {
      mainButton.enable();
      mainButton.hideProgress();
      mainButton.hide();
    }
  };

  async function handleSubmit(form) {
    startLoading();

    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: data,
    });

    const result = deserialize(await response.text());

    if (result.type === "success") {
      // rerun all `load` functions, following the successful update
      await invalidateAll();
    }

    await applyAction(result);
    finishLoading();
  }

  const submitForm = (e) => {
    let form;
    if (e) {
      form = e.currentTarget;
    } else {
      form = document.getElementsByName("form")[0];
    }
    handleSubmit(form);
  };

  onMount(() => {
    const isTgInitialized = window.Telegram.WebApp.initData !== "";
    if (isTgInitialized) {
      const tgApp = window.Telegram.WebApp;
      mainButton = tgApp.MainButton;
      mainButton.setParams({
        text: "Save",
      });
      if (window.mainButtonFunction) {
        mainButton.offClick(window.mainButtonFunction);
      }

      mainButton.onClick(submitForm);
      window.mainButtonFunction = submitForm;
      mainButton.show();

      const backButton = tgApp.BackButton;
      if (window.backButtonFunction) {
        backButton.offClick(window.backButtonFunction);
      }
      const back = () => {
        mainButton.hide();
        backButton.hide();
        gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
      };
      backButton.onClick(back);
      window.backButtonFunction = back;
      backButton.show();
    }
  });

  let productId = data.productId === "new" ? "" : data.productId;
  let item = data.itemsByProductId[productId];

  if (!item) {
    if (productId === "new") {
    }
    item = {
      product: {
        id: "",
        title: "Tesla Model X",
        price_from: "78000.00",
        description: "Electric car",
        url: "",
        // image: "",
      },
      is_booking_available: true,
    };
  }
</script>

<section>
  <h1>{productId ? "Edit wish" : "Add wish"}</h1>

  <form
    name="form"
    method="post"
    on:submit|preventDefault={submitForm}
    action="?/create"
  >
    <input type="hidden" name="wishlist_id" value={data.wishlist.wishlist.id} />
    <input type="hidden" name="product_id" value={productId} />

    <label class="hint-text">
      <p>Title</p>
      <input readonly={loading} name="title" placeholder={item.product.title} />
    </label>

    <!-- <label class="hint-text">
      <p>Price from</p>
      <input
        type="number"
        readonly={loading}
        name="price_from"
        placeholder={item.product.price_from}
      />
    </label> -->

    <label class="hint-text">
      <p>URL</p>
      <input readonly={loading} name="url" value={item.product.url} />
    </label>

    <label class="hint-text">
      <p>Description</p>
      <textarea
        readonly={loading}
        aria-multiline="true"
        name="description"
        placeholder={item.product.description}
      />
    </label>

    <label class="label-checkbox">
      <input
        class="checkbox"
        type="checkbox"
        readonly={loading}
        name="is_booking_available"
        checked={item.is_booking_available}
      />
      <span class="hint-text">Booking available</span>
    </label>

    {#if !mainButton}
      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    {/if}
  </form>
</section>

<style>
  h1 {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea {
    padding: 0.3em 0.5em;
    border-radius: 8px;
    width: 100%;
    border: none;
    font-size: 1rem;
    border: 1px solid var(--tg-theme-button-color);
  }
  textarea {
    resize: none;
    min-height: 4.2em;
  }
  p {
    margin: 0 0 0.2rem;
  }
  span {
    align-items: center;
  }
  .label-checkbox {
    display: flex;
    cursor: pointer;
  }
  .checkbox {
    width: 1em;
    height: 1em;
    margin-right: 0.3em;
    color: var(--tg-theme-button-color);
  }
  .checkbox:checked {
    color: var(--tg-theme-button-color);
  }
</style>
