import { useState } from 'react';
import '../sweater-planner.css';
import WizardHeader from './WizardHeader';
import ProgressIndicator from './ProgressIndicator';
import GaugeInput from './GaugeInput';
import ResultsDisplay from './ResultsDisplay';
import NavigationButtons from './NavigationButtons';
import { useCreateGaugeCalculation } from '../hooks/useGaugeCalculations';
import { useToast } from '@/hooks/use-toast';

interface GaugeData {
  units: 'inches' | 'centimeters';
  stitchGauge: number;
  rowGauge: number;
}

export default function SweaterWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [gaugeData, setGaugeData] = useState<GaugeData | null>(null);
  const createCalculation = useCreateGaugeCalculation();
  const { toast } = useToast();
  
  const steps = [
    { number: 1, label: "Gauge", status: currentStep > 1 ? 'completed' as const : currentStep === 1 ? 'active' as const : 'pending' as const },
    { number: 2, label: "Results", status: currentStep > 2 ? 'completed' as const : currentStep === 2 ? 'active' as const : 'pending' as const }
  ];

  const handleGaugeSubmit = async (data: GaugeData) => {
    console.log('Gauge data submitted:', data);
    setGaugeData(data);
    
    try {
      await createCalculation.mutateAsync(data);
      setCurrentStep(2);
      toast({
        title: "Calculation saved",
        description: "Your gauge calculation has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: "Error",
        description: "Failed to save your calculation. Please try again.",
        variant: "destructive",
      });
      // Still advance to step 2 to show results even if save failed
      setCurrentStep(2);
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    console.log('Wizard reset');
    setCurrentStep(1);
    setGaugeData(null);
  };

  const canProceed = currentStep === 1 ? gaugeData !== null : true;
  const isLoading = createCalculation.isPending;

  return (
    <div className="wizard-container" data-testid="container-wizard">
      <WizardHeader />
      
      <ProgressIndicator currentStep={currentStep} steps={steps} />
      
      <div className="content-area">
        <div className={`section ${currentStep === 1 ? 'active' : ''}`}>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="text-primary">Saving your calculation...</div>
            </div>
          )}
          {!isLoading && (
            <GaugeInput 
              onGaugeChange={handleGaugeSubmit}
              initialData={gaugeData || undefined}
            />
          )}
        </div>
        
        <div className={`section ${currentStep === 2 ? 'active' : ''}`}>
          {gaugeData && <ResultsDisplay gaugeData={gaugeData} />}
        </div>
        
        <NavigationButtons 
          currentStep={currentStep}
          totalSteps={2}
          onNext={handleNext}
          onBack={handleBack}
          onReset={handleReset}
          canProceed={canProceed}
        />
      </div>
    </div>
  );
}