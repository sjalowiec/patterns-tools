interface RoundIconButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
  testId?: string;
}

/**
 * RoundIconButton - Reusable lego block for round icon buttons
 * Features 56px size for mobile-friendly touch targets
 * Supports both Font Awesome classes (e.g., "fa fa-print") and emoji icons (e.g., "🖨️")
 */
export function RoundIconButton({
  icon,
  label,
  onClick,
  className = 'btn-round-primary',
  testId
}: RoundIconButtonProps) {
  // Check if icon is a Font Awesome class (starts with 'fa') or an emoji
  const isIconClass = icon.startsWith('fa');
  
  return (
    <div style={{ textAlign: 'center' }}>
      <button
        className={`btn-round ${className}`}
        onClick={onClick}
        data-testid={testId}
      >
        {isIconClass ? (
          <i className={icon}></i>
        ) : (
          <span style={{ fontSize: '20px' }}>{icon}</span>
        )}
      </button>
      <div style={{ 
        marginTop: '8px', 
        fontSize: '12px',
        fontWeight: 500,
        color: '#666'
      }}>
        {label}
      </div>
    </div>
  );
}
