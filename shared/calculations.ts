/**
 * Knitting calculation utilities for shoulder shaping and other pattern calculations
 * These functions implement the "magic formula" for creating professional knitting patterns
 */

// Shoulder width = half the stitches left after subtracting neckline
export function calcShoulderWidth(totalCastOn: number, necklineSts: number): number {
  const remainingSts = totalCastOn - necklineSts;
  return Math.floor(remainingSts / 2);
}

// Convert 1 inch into rows based on row gauge
export function rowsForOneInch(rowGauge: number): number {
  return Math.max(1, Math.round(rowGauge * 1)); // 1" worth of rows
}

// Distribute short-row shaping evenly across the shoulder
// Example: distributeEvenly(6, 18) -> [4, 4, 5, 5]
export function distributeEvenly(rows: number, stitches: number): number[] {
  if (rows <= 0 || stitches <= 0) return [];

  const perTurn = Math.floor(stitches / rows);
  const extra = stitches % rows;
  const result: number[] = [];

  for (let i = 0; i < rows; i++) {
    result.push(perTurn + (i < extra ? 1 : 0));
  }

  return result;
}