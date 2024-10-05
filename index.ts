type By6Cluster = {
    /** The 6bit color code. */
    code: number;
    /** The fraction of the total pixels that the color represents. */
    area: number;
    /** The average color of the cluster. */
    bytes: Uint8ClampedArray;
};

function by6(
    bytes: Uint8ClampedArray,
    pxsize = 4,
    aprox = 1
): By6Cluster[] {
    const pxincr = pxsize * aprox;
    const samples = bytes.length / pxincr;

    // NOTE: for each 64 possible 6bit colors, stores:
    // (0) count (1) red (2) green (3) blue
    const map = new Uint32Array(256).fill(0);

    for (let i = 0; i < bytes.length; i += pxincr) {
        const r = bytes[i];
        const g = bytes[i + 1];
        const b = bytes[i + 2];

        const map_i = ((b >> 6) + ((g >> 6) << 2) + ((r >> 6) << 4))
            // NOTE: the 6bit color multiplied by 4 (<< 2)
            // gives us the map index
            << 2;

        map[map_i]++;
        map[map_i + 1] += r;
        map[map_i + 2] += g;
        map[map_i + 3] += b;
    }

    const result: By6Cluster[] = [];

    for (let map_i = 0; map_i < 256; map_i += 4) {
        const count = map[map_i];

        if (count > 0) {
            const bytes = new Uint8ClampedArray(3);

            bytes[0] = map[map_i + 1] / count;
            bytes[1] = map[map_i + 2] / count;
            bytes[2] = map[map_i + 3] / count;

            result.push({
                code: map_i >> 2,
                area: count / samples,
                bytes,
            });
        };
    }

    return result;
}
