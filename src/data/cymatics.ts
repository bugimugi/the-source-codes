/**
 * Simplified plate model for the cymatics view. The pattern for mode (m, n) is
 *   A(x, y) = cos(mπx)·cos(nπy) − cos(nπx)·cos(mπy)   on the unit square,
 * and the ideal square plate has eigenfrequencies proportional to m² + n². That is a textbook approximation
 * (Chladni figures), not the measurement of a real plate – the page says so.
 */
export const BASE_HZ = 14;
export const MAX_MODE = 10;

export interface PlateMode { m: number; n: number }

/** The mode whose eigenfrequency BASE_HZ·(m²+n²) is closest to `hz` (m < n, so the pattern never vanishes). */
export function modeForHz(hz: number): PlateMode {
  const s = hz / BASE_HZ;
  let best: PlateMode = { m: 0, n: 1 };
  let bestErr = Infinity;
  for (let m = 0; m <= MAX_MODE; m++) {
    for (let n = m + 1; n <= MAX_MODE; n++) {
      const err = Math.abs(m * m + n * n - s);
      // on equal error prefer the "squarer" mode (smaller n − m)
      if (err < bestErr - 1e-9 || (Math.abs(err - bestErr) < 1e-9 && n - m < best.n - best.m)) { best = { m, n }; bestErr = err; }
    }
  }
  return best;
}

export const modeHz = (md: PlateMode) => BASE_HZ * (md.m * md.m + md.n * md.n);
