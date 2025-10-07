interface PrintFooterProps {
  className?: string;
}

export function PrintFooter({ className = "" }: PrintFooterProps) {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();
  
  return (
    <footer className={`print-only-footer ${className}`}>
      <div className="print-footer-content">
        © {year} Knit by Machine — All rights reserved. | www.knitbymachine.com | Generated {month} {year}
      </div>
    </footer>
  );
}
