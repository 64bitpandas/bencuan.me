// CIELAB to sRGB conversion utilities

function labToXyz(l: number, a: number, b: number): [number, number, number] {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const delta = 6 / 29;
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const x = xn * (fx > delta ? fx ** 3 : (fx - 16 / 116) * 3 * delta ** 2);
  const y = yn * (fy > delta ? fy ** 3 : (fy - 16 / 116) * 3 * delta ** 2);
  const z = zn * (fz > delta ? fz ** 3 : (fz - 16 / 116) * 3 * delta ** 2);

  return [x, y, z];
}

function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  const gamma = (c: number) =>
    c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

  r = Math.round(Math.min(255, Math.max(0, gamma(r) * 255)));
  g = Math.round(Math.min(255, Math.max(0, gamma(g) * 255)));
  b = Math.round(Math.min(255, Math.max(0, gamma(b) * 255)));

  return [r, g, b];
}

export function labToRgb(l: number, a: number, b: number): [number, number, number] {
  const [x, y, z] = labToXyz(l, a, b);
  return xyzToRgb(x, y, z);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

export function labToHex(l: number, a: number, b: number): string {
  const [r, g, bl] = labToRgb(l, a, b);
  return rgbToHex(r, g, bl);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function getPantoneColorCode(name: string): string | null {
  const match = name.match(/\d{2}-\d{4}/);
  return match ? match[0] : null;
}

export function formatPantoneName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getColorPrefix(name: string): string {
  if (name.startsWith('PANTONE+') || name.startsWith('PANTONE ')) {
    return 'PANTONE';
  }
  if (name.startsWith('TOYO')) {
    return 'TOYO';
  }
  const match = name.match(/^([A-Z]+)/);
  return match ? match[1] : '';
}

