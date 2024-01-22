/**
 * @param {Uint8ClampedArray} bytes 
 * @returns {{ code: number; area: number; bytes: Uint8ClampedArray; }[]}
 */
function bysix(bytes, pxsize = 4, aprox = 1) {
    const inc = pxsize * aprox;
    const len = bytes.length;
    const tot = len / inc;

    // for each 64 possible 6-bit colors, stores
    // in order: count - red - green - blue
    const map = new Uint32Array(256).fill(0);

    for (let i = 0; i < len; i += inc) {
        const r = bytes[i];
        const g = bytes[i + 1];
        const b = bytes[i + 2];

        // the 6-bit color represented in a single 0-63 number
        // multiplied by 4 (<< 2) is the map index
        const code = ((b >> 6) + ((g >> 6) << 2) + ((r >> 6) << 4)) << 2;

        map[code]++;
        map[code + 1] += r;
        map[code + 2] += g;
        map[code + 3] += b;
    }

    const result = [];

    for (let code = 0; code < 256; code += 4)
        if (map[code]) {
            const bytes = new Uint8ClampedArray(3);
            bytes[0] = map[code + 1] / map[code];
            bytes[1] = map[code + 2] / map[code];
            bytes[2] = map[code + 3] / map[code];

            result.push({ code: code >> 2, bytes, area: map[code] / tot });
        };

    return result;
}
