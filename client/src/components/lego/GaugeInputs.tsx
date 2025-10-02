import { type Units } from '@shared/types/wizard';

interface GaugeInputsProps {
  units: Units;
  stitchesIn4: string;
  rowsIn4: string;
  onStitchesChange: (value: string) => void;
  onRowsChange: (value: string) => void;
  stitchesTestId?: string;
  rowsTestId?: string;
}

/**
 * GaugeInputs - Reusable lego block for gauge measurement inputs
 * Features dynamic placeholders based on unit selection
 */
export function GaugeInputs({
  units,
  stitchesIn4,
  rowsIn4,
  onStitchesChange,
  onRowsChange,
  stitchesTestId = 'input-stitches',
  rowsTestId = 'input-rows'
}: GaugeInputsProps) {
  return (
    <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
      <div className="form-group" style={{ flex: 1 }}>
        <label>Stitch Gauge</label>
        <input
          type="number"
          className="form-control"
          value={stitchesIn4}
          onChange={(e) => onStitchesChange(e.target.value)}
          placeholder={units === 'inches' ? 'stitches per 4"' : 'stitches per 10cm'}
          data-testid={stitchesTestId}
        />
      </div>

      <div className="form-group" style={{ flex: 1 }}>
        <label>Row Gauge</label>
        <input
          type="number"
          className="form-control"
          value={rowsIn4}
          onChange={(e) => onRowsChange(e.target.value)}
          placeholder={units === 'inches' ? 'rows per 4"' : 'rows per 10cm'}
          data-testid={rowsTestId}
        />
      </div>
    </div>
  );
}
