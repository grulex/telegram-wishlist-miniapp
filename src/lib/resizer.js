const getMinSize = (defaultLink, sizes, fromSize) => {
    if (!sizes || sizes.length === 0) {
        return defaultLink;
    }
    let max = sizes[sizes.length - 1];
    for (let i = sizes.length - 1; i >= 0; i--) {
        const size = sizes[i];
        if (size.width <= fromSize || size.height <= fromSize) {
            break;
        }
        max = size;
    }
    return max.link;
}

export { getMinSize };
