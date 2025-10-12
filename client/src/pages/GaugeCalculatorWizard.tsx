import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons } from '@/components/lego';
import { Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const text = `${stitchesPer4or10.toFixed(2)} sts / ${displayLabel}, ${rowsPer4or10.toFixed(2)} rows / ${displayLabel}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      setSwatchWidth('');
      setSwatchHeight('');
      setStitches('');
      setRows('');
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#f7f8f7', minHeight: '100vh' }}>
      <StickyActionButtons actions={actions} show={hasResults} />

      <div id="pattern-content">
        <PrintHeader />
        {/* Instructions Block */}
        <div className="no-print" style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#52682d', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
            Ditch the Calculator!
          </h1>
          <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
            The Gauge Calculator helps you determine the stitch and row gauge of your knitted swatch.
            Accurate gauge measurements ensure your projects turn out as expected.
          </p>
          <div style={{ color: '#666', lineHeight: '1.8' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Step-by-step:</p>
            <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
              <li>Measure a 4″ (10 cm) area in the center of your swatch.</li>
              <li>Count the stitches across and the rows vertically.</li>
              <li>Enter your measurements and counts below.</li>
              <li>View stitches and rows per 1″ and 4″ (10 cm).</li>
            </ol>
          </div>
        </div>

        {/* Input Block */}
        <div className="no-print" style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '20px',
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

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginTop: '20px'
          }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '6px' }}>
                Swatch Width ({units === 'inches' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                step="0.1"
                value={swatchWidth}
                onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder={units === 'inches' ? '4.0' : '10.0'}
                data-testid="input-width"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '6px' }}>
                Swatch Height ({units === 'inches' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                step="0.1"
                value={swatchHeight}
                onChange={(e) => setSwatchHeight(e.target.value)}
                placeholder={units === 'inches' ? '4.0' : '10.0'}
                data-testid="input-height"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '6px' }}>
                Stitches Counted
              </label>
              <input
                type="number"
                step="1"
                value={stitches}
                onChange={(e) => setStitches(e.target.value)}
                placeholder="20"
                data-testid="input-stitches"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '6px' }}>
                Rows Counted
              </label>
              <input
                type="number"
                step="1"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                placeholder="24"
                data-testid="input-rows"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Block */}
        {hasResults && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold' }}>
                Your Gauge
              </h2>
              <button
                onClick={handleCopy}
                data-testid="button-copy"
                className="no-print"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: copied ? '#52682d' : 'white',
                  color: copied ? 'white' : '#52682d',
                  border: `1px solid ${copied ? '#52682d' : '#52682d'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '16px'
            }}>
              {/* Stitch Gauge Column */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f7f8f7', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ color: '#52682d', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Stitch Gauge
                </h3>
                <p style={{ color: '#333', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {stitchesPer4or10.toFixed(2)}
                </p>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  stitches per {displayLabel}
                </p>
                <p style={{ color: '#999', fontSize: '12px' }}>
                  ({stitchesPerInch.toFixed(2)} per 1")
                </p>
              </div>

              {/* Row Gauge Column */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f7f8f7', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ color: '#52682d', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Row Gauge
                </h3>
                <p style={{ color: '#333', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {rowsPer4or10.toFixed(2)}
                </p>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  rows per {displayLabel}
                </p>
                <p style={{ color: '#999', fontSize: '12px' }}>
                  ({rowsPerInch.toFixed(2)} per 1")
                </p>
              </div>
            </div>

            <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', fontStyle: 'italic' }}>
              Values are approximate. Always swatch carefully.
            </p>
          </div>
        )}

        {/* Tips Card Block */}
        <div className="no-print" style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Tips for Accurate Measurements
          </h2>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
            <li>Always measure your swatch after resting and blocking.</li>
            <li>Use a ruler with clear markings.</li>
            <li>Measure multiple sections of the swatch and average the results for better accuracy.</li>
          </ul>
          <div style={{ 
            backgroundColor: '#f7f8f7', 
            border: '2px dashed #52682d', 
            borderRadius: '6px', 
            padding: '40px', 
            textAlign: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            (insert drawing of swatch measurement here)
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
