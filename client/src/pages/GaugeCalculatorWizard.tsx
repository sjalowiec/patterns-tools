import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons } from '@/components/lego';
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f7f8f7', minHeight: '100vh' }}>
      <StickyActionButtons actions={actions} show={hasResults} />

      <div id="pattern-content">
        <PrintHeader />
        
        {/* Title Section */}
        <div className="no-print" style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '32px 24px', 
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
            Gauge Calculator
          </h1>
          <p style={{ color: '#666', lineHeight: '1.6', maxWidth: '800px' }}>
            Calculate your stitch and row gauge from swatch measurements. Enter your swatch dimensions and stitch counts to get precise gauge numbers for your knitting projects.
          </p>
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
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              Your Swatch Measurements
            </h2>

            <UnitsToggle
              units={units}
              onChange={setUnits}
              label="Measurement Units"
            />

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Width</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={swatchWidth}
                  onChange={(e) => setSwatchWidth(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g., 4' : 'e.g., 10'}
                  data-testid="input-width"
                />
              </div>

              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={swatchHeight}
                  onChange={(e) => setSwatchHeight(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g., 4' : 'e.g., 10'}
                  data-testid="input-height"
                />
              </div>

              <div className="form-group">
                <label>Stitches</label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={stitches}
                  onChange={(e) => setStitches(e.target.value)}
                  placeholder="Count of stitches"
                  data-testid="input-stitches"
                />
              </div>

              <div className="form-group">
                <label>Rows</label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                  placeholder="Count of rows"
                  data-testid="input-rows"
                />
              </div>
            </div>
          </div>

          {/* Right Column: SVG Diagram */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
              <svg id="b" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 271 271" style={{ maxWidth: '100%', height: 'auto' }}>
                <defs>
                  <style>{`
                    .h {
                      stroke-width: 1.63px;
                    }

                    .h, .i, .j, .k, .l {
                      stroke: #000;
                    }

                    .h, .j {
                      fill: none;
                      stroke-linecap: round;
                    }

                    .i {
                      filter: url(#d);
                    }

                    .i, .l {
                      fill: #eae8e8;
                      stroke-width: .52px;
                    }

                    .j {
                      stroke-width: 1.71px;
                    }

                    .k {
                      fill: #fff;
                    }

                    .l {
                      filter: url(#f);
                    }
                  `}</style>
                  <filter id="d" data-name="drop-shadow-1" x="120.72" y="41.29" width="29" height="196" filterUnits="userSpaceOnUse">
                    <feOffset dx="1.04" dy="2.09"/>
                    <feGaussianBlur result="e" stdDeviation="2.09"/>
                    <feFlood floodColor="#000" floodOpacity=".61"/>
                    <feComposite in2="e" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                  <filter id="f" data-name="drop-shadow-2" x="39.72" y="133.29" width="195" height="29" filterUnits="userSpaceOnUse">
                    <feOffset dx="1.04" dy="2.09"/>
                    <feGaussianBlur result="g" stdDeviation="2.09"/>
                    <feFlood floodColor="#000" floodOpacity=".61"/>
                    <feComposite in2="g" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                </defs>
                <g id="c" data-name="swatch_measure">
                  <rect className="k" x=".5" y=".5" width="270" height="270"/>
                  <g>
                    <line className="h" x1="35.38" y1="141.79" x2="39.16" y2="148.9"/>
                    <line className="h" x1="43.22" y1="141.79" x2="39.43" y2="148.9"/>
                  </g>
                  <g>
                    <line className="j" x1="228.13" y1="141.42" x2="231.91" y2="149.26"/>
                    <line className="j" x1="235.97" y1="141.42" x2="232.18" y2="149.26"/>
                  </g>
                  <path className="j" d="M5.62,45l-3.79-7.84M9.68,37.16l-3.79,7.84M9.92,37.16l3.79,7.84M17.76,37.16l-3.79,7.84M18,37.16l3.79,7.84M25.84,37.16l-3.79,7.84M26.07,37.16l3.79,7.84M33.92,37.16l-3.79,7.84M37.94,45l-3.79-7.84M42,37.16l-3.79,7.84M46.02,45l-3.79-7.84M50.07,37.16l-3.79,7.84M54.1,45l-3.79-7.84M58.15,37.16l-3.79,7.84M62.18,45l-3.79-7.84M66.23,37.16l-3.79,7.84M70.26,45l-3.79-7.84M74.31,37.16l-3.79,7.84M78.34,45l-3.79-7.84M82.39,37.16l-3.79,7.84M86.41,45l-3.79-7.84M90.47,37.16l-3.79,7.84M94.49,45l-3.79-7.84M98.55,37.16l-3.79,7.84M102.57,45l-3.79-7.84M106.63,37.16l-3.79,7.84M110.65,45l-3.79-7.84M114.71,37.16l-3.79,7.84M118.73,45l-3.79-7.84M122.79,37.16l-3.79,7.84M126.81,45l-3.79-7.84M130.87,37.16l-3.79,7.84M134.89,45l-3.79-7.84M138.95,37.16l-3.79,7.84M142.97,45l-3.79-7.84M147.02,37.16l-3.79,7.84M151.05,45l-3.79-7.84M155.1,37.16l-3.79,7.84M159.13,45l-3.79-7.84M163.18,37.16l-3.79,7.84M167.21,45l-3.79-7.84M171.26,37.16l-3.79,7.84M175.29,45l-3.79-7.84M179.34,37.16l-3.79,7.84M183.36,45l-3.79-7.84M187.42,37.16l-3.79,7.84M191.44,45l-3.79-7.84M195.5,37.16l-3.79,7.84M199.52,45l-3.79-7.84M203.58,37.16l-3.79,7.84M203.82,37.16l3.79,7.84M211.66,37.16l-3.79,7.84M211.9,37.16l3.79,7.84M219.74,37.16l-3.79,7.84M219.98,37.16l3.79,7.84M227.82,37.16l-3.79,7.84M228.05,37.16l3.79,7.84M235.9,37.16l-3.79,7.84M236.13,37.16l3.79,7.84M243.98,37.16l-3.79,7.84M244.21,37.16l3.79,7.84M252.05,37.16l-3.79,7.84M252.29,37.16l3.79,7.84M260.13,37.16l-3.79,7.84M260.37,37.16l3.79,7.84M268.21,37.16l-3.79,7.84"/>
                  <path className="j" d="M6.56,238.38l-3.79-7.84M10.61,230.54l-3.79,7.84M10.85,230.54l3.79,7.84M18.69,230.54l-3.79,7.84M18.93,230.54l3.79,7.84M26.77,230.54l-3.79,7.84M27.01,230.54l3.79,7.84M34.85,230.54l-3.79,7.84M38.87,238.38l-3.79-7.84M42.93,230.54l-3.79,7.84M46.95,238.38l-3.79-7.84M51.01,230.54l-3.79,7.84M55.03,238.38l-3.79-7.84M59.09,230.54l-3.79,7.84M63.11,238.38l-3.79-7.84M67.17,230.54l-3.79,7.84M71.19,238.38l-3.79-7.84M75.25,230.54l-3.79,7.84M79.27,238.38l-3.79-7.84M83.33,230.54l-3.79,7.84M87.35,238.38l-3.79-7.84M91.4,230.54l-3.79,7.84M95.43,238.38l-3.79-7.84M99.48,230.54l-3.79,7.84M103.51,238.38l-3.79-7.84M107.56,230.54l-3.79,7.84M111.59,238.38l-3.79-7.84M115.64,230.54l-3.79,7.84M119.67,238.38l-3.79-7.84M123.72,230.54l-3.79,7.84M127.74,238.38l-3.79-7.84M131.8,230.54l-3.79,7.84M135.82,238.38l-3.79-7.84M139.88,230.54l-3.79,7.84M143.9,238.38l-3.79-7.84M147.96,230.54l-3.79,7.84M151.98,238.38l-3.79-7.84M156.04,230.54l-3.79,7.84M160.06,238.38l-3.79-7.84M164.12,230.54l-3.79,7.84M168.14,238.38l-3.79-7.84M172.2,230.54l-3.79,7.84M176.22,238.38l-3.79-7.84M180.28,230.54l-3.79,7.84M184.3,238.38l-3.79-7.84M188.35,230.54l-3.79,7.84M192.38,238.38l-3.79-7.84M196.43,230.54l-3.79,7.84M200.46,238.38l-3.79-7.84M204.51,230.54l-3.79,7.84M204.75,230.54l3.79,7.84M212.59,230.54l-3.79,7.84M212.83,230.54l3.79,7.84M220.67,230.54l-3.79,7.84M220.91,230.54l3.79,7.84M228.75,230.54l-3.79,7.84M228.99,230.54l3.79,7.84M236.83,230.54l-3.79,7.84M237.07,230.54l3.79,7.84M244.91,230.54l-3.79,7.84M245.15,230.54l3.79,7.84M252.99,230.54l-3.79,7.84M253.23,230.54l3.79,7.84M261.07,230.54l-3.79,7.84M261.31,230.54l3.79,7.84M269.15,230.54l-3.79,7.84"/>
                  <path className="i" d="M141.33,46.37v181.21h-14.61V46.37h14.61ZM134.9,224.35l6.44-.04M141.35,220.91l-6.44.04M141.35,217.5l-6.44.04M134.9,214.13l6.44-.04M130.52,210.75l10.27-.06M134.9,207.32l6.44-.04M134.9,203.91l6.44-.04M134.9,200.51l6.44-.04M141.35,197.06l-6.44.04M130.59,193.72l10.27-.06M134.9,190.29l6.44-.04M134.9,186.88l6.44-.04M134.9,183.48l6.44-.04M134.9,180.07l6.44-.04M130.65,176.69l10.27-.06M141.35,173.22l-6.44.04M134.9,169.85l6.44-.04M134.9,166.44l6.44-.04M141.35,163l-6.44.04M130.71,159.66l10.27-.06M134.9,156.23l6.44-.04M134.9,152.82l6.44-.04M141.35,149.37l-6.44.04M134.9,146.01l6.44-.04M130.77,142.63l10.27-.06M141.35,139.15l-6.44.04M134.9,135.79l6.44-.04M134.9,132.38l6.44-.04M134.9,128.97l6.44-.04M130.83,125.59l10.27-.06M134.9,122.16l6.44-.04M141.35,118.72l-6.44.04M141.35,115.31l-6.44.04M134.9,111.94l6.44-.04M130.89,108.56l10.27-.06M134.9,105.13l6.44-.04M134.9,101.72l6.44-.04M134.9,98.32l6.44-.04M141.35,94.87l-6.44.04M130.95,91.53l10.27-.06M141.35,88.06l-6.44.04M141.35,84.65l-6.44.04M134.9,81.29l6.44-.04M141.35,77.84l-6.44.04M131.01,74.5l10.27-.06M141.35,71.03l-6.44.04M134.9,67.66l6.44-.04M141.35,64.22l-6.44.04M141.35,60.81l-6.44.04M131.08,57.47l10.27-.06M141.35,54l-6.44.04M134.9,50.63l6.44-.04"/>
                  <path className="l" d="M45.33,137.92h181.21v14.61H45.33v-14.61ZM223.31,144.34l-.04-6.44M219.86,137.89l.04,6.44M216.46,137.89l.04,6.44M213.09,144.34l-.04-6.44M209.71,148.72l-.06-10.27M206.28,144.34l-.04-6.44M202.87,144.34l-.04-6.44M199.46,144.34l-.04-6.44M196.02,137.89l.04,6.44M192.68,148.66l-.06-10.27M189.25,144.34l-.04-6.44M185.84,144.34l-.04-6.44M182.43,144.34l-.04-6.44M179.03,144.34l-.04-6.44M175.65,148.6l-.06-10.27M172.18,137.89l.04,6.44M168.81,144.34l-.04-6.44M165.4,144.34l-.04-6.44M161.96,137.89l.04,6.44M158.61,148.53l-.06-10.27M155.18,144.34l-.04-6.44M151.78,144.34l-.04-6.44M148.33,137.89l.04,6.44M144.96,144.34l-.04-6.44M141.58,148.47l-.06-10.27M138.11,137.89l.04,6.44M134.74,144.34l-.04-6.44M131.34,144.34l-.04-6.44M127.93,144.34l-.04-6.44M124.55,148.41l-.06-10.27M121.12,144.34l-.04-6.44M117.67,137.89l.04,6.44M114.27,137.89l.04,6.44M110.9,144.34l-.04-6.44M107.52,148.35l-.06-10.27M104.09,144.34l-.04-6.44M100.68,144.34l-.04-6.44M97.28,144.34l-.04-6.44M93.83,137.89l.04,6.44M90.49,148.29l-.06-10.27M87.02,137.89l.04,6.44M83.61,137.89l.04,6.44M80.24,144.34l-.04-6.44M76.8,137.89l.04,6.44M73.45,148.23l-.06-10.27M69.99,137.89l.04,6.44M66.62,144.34l-.04-6.44M63.17,137.89l.04,6.44M59.77,137.89l.04,6.44M56.42,148.17l-.06-10.27M52.95,137.89l.04,6.44M49.59,144.34l-.04-6.44"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Results Block with Fade-In Animation */}
        {hasResults && (
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
        <div className="no-print" style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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

        <PrintFooter />
      </div>
    </div>
  );
}
