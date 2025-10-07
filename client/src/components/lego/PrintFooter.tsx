interface PrintFooterProps {
  className?: string;
}

export function PrintFooter({ className = "" }: PrintFooterProps) {
  return (
    <footer className={`print-only-footer ${className}`}>
      <div className="print-footer-content">
        <p>© {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
}
