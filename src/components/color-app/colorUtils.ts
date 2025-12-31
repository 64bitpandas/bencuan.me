// LAB to RGB conversion using D50 illuminant (standard for color books)
// LAB values in color books are typically L: 0-100, a: -128 to 127, b: -128 to 127

export function labToXyz(l: number, a: number, b: number): [number, number, number] {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const delta = 6 / 29;
  const delta3 = delta * delta * delta;

  const xr = fx > delta ? fx * fx * fx : (fx - 16 / 116) * 3 * delta * delta;
  const yr = l > 8 ? fy * fy * fy : l / (24389 / 27);
  const zr = fz > delta ? fz * fz * fz : (fz - 16 / 116) * 3 * delta * delta;

  // D50 reference white
  const xn = 0.96422;
  const yn = 1.0;
  const zn = 0.82521;

  return [xr * xn, yr * yn, zr * zn];
}

export function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  // XYZ to linear sRGB (D65)
  // First adapt from D50 to D65 using Bradford transform
  const m = [
    [0.9555766, -0.0230393, 0.0631636],
    [-0.0282895, 1.0099416, 0.0210077],
    [0.0122982, -0.0204830, 1.3299098],
  ];

  const xd = m[0][0] * x + m[0][1] * y + m[0][2] * z;
  const yd = m[1][0] * x + m[1][1] * y + m[1][2] * z;
  const zd = m[2][0] * x + m[2][1] * y + m[2][2] * z;

  // XYZ to linear RGB
  let r = 3.2404542 * xd - 1.5371385 * yd - 0.4985314 * zd;
  let g = -0.9692660 * xd + 1.8760108 * yd + 0.0415560 * zd;
  let b = 0.0556434 * xd - 0.2040259 * yd + 1.0572252 * zd;

  // Gamma correction (linear to sRGB)
  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  b = Math.round(Math.max(0, Math.min(1, gamma(b))) * 255);

  return [r, g, b];
}

export function labToRgb(l: number, a: number, b: number): [number, number, number] {
  const [x, y, z] = labToXyz(l, a, b);
  return xyzToRgb(x, y, z);
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function labToHex(l: number, a: number, b: number): string {
  const [r, g, bb] = labToRgb(l, a, b);
  return rgbToHex(r, g, bb);
}

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '000000' : 'ffffff';
}

export function hexToRgbString(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
