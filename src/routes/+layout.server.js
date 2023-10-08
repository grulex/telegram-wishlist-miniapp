/** /src/lib/other.js **/
import { env } from '$lib/env'

export async function load({cookies}) {
    const back = env.BACKEND_HOST
    let resp = await fetch(back + '/api/profile', {
        headers: {
            'authorization': cookies.get('tg_init_data')
        },
    });
    let profile = await resp.json();

    return {
        profile: profile,
    }
}
