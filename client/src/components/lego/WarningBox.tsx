interface WarningBoxProps {
  message: string;
  show?: boolean;
}

/**
 * WarningBox - Reusable lego block for important warning messages
 * Displays with olive green accent and icon
 */
export function WarningBox({ message, show = true }: WarningBoxProps) {
  if (!show) return null;

  return (
    <div className="no-print" style={{ padding: '20px 20px 0 20px' }}>
      <div style={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: 'rgba(82, 104, 45, 0.1)',
        border: '1px solid rgba(82, 104, 45, 0.3)',
        borderRadius: '6px',
        color: '#52682d',
        fontSize: '14px'
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '18px' }} />
        <span>{message}</span>
      </div>
    </div>
  );
}
