<script>
    import {goto as gotoRoute} from '$app/navigation'

    export let data;
    console.log(data)
    gotoRoute('/wishlists/'+data.profile.default_wishlist.id)
</script>
