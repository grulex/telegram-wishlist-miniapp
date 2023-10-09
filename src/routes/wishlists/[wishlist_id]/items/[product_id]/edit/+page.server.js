import {error} from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export const actions = {
    create: async ({ request, cookies }) => {
        const back = env.BACKEND_HOST

        const data = await request.formData();
        let wishlist_id = data.get('wishlist_id')
        let product_id = data.get('product_id')
        let title = data.get('title')
        let price = data.get('price_from')
        let url = data.get('url')
        let description = data.get('description')
        let is_booking_available = data.get('is_booking_available') === "on"

        if (price !== '') {
            price = {
                number: price,
                currency: 'USD',
            }
        } else {
            price = null
        }

        let jsonRequest = {
            is_booking_available: is_booking_available,
            product: {
                id: product_id,
                title: title,
                price_from: price,
                url: url,
                description: description,
            },
        }
        console.log("request", jsonRequest)
        let req = await fetch(back+'api/wishlists/'+wishlist_id+'/items', {
            headers: {
                'authorization': cookies.get('tg_init_data'),
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(jsonRequest),
        });
        let status = req.status
        let jsonResponse = await req.json()
        if (status !== 200) {
            throw error(status, jsonResponse)
        }
        throw redirect(302, '/wishlists/'+wishlist_id);
    }
};
