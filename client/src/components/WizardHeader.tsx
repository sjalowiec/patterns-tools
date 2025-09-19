interface WizardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function WizardHeader({ 
  title = "Sweater Planning Wizard",
  subtitle = "Calculate stitch counts and shaping for your knitted garment"
}: WizardHeaderProps) {
  return (
    <div className="wizard-header">
      <h1 className="wizard-title" data-testid="text-wizard-title">{title}</h1>
      <p className="wizard-subtitle" data-testid="text-wizard-subtitle">{subtitle}</p>
    </div>
  );
}