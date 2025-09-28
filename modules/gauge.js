/**
 * Gauge conversion utilities for knitting calculations
 */

/**
 * Convert centimeters to stitches based on gauge
 * @param {number} cm - Width in centimeters
 * @param {number} gaugeSts - Stitches per centimeter
 * @returns {number} Number of stitches (rounded)
 */
export function cmToStitches(cm, gaugeSts) {
  return Math.round(cm * gaugeSts);
}

/**
 * Convert centimeters to rows based on gauge
 * @param {number} cm - Height in centimeters  
 * @param {number} gaugeRows - Rows per centimeter
 * @returns {number} Number of rows (rounded)
 */
export function cmToRows(cm, gaugeRows) {
  return Math.round(cm * gaugeRows);
}

/**
 * Convert inches to stitches based on gauge
 * @param {number} inches - Width in inches
 * @param {number} gaugeSts - Stitches per inch
 * @returns {number} Number of stitches (rounded)
 */
export function inchesToStitches(inches, gaugeSts) {
  return Math.round(inches * gaugeSts);
}

/**
 * Convert inches to rows based on gauge
 * @param {number} inches - Height in inches
 * @param {number} gaugeRows - Rows per inch  
 * @returns {number} Number of rows (rounded)
 */
export function inchesToRows(inches, gaugeRows) {
  return Math.round(inches * gaugeRows);
}

/**
 * Calculate stitches per unit from gauge swatch
 * @param {number} stitches - Number of stitches in swatch
 * @param {number} units - Width of swatch in units (cm or inches)
 * @returns {number} Stitches per unit
 */
export function calculateStitchGauge(stitches, units) {
  return stitches / units;
}

/**
 * Calculate rows per unit from gauge swatch
 * @param {number} rows - Number of rows in swatch
 * @param {number} units - Height of swatch in units (cm or inches)
 * @returns {number} Rows per unit
 */
export function calculateRowGauge(rows, units) {
  return rows / units;
}