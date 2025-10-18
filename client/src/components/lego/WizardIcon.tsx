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
    <svg viewBox="0 0 493.6 442.86" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <style>{`
          .pattern-outer { stroke: currentColor; stroke-width: 16.24px; fill: none; stroke-linejoin: round; }
          .pattern-inner { stroke: currentColor; stroke-width: 11.37px; fill: none; stroke-linejoin: round; }
          .pattern-fill-light { fill: currentColor; opacity: .13; stroke: currentColor; stroke-miterlimit: 10; }
          .pattern-sweater { fill: none; stroke: currentColor; stroke-width: 11.5px; stroke-linejoin: round; stroke-miterlimit: 10; }
        `}</style>
      </defs>
      <g>
        <path className="pattern-outer" d="M341.49,8.12h-189.37c-17.62,0-33.9,9.4-42.7,24.65L14.73,196.78c-8.81,15.26-8.81,34.05,0,49.31l94.69,164c8.81,15.26,25.09,24.65,42.7,24.65h189.37c17.62,0,33.9-9.4,42.7-24.65l94.69-164c8.81-15.26,8.81-34.05,0-49.31l-94.69-164c-8.81-15.26-25.09-24.65-42.7-24.65Z"/>
        <path className="pattern-inner" d="M326.34,37.97h-159.07c-14.8,0-28.47,7.89-35.87,20.71L51.86,196.44c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
        <path className="pattern-fill-light" d="M327.29,38.81h-159.07c-14.8,0-28.47,7.89-35.87,20.71L52.81,197.28c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
        <path className="pattern-sweater" d="M171.42,217.46l-29.54,63.5c-1.24.6-2.62.94-4,.71-3.68-.61-34.26-10.91-36.44-12.54-.83-.62-1.37-1.41-1.62-2.42l45.17-150.43c3.49-9.08,6.86-14.28,15.75-18.74s43.62-18.3,52.21-19.92c11.52-2.16,52.77-1.38,65.66-.29,8.96.76,40.97,13.64,50.93,18.06,16.1,7.16,17.7,13.54,23,29.26,15.31,45.41,26.55,92.33,42.1,137.68.89,4.42,1.51,5.72-2.65,7.9-3.02,1.58-32.36,10.93-35.09,11.01-1.26.04-2.49.17-3.61-.55l-29.25-62.21v90.42c0,1.9-5.9,3.53-7.49,4.01-44.31,13.31-97,13.44-141.73.61-2.14-.61-4.43-1.4-4.43-3.92v-91.15Z"/>
      </g>
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
