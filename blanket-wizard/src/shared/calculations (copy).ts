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

/**
 * Text Templates for Shoulder Shaping Instructions
 */

// Left shoulder shaping template (first shoulder - right armhole edge)
export function generateLeftShoulderTemplate(turnBlocks: number[], shoulderSts: number): string {
  return `
    • Set carriage to Hold.<br>
    <br>
    • At the armhole (right edge), put the first group of ${turnBlocks[0]} needles into Hold.<br>
    • Knit left → right. (the held needles won't knit)<br>
    • Wrap the adjacent held needle, then knit right → left back to the neck.<br>
    <br>
    • At the armhole (right edge), put the next group of ${turnBlocks[1] || turnBlocks[0]} needles into Hold.<br>
    • Knit left → right. (the held needles won't knit)<br>
    • Wrap the adjacent held needle, then knit right → left back to the neck.<br>
    <br>
    • Repeat this sequence until all specified armhole groups (${turnBlocks.length}) are held.<br>
    <br>
    • Cancel Hold. Break working yarn, leaving a tail for seaming. Scrap off ${shoulderSts} stitches.
  `;
}

// Right shoulder shaping template (second shoulder - left armhole edge)
export function generateRightShoulderTemplate(turnBlocks: number[], shoulderSts: number): string {
  return `
    • Set carriage to Hold.<br>
    <br>
    • At the armhole (left edge), put the first group of ${turnBlocks[0]} needles into Hold.<br>
    • Knit right → left. (the held needles won't knit)<br>
    • Wrap the adjacent held needle, then knit left → right back to the neck.<br>
    <br>
    • At the armhole (left edge), put the next group of ${turnBlocks[1] || turnBlocks[0]} needles into Hold.<br>
    • Knit right → left. (the held needles won't knit)<br>
    • Wrap the adjacent held needle, then knit left → right back to the neck.<br>
    <br>
    • Repeat this sequence until all specified armhole groups (${turnBlocks.length}) are held.<br>
    <br>
    • Cancel Hold. Break working yarn, leaving a tail for seaming. Scrap off ${shoulderSts} stitches.
  `;
}