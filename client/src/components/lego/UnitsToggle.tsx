import { Switch } from "@/components/ui/switch";

type Units = 'inches' | 'cm';

interface UnitsToggleProps {
  units: Units;
  onChange: (units: Units) => void;
  label?: string;
}

/**
 * UnitsToggle - Modern toggle switch for inches/cm selection
 * Replaces old-fashioned radio buttons with a sleek toggle
 */
export function UnitsToggle({ units, onChange, label }: UnitsToggleProps) {
  const isInches = units === 'inches';
  
  return (
    <div className="form-group" style={{ marginBottom: '20px' }}>
      {label && <label style={{ marginBottom: '8px', display: 'block' }}>{label}</label>}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: 500
      }}>
        <span style={{ 
          color: isInches ? '#6e8b3d' : '#999',
          transition: 'color 0.2s',
          fontWeight: isInches ? 600 : 500
        }}>
          in
        </span>
        <Switch
          checked={!isInches}
          onCheckedChange={(checked) => onChange(checked ? 'cm' : 'inches')}
          data-testid="toggle-units"
          className="data-[state=checked]:bg-[#6e8b3d] data-[state=unchecked]:bg-gray-300"
        />
        <span style={{ 
          color: !isInches ? '#6e8b3d' : '#999',
          transition: 'color 0.2s',
          fontWeight: !isInches ? 600 : 500
        }}>
          cm
        </span>
      </div>
    </div>
  );
}
