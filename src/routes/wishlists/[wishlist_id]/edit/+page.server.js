import {error} from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export const actions = {
    default: async ({request, cookies}) => {
        const back = env.BACKEND_HOST

        await  new Promise(r => setTimeout(r, 1000)); // todo: remove this
        const data = await request.formData();
        let title = data.get('title')
        let description = data.get('description')
        let is_default = data.get('is_default') === "true"
        let id = data.get('id')

        let jsonRequest = {
            wishlist: {
                title: title,
                description: description,
                is_default: is_default,
            }
        }
        let req = await fetch(back+'api/wishlists/'+id, {
            headers: {
                'authorization': cookies.get('tg_init_data'),
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(jsonRequest),
        });
        let status = req.status
        let jsonResponse = await req.json()
        if (status !== 200) {
            throw error(status, jsonResponse)
        }
        throw redirect(302, '/wishlists/'+id);
    }
};
