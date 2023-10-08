import { error } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export async function load({ params, cookies }) {
    const back = env.BACKEND_HOST
    if (params.wishlist_id === '') {
        throw error(404, 'Not found');
    }

    let wishlistReq = await fetch(back+'api/wishlists/'+params.wishlist_id, {
        headers: {
            'authorization': cookies.get('tg_init_data')
        },
    });
    let wishlist = await wishlistReq.json()

    let itemsReq = await fetch(back+'api/wishlists/'+params.wishlist_id+'/items', {
        headers: {
            'authorization': cookies.get('tg_init_data')
        },
    });
    let items = await itemsReq.json()

    items.items = items.items ? items.items : []
    let itemsByProductId = {}
    for (let item of items.items) {
        itemsByProductId[item.id.product_id] = item
    }

    return {
        wishlist: wishlist,
        items: items,
        itemsByProductId: itemsByProductId,
    };
}
