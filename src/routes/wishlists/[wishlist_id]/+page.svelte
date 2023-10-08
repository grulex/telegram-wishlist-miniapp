<script>
    import {goto as gotoRoute} from '$app/navigation'
    import {getContext} from "svelte";
    export let data;
    console.log(data)
    let newWish = () => gotoRoute(`/wishlists/${data.wishlist.wishlist.id}/items/new/edit`)
    let editWishlist = () => gotoRoute(`/wishlists/${data.wishlist.wishlist.id}/edit`)
    let share = () => {

        window.Telegram.WebApp.switchInlineQuery("my", ['users', 'groups', 'channels'])
    }

</script>

<h1>{data.wishlist.wishlist.title}</h1>
<p>{data.wishlist.wishlist.description}</p>
<button class="action-button" on:click={share}>Share</button><br><br>

<button class="action-button" on:click={editWishlist}>Edit wishlist</button>
<h2>Wishes:</h2>
<button class="action-button" on:click={newWish}>Add wish</button>
{#if data.items.items.length !== 0}
    {#each data.items.items as item}
        <div class="secondary-block">
            <a href="/wishlists/{data.wishlist.wishlist.id}/items/{item.product.id}">
                {item.product.title}
            </a>
        </div>
    {/each}
{:else}
    <p>No items in wishlist</p>
{/if}
