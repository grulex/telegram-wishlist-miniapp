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

    let item = data.itemsByProductId[data.productId];
    let product = item.product;
</script>

<h1>{product.title}</h1>
<p>Price from {product.price_from.number} {product.price_from.currency} to {product.price_to.number} {product.price_to.currency}</p>
<p>Link: <a href="{product.url}" target="_blank">{product.url}</a></p>
<p>Description:</p>
<p>{product.description}</p>
<p>Booking {item.is_booking_available ? "is available" : "is not available"}</p>
