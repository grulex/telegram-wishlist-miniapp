<script>
    /** @type {import('./$types').PageData} */
    export let data;

    let item = data.itemsByProductId[data.productId];
    let product = item.product;
</script>

<h1>{product.title}</h1>
<p>Price from {product.price_from.number} {product.price_from.currency} to {product.price_to.number} {product.price_to.currency}</p>
<p>Link: <a href="{product.url}" target="_blank">{product.url}</a></p>
<p>Description:</p>
<p>{product.description}</p>
<p>Booking {item.is_booking_available ? "is available" : "is not available"}</p>
