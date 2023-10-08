import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
    await parent();
    if (params.wishlist_id === '') {
        throw error(404, 'Not found');
    }

    return {

    };
}
