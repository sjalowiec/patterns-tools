import toolsIconPng from '@assets/tools-icon_1760978942834.png';
import patternIconPng from '@assets/pattern-icon_1760984743589.png';

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
    <svg viewBox="0 0 493.6 442.86" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <style>{`
          .practice-outer { stroke: currentColor; stroke-width: 16.24px; fill: none; stroke-linejoin: round; }
          .practice-inner { stroke: currentColor; stroke-width: 11.37px; fill: none; stroke-linejoin: round; }
          .practice-fill-light { fill: currentColor; opacity: .13; stroke: currentColor; stroke-miterlimit: 10; }
          .practice-blocks { fill: currentColor; stroke: currentColor; stroke-width: 1.43px; stroke-miterlimit: 10; }
        `}</style>
      </defs>
      <g>
        <path className="practice-outer" d="M341.49,8.12h-189.37c-17.62,0-33.9,9.4-42.7,24.65L14.73,196.78c-8.81,15.26-8.81,34.05,0,49.31l94.69,164c8.81,15.26,25.09,24.65,42.7,24.65h189.37c17.62,0,33.9-9.4,42.7-24.65l94.69-164c8.81-15.26,8.81-34.05,0-49.31l-94.69-164c-8.81-15.26-25.09-24.65-42.7-24.65Z"/>
        <path className="practice-inner" d="M326.34,37.97h-159.07c-14.8,0-28.47,7.89-35.87,20.71L51.86,196.44c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
        <path className="practice-fill-light" d="M328.36,42.2h-159.07c-14.8,0-28.47,7.89-35.87,20.71L53.88,200.67c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
        <rect className="practice-blocks" x="259.52" y="212" width="113.01" height="98.52"/>
        <rect className="practice-blocks" x="197.06" y="102.51" width="113.01" height="98.52"/>
        <rect className="practice-blocks" x="125.69" y="212" width="113.01" height="98.52"/>
      </g>
    </svg>
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
