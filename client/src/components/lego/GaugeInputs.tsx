import { type Units } from '@shared/types/wizard';
import { useState, useEffect } from 'react';

interface GaugeInputsProps {
  units: Units;
  stitchesIn4: string;
  rowsIn4: string;
  onStitchesChange: (value: string) => void;
  onRowsChange: (value: string) => void;
  onValidationChange?: (hasError: boolean) => void;
  stitchesTestId?: string;
  rowsTestId?: string;
}

type ValidationMessage = {
  type: 'error' | 'warning' | null;
  text: string;
};

/**
 * GaugeInputs - Reusable lego block for gauge measurement inputs
 * Features dynamic placeholders based on unit selection and real-time validation
 * Hard limits: 2-80 (reject), Soft warnings: stitches 10-50, rows 10-60
 */
export function GaugeInputs({
  units,
  stitchesIn4,
  rowsIn4,
  onStitchesChange,
  onRowsChange,
  onValidationChange,
  stitchesTestId = 'input-stitches',
  rowsTestId = 'input-rows'
}: GaugeInputsProps) {
  const [stitchesMessage, setStitchesMessage] = useState<ValidationMessage>({ type: null, text: '' });
  const [rowsMessage, setRowsMessage] = useState<ValidationMessage>({ type: null, text: '' });

  // Validate gauge value
  const validateGauge = (value: string, type: 'stitches' | 'rows'): ValidationMessage => {
    if (!value || value.trim() === '') {
      return { type: null, text: '' };
    }

    const numValue = parseFloat(value);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      return { type: 'error', text: 'Please enter a valid number' };
    }

    // Hard limits: reject <2 or >80
    if (numValue < 2) {
      return { type: 'error', text: 'Value must be at least 2' };
    }
    if (numValue > 80) {
      return { type: 'error', text: 'Value must be 80 or less' };
    }

    // Soft warnings
    if (type === 'stitches') {
      if (numValue < 10 || numValue > 50) {
        return { type: 'warning', text: 'That seems unusual — double-check your entry' };
      }
    } else if (type === 'rows') {
      if (numValue < 10 || numValue > 60) {
        return { type: 'warning', text: 'That seems unusual — double-check your entry' };
      }
    }

    return { type: null, text: '' };
  };

  // Validate on value change
  useEffect(() => {
    const msg = validateGauge(stitchesIn4, 'stitches');
    setStitchesMessage(msg);
  }, [stitchesIn4]);

  useEffect(() => {
    const msg = validateGauge(rowsIn4, 'rows');
    setRowsMessage(msg);
  }, [rowsIn4]);

  // Notify parent of validation errors
  useEffect(() => {
    const hasError = stitchesMessage.type === 'error' || rowsMessage.type === 'error';
    if (onValidationChange) {
      onValidationChange(hasError);
    }
  }, [stitchesMessage, rowsMessage, onValidationChange]);

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
          style={{
            borderColor: stitchesMessage.type === 'error' ? '#dc3545' : stitchesMessage.type === 'warning' ? '#ffc107' : undefined
          }}
        />
        {stitchesMessage.type && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: stitchesMessage.type === 'error' ? '#dc3545' : '#ff8c00',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            data-testid={`${stitchesTestId}-message`}
          >
            <i className={`fas fa-${stitchesMessage.type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
            <span>{stitchesMessage.text}</span>
          </div>
        )}
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
          style={{
            borderColor: rowsMessage.type === 'error' ? '#dc3545' : rowsMessage.type === 'warning' ? '#ffc107' : undefined
          }}
        />
        {rowsMessage.type && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: rowsMessage.type === 'error' ? '#dc3545' : '#ff8c00',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            data-testid={`${rowsTestId}-message`}
          >
            <i className={`fas fa-${rowsMessage.type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
            <span>{rowsMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
