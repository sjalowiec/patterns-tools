interface PrintHeaderProps {
  className?: string;
}

export function PrintHeader({ className = "" }: PrintHeaderProps) {
  return (
    <header className={`print-only-header ${className}`}>
      <div className="print-header-content">
        <div className="print-header-logo">Knit by Machine</div>
        <div className="print-header-url">www.knitbymachine.com</div>
      </div>
    </header>
  );
}
