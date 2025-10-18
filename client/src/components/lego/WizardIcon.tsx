interface WizardIconProps {
  iconName: 'tools-icon' | 'practice-icon' | 'pattern-icon';
  className?: string;
}

const iconSvgs = {
  'tools-icon': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="4" fill="transparent"/>
      <path d="M40 60 L60 40 L80 60 L60 80 Z" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinejoin="round"/>
      <circle cx="60" cy="60" r="8" fill="currentColor"/>
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
