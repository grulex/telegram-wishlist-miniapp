import { error } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { env } from "$lib/env.js";

export const actions = {
  create: async ({ request, cookies }) => {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
      token = env.TG_DEV_INIT_DATA_BASE64;
    }

    const data = await request.formData();
    let wishlist_id = data.get("wishlist_id");
    let title = data.get("title");
    let url = data.get("url");
    let description = data.get("description");
    let is_booking_available = data.get("is_booking_available") === "on";

    let image = null
    const imageObj = await data.get("image")
    const imageBuffer = await imageObj.arrayBuffer();
    let buff = new Buffer(imageBuffer);
    const base64Image = buff.toString("base64");
    if (base64Image) {
      image = {
        src: base64Image,
      }
    }

    let jsonRequest = {
      is_booking_available: is_booking_available,
      product: {
        title: title,
        url: url,
        description: description,
        image: image,
      },
    };
    let req = await fetch(env.BACKEND_HOST+'/api/wishlists/' + wishlist_id + "/items", {
      headers: {
        'authorization': token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(jsonRequest),
    });
    let status = req.status;
    let jsonResponse = await req.json();
    if (status !== 200) {
      throw error(status, jsonResponse);
    }
    throw redirect(302, "/wishlists/" + wishlist_id);
  },
  update: async ({ request, cookies }) => {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
      token = env.TG_DEV_INIT_DATA_BASE64;
    }

    const data = await request.formData();
    let wishlist_id = data.get("wishlist_id");
    let product_id = data.get("product_id");
    let title = data.get("title");
    let url = data.get("url");
    let description = data.get("description");
    let is_booking_available = data.get("is_booking_available") === "on";

    let image = null
    const imageObj = await data.get("image")
    const imageBuffer = await imageObj.arrayBuffer();
    let buff = new Buffer(imageBuffer);
    const base64Image = buff.toString("base64");
    if (base64Image) {
      image = {
        src: base64Image,
      }
    }

    let jsonRequest = {
      is_booking_available: is_booking_available,
      product: {
        id: product_id,
        title: title,
        url: url,
        description: description,
        image: image,
      },
    };
    let req = await fetch(env.BACKEND_HOST+'/api/wishlists/' + wishlist_id + "/items/"+product_id, {
      headers: {
        'authorization': token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(jsonRequest),
    });
    let status = req.status;
    let jsonResponse = await req.json();
    if (status !== 200) {
      throw error(status, jsonResponse);
    }
    throw redirect(302, "/wishlists/" + wishlist_id + "/items/"+product_id);
  }
};
