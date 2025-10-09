import { useState, useEffect } from 'react';
import { GaugeInputs, RadioGroup, useSleeveDropShoulder, PrintHeader, PrintFooter, PrintOnlyTitle, StickyActionButtons } from '@/components/lego';
import type { Units } from '@shared/types/wizard';
import html2pdf from 'html2pdf.js';

export default function BoatNeckWizard() {
  const [units, setUnits] = useState<Units>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('');
  const [rowsIn4, setRowsIn4] = useState<string>('');
  const [withSleeves, setWithSleeves] = useState<string>('sleeveless');
  const [hasGaugeError, setHasGaugeError] = useState<boolean>(false);

  // Warn user before leaving page if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stitchesIn4 || rowsIn4) {
        e.preventDefault();
        e.returnValue = 'Your pattern will be lost! Make sure to download your PDF before leaving.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stitchesIn4, rowsIn4]);

  // Calculate per-unit gauge
  const stitchesPerUnit = (Number(stitchesIn4) || 0) / 4;
  const rowsPerUnit = (Number(rowsIn4) || 0) / 4;

  // Default body dimensions (will be configurable later)
  // Using women's medium as default: ~40" chest, 24" length
  const bodyWidthIn = 40; // Full chest circumference
  const bodyLengthIn = 24; // Total garment length
  
  // Convert to display units
  const bodyWidth = units === 'inches' ? bodyWidthIn : bodyWidthIn * 2.54;
  const bodyLength = units === 'inches' ? bodyLengthIn : bodyLengthIn * 2.54;

  // Calculate stitch and row counts for Front and Back panels (each is half the body width)
  const panelWidthIn = bodyWidthIn / 2; // Front and Back are each half
  const castOnSts = Math.round(panelWidthIn * stitchesPerUnit) || 0;
  const totalRows = Math.round(bodyLengthIn * rowsPerUnit) || 0;

  // Sleeve pattern using hook (only if user wants sleeves)
  const sleeveParams = withSleeves === 'sleeves' && stitchesIn4 && rowsIn4 ? {
    category: 'misses',
    size: 'Med',
    stitchGauge: stitchesPerUnit,
    rowGauge: rowsPerUnit,
    units,
  } : null;

  const { pattern: sleevePattern, loading: sleeveLoading, error: sleeveError } = useSleeveDropShoulder(sleeveParams);

  const hasRequiredInputs = stitchesIn4 && rowsIn4 && !hasGaugeError;

  // Pattern instructions
  const frontBackInstructions = hasRequiredInputs ? `
    <div class="pattern-section">
      <h3>Front Panel</h3>
      <p><strong>Cast on:</strong> ${castOnSts} stitches</p>
      <p><strong>Work even:</strong> Knit in stockinette stitch (or your preferred stitch pattern) for ${totalRows} rows</p>
      <p><strong>Bind off:</strong> All stitches</p>
    </div>

    <div class="pattern-section">
      <h3>Back Panel</h3>
      <p><strong>Cast on:</strong> ${castOnSts} stitches</p>
      <p><strong>Work even:</strong> Knit in stockinette stitch (or your preferred stitch pattern) for ${totalRows} rows</p>
      <p><strong>Bind off:</strong> All stitches</p>
      <p><em>Note: Front and Back are identical for a classic boat neck design.</em></p>
    </div>
  ` : '';

  const finishingInstructions = hasRequiredInputs ? `
    <div class="pattern-section">
      <h3>Assembly & Finishing</h3>
      <p><strong>Seaming:</strong> Sew shoulder seams, leaving center open for boat neck opening (approximately 1/3 of shoulder width unsewn)</p>
      ${withSleeves === 'sleeves' ? '<p><strong>Attach sleeves:</strong> Sew sleeves to armholes</p>' : ''}
      <p><strong>Side seams:</strong> Sew side seams${withSleeves === 'sleeves' ? ' and underarm seams' : ''}</p>
      <p><strong>Neckline:</strong> Leave as-is for a rolled edge, or pick up stitches and work 1" ribbing (k1, p1) if desired</p>
      <p><strong>Finishing:</strong> Weave in all ends and block to measurements</p>
    </div>
  ` : '';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pattern-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.75, 0.5] as [number, number, number, number],
      filename: 'boat-neck-sweater-pattern.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleStartOver = () => {
    if (confirm('Start over? All current pattern data will be lost.')) {
      setStitchesIn4('');
      setRowsIn4('');
      setWithSleeves('sleeveless');
      setHasGaugeError(false);
    }
  };

  const actions = [
    {
      id: 'print',
      icon: '🖨️',
      label: 'Print',
      onClick: handlePrint,
      testId: 'button-print'
    },
    {
      id: 'download',
      icon: '📥',
      label: 'Download PDF',
      onClick: handleDownloadPDF,
      testId: 'button-download-pdf'
    },
    {
      id: 'start-over',
      icon: '🔄',
      label: 'Start Over',
      onClick: handleStartOver,
      testId: 'button-start-over'
    }
  ];

  return (
    <div className="wizard-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <PrintHeader />
      
      <div id="pattern-content">
        <PrintOnlyTitle title="Boat Neck Sweater Pattern" />
        
        <h1 className="no-print" style={{ color: '#52682d', marginBottom: '10px' }}>Boat Neck Sweater Pattern Builder</h1>
        <p className="no-print" style={{ marginBottom: '30px', color: '#666' }}>
          Create a simple, elegant boat neck sweater pattern based on your gauge.
        </p>

        {/* Gauge Inputs */}
        <div className="well_white no-print">
          <h2 style={{ color: '#52682d', marginBottom: '20px' }}>Your Gauge</h2>
          
          <RadioGroup
            name="units"
            label="Measurement Units"
            options={[
              { value: 'inches', label: 'Inches', testId: 'radio-inches' },
              { value: 'cm', label: 'Centimeters', testId: 'radio-cm' }
            ]}
            selectedValue={units}
            onChange={(value) => setUnits(value as Units)}
          />
          
          <GaugeInputs
            units={units}
            stitchesIn4={stitchesIn4}
            rowsIn4={rowsIn4}
            onStitchesChange={setStitchesIn4}
            onRowsChange={setRowsIn4}
            onValidationChange={setHasGaugeError}
            stitchesTestId="input-stitches"
            rowsTestId="input-rows"
          />
        </div>

        {/* Sleeves Option */}
        <div className="well_white no-print">
          <RadioGroup
            name="sleeves"
            label="Want to knit sleeves too, or keep it simple and sleeveless?"
            options={[
              { value: 'sleeveless', label: 'Sleeveless (vest style)', testId: 'radio-sleeveless' },
              { value: 'sleeves', label: 'With Sleeves', testId: 'radio-sleeves' }
            ]}
            selectedValue={withSleeves}
            onChange={setWithSleeves}
          />
        </div>

        {/* Pattern Display */}
        {hasRequiredInputs && (
          <>
            <div className="well_white">
              <h2 style={{ color: '#52682d', marginBottom: '15px' }}>Pattern Summary</h2>
              <p><strong>Body Width:</strong> {bodyWidth.toFixed(1)}{units === 'inches' ? '"' : 'cm'} (total circumference)</p>
              <p><strong>Body Length:</strong> {bodyLength.toFixed(1)}{units === 'inches' ? '"' : 'cm'}</p>
              <p><strong>Style:</strong> {withSleeves === 'sleeves' ? 'With Sleeves' : 'Sleeveless Vest'}</p>
              <p><strong>Each Panel Casts On:</strong> {castOnSts} stitches</p>
              <p><strong>Total Rows per Panel:</strong> {totalRows} rows</p>
            </div>

            <div className="well_white">
              <h2 style={{ color: '#52682d', marginBottom: '15px' }}>Pattern Instructions</h2>
              <div dangerouslySetInnerHTML={{ __html: frontBackInstructions }} />
              
              {withSleeves === 'sleeves' && (
                <>
                  {sleeveLoading && <p>Loading sleeve pattern...</p>}
                  {sleeveError && <p style={{ color: '#d32f2f' }}>Error loading sleeve pattern: {sleeveError}</p>}
                  {sleevePattern && (
                    <div className="pattern-section">
                      <h3>Sleeves (Make 2)</h3>
                      <div dangerouslySetInnerHTML={{ __html: sleevePattern.sleevePatternText }} />
                    </div>
                  )}
                </>
              )}
              
              <div dangerouslySetInnerHTML={{ __html: finishingInstructions }} />
            </div>
          </>
        )}

        {!hasRequiredInputs && !hasGaugeError && (
          <div className="well_white" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Enter your gauge above to generate your boat neck sweater pattern.</p>
          </div>
        )}
      </div>

      <PrintFooter />

      <StickyActionButtons actions={actions} show={!!hasRequiredInputs} />
    </div>
  );
}
