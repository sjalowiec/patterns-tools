import { useState, useRef, useEffect } from 'react';
import { UnitsToggle, PrintHeader, PrintFooter, StickyActionButtons, SiteHeader, SiteFooter, WizardIcon } from '@/components/lego';
import html2pdf from 'html2pdf.js';

type Units = 'inches' | 'cm';

export default function HalfStitchShockWizard() {
  const [units, setUnits] = useState<Units>('inches');
  const [gauge1, setGauge1] = useState('');
  const [gauge2, setGauge2] = useState('');
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const calloutRef = useRef<HTMLDivElement>(null);

  // Parse inputs
  const g1 = parseFloat(gauge1) || 0;
  const g2 = parseFloat(gauge2) || 0;

  const hasResults = g1 > 0 && g2 > 0;

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isCalloutVisible) {
            setIsCalloutVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (calloutRef.current) {
      observer.observe(calloutRef.current);
    }

    return () => {
      if (calloutRef.current) {
        observer.unobserve(calloutRef.current);
      }
    };
  }, [isCalloutVisible]);

  // Generate comparison rows
  const generateComparisonRows = () => {
    const rows = [];
    const factor = units === 'inches' ? 4 : 10;
    for (let stitches = 50; stitches <= 200; stitches += 25) {
      const width1 = (stitches / g1) * factor;
      const width2 = (stitches / g2) * factor;
      const difference = Math.abs(width1 - width2);
      
      rows.push({
        stitches,
        width1: width1.toFixed(1),
        width2: width2.toFixed(1),
        difference: difference.toFixed(1)
      });
    }
    return rows;
  };

  const comparisonRows = hasResults ? generateComparisonRows() : [];

  const handleReset = () => {
    setGauge1('');
    setGauge2('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pattern-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.75, 0.5] as [number, number, number, number],
      filename: 'half-stitch-shock.pdf',
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

  const unitLabel = units === 'inches' ? '4"' : '10cm';
  const unitDisplay = units === 'inches' ? 'inches' : 'cm';

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
                What a Difference a Stitch Makes
              </h1>
              <h2 style={{ color: '#666', fontSize: '18px', lineHeight: '1.6', fontWeight: 'normal' }}>
                A tiny change in gauge can make a big difference. See how your project grows (or shrinks) — one stitch at a time.
              </h2>
            </div>
          </div>

          {/* Hero Message */}
          <div className="no-print well_white" style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', margin: 0 }}>
              Even a half-stitch variation can add or subtract inches across a full garment. Enter two gauges below to see how your finished width changes.
            </p>
          </div>

          {/* Input Section */}
          <div className="no-print well_white">
            <UnitsToggle
              units={units}
              onChange={setUnits}
              gaugeLabel="Compare Two Gauges"
            />

            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ maxWidth: '180px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#52682d' }}>
                  Gauge 1
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={gauge1}
                  onChange={(e) => setGauge1(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g. 18' : 'e.g. 18'}
                  aria-label="Gauge 1"
                  data-testid="input-gauge1"
                  style={{ fontSize: '16px', padding: '8px 12px' }}
                />
              </div>

              <div className="form-group" style={{ maxWidth: '180px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#6E8B3D' }}>
                  Gauge 2
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={gauge2}
                  onChange={(e) => setGauge2(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g. 19' : 'e.g. 19'}
                  aria-label="Gauge 2"
                  data-testid="input-gauge2"
                  style={{ fontSize: '16px', padding: '8px 12px' }}
                />
              </div>
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              backgroundColor: '#f7f6f2', 
              borderLeft: '4px solid #52682d',
              borderRadius: '4px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#52682d' }} />
                <strong>Tip:</strong> If you change yarn or tension, even a ½ stitch difference can make your sweater an inch or two off!
              </p>
            </div>
          </div>

          {/* Results Section */}
          {hasResults && (
            <div 
              className="well_white"
              style={{ 
                animation: 'fadeIn 0.5s ease-in',
                marginTop: '20px'
              }}
            >
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                  from { opacity: 0; transform: translateX(-10px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes dramatic {
                  0% { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(10px); 
                  }
                  50% { 
                    transform: scale(1.02); 
                  }
                  100% { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                  }
                }
                @keyframes pulse {
                  0%, 100% { 
                    box-shadow: 0 4px 20px rgba(82, 104, 45, 0.15); 
                  }
                  50% { 
                    box-shadow: 0 6px 30px rgba(82, 104, 45, 0.25); 
                  }
                }
              `}</style>
              
              <h2 style={{ color: '#52682d', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                Width Comparison
              </h2>

              <div style={{ 
                maxWidth: '580px', 
                margin: '0 auto',
                overflowX: 'auto' 
              }}>
                <table style={{ 
                  width: '100%',
                  minWidth: '520px',
                  borderCollapse: 'collapse',
                  fontSize: '0.95em',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f7f6f2' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        borderBottom: '2px solid #52682d',
                        fontWeight: 'bold',
                        width: '20%'
                      }}>
                        Stitches Cast On
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        borderBottom: '2px solid #52682d',
                        fontWeight: 'bold',
                        color: '#52682d',
                        width: '30%'
                      }}>
                        Width at Gauge 1 ({unitDisplay})
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        borderBottom: '2px solid #52682d',
                        fontWeight: 'bold',
                        color: '#6E8B3D',
                        borderLeft: '1px solid #d8d8d8',
                        width: '30%'
                      }}>
                        Width at Gauge 2 ({unitDisplay})
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        borderBottom: '2px solid #52682d',
                        fontWeight: '600',
                        color: '#C2614E',
                        minWidth: '80px',
                        width: '20%'
                      }}>
                        Total Difference ({unitDisplay})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr 
                        key={row.stitches}
                        style={{ 
                          backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <td style={{ 
                          padding: '10px 12px', 
                          borderBottom: '1px solid #eee',
                          textAlign: 'right',
                          fontWeight: 'bold'
                        }}>
                          {row.stitches}
                        </td>
                        <td style={{ 
                          padding: '10px 12px', 
                          borderBottom: '1px solid #eee',
                          textAlign: 'right',
                          color: '#52682d',
                          backgroundColor: '#fafaf8'
                        }}>
                          {row.width1}
                        </td>
                        <td style={{ 
                          padding: '10px 12px', 
                          borderBottom: '1px solid #eee',
                          textAlign: 'right',
                          color: '#6E8B3D',
                          backgroundColor: '#fafaf8',
                          borderLeft: '1px solid #d8d8d8'
                        }}>
                          {row.width2}
                        </td>
                        <td style={{ 
                          padding: '10px 12px', 
                          borderBottom: '1px solid #eee',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: '#C2614E',
                          backgroundColor: 'rgba(82, 104, 45, 0.05)',
                          fontSize: '18px'
                        }}>
                          {row.difference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dramatic Callout */}
              <div 
                ref={calloutRef}
                style={{ 
                  marginTop: '32px', 
                  padding: '28px 32px', 
                  background: 'linear-gradient(135deg, rgba(82, 104, 45, 0.08) 0%, rgba(82, 104, 45, 0.12) 100%)',
                  border: '3px solid #52682d',
                  borderRadius: '12px',
                  textAlign: 'center',
                  animation: isCalloutVisible ? 'dramatic 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both, pulse 2s ease-in-out 0.8s infinite' : 'none',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#52682d',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-eyes" style={{ marginRight: '6px' }}></i>
                  What this means
                </div>
                <p style={{ 
                  fontSize: '20px', 
                  lineHeight: '1.7', 
                  color: '#52682d', 
                  margin: '8px 0 0 0',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  Now imagine this difference across the full width of your sweater or blanket — even a half-stitch can change your project by several inches!
                </p>
              </div>
            </div>
          )}
        </div>

        <PrintFooter />
      </div>

      <SiteFooter />
    </div>
  );
}
