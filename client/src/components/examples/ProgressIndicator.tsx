import ProgressIndicator from '../ProgressIndicator'

export default function ProgressIndicatorExample() {
  const steps = [
    { number: 1, label: "Gauge", status: 'completed' as const },
    { number: 2, label: "Results", status: 'active' as const }
  ];

  return <ProgressIndicator currentStep={2} steps={steps} />
}