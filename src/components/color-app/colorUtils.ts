export function labToRgb(L: number, a: number, b: number): [number, number, number] {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const delta = 6 / 29;
  const f = (t: number) => (t > delta ? t * t * t : 3 * delta * delta * (t - 4 / 29));

  x = 0.95047 * f(x);
  y = 1.0 * f(y);
  z = 1.08883 * f(z);

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let bl = x * 0.0557 + y * -0.204 + z * 1.057;

  const gamma = (c: number) => (c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c);

  r = Math.round(Math.max(0, Math.min(255, gamma(r) * 255)));
  g = Math.round(Math.max(0, Math.min(255, gamma(g) * 255)));
  bl = Math.round(Math.max(0, Math.min(255, gamma(bl) * 255)));

  return [r, g, bl];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

export function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.179;
}

export function formatPantoneName(fullName: string, pantoneNames: Record<string, { name: string; hex: string }>): string | null {
  const match = fullName.match(/(\d{2}-\d{4})/);
  if (match) {
    const code = match[1];
    const entry = pantoneNames[code];
    if (entry) {
      return entry.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return null;
}

export function getColorBookPrefix(title: string): string {
  if (title.startsWith('PANTONE') || title.startsWith('PANTONE+')) return 'PANTONE';
  if (title.startsWith('TOYO')) return 'TOYO';
  if (title.startsWith('HKS')) return 'HKS';
  if (title.startsWith('DIC')) return 'DIC';
  if (title.startsWith('FOCOLTONE')) return 'FOCOLTONE';
  if (title.startsWith('ANPA')) return 'ANPA';
  if (title.startsWith('TRUMATCH')) return 'TRUMATCH';
  return title.split(' ')[0];
}

