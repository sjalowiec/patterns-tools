interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  onReset?: () => void;
  canProceed?: boolean;
}

export default function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  onReset,
  canProceed = true 
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="navigation-buttons">
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isFirstStep && (
          <button 
            className="btn-secondary" 
            onClick={onBack}
            data-testid="button-back"
          >
            Back
          </button>
        )}
        <button 
          className="btn-secondary" 
          onClick={onReset}
          data-testid="button-reset"
        >
          Reset
        </button>
      </div>
      
      <div>
        {!isLastStep && (
          <button 
            className={`btn-primary ${!canProceed ? 'disabled' : ''}`}
            onClick={onNext}
            disabled={!canProceed}
            data-testid="button-next"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}