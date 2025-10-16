import { useState, useEffect } from 'react';
import type { Units } from '@shared/types/wizard';

interface YarnCalculatorProps {
  units: Units;
  garmentAreaInches: number; // Total garment area in square inches
  onYarnEstimateChange?: (grams: number) => void;
}

interface YarnEstimate {
  grams: number;
  method: 'swatch' | 'none';
}

/**
 * YarnCalculator - Reusable yarn estimation component
 * Handles swatch input and calculates yarn needed with 10% safety margin
 */
export function YarnCalculator({ units, garmentAreaInches, onYarnEstimateChange }: YarnCalculatorProps) {
  const [calculateYarn, setCalculateYarn] = useState<boolean>(false);
  const [swatchWidth, setSwatchWidth] = useState<string>('');
  const [swatchLength, setSwatchLength] = useState<string>('');
  const [swatchWeight, setSwatchWeight] = useState<string>('');

  // Calculate yarn needed based on swatch data
  const calculateYarnNeeded = (): YarnEstimate => {
    if (!calculateYarn || !garmentAreaInches) {
      return { grams: 0, method: 'none' };
    }
    
    if (swatchWidth && swatchLength && swatchWeight) {
      const swatchWidthNum = parseFloat(swatchWidth);
      const swatchLengthNum = parseFloat(swatchLength);
      const swatchWeightNum = parseFloat(swatchWeight);
      
      if (swatchWidthNum > 0 && swatchLengthNum > 0 && swatchWeightNum > 0) {
        // Calculate swatch area - convert to inches if user provided cm measurements
        const swatchAreaInches = units === 'inches' 
          ? swatchWidthNum * swatchLengthNum
          : (swatchWidthNum / 2.54) * (swatchLengthNum / 2.54);
        
        // Weight needed = (total area / swatch area) × swatch weight × 1.1 (10% safety margin)
        const gramsNeeded = Math.round((garmentAreaInches / swatchAreaInches) * swatchWeightNum * 1.1);
        
        return { grams: gramsNeeded, method: 'swatch' };
      }
    }
    
    return { grams: 0, method: 'none' };
  };

  const yarnEstimate = calculateYarnNeeded();

  // Notify parent of estimate changes via effect (not during render)
  useEffect(() => {
    if (onYarnEstimateChange) {
      onYarnEstimateChange(yarnEstimate.grams);
    }
  }, [yarnEstimate.grams, onYarnEstimateChange]);

  return (
    <div className="well_white no-print">
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={calculateYarn}
            onChange={(e) => setCalculateYarn(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            data-testid="checkbox-calculate-yarn"
          />
          <span style={{ fontSize: '16px', fontWeight: '500', color: '#52682d' }}>
            Calculate yarn needed
          </span>
        </label>
      </div>

      {calculateYarn && (
        <div style={{ marginTop: '15px', paddingLeft: '28px' }}>
          <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
            Weigh your gauge swatch to get an accurate yarn estimate. Enter the dimensions and weight below:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                Swatch Width ({units === 'inches' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                value={swatchWidth}
                onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder="e.g., 4"
                min="0"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                data-testid="input-swatch-width"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                Swatch Length ({units === 'inches' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                value={swatchLength}
                onChange={(e) => setSwatchLength(e.target.value)}
                placeholder="e.g., 4"
                min="0"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                data-testid="input-swatch-length"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                Swatch Weight (grams)
              </label>
              <input
                type="number"
                value={swatchWeight}
                onChange={(e) => setSwatchWeight(e.target.value)}
                placeholder="e.g., 15"
                min="0"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                data-testid="input-swatch-weight"
              />
            </div>
          </div>
          
          {swatchWidth && swatchLength && swatchWeight && (
            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(82, 104, 45, 0.2)', borderRadius: '4px' }}>
              <strong style={{ color: '#52682d' }}>Calculation Preview:</strong><br />
              <small style={{ color: '#666' }}>
                {yarnEstimate.method === 'swatch' 
                  ? `Your project will need approximately ${yarnEstimate.grams}g of yarn based on your swatch (includes 10% extra).`
                  : 'Complete all swatch measurements to see the calculation.'}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export hook for accessing calculator state if needed
export function useYarnCalculator() {
  const [swatchWidth, setSwatchWidth] = useState<string>('');
  const [swatchLength, setSwatchLength] = useState<string>('');
  const [swatchWeight, setSwatchWeight] = useState<string>('');

  const resetSwatch = () => {
    setSwatchWidth('');
    setSwatchLength('');
    setSwatchWeight('');
  };

  return {
    swatchWidth,
    setSwatchWidth,
    swatchLength,
    setSwatchLength,
    swatchWeight,
    setSwatchWeight,
    resetSwatch
  };
}
