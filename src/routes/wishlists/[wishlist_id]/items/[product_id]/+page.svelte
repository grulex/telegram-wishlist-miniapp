<script>
    import {onMount} from "svelte";
    import {goto as gotoRoute, invalidateAll} from "$app/navigation";

    /** @type {import('./$types').PageData} */
    export let data;

    onMount(() => {
        const isTgInitialized = window.Telegram.WebApp.initData !== "";
        if (isTgInitialized) {
            const tgApp = window.Telegram.WebApp;
            const backButton = tgApp.BackButton
            if (window.backButtonFunction) {
                backButton.offClick(window.backButtonFunction);
            }
            const back = () => {
                backButton.hide();
                gotoRoute('/wishlists/'+data.wishlist.wishlist.id)
            }
            backButton.onClick(back);
            window.backButtonFunction = back;
            backButton.show();
        }
    })

    let removeInProgress = false;
    let bookInProgress = false;
    let unbookInProgress = false;
    let copyToMyWishlistInProgress = false;
    let copyToMyWishlistSuccess = false;

    const remove = async () => {
        const button = {id: 'yes', type:'destructive', text: 'Yes'};

        const callback = async (id) => {
            if (id === 'yes') {
                removeInProgress = true;
                const response = await fetch('', {method: 'DELETE'});
                if (response.status === 200) {
                    await invalidateAll();
                    await gotoRoute('/wishlists/'+data.wishlist.wishlist.id)
                }
                removeInProgress = false;
            }
        }

        await showDialog('Removing', 'Do you want to remove this wish?', button, callback);
    }
    const book = async () => {
        const button = {id: 'yes', type:'ok', text: 'Yes!'};

        const callback = async (id) => {
            if (id === 'yes') {
                bookInProgress = true;
                const response = await fetch('', {method: 'POST', body: JSON.stringify({action:"book"})})
                if (response.status === 200) {
                    await invalidateAll();
                    await gotoRoute('/wishlists/'+data.wishlist.wishlist.id)
                }
                bookInProgress = false;
            }
        }

        await showDialog('Booking', 'Are you planning to fulfill this wish?', button, callback);
    }
    const unbook = async () => {
        const button = {id: 'yes', type:'ok', text: 'Yes'};

        const callback = async (id) => {
            if (id === 'yes') {
                unbookInProgress = true;
                const response = await fetch('', {method: 'POST', body: JSON.stringify({action:"unbook"})})
                if (response.status === 200) {
                    await invalidateAll();
                    await gotoRoute('/wishlists/'+data.wishlist.wishlist.id)
                }
                unbookInProgress = false;
            }
        }

        await showDialog('Unbooking', 'Do you no longer want to fulfill this desire?', button, callback);
    }

    const copyToMyWishlist = async () => {
        copyToMyWishlistInProgress = true;
        const response = await fetch('', {method: 'POST', body: JSON.stringify({action:"copy"})})
        if (response.status === 200) {
            copyToMyWishlistSuccess = true;
            await invalidateAll();
        }
        copyToMyWishlistInProgress = false;
    }

    const showDialog = async (title, message, button, callback) =>  {
        const params = {
            title: title,
            message: message,
            buttons: [
                {type:'cancel', text: 'No'},
                button,
            ],
        }
        await window.Telegram.WebApp.showPopup(params, callback);
    }


    let item = data.itemsByProductId[data.productId];
    let product = item.product;
    console.log(item);
    let isOwner = data.wishlist.wishlist.is_my_wishlist;
    let isBookedByCurrentUser = item.is_booked_by_current_user;

</script>

<h1>{product.title}</h1>
<p>Price from {product.price_from.number} {product.price_from.currency}</p>
<p>Link: <a href="{product.url}" target="_blank">{product.url}</a></p>
<p>Description:</p>
<p>{product.description}</p>
<p>Booking {item.is_booking_available ? "is available" : "is not available"}</p>



{#if !isOwner }
    <button on:click={remove}>Remove</button>
{:else}
    {#if isBookedByCurrentUser}
        <button on:click={unbook}>Unbook</button>
    {:else}
        <button on:click={book}>
            {#if bookInProgress}
                Booking...
            {:else}
                Book
            {/if}
        </button>
    {/if}
    <button on:click={copyToMyWishlist}>Copy to my Wishlist</button>
{/if}
