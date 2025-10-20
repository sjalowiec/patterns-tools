import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons, SiteHeader, SiteFooter, WizardIcon } from '@/components/lego';
import { ChevronDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import swatchBackgroundPng from '@assets/gauge_calcualtor_1760984280567.png';

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
              <svg style={{ maxWidth: '100%', height: 'auto' }} id="a" data-name="rulers" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 440 440">
                <defs>
                  <style>{`
                    .i {
                      filter: url(#c);
                      stroke-width: .87px;
                      transition: stroke 0.3s ease, filter 0.3s ease;
                    }
              
                    .i, .j {
                      fill: #eae8e8;
                      stroke: #000;
                    }
              
                    .j {
                      filter: url(#f);
                      stroke-width: .89px;
                      transition: stroke 0.3s ease, filter 0.3s ease;
                    }

                    .i.active,
                    .j.active {
                      stroke: #C2614E !important;
                      filter: drop-shadow(0 0 4px rgba(194, 97, 78, 0.6)) !important;
                    }
                  `}</style>
                  <filter id="c" data-name="drop-shadow-1" x="184.7" y="61.97" width="47" height="324" filterUnits="userSpaceOnUse">
                    <feOffset dx="1.73" dy="3.46"/>
                    <feGaussianBlur result="d" stdDeviation="3.46"/>
                    <feFlood floodColor="#000" floodOpacity=".61"/>
                    <feComposite in2="d" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                  <filter id="f" data-name="drop-shadow-2" x="49.64" y="190.44" width="332" height="48" filterUnits="userSpaceOnUse">
                    <feOffset dx="1.77" dy="3.54"/>
                    <feGaussianBlur result="g" stdDeviation="3.54"/>
                    <feFlood floodColor="#000" floodOpacity=".61"/>
                    <feComposite in2="g" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                </defs>
                <image id="background" data-name="swatch_background" width="440" height="440" xlinkHref={swatchBackgroundPng} />
                <path id="vertical-ruler" data-name="vertical ruler" className={`i ${activeRuler === 'vertical' ? 'active' : ''}`} d="M194.61,370.87V70.06h24.26v300.81h-24.26ZM205.28,75.42l-10.7.06M194.58,81.14l10.7-.06M194.58,86.8l10.7-.06M205.28,92.39l-10.7.06M212.55,98l-17.05.1M205.28,103.69l-10.7.06M205.28,109.35l-10.7.06M205.28,115l-10.7.06M194.58,120.72l10.7-.06M212.45,126.27l-17.05.1M205.28,131.97l-10.7.06M205.28,137.62l-10.7.06M205.28,143.28l-10.7.06M205.28,148.93l-10.7.06M212.34,154.54l-17.05.1M194.58,160.3l10.7-.06M205.28,165.89l-10.7.06M205.28,171.55l-10.7.06M194.58,177.27l10.7-.06M212.24,182.81l-17.05.1M205.28,188.51l-10.7.06M205.28,194.17l-10.7.06M194.58,199.89l10.7-.06M205.28,205.47l-10.7.06M212.14,211.09l-17.05.1M194.58,216.85l10.7-.06M205.28,222.44l-10.7.06M205.28,228.09l-10.7.06M205.28,233.75l-10.7.06M212.04,239.36l-17.05.1M205.28,245.06l-10.7.06M194.58,250.78l10.7-.06M194.58,256.43l10.7-.06M205.28,262.02l-10.7.06M211.94,267.63l-17.05.1M205.28,273.33l-10.7.06M205.28,278.98l-10.7.06M205.28,284.64l-10.7.06M194.58,290.36l10.7-.06M211.84,295.91l-17.05.1M194.58,301.67l10.7-.06M194.58,307.32l10.7-.06M205.28,312.91l-10.7.06M194.58,318.63l10.7-.06M211.73,324.18l-17.05.1M194.58,329.94l10.7-.06M205.28,335.53l-10.7.06M194.58,341.25l10.7-.06M194.58,346.9l10.7-.06M211.63,352.45l-17.05.1M194.58,358.21l10.7-.06M205.28,363.8l-10.7.06"/>
                <path id="horizontal-ruler" data-name="horizontal_ruler" className={`j ${activeRuler === 'horizontal' ? 'active' : ''}`} d="M59.15,197.99h307.98v24.84H59.15v-24.84ZM361.64,208.9l-.07-10.95M355.78,197.95l.07,10.95M349.99,197.95l.07,10.95M344.27,208.9l-.07-10.95M338.53,216.35l-.11-17.46M332.69,208.9l-.07-10.95M326.9,208.9l-.07-10.95M321.11,208.9l-.07-10.95M315.26,197.95l.07,10.95M309.58,216.24l-.11-17.46M303.74,208.9l-.07-10.95M297.96,208.9l-.07-10.95M292.17,208.9l-.07-10.95M286.38,208.9l-.07-10.95M280.63,216.14l-.11-17.46M274.73,197.95l.07,10.95M269.01,208.9l-.07-10.95M263.22,208.9l-.07-10.95M257.36,197.95l.07,10.95M251.68,216.04l-.11-17.46M245.85,208.9l-.07-10.95M240.06,208.9l-.07-10.95M234.21,197.95l.07,10.95M228.48,208.9l-.07-10.95M222.74,215.93l-.11-17.46M216.84,197.95l.07,10.95M211.12,208.9l-.07-10.95M205.33,208.9l-.07-10.95M199.54,208.9l-.07-10.95M193.79,215.83l-.11-17.46M187.96,208.9l-.07-10.95M182.1,197.95l.07,10.95M176.32,197.95l.07,10.95M170.59,208.9l-.07-10.95M164.84,215.72l-.11-17.46M159.01,208.9l-.07-10.95M153.22,208.9l-.07-10.95M147.44,208.9l-.07-10.95M141.58,197.95l.07,10.95M135.9,215.62l-.11-17.46M130,197.95l.07,10.95M124.21,197.95l.07,10.95M118.49,208.9l-.07-10.95M112.63,197.95l.07,10.95M106.95,215.52l-.11-17.46M101.06,197.95l.07,10.95M95.33,208.9l-.07-10.95M89.48,197.95l.07,10.95M83.69,197.95l.07,10.95M78,215.41l-.11-17.46M72.11,197.95l.07,10.95M66.39,208.9l-.07-10.95"/>
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
