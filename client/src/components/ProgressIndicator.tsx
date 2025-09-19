interface Step {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="progress-container">
      <div className="progress-steps">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step ${step.status}`}
            data-testid={`step-${step.number}`}
          >
            <div className="step-circle">
              {step.number}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-custom">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text" data-testid="text-progress">
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  );
}