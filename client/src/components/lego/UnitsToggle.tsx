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
        gap: '8px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <span 
          className={!isCm ? 'active' : ''}
          style={{ 
            color: !isCm ? '#6e8b3d' : '#333',
            fontWeight: !isCm ? 'bold' : 'normal',
            transition: 'color 0.3s',
            lineHeight: '20px'
          }}
        >
          in
        </span>
        <label style={{ 
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          verticalAlign: 'middle'
        }}>
          <input
            type="checkbox"
            checked={isCm}
            onChange={(e) => onChange(e.target.checked ? 'cm' : 'inches')}
            data-testid="toggle-units"
            style={{ display: 'none' }}
          />
          <span style={{
            position: 'relative',
            display: 'inline-block',
            width: '40px',
            height: '20px',
            backgroundColor: isCm ? '#8ab665' : '#6e8b3d',
            borderRadius: '20px',
            transition: '0.3s'
          }}>
            <span style={{
              content: '""',
              position: 'absolute',
              width: '16px',
              height: '16px',
              left: '2px',
              top: '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: '0.3s',
              transform: isCm ? 'translateX(20px)' : 'translateX(0)'
            }} />
          </span>
        </label>
        <span 
          className={isCm ? 'active' : ''}
          style={{ 
            color: isCm ? '#8ab665' : '#333',
            fontWeight: isCm ? 'bold' : 'normal',
            transition: 'color 0.3s',
            lineHeight: '20px'
          }}
        >
          cm
        </span>
      </div>
    </div>
  );
}
