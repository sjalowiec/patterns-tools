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
 */
export function RoundIconButton({
  icon,
  label,
  onClick,
  className = 'btn-round-primary',
  testId
}: RoundIconButtonProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <button
        className={`btn-round ${className}`}
        onClick={onClick}
        data-testid={testId}
      >
        <i className={icon}></i>
      </button>
      <div style={{ 
        marginTop: '8px', 
        fontSize: '12px',
        fontWeight: 500
      }}>
        {label}
      </div>
    </div>
  );
}
