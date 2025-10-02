import { type RadioOption } from '@shared/types/wizard';

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * RadioGroup - Reusable lego block for styled radio button groups
 * Features olive green accent color matching wizard theme
 */
export function RadioGroup({
  name,
  options,
  selectedValue,
  onChange,
  label
}: RadioGroupProps) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
        {options.map((option) => (
          <label
            key={option.value}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              data-testid={option.testId || `radio-${option.value}`}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
