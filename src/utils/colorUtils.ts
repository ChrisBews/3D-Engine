import { radiansToDegrees } from 'utils/mathUtils';
import { colorType } from '../constants/colors';

export const convertColorToUnits = (color: rgb | rgba): rgba => {
  return {
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255,
    a: color['a'] ? color['a'] : 1,
  };
};

export const getColorType = (color: any): colorType => {
  if (typeof color !== 'string') return undefined;
  if (validHex(color)) return colorType.hex;
  if (validRGB(color)) return colorType.rgb;
  if (validRGBA(color)) return colorType.rgba;
  if (validHSL(color)) return colorType.hsl;
  if (validHSLA(color)) return colorType.hsla;
};

export const validHex = (color: string): boolean => {
  color = this.expandHex(color);

  return /^#[0-9A-F]{6}$/i.test(color);
};

export const validRGB = (color: string): boolean => {
  return /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i.test(color);
};

export const validRGBA = (color: string): boolean => {
  return /^rgba\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/i.test(color);
};

export const validHSL = (color: string): boolean => {
  return /^hsl\((\d+(\.\d)*)(turn|rad)*,\s*([\d.]+)%,\s*([\d.]+)%\)$/i.test(color);
};

export const validHSLA = (color: string): boolean => {
  return /hsla\((\d+(\.\d)*)(turn|rad)*,\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d+(?:\.\d+)?)\)/i.test(color);
};

export const expandHex = (color: string): string => {
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
};

export const convertToRGBA = (color: string, type: colorType): string => {
  if (type === colorType.rgb) {
    return this.rgbToRGBA(color);
  } else if (type === colorType.hex) {
    return this.hexToRGBA(color);
  } else if (type === colorType.hsl || type === colorType.hsla) {
    return this.hslToRGBA(color);
  } else {
    return color;
  }
};

export const rgbToRGBA = (color: string): string => {
  if (this.validRGB(color)) {
    color = color.replace('rgb', 'rgba');
    color = color.replace(')', ', 1)');
  }
  return color;
};

export const hexToRGBA = (color: string): string => {
  let colorArray: string[];
  let newColorValue: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    colorArray = color.substring(1).split('');
    // handle short hex like #0FF
    if (colorArray.length === 3) {
      colorArray = [colorArray[0], colorArray[0], colorArray[1], colorArray[1], colorArray[2], colorArray[2]];
    }
    newColorValue = `0x${colorArray.join('')}`;
    return `rgba(${[(newColorValue>>16)&255, (newColorValue>>8)&255, newColorValue&255].join(',')}, 1)`;
  }
  throw new Error('colorUtils.hexToRGBA: Invalid hex color');
};

export const hslToRGBA = (color: string): string => {
  let newColor = color.replace('hsla(', '');
  newColor = newColor.replace(/%|deg/g, '');
  newColor = newColor.replace('hsl(', '');
  newColor = newColor.replace(')', '');
  let colorArray: string[] = newColor.split(',');
  let h: any = newColor[0];
  if (h !== '0') {
    // Check for radians or turns as units
    if (h.search('rad') > -1) {
      h = radiansToDegrees(parseFloat(h.replace('rad', '')));
    } else if (h.search('turn') > -1) {
      h = parseFloat(h.replace('turn', '')) * 360;
    }
  }

  h = parseFloat(h) / 360;
  const s = parseFloat(newColor[1]) / 100;
  const l = parseFloat(newColor[2]) / 100;
  const a = newColor[3] ? parseFloat(newColor[3]) : 1;
  let r, g, b;
  if (s === 0) {
    r = g = b = 0;
  } else {
    const q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = this.hueToRGB(p, q, h + 1/3) * 255;
    g = this.hueToRGB(p, q, h) * 255;
    b = this.hueToRGB(p, q, h - 1/3) * 255;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const hueToRGB = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;

  return p;
};

export const getColorBetweenRGBA = (start: string, end: string, percentage: number): rgba | string => {
  const startValues: rgba = this.getColorValuesFromRGBAString(start);
  const endValues: rgba = this.getColorValuesFromRGBAString(end);
  ['r', 'g', 'b', 'a'].forEach(value => {
    startValues[value] = parseFloat(startValues[value]);
    endValues[value] = parseFloat(endValues[value]);
  });
  let r = Math.round(startValues.r + ((endValues.r - startValues.r) * percentage));
  let g = Math.round(startValues.g + ((endValues.g - startValues.g) * percentage));
  let b = Math.round(startValues.b + ((endValues.b - startValues.b) * percentage));
  let a = startValues.a + ((endValues.a - startValues.a) * percentage);

  return {r, g, b, a};
  /*return Oomph3D.motion.outputColorsAsStrings
    ? `rgba(${r}, ${g}, ${b}, ${a})`
    : {r, g, b, a};*/
};

export const getColorValuesFromRGBA = (color: string): rgba => {
  color = color.replace(/ |rgba\(|rgb\(|, |,|)/, '');
  const colorArray: string[] = color.split(',');
  let r: any = colorArray[0];
  let g: any = colorArray[1];
  let b: any = colorArray[2];
  if (r.search('%') > -1) r = (parseInt(r, 10) / 100) * 255;
  if (g.search('%') > -1) g = (parseInt(g, 10) / 100) * 255;
  if (b.search('%') > -1) b = (parseInt(b, 10) / 100) * 255;

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: colorArray[3] ? parseFloat(colorArray[3]) : 1,
  };
};
