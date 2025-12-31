export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length !== 6) throw new Error(`Invalid hex: ${hex}`);
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const to2 = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

export function rgbToCss({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// CIELAB (D65/2°) -> sRGB
export function labToRgb(l: number, a: number, b: number): Rgb {
  // Reference white (D65)
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const pivot = (t: number) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  x = refX * pivot(x);
  y = refY * pivot(y);
  z = refZ * pivot(z);

  // XYZ -> linear RGB
  x /= 100;
  y /= 100;
  z /= 100;

  let rl = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let gl = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let bl = x * 0.0557 + y * -0.204 + z * 1.057;

  const gamma = (u: number) => (u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055);

  rl = gamma(rl);
  gl = gamma(gl);
  bl = gamma(bl);

  const to255 = (u: number) => Math.max(0, Math.min(255, u * 255));
  return { r: to255(rl), g: to255(gl), b: to255(bl) };
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  const srgb = [r, g, b].map(v => v / 255);
  const lin = srgb.map(u => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function titleCaseFromSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
