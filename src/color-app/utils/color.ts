export function normalizeHex(hex: string): string {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length === 3) return raw.split('').map(ch => ch + ch).join('').toLowerCase();
  return raw.toLowerCase();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const raw = normalizeHex(hex);
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map(v => v / 255);
  const lin = srgb.map(v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function titleCaseKebab(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map(part => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
