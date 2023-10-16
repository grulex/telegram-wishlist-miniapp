import { error } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export async function load({ params, cookies }) {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
        token = env.TG_DEV_INIT_DATA_BASE64;
    }
    if (params.wishlist_id === '') {
        throw error(404, 'Not found');
    }

    let wishlistReq = await fetch(env.BACKEND_HOST+'/api/wishlists/'+params.wishlist_id, {
        headers: {
            'authorization': token,
        },
    });
    let wishlist = await wishlistReq.json()

    let itemsReq = await fetch(env.BACKEND_HOST+'/api/wishlists/'+params.wishlist_id+'/items', {
        headers: {
            'authorization': token,
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
