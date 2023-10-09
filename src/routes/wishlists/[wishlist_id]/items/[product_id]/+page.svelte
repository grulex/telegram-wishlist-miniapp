<script>
    import {onMount} from "svelte";
    import {goto as gotoRoute} from "$app/navigation";

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

    const remove = () => {
        fetch('', {method: 'DELETE'}).then(() => {console.log("OK")})
    }
    const book = () => {
        fetch('', {method: 'POST', body: JSON.stringify({action:"book"})}).then(() => {console.log("OK")})
    }
    const unbook = () => {
        fetch('', {method: 'POST', body: JSON.stringify({action:"unbook"})}).then(() => {console.log("OK")})
    }
    const copyToMyWishlist = () => {
        fetch('', {method: 'POST', body: JSON.stringify({action:"copy"})}).then(() => {console.log("OK")})
    }

    let item = data.itemsByProductId[data.productId];
    let product = item.product;
    let isOwner = data.wishlist.wishlist.is_my_wishlist;

</script>

<h1>{product.title}</h1>
<p>Price from {product.price_from.number} {product.price_from.currency}</p>
<p>Link: <a href="{product.url}" target="_blank">{product.url}</a></p>
<p>Description:</p>
<p>{product.description}</p>
<p>Booking {item.is_booking_available ? "is available" : "is not available"}</p>



{#if isOwner }
    <button on:click={remove}>Remove</button>
{:else}
    <button on:click={book}>Book!</button>
    <button on:click={unbook}>Unbook</button>
    <button on:click={copyToMyWishlist}>Copy to my Wishlist</button>
{/if}
