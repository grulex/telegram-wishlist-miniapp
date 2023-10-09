export function DELETE({ params, cookies }) {

    console.log("DELETE", params.wishlist_id, params.product_id, cookies.get('tg_init_data'))
    return new Response('DELETED', { status: 200 });
}

export async function POST({ params, cookies, request }) {
    const rJson = await request.json()
    if (rJson.action === 'book') {
        console.log("BOOK", params.wishlist_id, params.product_id, cookies.get('tg_init_data'))
        return new Response('BOOKED', { status: 200 });

    } else if (rJson.action === 'unbook') {
        console.log("UNBOOK", params.wishlist_id, params.product_id, cookies.get('tg_init_data'))
        return new Response('UNBOOKED', { status: 200 });
    } else if (rJson.action === 'copy') {
        console.log("COPY", params.wishlist_id, params.product_id, cookies.get('tg_init_data'))
        return new Response('COPIED', { status: 200 });
    }

}
