// Pythonic range function.
export const range = (start: number, stop: number, step?: number): Array<number> => {
  step ??= 1;
  return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
};
