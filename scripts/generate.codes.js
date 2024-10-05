const size = 48;
const fontSize = 12;

const width = 16 * size;
const height = 4 * size;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;

for (let i = 0; i < 64; i++) {
    const r = ((i & 0b00110000) >> 4) * 85;
    const g = ((i & 0b00001100) >> 2) * 85;
    const b = (i & 0b00000011) * 85;

    const isDark = r * 0.299 + g * 0.587 + b * 0.114 < 128;

    const x = (i % 16) * size;
    const y = Math.floor(i / 16) * size;
    svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="rgb(${r}, ${g}, ${b})"/>`;

    const color = isDark ? "#ffffff" : "#000000";
    svg += `<text x="${x + size / 2}" y="${y + size / 2}" fill="${color}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${i}</text>`;
}

svg += "</svg>";

require("fs").writeFileSync("media/codes.svg", svg);
