<script>
    import {goto as gotoRoute} from '$app/navigation'
    import {onMount} from "svelte";

    export let data;

    onMount(() => {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
        const tgApp = window.Telegram.WebApp;
        const wishlistId = tgApp.initDataUnsafe.start_param;
        if (wishlistId) {
            gotoRoute('/wishlists/'+wishlistId)
        } else {
            gotoRoute('/wishlists/'+data.profile.default_wishlist.id)
        }
    })
</script>
