import { useState } from 'react';

interface GaugeData {
  units: 'inches' | 'centimeters';
  stitchGauge: number;
  rowGauge: number;
}

interface GaugeInputProps {
  onGaugeChange: (gaugeData: GaugeData) => void;
  initialData?: Partial<GaugeData>;
}

export default function GaugeInput({ onGaugeChange, initialData = {} }: GaugeInputProps) {
  const [units, setUnits] = useState<'inches' | 'centimeters'>(initialData.units || 'inches');
  const [stitchGauge, setStitchGauge] = useState(initialData.stitchGauge || '');
  const [rowGauge, setRowGauge] = useState(initialData.rowGauge || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (!stitchGauge || Number(stitchGauge) <= 0) {
      newErrors.stitchGauge = 'Stitch gauge must be greater than 0';
    }
    
    if (!rowGauge || Number(rowGauge) <= 0) {
      newErrors.rowGauge = 'Row gauge must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      onGaugeChange({
        units,
        stitchGauge: Number(stitchGauge),
        rowGauge: Number(rowGauge)
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'stitchGauge') {
      setStitchGauge(value);
    } else if (field === 'rowGauge') {
      setRowGauge(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="well_white">
      <h2 className="text-primary">Step 1: Enter Your Gauge</h2>
      
      <div className="form-group">
        <label htmlFor="units">Measurement Units</label>
        <select 
          id="units"
          className="form-control"
          value={units}
          onChange={(e) => setUnits(e.target.value as 'inches' | 'centimeters')}
          data-testid="select-units"
        >
          <option value="inches">Inches</option>
          <option value="centimeters">Centimeters</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="stitchGauge">Stitch Gauge (stitches per {units === 'inches' ? 'inch' : 'cm'})</label>
        <input
          id="stitchGauge"
          type="number"
          step="0.1"
          min="0.1"
          className={`form-control ${errors.stitchGauge ? 'is-invalid' : ''}`}
          value={stitchGauge}
          onChange={(e) => handleInputChange('stitchGauge', e.target.value)}
          placeholder="e.g., 5.5"
          data-testid="input-stitch-gauge"
        />
        {errors.stitchGauge && (
          <div className="validation-error" style={{ display: 'block' }} data-testid="error-stitch-gauge">
            {errors.stitchGauge}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rowGauge">Row Gauge (rows per {units === 'inches' ? 'inch' : 'cm'})</label>
        <input
          id="rowGauge"
          type="number"
          step="0.1"
          min="0.1"
          className={`form-control ${errors.rowGauge ? 'is-invalid' : ''}`}
          value={rowGauge}
          onChange={(e) => handleInputChange('rowGauge', e.target.value)}
          placeholder="e.g., 7.5"
          data-testid="input-row-gauge"
        />
        {errors.rowGauge && (
          <div className="validation-error" style={{ display: 'block' }} data-testid="error-row-gauge">
            {errors.rowGauge}
          </div>
        )}
      </div>

      <button 
        className="btn-primary" 
        onClick={handleSubmit}
        data-testid="button-calculate"
      >
        Calculate
      </button>
    </div>
  );
}