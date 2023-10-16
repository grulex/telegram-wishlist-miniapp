import { error } from "@sveltejs/kit";
import {env} from "$lib/env.js";
export async function DELETE({ params, cookies }) {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
        token = env.TG_DEV_INIT_DATA_BASE64;
    }
    let req = await fetch(env.BACKEND_HOST+`/api/wishlists/${params.wishlist_id}/items/${params.product_id}`, {
        headers: {
            'authorization': token,
        },
        method: 'DELETE',
    });
    let status = req.status
    let jsonResponse = await req.json()
    if (status !== 200) {
        throw error(status, jsonResponse)
    }
    return new Response('Deleted', { status: 200 });
}

export async function POST({ params, cookies, request }) {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
        token = env.TG_DEV_INIT_DATA_BASE64;
    }
    const rJson = await request.json()
    if (rJson.action === 'book') {
        let req = await fetch(env.BACKEND_HOST+`/api/wishlists/${params.wishlist_id}/items/${params.product_id}/book`, {
            headers: {
                'authorization': token,
            },
            method: 'PUT',
        });
        let status = req.status
        let jsonResponse = await req.json()
        if (status !== 200) {
            throw error(status, jsonResponse)
        }
        return new Response('Booked', { status: 200 });
    } else if (rJson.action === 'unbook') {
        let req = await fetch(env.BACKEND_HOST+`/api/wishlists/${params.wishlist_id}/items/${params.product_id}/book`, {
            headers: {
                'authorization': token,
            },
            method: 'DELETE',
        });
        let status = req.status
        let jsonResponse = await req.json()
        if (status !== 200) {
            throw error(status, jsonResponse)
        }
        return new Response('Unbooked', { status: 200 });
    } else if (rJson.action === 'copy') {
        const targetWishlistId = rJson.target_wishlist_id
        let req = await fetch(env.BACKEND_HOST+`/api/wishlists/${targetWishlistId}/items`, {
            headers: {
                'authorization': token,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                product: {
                    id: params.product_id,
                },
                is_booking_available: rJson.is_booking_available,
            }),
        });
        let status = req.status
        let jsonResponse = await req.json()
        if (status !== 200) {
            throw error(status, jsonResponse)
        }
        return new Response('Copied', { status: 200 });
    }
}
