<script>
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";

  import { onMount } from "svelte";
  export let data;
  console.log(data);

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
            mainButton = tgApp.MainButton
            mainButton.setParams({
                text: "Save",
            })
            if (window.mainButtonFunction) {
                mainButton.offClick(window.mainButtonFunction);
            }

            mainButton.onClick(submitForm);
            window.mainButtonFunction = submitForm;
            mainButton.show();

            const backButton = tgApp.BackButton
            if (window.backButtonFunction) {
                backButton.offClick(window.backButtonFunction);
            }
            const back = () => {
                mainButton.hide();
                backButton.hide();
                gotoRoute('/wishlists/'+data.wishlist.wishlist.id)
            }
            backButton.onClick(back);
            window.backButtonFunction = back;
            backButton.show();
        }
    })

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
        description: "Электроавтомобиль",
        url: "",
        // image: "",
      },
      is_booking_available: true,
    };
  }
</script>

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
    Title
    <input readonly={loading} name="title" value={item.product.title} />
  </label>
  <label class="hint-text">
    Price from
    <input
      type="number"
      readonly={loading}
      name="price_from"
      value={item.product.price_from}
    />
  </label>
  <label class="hint-text">
    URL
    <input readonly={loading} name="url" value={item.product.url} />
  </label>
  <label class="hint-text">
    Description
    <textarea readonly={loading} aria-multiline="true" name="description"
      >{item.product.description}</textarea
    >
  </label>
  <label class="hint-text">
    <input
      type="checkbox"
      readonly={loading}
      name="is_booking_available"
      checked={item.is_booking_available}
    />
    Booking available
  </label>
  {#if !mainButton}
    <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
  {/if}
</form>

<style>
  form,
  label {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  label {
    margin-bottom: 1rem;
  }
</style>
