import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    if (params.wishlist_id === '' || params.product_id === '') {
        throw error(404, 'Not found');
    }

    return {
        productId: params.product_id,
    };
}
