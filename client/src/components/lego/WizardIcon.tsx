interface WizardIconProps {
  iconName: 'tools-icon' | 'practice-icon' | 'pattern-icon';
  className?: string;
}

const iconSvgs = {
  'tools-icon': (
    <svg viewBox="0 0 493.6 442.86" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <style>{`
          .icon-stroke { stroke: currentColor; fill: none; stroke-miterlimit: 10; }
          .icon-thick { stroke-width: 16.24px; stroke-linejoin: round; }
          .icon-medium { stroke-width: 11.37px; stroke-linejoin: round; }
          .icon-thin { stroke-width: 7px; }
          .icon-thinnest { stroke-width: 2.8px; }
          .icon-fill { fill: currentColor; opacity: .13; stroke: currentColor; stroke-miterlimit: 10; }
        `}</style>
      </defs>
      <g>
        <g>
          <path className="icon-stroke icon-thick" d="M341.49,8.12h-189.37c-17.62,0-33.9,9.4-42.7,24.65L14.73,196.78c-8.81,15.26-8.81,34.05,0,49.31l94.69,164c8.81,15.26,25.09,24.65,42.7,24.65h189.37c17.62,0,33.9-9.4,42.7-24.65l94.69-164c8.81-15.26,8.81-34.05,0-49.31l-94.69-164c-8.81-15.26-25.09-24.65-42.7-24.65Z"/>
          <path className="icon-fill" d="M322.29,34.16h-159.07c-14.8,0-28.47,7.89-35.87,20.71L47.81,192.63c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
          <path className="icon-stroke icon-medium" d="M326.34,37.97h-159.07c-14.8,0-28.47,7.89-35.87,20.71L51.86,196.44c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
        </g>
        <g>
          <rect className="icon-stroke icon-thin" x="85.92" y="192.18" width="321.76" height="58.5" rx="13.96" ry="13.96" transform="translate(-48.9 71.42) rotate(-15)"/>
          <line className="icon-stroke icon-thinnest" x1="117.82" y1="261.5" x2="124.02" y2="284.61"/>
          <line className="icon-stroke icon-thinnest" x1="161.49" y1="249.8" x2="167.68" y2="272.91"/>
          <line className="icon-stroke icon-thinnest" x1="141.55" y1="262.71" x2="145.85" y2="278.76"/>
          <line className="icon-stroke icon-thinnest" x1="185.04" y1="250.37" x2="189.34" y2="266.42"/>
          <line className="icon-stroke icon-thinnest" x1="228.54" y1="238.03" x2="232.84" y2="254.08"/>
          <line className="icon-stroke icon-thinnest" x1="272.03" y1="225.68" x2="276.33" y2="241.74"/>
          <line className="icon-stroke icon-thinnest" x1="315.52" y1="213.34" x2="319.83" y2="229.39"/>
          <line className="icon-stroke icon-thinnest" x1="359.02" y1="201" x2="363.32" y2="217.05"/>
          <line className="icon-stroke icon-thinnest" x1="205.15" y1="238.1" x2="211.35" y2="261.21"/>
          <line className="icon-stroke icon-thinnest" x1="248.82" y1="226.4" x2="255.01" y2="249.51"/>
          <line className="icon-stroke icon-thinnest" x1="292.49" y1="214.7" x2="298.68" y2="237.81"/>
          <line className="icon-stroke icon-thinnest" x1="336.15" y1="203" x2="342.35" y2="226.11"/>
          <line className="icon-stroke icon-thinnest" x1="379.82" y1="191.3" x2="386.01" y2="214.41"/>
        </g>
      </g>
    </svg>
  ),
  'practice-icon': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 90 L60 30 L90 90 Z" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinejoin="round"/>
      <path d="M45 70 L75 70" stroke="currentColor" strokeWidth="3"/>
      <circle cx="60" cy="45" r="6" fill="currentColor"/>
    </svg>
  ),
  'pattern-icon': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="60" height="60" stroke="currentColor" strokeWidth="4" fill="transparent" rx="4"/>
      <path d="M30 50 L90 50 M30 70 L90 70" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 30 L50 90 M70 30 L70 90" stroke="currentColor" strokeWidth="2"/>
    </svg>
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
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#52682d';
      }}
    >
      {svg}
    </div>
  );
}
