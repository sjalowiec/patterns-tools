import { type GaugeCalculations, type Units } from '@shared/types/wizard';

/**
 * useGaugeCalculations - Hook for calculating per-unit gauge values
 * Converts gauge measurements to per-unit values based on measurement system
 * - Inches: divides by 4 (measurements are per 4")
 * - Centimeters: divides by 10 (measurements are per 10cm)
 */
export function useGaugeCalculations(
  stitchesIn4: string,
  rowsIn4: string,
  units: Units
): GaugeCalculations {
  const divisor = units === 'inches' ? 4 : 10;
  const stitchesPerUnit = (Number(stitchesIn4) || 0) / divisor;
  const rowsPerUnit = (Number(rowsIn4) || 0) / divisor;

  return {
    stitchesPerUnit,
    rowsPerUnit
  };
}
