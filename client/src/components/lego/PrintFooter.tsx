interface PrintFooterProps {
  className?: string;
}

export function PrintFooter({ className = "" }: PrintFooterProps) {
  const now = new Date();
  const generatedDate = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const year = now.getFullYear();
  
  return (
    <footer className={`print-only-footer ${className}`}>
      <div className="print-footer-content">
        <div>© {year} Knit by Machine — All rights reserved.</div>
        <div>www.knitbymachine.com</div>
        <div>Generated {generatedDate}</div>
        <div className="page-numbers">Page <span className="page-number"></span> of <span className="total-pages"></span></div>
      </div>
    </footer>
  );
}
