interface PrintHeaderProps {
  className?: string;
}

export function PrintHeader({ className = "" }: PrintHeaderProps) {
  return (
    <div className={`print-header ${className}`}>
      <span>Knit by Machine</span>
      <a href="https://www.knitbymachine.com">www.knitbymachine.com</a>
    </div>
  );
}
