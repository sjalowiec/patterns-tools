import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons, SiteHeader, SiteFooter, WizardIcon } from '@/components/lego';
import { ChevronDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

type Units = 'inches' | 'cm';

export default function GaugeCalculatorWizard() {
  // Load from localStorage or use defaults
  const [units, setUnits] = useState<Units>(() => {
    const saved = localStorage.getItem('gauge.unit');
    return (saved as Units) || 'inches';
  });
  const [swatchWidth, setSwatchWidth] = useState(() => localStorage.getItem('gauge.width') || '');
  const [swatchHeight, setSwatchHeight] = useState(() => localStorage.getItem('gauge.height') || '');
  const [stitches, setStitches] = useState(() => localStorage.getItem('gauge.sts') || '');
  const [rows, setRows] = useState(() => localStorage.getItem('gauge.rows') || '');
  const [tipsOpen, setTipsOpen] = useState(false);
  const [activeRuler, setActiveRuler] = useState<'horizontal' | 'vertical' | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('gauge.unit', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('gauge.width', swatchWidth);
  }, [swatchWidth]);

  useEffect(() => {
    localStorage.setItem('gauge.height', swatchHeight);
  }, [swatchHeight]);

  useEffect(() => {
    localStorage.setItem('gauge.sts', stitches);
  }, [stitches]);

  useEffect(() => {
    localStorage.setItem('gauge.rows', rows);
  }, [rows]);

  // Parse inputs
  const width = parseFloat(swatchWidth) || 0;
  const height = parseFloat(swatchHeight) || 0;
  const sts = parseFloat(stitches) || 0;
  const rowCount = parseFloat(rows) || 0;

  // Calculate gauge
  let stitchesPerInch = 0;
  let rowsPerInch = 0;
  let stitchesPer4or10 = 0;
  let rowsPer4or10 = 0;
  let displayLabel = '';

  if (width > 0 && height > 0 && sts > 0 && rowCount > 0) {
    if (units === 'inches') {
      stitchesPerInch = sts / width;
      rowsPerInch = rowCount / height;
      stitchesPer4or10 = stitchesPerInch * 4;
      rowsPer4or10 = rowsPerInch * 4;
      displayLabel = '4"';
    } else {
      // Centimeters - calculate per 10cm and convert to per inch
      const stitchesPer10cm = (sts / width) * 10;
      const rowsPer10cm = (rowCount / height) * 10;
      stitchesPer4or10 = stitchesPer10cm;
      rowsPer4or10 = rowsPer10cm;
      // Convert from per-10cm to per-inch: divide by 3.937 (10cm / 2.54)
      stitchesPerInch = stitchesPer10cm / 3.937007874;
      rowsPerInch = rowsPer10cm / 3.937007874;
      displayLabel = '10 cm';
    }
  }

  const hasResults = width > 0 && height > 0 && sts > 0 && rowCount > 0;

  const handleReset = () => {
    setSwatchWidth('');
    setSwatchHeight('');
    setStitches('');
    setRows('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pattern-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.75, 0.5] as [number, number, number, number],
      filename: 'gauge-calculator.pdf',
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
          <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <WizardIcon iconName="tools-icon" />
            <div style={{ flex: 1 }}>
              <h1 style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
                Gauge Calculator
              </h1>
              <h2 style={{ color: '#666', fontSize: '18px', lineHeight: '1.6', fontWeight: 'normal' }}>
                No more guesswork — measure your swatch, enter the results, and get accurate stitch and row counts in seconds
              </h2>
            </div>
          </div>

        {/* Two-Column Layout: Inputs + SVG */}
        <style>{`
          .gauge-grid {
            display: grid;
            grid-template-columns: 7fr 5fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          @media (max-width: 768px) {
            .gauge-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
        <div className="no-print gauge-grid">
          {/* Left Column: Inputs */}
          <div className="well_white">
            <UnitsToggle
              units={units}
              onChange={setUnits}
              gaugeLabel="Your Swatch Measurements"
            />

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={stitches}
                  onChange={(e) => setStitches(e.target.value)}
                  onFocus={() => setActiveRuler('horizontal')}
                  onBlur={() => setActiveRuler(null)}
                  placeholder="Count of stitches"
                  aria-label="Count of stitches"
                  data-testid="input-stitches"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                  onFocus={() => setActiveRuler('vertical')}
                  onBlur={() => setActiveRuler(null)}
                  placeholder="Count of rows"
                  aria-label="Count of rows"
                  data-testid="input-rows"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={swatchWidth}
                  onChange={(e) => setSwatchWidth(e.target.value)}
                  onFocus={() => setActiveRuler('horizontal')}
                  onBlur={() => setActiveRuler(null)}
                  placeholder={
                    sts > 0 
                      ? `Width over ${sts} stitches` 
                      : 'Measure stitches'
                  }
                  aria-label="Swatch width"
                  data-testid="input-width"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={swatchHeight}
                  onChange={(e) => setSwatchHeight(e.target.value)}
                  onFocus={() => setActiveRuler('vertical')}
                  onBlur={() => setActiveRuler(null)}
                  placeholder={
                    rowCount > 0 
                      ? `Height over ${rowCount} rows` 
                      : 'Measure rows'
                  }
                  aria-label="Swatch height"
                  data-testid="input-height"
                />
              </div>
            </div>
          </div>

          {/* Right Column: SVG Diagram */}
          <div className="well_white" style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', alignSelf: 'flex-start' }}>
              How to Measure
            </h2>
            <div style={{ 
              backgroundColor: '#f7f8f7', 
              border: '2px dashed #52682d', 
              borderRadius: '6px', 
              padding: '20px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <svg style={{ maxWidth: '100%', height: 'auto' }} viewBox="0 0 493.6 442.86" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <style>{`
                    .gauge-bg-fill {
                      fill: #fcfcfc;
                      opacity: .13;
                      stroke: #6e8b3d;
                      stroke-miterlimit: 10;
                    }
                    .gauge-triangle-marks {
                      stroke: #52682d;
                      stroke-width: 11px;
                      fill: none;
                    }
                    .gauge-outer-hex {
                      fill: #fefffd;
                      stroke: #52682d;
                      stroke-width: 16.24px;
                      stroke-linejoin: round;
                    }
                    .gauge-inner-hex {
                      fill: none;
                      stroke: #6e8b3d;
                      stroke-width: 11.37px;
                      stroke-linejoin: round;
                    }
                  `}</style>
                </defs>
                <g>
                  <path className="gauge-outer-hex" d="M341.49,8.12h-189.37c-17.62,0-33.9,9.4-42.7,24.65L14.73,196.78c-8.81,15.26-8.81,34.05,0,49.31l94.69,164c8.81,15.26,25.09,24.65,42.7,24.65h189.37c17.62,0,33.9-9.4,42.7-24.65l94.69-164c8.81-15.26,8.81-34.05,0-49.31l-94.69-164c-8.81-15.26-25.09-24.65-42.7-24.65Z"/>
                  <path className="gauge-bg-fill" d="M323.02,36.35h-159.07c-14.8,0-28.47,7.89-35.87,20.71L48.54,194.82c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
                  <path className="gauge-inner-hex" d="M326.34,37.97h-159.07c-14.8,0-28.47,7.89-35.87,20.71L51.86,196.44c-7.4,12.82-7.4,28.6,0,41.42l79.54,137.76c7.4,12.82,21.07,20.71,35.87,20.71h159.07c14.8,0,28.47-7.89,35.87-20.71l79.54-137.76c7.4-12.82,7.4-28.6,0-41.42l-79.54-137.76c-7.4-12.82-21.07-20.71-35.87-20.71Z"/>
                  <polygon className="gauge-triangle-marks" points="360.56 315.11 141.71 315.11 141.71 96.26 360.56 315.11"/>
                  <line className="gauge-triangle-marks" x1="176.9" y1="286.72" x2="176.9" y2="313.03"/>
                  <line className="gauge-triangle-marks" x1="215.83" y1="267.27" x2="215.83" y2="313.03"/>
                  <line className="gauge-triangle-marks" x1="254.77" y1="286.72" x2="254.77" y2="313.03"/>
                  <line className="gauge-triangle-marks" x1="293.7" y1="267.27" x2="293.7" y2="313.03"/>
                  <line className="gauge-triangle-marks" x1="167.62" y1="276.55" x2="141.31" y2="276.55"/>
                  <line className="gauge-triangle-marks" x1="187.07" y1="237.62" x2="141.31" y2="237.62"/>
                  <line className="gauge-triangle-marks" x1="167.62" y1="198.68" x2="141.31" y2="198.68"/>
                  <line className="gauge-triangle-marks" x1="187.07" y1="159.75" x2="141.31" y2="159.75"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Results Block with Fade-In Animation */}
        {hasResults && (
          <div 
            className="well_white"
            style={{ 
              animation: 'fadeIn 0.3s ease-in'
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              Your Gauge
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '16px'
            }}>
              {/* Stitch Gauge Column */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f7f8f7', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ color: '#52682d', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Stitch Gauge
                </h3>
                <p style={{ color: '#333', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {stitchesPer4or10.toFixed(2)}
                </p>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: units === 'inches' ? '8px' : '0' }}>
                  stitches per {displayLabel}
                </p>
                {units === 'inches' && (
                  <p style={{ color: '#999', fontSize: '12px' }}>
                    ({stitchesPerInch.toFixed(2)} per 1")
                  </p>
                )}
              </div>

              {/* Row Gauge Column */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f7f8f7', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ color: '#52682d', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Row Gauge
                </h3>
                <p style={{ color: '#333', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {rowsPer4or10.toFixed(2)}
                </p>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: units === 'inches' ? '8px' : '0' }}>
                  rows per {displayLabel}
                </p>
                {units === 'inches' && (
                  <p style={{ color: '#999', fontSize: '12px' }}>
                    ({rowsPerInch.toFixed(2)} per 1")
                  </p>
                )}
              </div>
            </div>

            <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', fontStyle: 'italic' }}>
              Values are approximate. Always swatch carefully.
            </p>
          </div>
        )}

        {/* Collapsible Tips Section */}
        <div className="well_white no-print" style={{ 
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            data-testid="button-toggle-tips"
            style={{
              width: '100%',
              padding: '20px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f8f7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              Tips for Accurate Measurements
            </h2>
            <ChevronDown 
              size={24} 
              style={{ 
                color: '#52682d',
                transform: tipsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </button>
          
          <div 
            style={{ 
              maxHeight: tipsOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease'
            }}
          >
            <div style={{ padding: '0 24px 24px 24px' }}>
              <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li>Always measure your swatch after resting and blocking.</li>
                <li>Use a ruler with clear markings for accurate measurements.</li>
                <li>Measure multiple sections of the swatch and average the results for better accuracy.</li>
                <li>Count stitches and rows in the center of your swatch, away from the edges.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print" style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
          Built for machine knitters. Always swatch before you knit.
        </div>
        </div>
      </div>

      <PrintFooter />
      <SiteFooter />
    </div>
  );
}
