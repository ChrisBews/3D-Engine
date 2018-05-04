export const convertColorToUnits = (color: rgb | rgba): rgba => {
  return {
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255,
    a: color['a'] ? color['a'] : 1,
  };
};
