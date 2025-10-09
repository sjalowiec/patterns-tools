import { useState, useEffect } from 'react';

interface SleeveDropShoulderParams {
  category: string;
  size: string;
  stitchGauge: number;
  rowGauge: number;
  units: 'in' | 'cm';
}

interface SleevePattern {
  source: string;
  sleevePatternText: string;
  sleeveSVG: string;
  details: {
    castOnSts: number;
    increaseInterval: number;
    finalRows: number;
    capRows: number;
    gauge: {
      stitchGauge: number;
      rowGauge: number;
    };
  };
}

interface SizingData {
  armhole_depth: number;
  sleeve_length: number;
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
        const url = `https://sizing-data.knitbymachine.com/${category}.json?t=${timestamp}`;
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
        const { armhole_depth, sleeve_length, wrist } = sizeData;

        if (armhole_depth == null || sleeve_length == null || wrist == null) {
          throw new Error('Missing required measurements: armhole_depth, sleeve_length, or wrist');
        }

        // Base calculations
        const castOnSts = Math.round(wrist * stitchGauge);
        const totalRows = Math.round(sleeve_length * rowGauge);

        // Shaping calculations
        const shapingHeight = armhole_depth * 2;
        const shapingRows = Math.round(shapingHeight * rowGauge);
        
        const finalWidth = armhole_depth * 2;
        const totalIncrease = Math.round((finalWidth - wrist) * stitchGauge);
        const increasePairs = Math.floor(totalIncrease / 2);
        
        // Calculate increase interval and round to even number
        let increaseInterval = increasePairs > 0 ? Math.round(shapingRows / increasePairs) : 0;
        if (increaseInterval % 2 !== 0) {
          increaseInterval = increaseInterval + 1; // Round up to even
        }

        const capRows = Math.round(armhole_depth * 2 * rowGauge);
        const finalRows = totalRows;

        // Generate pattern text
        const unitLabel = units === 'in' ? '"' : 'cm';
        const sleevePatternText = `
<strong>Drop Shoulder Sleeve Pattern</strong>
<br><br>
<strong>Cast On:</strong> ${castOnSts} stitches
<br>
<strong>Cuff Ribbing:</strong> Work 20 rows in ribbing (K1, P1 or K2, P2)
<br>
<strong>Shaping:</strong> Increase 1 stitch each side every ${increaseInterval} rows until sleeve measures ${sleeve_length - armhole_depth * 2}${unitLabel}
<br>
<strong>Cap:</strong> Continue straight for ${capRows} rows
<br>
<strong>Bind Off:</strong> All remaining stitches
<br><br>
<strong>Final Measurements:</strong>
<br>• Cuff: ${wrist}${unitLabel}
<br>• Length: ${sleeve_length}${unitLabel}
<br>• Armhole depth: ${armhole_depth}${unitLabel}
        `.trim();

        // Generate SVG diagram
        const scale = units === 'in' ? 5 : 2; // px per unit
        const svgWidth = finalWidth * scale + 100;
        const svgHeight = sleeve_length * scale + 80;
        const sleeveWidth = wrist * scale;
        const sleeveHeight = sleeve_length * scale;
        const capHeight = (armhole_depth * 2) * scale;
        const topWidth = finalWidth * scale;

        const sleeveSVG = `
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; max-width: 600px; height: auto;">
            <!-- Sleeve outline -->
            <polygon 
              points="${(svgWidth - sleeveWidth) / 2},${svgHeight - 40} ${(svgWidth - topWidth) / 2},${svgHeight - 40 - sleeveHeight} ${(svgWidth + topWidth) / 2},${svgHeight - 40 - sleeveHeight} ${(svgWidth + sleeveWidth) / 2},${svgHeight - 40}"
              fill="none" 
              stroke="black" 
              stroke-width="2"
            />
            
            <!-- Cap boundary (dashed line) -->
            <line 
              x1="${(svgWidth - topWidth) / 2}" 
              y1="${svgHeight - 40 - capHeight}" 
              x2="${(svgWidth + topWidth) / 2}" 
              y2="${svgHeight - 40 - capHeight}"
              stroke="black" 
              stroke-width="1" 
              stroke-dasharray="5,5"
            />
            
            <!-- Labels -->
            <text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="12" fill="black">
              Cuff (${wrist}${unitLabel})
            </text>
            
            <text x="20" y="${svgHeight / 2}" text-anchor="start" font-size="12" fill="black">
              Sleeve Length (${sleeve_length}${unitLabel})
            </text>
            
            <text x="${svgWidth / 2}" y="${svgHeight - 40 - capHeight - 10}" text-anchor="middle" font-size="12" fill="black">
              Armhole Cap
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
            capRows,
            gauge: {
              stitchGauge,
              rowGauge,
            },
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
