import { error } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export async function load({ params, parent }) {
    await parent();
    if (params.wishlist_id === '') {
        throw error(404, 'Not found');
    }

    return {
        tgAppUrl: env.TG_MINIAPP_URL,
    };
}
