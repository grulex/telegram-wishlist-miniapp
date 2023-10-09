import { error } from "@sveltejs/kit";
import {env} from "$lib/env.js";
export async function DELETE({ params, cookies }) {
    let req = await fetch(env.BACKEND_HOST+`api/wishlists/${params.wishlist_id}/items/${params.product_id}`, {
        headers: {
            'authorization': cookies.get('tg_init_data'),
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
    const rJson = await request.json()
    if (rJson.action === 'book') {
        let req = await fetch(env.BACKEND_HOST+`api/wishlists/${params.wishlist_id}/items/${params.product_id}/book`, {
            headers: {
                'authorization': cookies.get('tg_init_data'),
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
        let req = await fetch(env.BACKEND_HOST+`api/wishlists/${params.wishlist_id}/items/${params.product_id}/book`, {
            headers: {
                'authorization': cookies.get('tg_init_data'),
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
        let req = await fetch(env.BACKEND_HOST+`api/wishlists/${params.wishlist_id}/items`, {
            headers: {
                'authorization': cookies.get('tg_init_data'),
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                product: {
                    id: params.product_id,
                },
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
