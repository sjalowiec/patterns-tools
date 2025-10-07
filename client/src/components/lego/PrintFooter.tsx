interface PrintFooterProps {
  className?: string;
}

export function PrintFooter({ className = "" }: PrintFooterProps) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <footer className={`print-only-footer ${className}`}>
      <div className="print-footer-content">
        <p>{currentDate} | KnitbyMachine.com</p>
      </div>
    </footer>
  );
}
