<script>
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";
  import { _ } from "$lib/i18n";
  import { onMount } from "svelte";
  import ImgCompressedInput from "$lib/ImgCompressedInput.svelte";

  export let data;

  let mainButton = false;
  $: if (mainButton) {
    mainButton.setParams({
      text: $_('app.save'),
    });
    if (window.mainButtonFunction) {
      mainButton.offClick(window.mainButtonFunction);
    }

    mainButton.onClick(submitForm);
    window.mainButtonFunction = submitForm;
    mainButton.show();
  }

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

  let titleObj;
  const submitForm = (e) => {
    titleObj.required = true
    if (titleObj.value === "") {
      titleObj.reportValidity()
      return
    }
    let form;
    if (e) {
      form = e.currentTarget;
    } else {
      form = document.getElementsByName("form")[0];
    }
    if (!form.checkValidity()) {
      return
    }
    handleSubmit(form);
  };

  onMount(() => {
    const isTgInitialized = window.Telegram.WebApp.initData !== "";
    if (isTgInitialized) {
      const tgApp = window.Telegram.WebApp;
      mainButton = tgApp.MainButton;

      const backButton = tgApp.BackButton;
      if (window.backButtonFunction) {
        backButton.offClick(window.backButtonFunction);
      }
      const back = () => {
        mainButton.hide();
        backButton.hide();
        if (data.productId === "new") {
          gotoRoute("/wishlists/" + data.wishlist.wishlist.id);
        } else {
            gotoRoute("/wishlists/" + data.wishlist.wishlist.id + "/items/" + data.productId);
        }
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
        image: {
          link: "https://wishlist.super-app.studio/api/images/dGVsZWdyYW1fYm90OkFnQUNBZ0lBQXhrREFBTkJaVG1mUXhlM1M5Mk8yVmRyY0pMZzVSZ2ZrTW9BQWp6WE1SdnR1ZEZKVGhtT3B3Sk9ibklCQUFNQ0FBTjRBQU13QkE="
        },
      },
      is_booking_available: true,
    };
  }
  let action = "create";
  if (productId) {
      action = "update";
  }

  let descriptionField;
  const resizeTextarea = () => {
    descriptionField.style.height = "auto";
    descriptionField.style.height = descriptionField.scrollHeight + "px";
    descriptionField.scrollTop = descriptionField.scrollHeight;
  }
  $: if (descriptionField) {
    resizeTextarea();
  }

  let fileInput;
  let image = item.product.image ? item.product.image['link'] : "https://wishlist.super-app.studio/api/images/dGVsZWdyYW1fYm90OkFnQUNBZ0lBQXhrREFBTkJaVG1mUXhlM1M5Mk8yVmRyY0pMZzVSZ2ZrTW9BQWp6WE1SdnR1ZEZKVGhtT3B3Sk9ibklCQUFNQ0FBTjRBQU13QkE=";
  const onFileSelected = (imageObj) => {
    let reader = new FileReader();
    reader.readAsDataURL(imageObj);
    reader.onload = e => {
      image = e.target.result;
    };
  }
</script>

<section>
  <h1>{productId ? $_('app.edit') : $_('app.add_wish')}</h1>

  <form
    name="form"
    method="post"
    on:submit|preventDefault={submitForm}
    action="?/{action}"
  >
    <input type="hidden" name="wishlist_id" value={data.wishlist.wishlist.id} />
    <input type="hidden" name="product_id" value={productId} />

    <div class="image-box">
      <div class="image">
          <img alt="product" height="100" src="{image}"/>
      </div>
      <button class="upload-button" type="button" disabled={loading} on:click={() => { fileInput.click();}} >
        Choose new Image...
      </button>
    </div>
    <ImgCompressedInput name="image" onCompressed={onFileSelected} bind:fileInput={fileInput}/>

    <label class="hint-text">
      <p>{$_('app.title')}</p>
      <input
        maxlength="40"
        readonly={loading}
        name="title"
        bind:this={titleObj}
        placeholder={item.product.title}
        value="{productId ? item.product.title : ''}"
      />
    </label>

    <label class="hint-text">
      <p>URL</p>
      <input
        readonly={loading}
        name="url"
        type="url"
        pattern="https://.*"
        spellcheck="false"
        placeholder="https://example.com/..."
        value="{productId ? item.product.url : ''}"
      />
    </label>

    <label class="hint-text">
      <p>{$_('app.description')}</p>
      <textarea
        readonly={loading}
        aria-multiline="true"
        name="description"
        bind:this={descriptionField}
        on:input={resizeTextarea}
        placeholder={item.product.description + "..."}
      >{productId ? item.product.description : ''}</textarea>
    </label>

    <label class="label-checkbox">
      <span class="hint-text">{$_('app.booking_available')}</span>
      <input
        class="checkbox no-visible"
        type="checkbox"
        readonly={loading}
        name="is_booking_available"
        checked={item.is_booking_available}
      />
      <div class="switch" />
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
  p {
    margin: 0 0 0.2rem;
  }
  span {
    align-items: center;
  }
  .label-checkbox {
    position: relative;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 1em;
    -webkit-tap-highlight-color: transparent;
  }

  .checkbox:checked {
    background-color: var(--tg-theme-button-color);
  }
  .no-visible {
    opacity: 0;
    position: absolute;
  }
  .switch {
    position: relative;
    display: inline-block;
    height: 1.5em;
    width: 3em;
    background-color: var(--tg-theme-hint-color);
    border-radius: 999px;
    top: -50%;
    transition: 0.2s;
  }
  .switch::before {
    content: "";
    position: absolute;
    margin: 0.15em;
    height: 1.2em;
    width: 1.2em;
    border-radius: 999px;
    background-color: var(--tg-theme-button-text-color);
    transition: 0.2s;
  }
  .checkbox:checked + .switch {
    background-color: var(--tg-theme-button-color);
  }
  .checkbox:checked + .switch::before {
    transform: translateX(1.5em);
  }
  label p {
    margin-left: 4px;
  }
  label span {
    margin-left: 4px;
  }
  .upload-file {
    display: none;
  }
  .image-box {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  .image {
    height: 100px;
    max-width: 250px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--tg-theme-hint-color);
  }
  .upload-button {
    border: none;
    background: none;
    color: var(--tg-theme-button-color);
  }
</style>
