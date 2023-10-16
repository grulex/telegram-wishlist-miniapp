/** /src/lib/other.js **/
import { env } from '$lib/env'

export async function load({cookies}) {
    let token = cookies.get("tg_init_data");
    if (env.TG_DEV_INIT_DATA_BASE64) {
        token = env.TG_DEV_INIT_DATA_BASE64;
    }
    let resp = await fetch(env.BACKEND_HOST + '/api/profile', {
        headers: {
            'authorization': token,
        },
    });
    let profile = await resp.json();

    return {
        profile: profile,
    }
}
