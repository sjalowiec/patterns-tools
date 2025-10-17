import { useState, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons, SiteHeader, SiteFooter } from '@/components/lego';
import { ChevronDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
  const [lengthMode, setLengthMode] = useState<'length' | 'rows'>(() => {
    const saved = localStorage.getItem('gaugeConversion.lengthMode');
    return (saved as 'length' | 'rows') || 'rows';
  });
  const [lengthValue, setLengthValue] = useState(() => localStorage.getItem('gaugeConversion.lengthValue') || '');

  const [tipsOpen, setTipsOpen] = useState(false);
  const [showMath, setShowMath] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('gaugeConversion.lengthMode', lengthMode);
  }, [lengthMode]);

  useEffect(() => {
    localStorage.setItem('gaugeConversion.lengthValue', lengthValue);
  }, [lengthValue]);

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
  
  // Length/Row conversion
  const rowsPerUnit = units === 'inches' ? yRows / 4 : yRows / 10;
  const lengthNum = parseFloat(lengthValue) || 0;
  const convertedRowsFromLength = lengthMode === 'length' && lengthNum > 0 && rowsPerUnit > 0 
    ? Math.round(lengthNum * rowsPerUnit) 
    : 0;
  const convertedLengthFromRows = lengthMode === 'rows' && lengthNum > 0 && rowsPerUnit > 0
    ? (lengthNum / rowsPerUnit).toFixed(1)
    : '0';

  const hasResults = pSts > 0 && pRows > 0 && ySts > 0 && yRows > 0;
  const displayLabel = units === 'inches' ? '4"' : '10 cm';

  const handleReset = () => {
    setPatternStitches('');
    setPatternRows('');
    setYourStitches('');
    setYourRows('');
    setTestStitches('');
    setTestRows('');
    setLengthValue('');
    setLengthMode('rows');
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
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={patternStitches}
                  onChange={(e) => setPatternStitches(e.target.value)}
                  placeholder={`Enter the pattern's gauge (per ${displayLabel})`}
                  data-testid="input-pattern-stitches"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={patternRows}
                  onChange={(e) => setPatternRows(e.target.value)}
                  placeholder={`Rows per ${displayLabel}`}
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
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={yourStitches}
                  onChange={(e) => setYourStitches(e.target.value)}
                  placeholder={`Enter your measured gauge (per ${displayLabel})`}
                  data-testid="input-your-stitches"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={yourRows}
                  onChange={(e) => setYourRows(e.target.value)}
                  placeholder={`Rows per ${displayLabel}`}
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
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      value={testStitches}
                      onChange={(e) => setTestStitches(e.target.value)}
                      placeholder="Pattern says (stitches)"
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

                {/* Length/Row Converter */}
                <div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        step={lengthMode === 'length' ? '0.1' : '1'}
                        className="form-control"
                        value={lengthValue}
                        onChange={(e) => setLengthValue(e.target.value)}
                        placeholder={lengthMode === 'length' 
                          ? `Pattern length (${units === 'inches' ? 'inches' : 'cm'})`
                          : 'Pattern length (rows)'}
                        data-testid="input-pattern-length"
                        style={{ flex: 1 }}
                      />
                      <div 
                        style={{
                          display: 'inline-flex',
                          backgroundColor: '#f7f8f7',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '2px',
                          gap: '2px'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (lengthMode === 'rows') {
                              setLengthMode('length');
                              setLengthValue('');
                            }
                          }}
                          data-testid="button-length-mode-inches"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: lengthMode === 'length' ? '#52682d' : 'transparent',
                            color: lengthMode === 'length' ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                          }}
                        >
                          {units === 'inches' ? 'in' : 'cm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (lengthMode === 'length') {
                              setLengthMode('rows');
                              setLengthValue('');
                            }
                          }}
                          data-testid="button-length-mode-rows"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: lengthMode === 'rows' ? '#52682d' : 'transparent',
                            color: lengthMode === 'rows' ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                          }}
                        >
                          rows
                        </button>
                      </div>
                    </div>
                  </div>
                  {lengthMode === 'length' && convertedRowsFromLength > 0 && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: '#f0f4ec', 
                      borderRadius: '6px',
                      border: '2px solid #52682d'
                    }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                        You knit:
                      </p>
                      <p style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold' }} data-testid="text-converted-length-to-rows">
                        {convertedRowsFromLength} rows
                      </p>
                    </div>
                  )}
                  {lengthMode === 'rows' && parseFloat(convertedLengthFromRows) > 0 && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: '#f0f4ec', 
                      borderRadius: '6px',
                      border: '2px solid #52682d'
                    }}>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                        You knit until piece measures:
                      </p>
                      <p style={{ color: '#52682d', fontSize: '28px', fontWeight: 'bold' }} data-testid="text-converted-rows-to-length">
                        {convertedLengthFromRows} {units === 'inches' ? 'inches' : 'cm'}
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
                </ul>
              </div>
            )}
          </div>
        </div>

        <PrintFooter />
      </div>

      <SiteFooter />
    </div>
  );
}
