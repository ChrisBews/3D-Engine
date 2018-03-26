class Colors {

  constructor() {
    this.HEX = 'hex';
    this.RGB = 'rgb';
    this.HSL = 'hsl';
  }

  getColorType(color) {
    let colorType = undefined;
    if (typeof color !== 'string') return colorType;
    const isHex = this.validHex(color);
    const isRGB = this.validRGB(color) || this.validRGBA(color);
    const isHSL = this.validHSL(color) || this.validHSLA(color);
    
    if (isHex) colorType = this.HEX;
    if (isRGB) colorType = this.RGB;
    if (isHSL) colorType = this.HSL;

    return colorType;
  }

  validHex(color) {
    color = this.expandHex(color);

    return /^#[0-9A-F]{6}$/i.test(color);
  }

  validRGB(color) {
    return /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i.test(color);
  }

  validRGBA(color) {
    return /^rgba\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/i.test(color);
  }

  validHSL(color) {
    return /^hsl\((\d+(\.\d)*)(turn|rad)*,\s*([\d.]+)%,\s*([\d.]+)%\)$/i.test(color);
  }

  validHSLA(color) {
    return /hsla\((\d+(\.\d)*)(turn|rad)*,\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d+(?:\.\d+)?)\)/i.test(color);
  }

  expandHex(color) {
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }

    return color;
  }

  convertToRGBA(color, colorType) {
    if (colorType === this.RGB) {
      return this.rgbToRGBA(color);
    } else if (colorType === this.HEX) {
      return this.hexToRGBA(color);
    } else if (colorType === this.HSL) {
      return this.hslToRGBA(color);
    }
  }

  rgbToRGBA(color) {
    if (this.validRGB(color)) {
      color = color.replace('rgb', 'rgba');
      color = color.replace(')', ', 1)');
    }
    return color;
  }

  hexToRGBA(color) {
    let newColor;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      newColor = color.substring(1).split('');
      // handle short hex like #0FF
      if (newColor.length === 3) {
        newColor = [newColor[0], newColor[0], newColor[1], newColor[1], newColor[2], newColor[2]];
      }
      newColor = `0x${newColor.join('')}`;
      return `rgba(${[(newColor>>16)&255, (newColor>>8)&255, newColor&255].join(',')}, 1)`; 
    }
    console.error('OomphMotion: Invalid hex color');
  }

  hslToRGBA(color) {
    let newColor = color.replace('hsla(', '');
    newColor = newColor.replace(/%|deg/g, '');
    newColor = newColor.replace('hsl(', '');
    newColor = newColor.replace(')');
    newColor = newColor.split(',');
    let h = newColor[0];
    if (h !== 0) {
      // Check for radians or turns as units
      if (h.search('rad') > -1) {
        h = Helpers.radiansToDegrees(parseFloat(h.replace('rad', '')));
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
  }

  hueToRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;

    return p;
  }

  getColorBetweenRGBA(start, end, percentage) {
    start = this.getColorValuesFromRGBAString(start);
    end = this.getColorValuesFromRGBAString(end);
    for (let i = 0; i < start.length; i++) {
      start[i] = parseFloat(start[i]);
      end[i] = parseFloat(end[i]);
    }
    let r = Math.round(start.r + ((end.r - start.r) * percentage));
    let g = Math.round(start.g + ((end.g - start.g) * percentage));
    let b = Math.round(start.b + ((end.b - start.b) * percentage));
    let a = start.a + ((end.a - start.a) * percentage);

    return OomphMotion.outputColorsAsArrays
      ? [r, g, b, a]
      : `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  getColorValuesFromRGBAString(string) {
    string = string.replace(/ /, '');
    string = string.replace('rgba(', '');
    string = string.replace('rgb(', '');
    string = string.replace(')', '');
    string = string.split(',');
    let r = string[0];
    let g = string[1];
    let b = string[2];
    if (r.search('%') > -1) r = (r / 100) * 255;
    if (g.search('%') > -1) g = (g / 100) * 255;
    if (b.search('%') > -1) b = (b / 100) * 255;

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      a: string[3] ? parseFloat(string[3]) : 1,
    };
  }
}