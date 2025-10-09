import { useState, useEffect } from 'react';
import { calculateShapingRows } from '@/lib/shapingRows';

interface SleeveDropShoulderParams {
  category: string;
  size: string;
  stitchGauge: number;
  rowGauge: number;
  units: 'inches' | 'cm';
}

interface SleevePattern {
  source: string;
  sleevePatternText: string;
  sleeveSVG: string;
  details: {
    castOnSts: number;
    increaseInterval: number;
    finalRows: number;
    finalStitches: number;
    gauge: {
      stitchGauge: number;
      rowGauge: number;
    };
  };
  measurements: {
    wrist: number;
    sleeveLength: number;
    sleeveTop: number;
    sleeveCap: number;
  };
}

interface SizingData {
  armhole_depth: number;
  sleeve_length: number;
  sleeve_cap: number;
  wrist: number;
  [key: string]: any;
}

/**
 * useSleeveDropShoulder - Hook for generating drop shoulder sleeve patterns
 * 
 * Fetches sizing data from external URL and calculates sleeve shaping
 * based on gauge and measurements. Returns pattern instructions and SVG diagram.
 */
export function useSleeveDropShoulder(params: SleeveDropShoulderParams | null): {
  pattern: SleevePattern | null;
  loading: boolean;
  error: string | null;
} {
  const [pattern, setPattern] = useState<SleevePattern | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) {
      setPattern(null);
      setError(null);
      return;
    }

    const { category, size, stitchGauge, rowGauge, units } = params;

    // Validate inputs
    if (!category || !size || !stitchGauge || !rowGauge) {
      setPattern(null);
      setError(null);
      return;
    }

    const fetchAndCalculate = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch sizing data with cache-busting
        const timestamp = new Date().getTime();
        const url = `https://sizing-data.knitbymachine.com/sizing_sweaters_${category}.json?t=${timestamp}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sizing data: ${response.statusText}`);
        }

        const sizingData: SizingData[] = await response.json();
        
        // Find the size record
        const sizeData = sizingData.find((item) => item.size === size);
        
        if (!sizeData) {
          throw new Error(`Size "${size}" not found in ${category} sizing data`);
        }

        // Extract required measurements
        const { armhole_depth, sleeve_length, sleeve_cap, wrist } = sizeData;

        if (armhole_depth == null || sleeve_length == null || sleeve_cap == null || wrist == null) {
          throw new Error('Missing required measurements: armhole_depth, sleeve_length, sleeve_cap, or wrist');
        }

        // Base calculations
        const castOnSts = Math.round(wrist * stitchGauge);
        const totalRows = Math.round(sleeve_length * rowGauge);

        // Shaping calculations
        const finalWidth = armhole_depth * 2;
        let totalIncrease = Math.round((finalWidth - wrist) * stitchGauge);
        
        // Validate shaping is possible
        const unitLabel = units === 'inches' ? '"' : 'cm';
        if (totalIncrease < 0) {
          throw new Error(`Invalid measurements: sleeve top (${finalWidth}${unitLabel}) is narrower than wrist (${wrist}${unitLabel}). Please check your size selection.`);
        }
        
        // Ensure totalIncrease is even (pairs of increases)
        if (totalIncrease % 2 !== 0) {
          totalIncrease = totalIncrease + 1; // Round up to next even number
        }
        
        const increasePairs = totalIncrease / 2;
        const finalStitchCount = castOnSts + totalIncrease;
        
        // Calculate shaping span: sleeve body length minus cap
        const shapingLength = sleeve_length - sleeve_cap;
        const shapingRows = Math.round(shapingLength * rowGauge);
        
        // Calculate increase interval and round to even number
        // Distribute increases over the shaping span only
        let increaseInterval = increasePairs > 0 ? Math.round(shapingRows / increasePairs) : 0;
        if (increaseInterval % 2 !== 0 && increaseInterval > 0) {
          increaseInterval = increaseInterval + 1; // Round up to even
        }

        const finalRows = totalRows;
        
        let shapingInstructions = '';
        if (increasePairs >= 1 && increaseInterval > 0) {
          const shapingRowsHTML = calculateShapingRows(1, increaseInterval, increasePairs);
          shapingInstructions = `<strong>Shaping:</strong> Increase 1 stitch each side every ${increaseInterval} rows until you have ${finalStitchCount} stitches
<br>${shapingRowsHTML}
<br>`;
        } else if (totalIncrease === 0) {
          shapingInstructions = `<strong>Shaping:</strong> Work straight (no increases needed)
<br>`;
        }
        
        const sleevePatternText = `
<strong>Drop Shoulder Sleeve Pattern</strong>
<br><br>
<strong>Cast On:</strong> ${castOnSts} stitches
<br>
<strong>Cuff Ribbing:</strong> Work 20 rows in ribbing (K1, P1 or K2, P2)
<br>
${shapingInstructions}<strong>Continue:</strong> Work straight until sleeve measures ${sleeve_length}${unitLabel}
<br>
<strong>Bind Off:</strong> All remaining stitches
<br><br>
<strong>Final Measurements:</strong>
<br>• Cuff: ${wrist}${unitLabel}
<br>• Total length: ${sleeve_length}${unitLabel}
<br>• Top width: ${finalWidth}${unitLabel}
        `.trim();

        // Generate SVG diagram
        const scale = units === 'inches' ? 5 : 2; // px per unit
        const svgWidth = finalWidth * scale + 100;
        const svgHeight = sleeve_length * scale + 80;
        const sleeveWidth = wrist * scale;
        const sleeveHeight = sleeve_length * scale;
        const topWidth = finalWidth * scale;

        const sleeveSVG = `
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; max-width: 600px; height: auto;">
            <!-- Sleeve outline (trapezoid shape for drop shoulder) -->
            <polygon 
              points="${(svgWidth - sleeveWidth) / 2},${svgHeight - 40} ${(svgWidth - topWidth) / 2},${svgHeight - 40 - sleeveHeight} ${(svgWidth + topWidth) / 2},${svgHeight - 40 - sleeveHeight} ${(svgWidth + sleeveWidth) / 2},${svgHeight - 40}"
              fill="none" 
              stroke="black" 
              stroke-width="2"
            />
            
            <!-- Labels -->
            <text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="12" fill="black">
              Cuff (${wrist}${unitLabel})
            </text>
            
            <text x="20" y="${svgHeight / 2}" text-anchor="start" font-size="12" fill="black">
              Length (${sleeve_length}${unitLabel})
            </text>
            
            <text x="${svgWidth / 2}" y="${svgHeight - 40 - sleeveHeight - 10}" text-anchor="middle" font-size="12" fill="black">
              Top (${finalWidth}${unitLabel})
            </text>
          </svg>
        `.trim();

        setPattern({
          source: url.split('?')[0], // Remove cache-busting param from display
          sleevePatternText,
          sleeveSVG,
          details: {
            castOnSts,
            increaseInterval,
            finalRows,
            finalStitches: finalStitchCount,
            gauge: {
              stitchGauge,
              rowGauge,
            },
          },
          measurements: {
            wrist,
            sleeveLength: sleeve_length,
            sleeveTop: finalWidth,
            sleeveCap: sleeve_cap,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setPattern(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, [params?.category, params?.size, params?.stitchGauge, params?.rowGauge, params?.units]);

  return { pattern, loading, error };
}
