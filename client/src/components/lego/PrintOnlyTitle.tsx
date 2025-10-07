interface PrintOnlyTitleProps {
  title: string;
}

/**
 * PrintOnlyTitle - Reusable lego block for print/PDF-only title sections
 * Hidden on screen, visible in print output
 */
export function PrintOnlyTitle({ title }: PrintOnlyTitleProps) {
  return (
    <div className="print-only-title" style={{
      display: 'none',
      textAlign: 'center',
      marginBottom: '30px'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#52682d',
        marginBottom: '10px'
      }}>
        {title}
      </h1>
    </div>
  );
}
