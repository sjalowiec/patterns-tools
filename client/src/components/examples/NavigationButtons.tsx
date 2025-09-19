import NavigationButtons from '../NavigationButtons'

export default function NavigationButtonsExample() {
  const handleNext = () => console.log('Next clicked');
  const handleBack = () => console.log('Back clicked');
  const handleReset = () => console.log('Reset clicked');

  return (
    <NavigationButtons 
      currentStep={1}
      totalSteps={2}
      onNext={handleNext}
      onBack={handleBack}
      onReset={handleReset}
      canProceed={true}
    />
  )
}