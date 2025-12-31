function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function xyzPivot(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116;
}

function xyzUnpivot(t: number): number {
  const t3 = t * t * t;
  return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
}

export function labToRgb(lab: [number, number, number]): { r: number; g: number; b: number } {
  const [L, a, b] = lab;

  // D65 reference white
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  const fy = (L + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;

  const xr = xyzUnpivot(fx);
  const yr = xyzUnpivot(fy);
  const zr = xyzUnpivot(fz);

  const X = refX * xr;
  const Y = refY * yr;
  const Z = refZ * zr;

  // XYZ to linear RGB (sRGB)
  let rl = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
  let gl = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
  let bl = X * 0.000557 + Y * -0.002040 + Z * 0.010570;

  // Scale from 0..100
  rl /= 100;
  gl /= 100;
  bl /= 100;

  const gamma = (u: number) => (u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055);

  const r = clampByte(gamma(rl) * 255);
  const g = clampByte(gamma(gl) * 255);
  const b2 = clampByte(gamma(bl) * 255);

  return { r, g, b: b2 };
}

export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const to = (n: number) => n.toString(16).padStart(2, '0');
  return `${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`;
}

export function labToHex(lab: [number, number, number]): string {
  return rgbToHex(labToRgb(lab));
}
