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
  const isCm = units === 'cm';
  
  return (
    <div className="form-group" style={{ marginBottom: '20px' }}>
      {label && <label style={{ marginBottom: '8px', display: 'block' }}>{label}</label>}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: 500
      }}>
        <span style={{ 
          color: '#333',
          minWidth: '18px'
        }}>
          in
        </span>
        <Switch
          checked={isCm}
          onCheckedChange={(checked) => onChange(checked ? 'cm' : 'inches')}
          data-testid="toggle-units"
          className="data-[state=checked]:bg-[#6e8b3d] data-[state=unchecked]:bg-[#6e8b3d]"
        />
        <span style={{ 
          color: '#333',
          minWidth: '22px'
        }}>
          cm
        </span>
      </div>
    </div>
  );
}
