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
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    }}>
      {/* Warning Box */}
      {warning?.show && (
        <div style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          background: 'rgba(237, 137, 54, 0.1)',
          border: '1px solid rgba(237, 137, 54, 0.3)',
          borderRadius: '6px',
          color: '#C2514E',
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
        alignItems: 'center'
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
