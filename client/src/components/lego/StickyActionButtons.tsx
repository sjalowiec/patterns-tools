import { RoundIconButton } from './RoundIconButton';

interface ActionButton {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
  testId?: string;
}

interface StickyActionButtonsProps {
  actions: ActionButton[];
  show?: boolean;
}

export default function StickyActionButtons({ actions, show = true }: StickyActionButtonsProps) {
  if (!show) return null;

  return (
    <div className="no-print" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      padding: '15px 20px',
      backgroundColor: 'transparent',
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end'
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
  );
}
