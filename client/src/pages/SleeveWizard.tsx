import { useState } from 'react';
import { useSleeveDropShoulder } from '@/components/lego';
import type { Units } from '@shared/types/wizard';

export default function SleeveWizard() {
  const [category, setCategory] = useState<string>('men');
  const [size, setSize] = useState<string>('Med');
  const [units, setUnits] = useState<Units>('inches');
  const [stitchGauge, setStitchGauge] = useState<string>('20');
  const [rowGauge, setRowGauge] = useState<string>('28');

  // Calculate per-unit gauge
  const stitchesPerUnit = Number(stitchGauge) / 4;
  const rowsPerUnit = Number(rowGauge) / 4;

  // Call the hook
  const { pattern, loading, error } = useSleeveDropShoulder(
    stitchGauge && rowGauge && category && size
      ? {
          category,
          size,
          stitchGauge: stitchesPerUnit,
          rowGauge: rowsPerUnit,
          units,
        }
      : null
  );

  const categories = [
    { value: 'men', label: 'Men' },
    { value: 'misses', label: 'Misses' },
    { value: 'plus', label: 'Plus' },
    { value: 'kids', label: 'Kids' },
    { value: 'baby', label: 'Baby' },
  ];

  const sizesByCategory: Record<string, string[]> = {
    men: ['Sm', 'Med', 'Lg', 'XL', '1X', '2X', '3X', '4X', '5X'],
    misses: ['1', '2', '3', '4', '5', '6', '7', '8'],
    plus: ['1X', '2X', '3X', '4X', '5X'],
    kids: ['2', '4', '6', '8', '10', '12'],
    baby: ['3m', '6m', '12m', '18m', '24m'],
  };

  return (
    <div className="wizard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Title Section */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
          Sleeve lego Block
        </h1>
        <h2 style={{ color: '#666', fontSize: '18px', lineHeight: '1.6', fontWeight: 'normal' }}>
          This is a test block for development only
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Category Selection */}
        <div className="well_white">
          <h3>Category</h3>
          <select 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              setSize(sizesByCategory[e.target.value][0]);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            data-testid="select-category"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size Selection */}
        <div className="well_white">
          <h3>Size</h3>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            data-testid="select-size"
          >
            {sizesByCategory[category]?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Units */}
        <div className="well_white">
          <h3>Units</h3>
          <select 
            value={units} 
            onChange={(e) => setUnits(e.target.value as Units)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            data-testid="select-units"
          >
            <option value="inches">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
        </div>

        {/* Gauge */}
        <div className="well_white">
          <h3>Gauge (per 4" / 10cm)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Stitches:</label>
              <input
                type="number"
                value={stitchGauge}
                onChange={(e) => setStitchGauge(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                data-testid="input-stitch-gauge"
              />
            </div>
            <div>
              <label>Rows:</label>
              <input
                type="number"
                value={rowGauge}
                onChange={(e) => setRowGauge(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                data-testid="input-row-gauge"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="well_white" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading sizing data...</p>
        </div>
      )}

      {error && (
        <div className="well_white" style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {pattern && (
        <>
          <div className="well_white" style={{ marginBottom: '20px' }}>
            <h3>Pattern Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: pattern.sleevePatternText }} />
          </div>

          <div className="well_white">
            <h3>Schematic</h3>
            <div dangerouslySetInnerHTML={{ __html: pattern.sleeveSVG }} />
          </div>

          <div className="well_white" style={{ marginTop: '20px' }}>
            <h3>Details</h3>
            <p><strong>Data Source:</strong> {pattern.source}</p>
            <p><strong>Cast On Stitches:</strong> {pattern.details.castOnSts}</p>
            <p><strong>Final Stitches:</strong> {pattern.details.finalStitches}</p>
            <p><strong>Increase Interval:</strong> Every {pattern.details.increaseInterval} rows</p>
            <p><strong>Total Rows:</strong> {pattern.details.finalRows}</p>
          </div>
        </>
      )}
    </div>
  );
}
