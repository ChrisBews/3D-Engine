type rgb = {
  r: number;
  g: number;
  b: number;
}

type rgba = {
  r: number;
  g: number;
  b: number;
  a: number;
}

type hex = string;

type hsl = {
  h: number;
  s: number;
  l: number;
}

type hsla = {
  h: number;
  s: number;
  l: number;
  a: number;
}

type color = rgb | rgba | hex | hsl | hsla;
