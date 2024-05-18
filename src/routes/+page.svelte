<script>
    import {goto as gotoRoute} from '$app/navigation'
    import {onMount} from "svelte";

    export let data;

    onMount(() => {
        window.Telegram.WebApp.ready();
        const tgApp = window.Telegram.WebApp;
        const startParam = tgApp.initDataUnsafe.start_param;
        if (startParam && startParam.substring(0, 5) !== "tapps") {
            if (startParam[0] === "-") {
                const routeB64 = startParam.substring(1);
                const route = atob(routeB64);
                if (route) {
                    gotoRoute(route)
                    return
                }
            }
            gotoRoute("/wishlists/"+startParam)
        } else {
            gotoRoute("/wishlists/"+data.profile.default_wishlist.id)
        }
    })
</script>

<main>
<!--    todo: wishlist skeleton screen-->
<!--    <section>Loading...</section>-->
</main>
