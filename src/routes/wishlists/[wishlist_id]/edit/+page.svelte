<script>
    import { invalidateAll } from '$app/navigation';
    import { applyAction, deserialize } from '$app/forms';

    import { onMount } from "svelte";
    export let data;

    let mainButton = false
    let loading = false;

    const startLoading = () =>  {
        loading = true;
        if (mainButton) {
            mainButton.disable()
            mainButton.showProgress()
        }
    }
    const finishLoading = () =>  {
        loading = false;
        if (mainButton) {
            mainButton.enable()
            mainButton.hideProgress()
            mainButton.hide()
        }
    }

    const submitForm = (e) => {
        let form
        if (e) {
            form = e.currentTarget
        } else {
            form = document.getElementsByName('form')[0];
        }
        handleSubmit(form)
    }

    onMount(() => {
        const isTgInitialized = window.Telegram.WebApp.initData !== "";
        if (isTgInitialized) {
            const tgApp = window.Telegram.WebApp;
            mainButton = tgApp.MainButton
            mainButton.setParams({
                text: 'Save',
            })
            if (window.mainButtonFunction) {
                mainButton.offClick(window.mainButtonFunction);
            }
            mainButton.onClick(submitForm);
            window.mainButtonFunction = submitForm;
            mainButton.show();
        }
    })

    async function handleSubmit(form) {
        startLoading()

        const data = new FormData(form);

        const response = await fetch(form.action, {
            method: 'POST',
            body: data
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        if (result.type === 'success') {
            // rerun all `load` functions, following the successful update
            await invalidateAll();
        }

        await applyAction(result);
        finishLoading()
    }
</script>

<h1>Edit</h1>
<form name="form" method="post" on:submit|preventDefault={submitForm}>
<label class="hint-text">
    Title<br/>
    <input readonly="{loading}" name="title" value="{data.wishlist.wishlist.title}"/>
</label><br/><br/>
<label class="hint-text">
    Description<br/>
    <textarea readonly="{loading}" aria-multiline="true" name="description">{data.wishlist.wishlist.description}</textarea>
</label>
<input type="hidden" name="id" value="{data.wishlist.wishlist.id}"/>
<input type="hidden" name="is_default" value="{data.wishlist.wishlist.is_default}"/>
<br/><br/>
{#if !mainButton}
    <button disabled="{loading}">{loading?'Saving...':'Save'}</button>
{/if}
</form>
