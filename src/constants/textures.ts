// A 16 x 16 checked placeholder texture
export const defaultTexture = (() => {
  const texture: Uint8Array = new Uint8Array(4 * 16 * 16);
  for (let i: number = 0; i < 16; i++) {
    for (let j: number = 0; j < 16; j++) {
      const offset = 64 * i + 4 * j;
      // If this is the bottom left or top right square of the 4 square check, color is grey
      // Otherwise the color should be white
      const color: number = ((i < 8 && j < 8) || (i >= 8 && j >= 8)) ? 150 : 255;
      texture[offset] = color; // r
      texture[offset + 1] = color; // g
      texture[offset + 2] = color; // b
      texture[offset + 3] = 255; // alpha
    }
  }
  return texture;
})();
