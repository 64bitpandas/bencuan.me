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

export function labToXyz(lab: LABColor): { x: number; y: number; z: number } {
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let y = (lab.L + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;

  const y3 = Math.pow(y, 3);
  const x3 = Math.pow(x, 3);
  const z3 = Math.pow(z, 3);

  y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
  x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

  return {
    x: x * refX,
    y: y * refY,
    z: z * refZ,
  };
}

export function xyzToRgb(xyz: { x: number; y: number; z: number }): RGBColor {
  const x = xyz.x / 100;
  const y = xyz.y / 100;
  const z = xyz.z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b * 255))),
  };
}

export function labToRgb(lab: LABColor): RGBColor {
  return xyzToRgb(labToXyz(lab));
}

export function rgbToHex(rgb: RGBColor): string {
  const toHex = (c: number) => c.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function labToHex(components: number[]): string {
  const lab: LABColor = { L: components[0], a: components[1], b: components[2] };
  return rgbToHex(labToRgb(lab));
}

export function labToRgbString(components: number[]): string {
  const lab: LABColor = { L: components[0], a: components[1], b: components[2] };
  const rgb = labToRgb(lab);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5;
}

export function formatPantoneName(fullName: string, pantoneNames: Record<string, { name: string; hex: string }>): string | null {
  const match = fullName.match(/(\d{2}-\d{4})/);
  if (!match) return null;
  const code = match[1];
  const entry = pantoneNames[code];
  if (!entry) return null;
  return entry.name.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
