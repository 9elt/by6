/**
 * @param {Uint8ClampedArray} bytes 
 * @returns {{ code: number; area: number; bytes: Uint8Array; }[]}
 */
function bysix(bytes, pxsize = 4, aprox = 1) {
    const inc = pxsize * aprox;
    const len = bytes.length / inc;
    const tot = len / inc;
    const map = new Uint32Array(256).fill(0);
    for (let i = 0; i < len; i += inc) {
        const r = bytes[i];
        const g = bytes[i + 1];
        const b = bytes[i + 2];
        const c = ((b >> 6) + ((g >> 6) << 2) + ((r >> 6) << 4)) << 2;
        map[c]++;
        map[c + 1] += r;
        map[c + 2] += g;
        map[c + 3] += b;
    }
    const result = [];
    for (let c = 0; c < 256; c += 4)
        if (map[c]) {
            const bytes = new Uint8Array(3);
            bytes[0] = map[c + 1] / map[c];
            bytes[1] = map[c + 2] / map[c];
            bytes[2] = map[c + 3] / map[c];
            result.push({ code: c >> 2, bytes, area: map[c] / tot });
        };
    return result;
}
