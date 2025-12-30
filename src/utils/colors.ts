import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';
import namesPlugin from 'colord/plugins/names';

extend([labPlugin, namesPlugin]);

export interface ColorEntry {
  name: string;
  l?: number;
  a?: number;
  b?: number;
  hex?: string;
}

export function labToHex(l: number, a: number, b: number): string {
  return colord({ l, a, b }).toHex();
}

export function labToRgb(l: number, a: number, b: number): string {
  return colord({ l, a, b }).toRgbString();
}

/**
 * Returns true if the color is light, false if it is dark.
 * Used to determine text color overlay (black on light, white on dark).
 */
export function isLight(color: string): boolean {
  return colord(color).isLight();
}
