import { useState } from 'react';
import { UnitsToggle } from './UnitsToggle';

type Units = 'inches' | 'cm';

interface LengthConverterBlockProps {
  rowsPerInch?: number;
  rowsPerCm?: number;
}

/**
 * LengthConverterBlock - Dedicated converter for machine knitters
 * Converts pattern length measurements (in/cm) to exact row counts
 * Machine knitters can't measure on the bed, so they need to know exact rows
 */
export function LengthConverterBlock({ 
  rowsPerInch = 0, 
  rowsPerCm = 0 
}: LengthConverterBlockProps) {
  const [units, setUnits] = useState<Units>('inches');
  const [lengthInput, setLengthInput] = useState('');

  const lengthNum = parseFloat(lengthInput) || 0;
  const rowsPerUnit = units === 'inches' ? rowsPerInch : rowsPerCm;
  const convertedRows = lengthNum > 0 && rowsPerUnit > 0 
    ? Math.round(lengthNum * rowsPerUnit) 
    : 0;

  const hasGauge = rowsPerUnit > 0;

  return (
    <div className="well_white">
      <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
        Length to Rows Converter
      </h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        For machine knitters: Convert pattern length to exact row count
      </p>

      <div className="no-print" style={{ marginBottom: '20px' }}>
        <UnitsToggle units={units} onChange={setUnits} gaugeLabel="Units" />
      </div>

      {!hasGauge && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #ffc107',
          color: '#856404'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }} />
          Enter your row gauge above to use this converter
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <input
          type="number"
          step="0.1"
          className="form-control"
          value={lengthInput}
          onChange={(e) => setLengthInput(e.target.value)}
          placeholder={`Pattern says knit for... (${units === 'inches' ? 'inches' : 'cm'})`}
          data-testid="input-length-converter"
          disabled={!hasGauge}
        />
      </div>

      {convertedRows > 0 && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f4ec', 
          borderRadius: '6px',
          border: '2px solid #52682d'
        }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
            You knit:
          </p>
          <p style={{ color: '#52682d', fontSize: '32px', fontWeight: 'bold', marginBottom: '0' }} data-testid="text-length-converter-result">
            {convertedRows} rows
          </p>
        </div>
      )}

      {lengthNum > 0 && !hasGauge && (
        <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic', marginTop: '12px' }}>
          Enter gauge information above to see conversion
        </p>
      )}
    </div>
  );
}
