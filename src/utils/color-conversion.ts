
// Constants for D50 and D65 white points
const D50 = { x: 96.422, y: 100.000, z: 82.521 };
const D65 = { x: 95.047, y: 100.000, z: 108.883 };

/**
 * Converts CIELAB to XYZ (D50)
 */
function labToXyz(l: number, a: number, b: number) {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  x = (x3 > 0.008856) ? x3 : (x - 16 / 116) / 7.787;
  y = (y3 > 0.008856) ? y3 : (y - 16 / 116) / 7.787;
  z = (z3 > 0.008856) ? z3 : (z - 16 / 116) / 7.787;

  return {
    x: x * D50.x,
    y: y * D50.y,
    z: z * D50.z
  };
}

/**
 * Chromatic Adaptation from D50 to D65 (Bradford)
 */
function adaptXyzD50toD65(x: number, y: number, z: number) {
  // Bradford transformation matrices
  // M_A (D50 -> Cone)
  // M_A_inv (Cone -> D50) ... not needed directly if we combine
  // Standard matrix mult is easier.
  // Using pre-calculated linear transform for D50->D65 adaptation (approx):
  // X_D65 = 0.9555766 * X_D50 + -0.0230393 * Y_D50 + 0.0631636 * Z_D50
  // Y_D65 = -0.0282895 * X_D50 + 1.0099416 * Y_D50 + 0.0210077 * Z_D50
  // Z_D65 = 0.0122982 * X_D50 + -0.0204830 * Y_D50 + 1.3299098 * Z_D50
  
  const X = x * 0.9555766 + y * -0.0230393 + z * 0.0631636;
  const Y = x * -0.0282895 + y * 1.0099416 + z * 0.0210077;
  const Z = x * 0.0122982 + y * -0.0204830 + z * 1.3299098;
  
  return { x: X, y: Y, z: Z };
}


/**
 * Converts XYZ (D65) to RGB (sRGB)
 */
function xyzToRgb(x: number, y: number, z: number) {
  // Normalize to 0-1
  const X = x / 100;
  const Y = y / 100;
  const Z = z / 100;

  let r = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314;
  let g = X * -0.9692660 + Y * 1.8760108 + Z * 0.0415560;
  let b = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252;

  // Gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp
  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function labToHex(l: number, a: number, b: number): string {
  const xyzD50 = labToXyz(l, a, b);
  const xyzD65 = adaptXyzD50toD65(xyzD50.x, xyzD50.y, xyzD50.z);
  const rgb = xyzToRgb(xyzD65.x, xyzD65.y, xyzD65.z);
  
  return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
