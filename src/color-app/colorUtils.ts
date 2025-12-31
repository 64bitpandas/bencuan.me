// CIELAB to RGB/Hex conversion utilities

export interface LABColor {
  L: number;
  a: number;
  b: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function labToXyz(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const delta = 6 / 29;
  const delta3 = delta * delta * delta;
  const factor = 3 * delta * delta;

  const xr = fx > delta ? fx * fx * fx : (fx - 16 / 116) * factor;
  const yr = L > 8 ? fy * fy * fy : L / (24389 / 27);
  const zr = fz > delta ? fz * fz * fz : (fz - 16 / 116) * factor;

  // D65 illuminant
  return [xr * 95.047, yr * 100.0, zr * 108.883];
}

function xyzToRgb(x: number, y: number, z: number): RGBColor {
  x /= 100;
  y /= 100;
  z /= 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  const gammaCorrect = (c: number) =>
    c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

  r = Math.round(Math.max(0, Math.min(255, gammaCorrect(r) * 255)));
  g = Math.round(Math.max(0, Math.min(255, gammaCorrect(g) * 255)));
  b = Math.round(Math.max(0, Math.min(255, gammaCorrect(b) * 255)));

  return { r, g, b };
}

export function labToRgb(L: number, a: number, b: number): RGBColor {
  const [x, y, z] = labToXyz(L, a, b);
  return xyzToRgb(x, y, z);
}

export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function labToHex(L: number, a: number, b: number): string {
  return rgbToHex(labToRgb(L, a, b));
}

export function hexToRgb(hex: string): RGBColor {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function getLuminance(rgb: RGBColor): number {
  const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const [r, g, b] = [rs, gs, bs].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(rgb1: RGBColor, rgb2: RGBColor): number {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastTextColor(bgHex: string): string {
  const rgb = hexToRgb(bgHex);
  const luminance = getLuminance(rgb);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function formatRgb(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

