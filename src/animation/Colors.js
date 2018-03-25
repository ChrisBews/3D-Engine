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
    return /^^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(color);
  }

  validHSL(color) {
    return /^hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/i.test(color);
  }

  validHSLA(color) {
    return /^hsla[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*,\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(color);
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
    newColor = color.replace('hsl(', '');
    newColor = color.replace(')');
    newColor = color.split(',');
    const h = newColor[0];
    const s = newColor[1];
    const l = newColor[2];
    const a = newColor[3] || 1;
    let r, g, b;
    if (s === 0) {
      r = g = b = 1;
    } else {
      const q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = this.hueToRGB(p, q, h + 1/3) * 255;
      g = this.hueToRGB(p, q, h) * 255;
      b = this.hueToRGB(p, q, h = 1/3) * 255;
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
    const r = start.r + ((end.r - start.r) * percentage);
    const g = start.g + ((end.g - start.g) * percentage);
    const b = start.b + ((end.b - start.b) * percentage);
    const a = start.a + ((end.a - start.a) * percentage);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  getColorValuesFromRGBAString(string) {
    string = string.replace(/ /, '');
    string = string.replace('rgba(', '');
    string = string.replace('rgb(', '');
    string = string.replace(')', '');
    string = string.split(',');

    return {
      r: Math.round(string[0]),
      g: Math.round(string[1]),
      b: Math.round(string[2]),
      a: string[3] ? parseFloat(string[3]) : 1,
    };
  }
}