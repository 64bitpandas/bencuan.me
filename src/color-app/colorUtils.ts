export function labToXyz(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const delta = 6 / 29;
  const delta3 = delta * delta * delta;

  const xr = fx > delta ? fx * fx * fx : (116 * fx - 16) / 903.3;
  const yr = L > 8 ? fy * fy * fy : L / 903.3;
  const zr = fz > delta ? fz * fz * fz : (116 * fz - 16) / 903.3;

  const Xn = 95.047;
  const Yn = 100.0;
  const Zn = 108.883;

  return [xr * Xn, yr * Yn, zr * Zn];
}

export function xyzToRgb(X: number, Y: number, Z: number): [number, number, number] {
  const x = X / 100;
  const y = Y / 100;
  const z = Z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  const gamma = (c: number) =>
    c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

  r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  b = Math.round(Math.max(0, Math.min(1, gamma(b))) * 255);

  return [r, g, b];
}

export function labToRgb(L: number, a: number, b: number): [number, number, number] {
  const [X, Y, Z] = labToXyz(L, a, b);
  return xyzToRgb(X, Y, Z);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  ).toUpperCase();
}

export function labToHex(L: number, a: number, b: number): string {
  const [r, g, bVal] = labToRgb(L, a, b);
  return rgbToHex(r, g, bVal);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5;
}

export function formatColorName(name: string): { prefix: string; rest: string } {
  const parts = name.split(' ');
  if (parts.length > 1) {
    return { prefix: parts[0], rest: parts.slice(1).join(' ') };
  }
  return { prefix: '', rest: name };
}

export function formatFriendlyName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

