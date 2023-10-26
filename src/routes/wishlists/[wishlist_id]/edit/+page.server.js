import {error} from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';
import {env} from "$lib/env.js";

export const actions = {
    default: async ({request, cookies}) => {
        let token = cookies.get("tg_init_data");
        if (env.TG_DEV_INIT_DATA_BASE64) {
            token = env.TG_DEV_INIT_DATA_BASE64;
        }

        const data = await request.formData();
        let title = data.get("title")
        let description = data.get("description")
        let is_default = data.get("is_default") === "true"
        let id = data.get("id")

        let avatar = null
        const imageObj = await data.get("image")
        const image = await imageObj.arrayBuffer();
        let buff = new Buffer(image);
        const base64Image = buff.toString("base64");
        if (base64Image) {
            avatar = {
                src: base64Image,
            }
        }

        let jsonRequest = {
            wishlist: {
                title: title,
                description: description,
                is_default: is_default,
                avatar: avatar,
            }
        }
        let req = await fetch(env.BACKEND_HOST+'/api/wishlists/'+id, {
            headers: {
                'authorization': token,
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
