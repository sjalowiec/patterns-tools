import { type WizardWarning, type WizardAction } from '@shared/types/wizard';
import { RoundIconButton } from './RoundIconButton';

interface WizardActionBarProps {
  warning?: WizardWarning;
  actions: WizardAction[];
}

/**
 * WizardActionBar - Reusable lego block for wizard action buttons with optional warning
 * Features flex layout: warning box on left, action buttons on right
 */
export function WizardActionBar({
  warning,
  actions
}: WizardActionBarProps) {
  return (
    <div className="no-print" style={{ 
      display: 'flex', 
      gap: '20px', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Warning Box */}
      {warning?.show && (
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
          {warning.icon && <i className={warning.icon} style={{ fontSize: '18px' }} />}
          <span>{warning.message}</span>
        </div>
      )}
      
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '15px',
        alignItems: 'center',
        flexShrink: 0
      }}>
        {actions.map((action) => (
          <RoundIconButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
            className={action.className}
            testId={action.testId}
          />
        ))}
      </div>
    </div>
  );
}
