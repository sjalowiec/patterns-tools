import toolsIconPng from '@assets/tools-icon_1760978942834.png';
import patternIconPng from '@assets/pattern-icon_1760984743589.png';
import practiceIconPng from '@assets/practice-icon_1760985242080.png';

interface WizardIconProps {
  iconName: 'tools-icon' | 'practice-icon' | 'pattern-icon';
  className?: string;
}

const iconSvgs = {
  'tools-icon': (
    <img 
      src={toolsIconPng} 
      alt="Gauge tools icon" 
      style={{ 
        width: '100%', 
        height: 'auto', 
        display: 'block',
        transition: 'filter 0.2s ease'
      }}
      className="png-icon-img"
    />
  ),
  'practice-icon': (
    <img 
      src={practiceIconPng} 
      alt="Practice icon" 
      style={{ 
        width: '100%', 
        height: 'auto', 
        display: 'block',
        transition: 'filter 0.2s ease'
      }}
      className="png-icon-img"
    />
  ),
  'pattern-icon': (
    <img 
      src={patternIconPng} 
      alt="Pattern icon" 
      style={{ 
        width: '100%', 
        height: 'auto', 
        display: 'block',
        transition: 'filter 0.2s ease'
      }}
      className="png-icon-img"
    />
  )
};

export function WizardIcon({ iconName, className = '' }: WizardIconProps) {
  const svg = iconSvgs[iconName];
  
  if (!svg) {
    // Fallback if icon doesn't exist
    return (
      <div 
        style={{ 
          maxWidth: '120px', 
          width: '100%', 
          flexShrink: 0,
          paddingBottom: '100%',
          background: '#52682d',
          borderRadius: '50%',
          opacity: 0.3
        }} 
      />
    );
  }

  return (
    <div 
      className={`wizard-icon-container ${className}`}
      style={{
        maxWidth: '120px',
        width: '100%',
        flexShrink: 0,
        color: '#52682d',
        transition: 'color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#6E8B3D';
        // Apply brightness filter to PNG icons on hover
        const img = e.currentTarget.querySelector('.png-icon-img') as HTMLImageElement;
        if (img) {
          img.style.filter = 'brightness(1.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#52682d';
        // Reset brightness filter on PNG icons
        const img = e.currentTarget.querySelector('.png-icon-img') as HTMLImageElement;
        if (img) {
          img.style.filter = 'brightness(1)';
        }
      }}
    >
      {svg}
    </div>
  );
}
