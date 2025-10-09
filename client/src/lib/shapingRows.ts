/**
 * Shaping Rows Utility
 * 
 * Purpose: Calculate and display specific row numbers where shaping occurs
 * (increases, decreases, or short rows) in knitting patterns.
 */

export interface ShapingRowsParams {
  startRow: number;      // Starting row number (usually 1)
  repeatEvery: number;   // Number of rows between shaping actions
  totalRepeats: number;  // Total number of shaping actions
}

/**
 * Calculate which rows have shaping and return formatted HTML
 * 
 * @param startRow - Row number to start shaping (default: 1)
 * @param repeatEvery - Number of rows between each shaping action
 * @param totalRepeats - Total number of times to repeat the shaping
 * @returns Formatted HTML string showing row numbers, or empty string if invalid
 * 
 * @example
 * calculateShapingRows(1, 4, 4)
 * // Returns: '<small class="shaping-rows">rows: (1, 5, 9, 13)</small>'
 */
export function calculateShapingRows(
  startRow: number,
  repeatEvery: number,
  totalRepeats: number
): string {
  // Validate inputs
  if (!startRow || !repeatEvery || !totalRepeats) {
    return '';
  }
  
  if (startRow < 1 || repeatEvery < 1 || totalRepeats < 1) {
    return '';
  }
  
  if (!Number.isInteger(startRow) || !Number.isInteger(repeatEvery) || !Number.isInteger(totalRepeats)) {
    return '';
  }
  
  // Calculate row numbers
  const rowNumbers: number[] = [];
  for (let i = 0; i < totalRepeats; i++) {
    const rowNumber = startRow + (i * repeatEvery);
    rowNumbers.push(rowNumber);
  }
  
  // Format as comma-separated list in parentheses
  const rowList = rowNumbers.join(', ');
  
  // Return formatted HTML with styling class
  return `<small class="shaping-rows">rows: (${rowList})</small>`;
}

/**
 * Alternative function using object parameter for better readability
 */
export function getShapingRows(params: ShapingRowsParams): string {
  return calculateShapingRows(params.startRow, params.repeatEvery, params.totalRepeats);
}
