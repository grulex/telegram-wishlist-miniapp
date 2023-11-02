<script>
  import { goto as gotoRoute, invalidateAll } from "$app/navigation";
  import { _ } from "$lib/i18n";
  import { applyAction, deserialize } from "$app/forms";

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
      mainButton.disable();
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

  async function handleSubmit(form) {
    startLoading();

    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: data,
    });

    /** @type {import('@sveltejs/kit').ActionResult} */
    const result = deserialize(await response.text());

    if (result.type === "success") {
      // rerun all `load` functions, following the successful update
      await invalidateAll();
    }

    await applyAction(result);
    finishLoading();
  }

  let fileInput;
  let avatar = data.wishlist.wishlist.avatar?.link;
  const onFileSelected = (imageObj) => {
    let reader = new FileReader();
    reader.readAsDataURL(imageObj);
    reader.onload = e => {
      avatar = e.target.result
    };
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
</script>

<section>
  <h1>{$_('app.edit')}</h1>
  <form name="form" method="post" on:submit|preventDefault={submitForm}>
    <div class="image-box">
      <div class="image">
        <img src="{avatar}" height="100" alt="Avatar" />
      </div>
      <button class="upload-button" type="button" disabled={loading} on:click={() => { fileInput.click();}} >
        Choose new Image...
      </button>
    </div>
    <ImgCompressedInput name="image" onCompressed={onFileSelected} bind:fileInput={fileInput}/>

    <label class="hint-text">
      <p>{$_('app.title')}</p>
      <input
        maxlength="30"
        readonly={loading}
        name="title"
        value={data.wishlist.wishlist.title}
      />
    </label>
    <label class="hint-text">
      <p>{$_('app.description')}</p>
      <textarea readonly={loading} aria-multiline="true" name="description"
                bind:this={descriptionField} on:input={resizeTextarea}
        >{data.wishlist.wishlist.description}</textarea
      >
    </label>
    <input type="hidden" name="id" value={data.wishlist.wishlist.id} />
    <input
      type="hidden"
      name="is_default"
      value={data.wishlist.wishlist.is_default}
    />
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
  label p {
    margin-left: 4px;
  }
  .image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  .image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--tg-theme-hint-color);
  }
  .upload-button {
    border: none;
    background: none;
    color: var(--tg-theme-button-color);
  }
</style>
