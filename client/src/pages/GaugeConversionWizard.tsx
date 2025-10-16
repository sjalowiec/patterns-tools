import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons, SiteHeader, SiteFooter } from '@/components/lego';
import { ChevronDown, Calculator } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Units = 'inches' | 'cm';

export default function GaugeConversionWizard() {
  // Unit preference
  const [units, setUnits] = useState<Units>(() => {
    const saved = localStorage.getItem('gaugeConversion.unit');
    return (saved as Units) || 'inches';
  });

  // Pattern Gauge (what the pattern calls for)
  const [patternStitches, setPatternStitches] = useState(() => localStorage.getItem('gaugeConversion.patternSts') || '');
  const [patternRows, setPatternRows] = useState(() => localStorage.getItem('gaugeConversion.patternRows') || '');

  // Your Gauge (what you actually get)
  const [yourStitches, setYourStitches] = useState(() => localStorage.getItem('gaugeConversion.yourSts') || '');
  const [yourRows, setYourRows] = useState(() => localStorage.getItem('gaugeConversion.yourRows') || '');

  // Test conversion inputs
  const [testStitches, setTestStitches] = useState(() => localStorage.getItem('gaugeConversion.testSts') || '');
  const [testRows, setTestRows] = useState(() => localStorage.getItem('gaugeConversion.testRows') || '');

  const [tipsOpen, setTipsOpen] = useState(false);
  const [showMath, setShowMath] = useState(false);
  
  // Quick Convert modal state
  const [quickConvertOpen, setQuickConvertOpen] = useState(false);
  const [lengthInput, setLengthInput] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('gaugeConversion.unit', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.patternSts', patternStitches);
  }, [patternStitches]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.patternRows', patternRows);
  }, [patternRows]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.yourSts', yourStitches);
  }, [yourStitches]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.yourRows', yourRows);
  }, [yourRows]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.testSts', testStitches);
  }, [testStitches]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.testRows', testRows);
  }, [testRows]);

  // Parse inputs
  const pSts = parseFloat(patternStitches) || 0;
  const pRows = parseFloat(patternRows) || 0;
  const ySts = parseFloat(yourStitches) || 0;
  const yRows = parseFloat(yourRows) || 0;

  // Calculate multipliers
  const stitchMultiplier = pSts > 0 ? ySts / pSts : 0;
  const rowMultiplier = pRows > 0 ? yRows / pRows : 0;

  // Calculate test conversions
  const testStsNum = parseFloat(testStitches) || 0;
  const testRowsNum = parseFloat(testRows) || 0;
  const convertedStitches = testStsNum > 0 && stitchMultiplier > 0 ? Math.round(testStsNum * stitchMultiplier) : 0;
  const convertedRows = testRowsNum > 0 && rowMultiplier > 0 ? Math.round(testRowsNum * rowMultiplier) : 0;

  const hasResults = pSts > 0 && pRows > 0 && ySts > 0 && yRows > 0;
  const displayLabel = units === 'inches' ? '4"' : '10 cm';
  
  // Calculate rows per single unit for length-to-rows conversion
  const rowsPerUnit = units === 'inches' ? yRows / 4 : yRows / 10;
  const unitLabel = units === 'inches' ? 'inch' : 'cm';
  const lengthNum = parseFloat(lengthInput) || 0;
  const convertedRowsFromLength = lengthNum > 0 && rowsPerUnit > 0 ? Math.round(lengthNum * rowsPerUnit) : 0;

  const handleReset = () => {
    setPatternStitches('');
    setPatternRows('');
    setYourStitches('');
    setYourRows('');
    setTestStitches('');
    setTestRows('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pattern-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.75, 0.5] as [number, number, number, number],
      filename: 'gauge-conversion.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleStartOver = () => {
    if (confirm('Start over? All current data will be lost.')) {
      handleReset();
    }
  };

  const actions = [
    {
      id: 'print',
      icon: 'fas fa-print',
      label: 'Print',
      onClick: handlePrint,
      className: 'btn-round-wizard',
      testId: 'button-print'
    },
    {
      id: 'download',
      icon: 'fas fa-download',
      label: 'Download PDF',
      onClick: handleDownloadPDF,
      className: 'btn-round-wizard',
      testId: 'button-download-pdf'
    },
    {
      id: 'start-over',
      icon: 'fas fa-redo',
      label: 'Start Over',
      onClick: handleStartOver,
      className: 'btn-round-wizard',
      testId: 'button-start-over'
    }
  ];

  return (
    <div className="wizard-container">
      <SiteHeader />
      
      <StickyActionButtons actions={actions} show={hasResults} />

      <div id="pattern-content">
        <PrintHeader />
        
        <div className="content-area">
          {/* Title Section */}
          <div className="no-print" style={{ marginBottom: '20px' }}>
            <h1 style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
              Gauge Conversion Tool
            </h1>
            <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
              Convert pattern numbers to match your gauge. Enter the pattern's gauge and your actual gauge below.
            </p>
          </div>

          <PrintOnlyTitle title="Gauge Conversion Tool" />

          {/* Unit Toggle */}
          <div className="no-print" style={{ marginBottom: '24px' }}>
            <UnitsToggle units={units} onChange={setUnits} gaugeLabel="Gauge Units" />
          </div>

          {/* Gauge Input Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Pattern Gauge */}
            <div className="well_white">
              <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Pattern Gauge
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                What the pattern calls for per {displayLabel}
              </p>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Stitches per {displayLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={patternStitches}
                  onChange={(e) => setPatternStitches(e.target.value)}
                  placeholder={`e.g., 20`}
                  data-testid="input-pattern-stitches"
                />
              </div>

              <div className="form-group">
                <label>Rows per {displayLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={patternRows}
                  onChange={(e) => setPatternRows(e.target.value)}
                  placeholder={`e.g., 28`}
                  data-testid="input-pattern-rows"
                />
              </div>
            </div>

            {/* Your Gauge */}
            <div className="well_white">
              <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Your Gauge
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                What you actually get per {displayLabel}
              </p>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Stitches per {displayLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={yourStitches}
                  onChange={(e) => setYourStitches(e.target.value)}
                  placeholder={`e.g., 23`}
                  data-testid="input-your-stitches"
                />
              </div>

              <div className="form-group">
                <label>Rows per {displayLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={yourRows}
                  onChange={(e) => setYourRows(e.target.value)}
                  placeholder={`e.g., 26`}
                  data-testid="input-your-rows"
                />
              </div>
            </div>
          </div>

          {/* Direct Conversion Results */}
          {hasResults && (
            <div 
              className="well_white"
              style={{ 
                animation: 'fadeIn 0.3s ease-in',
                marginBottom: '24px'
              }}
            >
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              
              <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Pattern Translator
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Enter any number from your pattern and see what you need to work
              </p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '24px',
                marginBottom: '20px'
              }}>
                {/* Stitch Converter */}
                <div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Pattern says (stitches)</label>
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      value={testStitches}
                      onChange={(e) => setTestStitches(e.target.value)}
                      placeholder="e.g., 100"
                      data-testid="input-test-stitches"
                    />
                  </div>
                  {testStsNum > 0 && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: '#f0f4ec', 
                      borderRadius: '6px',
                      border: '2px solid #52682d'
                    }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                        You cast on:
                      </p>
                      <p style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold' }} data-testid="text-converted-stitches">
                        {convertedStitches} stitches
                      </p>
                    </div>
                  )}
                </div>

                {/* Row Converter */}
                <div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Pattern says (rows)</label>
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      value={testRows}
                      onChange={(e) => setTestRows(e.target.value)}
                      placeholder="e.g., 80"
                      data-testid="input-test-rows"
                    />
                  </div>
                  {testRowsNum > 0 && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: '#f0f4ec', 
                      borderRadius: '6px',
                      border: '2px solid #52682d'
                    }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                        You knit:
                      </p>
                      <p style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold' }} data-testid="text-converted-rows">
                        {convertedRows} rows
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Show Math Toggle */}
              <button
                onClick={() => setShowMath(!showMath)}
                data-testid="button-toggle-math"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7f8f7';
                  e.currentTarget.style.borderColor = '#52682d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: showMath ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
                {showMath ? 'Hide' : 'Show'} the math
              </button>

              {/* Math Details */}
              {showMath && (
                <div style={{ 
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f7f8f7',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <p style={{ marginBottom: '12px', fontWeight: '600', color: '#52682d' }}>
                    Conversion Multipliers:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <p style={{ margin: 0 }}>
                        <strong>Stitches:</strong> Multiply by {stitchMultiplier.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0 }}>
                        <strong>Rows:</strong> Multiply by {rowMultiplier.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p style={{ marginTop: '12px', fontSize: '13px', fontStyle: 'italic' }}>
                    These are calculated from your gauge: {ySts}/{pSts} for stitches, {yRows}/{pRows} for rows
                  </p>
                </div>
              )}
            </div>
          )}


          {/* Collapsible Tips Section */}
          <div className="well_white no-print" style={{ overflow: 'hidden' }}>
            <button
              onClick={() => setTipsOpen(!tipsOpen)}
              data-testid="button-toggle-tips"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: '#52682d',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              <span>Tips for Using This Tool</span>
              <ChevronDown 
                size={20} 
                style={{ 
                  transform: tipsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>
            
            {tipsOpen && (
              <div style={{ padding: '0 16px 16px 16px' }}>
                <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li><strong>When to use:</strong> This tool is perfect when you want to use a different yarn weight or knit at a different tension than the pattern specifies.</li>
                  <li><strong>How it works:</strong> The multipliers show you how much larger or smaller your knitting will be compared to the pattern. Numbers above 1.0 mean you need MORE stitches/rows, below 1.0 means FEWER.</li>
                  <li><strong>Example:</strong> If the pattern says "Cast on 100 stitches" and your multiplier is 1.15, you'd cast on 115 stitches instead.</li>
                  <li><strong>Important:</strong> This works best for simple patterns. Complex shaping, lace, or cables may need additional adjustments.</li>
                  <li><strong>Pro tip:</strong> Always knit a swatch in your yarn to get an accurate gauge before starting your project.</li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ flex: 1 }}>
                      <strong>Converting lengths to rows:</strong>{' '}
                      {units === 'inches' 
                        ? 'Hand knitting patterns often give length measurements in inches. When the pattern says "Knit until sleeve measures 15 inches," multiply 15 by your rows-per-inch gauge to find how many rows to knit.'
                        : 'Hand knitting patterns often give measurements in centimeters. When the pattern says "Knit until sleeve measures 38 cm," multiply 38 by your rows-per-centimeter gauge to find how many rows to knit.'}
                    </span>
                    {hasResults && rowsPerUnit > 0 && (
                      <button
                        onClick={() => setQuickConvertOpen(true)}
                        data-testid="button-quick-convert"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          backgroundColor: '#52682d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6e8b3d'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52682d'}
                      >
                        <Calculator size={14} />
                        Quick Convert
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <PrintFooter />
      </div>

      <SiteFooter />

      {/* Quick Convert Modal */}
      <Dialog open={quickConvertOpen} onOpenChange={setQuickConvertOpen}>
        <DialogContent style={{ maxWidth: '500px' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#52682d', fontSize: '20px' }}>
              Quick Convert: Length to Rows
            </DialogTitle>
            <DialogDescription style={{ color: '#666', fontSize: '14px' }}>
              Convert any length measurement to the number of rows you need to knit.
            </DialogDescription>
          </DialogHeader>
          
          <div style={{ marginTop: '20px' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Length ({units === 'inches' ? 'inches' : 'cm'})</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                placeholder={units === 'inches' ? 'e.g., 15' : 'e.g., 38'}
                data-testid="input-length-convert"
                autoFocus
              />
            </div>

            {lengthNum > 0 && convertedRowsFromLength > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f0f4ec', 
                  borderRadius: '6px',
                  border: '2px solid #52682d',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Knit
                  </p>
                  <p style={{ color: '#52682d', fontSize: '32px', fontWeight: 'bold', marginBottom: '0' }} data-testid="text-length-to-rows-result">
                    {convertedRowsFromLength} rows
                  </p>
                </div>

                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8f7', 
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  <p style={{ margin: 0, fontFamily: 'monospace' }}>
                    {lengthNum} {unitLabel}{lengthNum !== 1 ? (units === 'inches' ? 'es' : '') : ''} × {rowsPerUnit.toFixed(2)} rows per {unitLabel} = {convertedRowsFromLength} rows
                  </p>
                </div>
              </div>
            )}

            {lengthNum === 0 && (
              <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic', marginTop: '12px' }}>
                Enter a length to see the conversion
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Print-only title component
function PrintOnlyTitle({ title }: { title: string }) {
  return (
    <div className="print-only" style={{ marginBottom: '24px' }}>
      <h1 style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold' }}>
        {title}
      </h1>
    </div>
  );
}
