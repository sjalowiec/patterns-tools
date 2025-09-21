import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import logoSvg from '@assets/shoulders.svg';
import { calcShoulderWidth, rowsForOneInch, distributeEvenly, generateLeftShoulderTemplate, generateRightShoulderTemplate } from '@shared/calculations';

interface GaugeData {
  units: 'inches' | 'cm';
  stitchesIn4: number;
  rowsIn4: number;
}

export default function NecklineWizard() {
  const [units, setUnits] = useState<'inches' | 'cm'>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('20');
  const [rowsIn4, setRowsIn4] = useState<string>('28');

  // Warn user before leaving page if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stitchesIn4 !== '20' || rowsIn4 !== '28') {
        e.preventDefault();
        e.returnValue = 'Your pattern will be lost! Make sure to download your PDF before leaving.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stitchesIn4, rowsIn4]);

  // Handle unit change without converting input display values
  const handleUnitsChange = (newUnits: 'inches' | 'cm') => {
    setUnits(newUnits);
  };

  // Fixed dimensions in inches (canonical base units)
  const garmentWidthIn = 10;
  const bodyHeightIn = 5;  // Straight knitting before neck shaping
  const necklineWidthIn = 5;
  const necklineDepthIn = 4;
  const totalGarmentHeightIn = bodyHeightIn + necklineDepthIn; // 9" total

  // Calculate per-inch gauge consistently - treat input numbers the same regardless of units
  const stitchesPerInch = (Number(stitchesIn4) || 0) / 4;
  const rowsPerInch = (Number(rowsIn4) || 0) / 4;

  // Calculate stitch and row counts using canonical dimensions (always in inches)
  const castOnSts = Math.round(garmentWidthIn * stitchesPerInch) || 0;
  const bodyRows = Math.round(bodyHeightIn * rowsPerInch) || 0;
  const totalRows = Math.round(totalGarmentHeightIn * rowsPerInch) || 0;
  const neckSts = Math.round(necklineWidthIn * stitchesPerInch) || 0;
  const neckDepthRows = Math.round(necklineDepthIn * rowsPerInch) || 0;
  
  // Display dimensions in current units for labels  
  const garmentWidth = units === 'inches' ? garmentWidthIn : Math.round(garmentWidthIn * 2.54 * 10) / 10;
  const bodyHeight = units === 'inches' ? bodyHeightIn : Math.round(bodyHeightIn * 2.54 * 10) / 10;
  const totalGarmentHeight = units === 'inches' ? totalGarmentHeightIn : Math.round(totalGarmentHeightIn * 2.54 * 10) / 10;
  const necklineWidth = units === 'inches' ? necklineWidthIn : Math.round(necklineWidthIn * 2.54 * 10) / 10;
  const necklineDepth = units === 'inches' ? necklineDepthIn : Math.round(necklineDepthIn * 2.54 * 10) / 10;

  // Machine knitting neckline shaping calculations
  const bindOffSts = Math.floor(castOnSts / 3);  // initial bind off (center) - 1/3 of total cast-on
  const sideTotal = Math.floor(castOnSts / 2);  // total stitches per side
  const totalDecreases = neckSts - bindOffSts;  // total stitches to decrease
  const perSideRemaining = Math.floor(totalDecreases / 2);  // decreases per side 
  const extraStitch = totalDecreases % 2;  // remainder stitch (0 or 1)
  const adjustedBindOff = bindOffSts + extraStitch;  // add remainder to center bind-off
  const scrapOffTotal = sideTotal + adjustedBindOff;  // stitches to scrap off
  
  // Split per-side decreases into section patterns to match user terminology  
  const section1Decreases = Math.floor(perSideRemaining / 2); // every other row decreases
  const section2Decreases = perSideRemaining - section1Decreases; // every row decreases
  
  // Calculate shaping rows used per side
  const section1Rows = section1Decreases * 2; // every other row = 2 rows per decrease
  const section2Rows = section2Decreases; // every row = 1 row per decrease  
  const shapingRows = section1Rows + section2Rows;
  const shoulderRows = rowsForOneInch(rowsPerInch); // 1" worth of shoulder shaping rows
  const remainingRows = Math.max(0, neckDepthRows - shapingRows - shoulderRows);
  
  // Calculate total knitting rows for SVG
  const initialStraightRows = bodyRows; // 5" of straight knitting
  const totalKnittingRows = Math.min(initialStraightRows + shapingRows, totalRows); // Clamp to prevent SVG overflow

  // Generate machine knitting text instructions
  const generateInstructions = () => {
    const unitLabel = units === 'inches' ? '"' : 'cm';
    
    // Calculate shoulder shaping values using magic formula
    const shoulderSts = calcShoulderWidth(castOnSts, neckSts);
    const shoulderDropRows = rowsForOneInch(rowsPerInch);
    const turnBlocks = distributeEvenly(shoulderDropRows, shoulderSts);
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Complete Knitting Pattern</h3>
        
        <div style="margin-bottom: 20px;">
          <strong>Step 1:</strong><br>
          • Cast on ${castOnSts} stitches<br>
          • Knit ${bodyRows} rows
        </div>
        
        <div style="margin-bottom: 25px; padding: 15px; background: rgba(197, 81, 78, 0.1); border-left: 4px solid #C2514E; border-radius: 4px;">
          <strong style="color: #C2514E;">IMPORTANT: In case of disaster, place a lifeline</strong><br>
          <small style="color: #666;">Place a thin yarn or thread through all active stitches to preserve your work before starting neckline shaping.</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>About Neckline Shaping:</strong><br>
          <em>Each side of the neckline is knit separately. You will scrap off one side, shape one side, then re-hang and shape the 2nd side.</em>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Step 2: Neckline Shaping Setup</strong><br>
          • Scrap off ${sideTotal} stitches
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Step 3: Shape neck edge #1</strong><br>
          • At neck edge, decrease 1 stitch every other row ${section1Decreases} times; decrease 1 stitch every row ${section2Decreases} times.<br>
          • Knit ${remainingRows} rows<br>
          • End with the carriage on the left (neck side).<br>
          <br>
          <strong>Step 3a: Shape shoulders</strong><br>
          ${generateLeftShoulderTemplate(turnBlocks, shoulderSts)}
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Step 4: Shape neck edge #2</strong><br>
          • Re-hang scrapped off stitches<br>
          • Re-attach working yarn<br>
          • Bind off ${adjustedBindOff} stitches<br>
          <br>
          • At neck edge, decrease 1 stitch every other row ${section1Decreases} times; decrease 1 stitch every row ${section2Decreases} times.<br>
          • Knit ${remainingRows} rows<br>
          • End with the carriage on the right.<br>
          <br>
          <strong>Step 4a: Shape shoulders</strong><br>
          ${generateRightShoulderTemplate(turnBlocks, shoulderSts)}
        </div>

      </div>
    `;
  };

  // Generate SVG schematic
  const generateSchematic = () => {
    // Validate inputs before generating SVG
    if (!castOnSts || !totalRows || !neckSts || isNaN(castOnSts) || isNaN(totalRows) || isNaN(neckSts)) {
      return `<div style="padding: 20px; text-align: center; color: #666;">Enter valid gauge values to see the schematic</div>`;
    }

    const svgWidth = 400;
    const svgHeight = 320;
    const rectWidth = 240;
    const rectHeight = 180;
    const rectX = 80;
    const rectY = 60;
    
    // Neckline dimensions in SVG units with validation
    const neckWidthSvg = Math.max(0, (neckSts / castOnSts) * rectWidth);
    const neckDepthSvg = Math.max(0, (neckDepthRows / totalRows) * rectHeight);
    
    const centerX = rectX + rectWidth / 2;
    const neckLeft = centerX - neckWidthSvg / 2;
    const neckRight = centerX + neckWidthSvg / 2;
    
    // Calculate shoulder shaping dimensions for red visualization
    const shoulderSts = calcShoulderWidth(castOnSts, neckSts);
    const shoulderWidthSvg = (shoulderSts / castOnSts) * rectWidth;
    const shoulderDropRows = rowsForOneInch(rowsPerInch);
    const shoulderDropSvg = Math.min((shoulderDropRows / totalRows) * rectHeight, neckDepthSvg);

    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; max-width: 500px; height: auto;">
        <!-- Main rectangle - draw individual sides to avoid shoulder interference -->
        <line x1="${rectX}" y1="${rectY + shoulderDropSvg}" x2="${rectX}" y2="${rectY + rectHeight}" 
              stroke="black" stroke-width="1"/>
        <line x1="${rectX}" y1="${rectY + rectHeight}" x2="${rectX + rectWidth}" y2="${rectY + rectHeight}" 
              stroke="black" stroke-width="1"/>
        <line x1="${rectX + rectWidth}" y1="${rectY + rectHeight}" x2="${rectX + rectWidth}" y2="${rectY + shoulderDropSvg}" 
              stroke="black" stroke-width="1"/>
        <!-- Top edges only where shoulders don't interfere -->
        <line x1="${rectX + shoulderWidthSvg}" y1="${rectY}" x2="${neckLeft}" y2="${rectY}" 
              stroke="black" stroke-width="1"/>
        <line x1="${neckRight}" y1="${rectY}" x2="${rectX + rectWidth - shoulderWidthSvg}" y2="${rectY}" 
              stroke="black" stroke-width="1"/>
        
        <!-- Shoulder slope lines (match logo) -->
        <line x1="${rectX}" y1="${rectY + shoulderDropSvg}" x2="${rectX + shoulderWidthSvg}" y2="${rectY}"
              stroke="#C2514E" stroke-width="2" stroke-linecap="round" />
        <line x1="${rectX + rectWidth - shoulderWidthSvg}" y1="${rectY}" x2="${rectX + rectWidth}" y2="${rectY + shoulderDropSvg}"
              stroke="#C2514E" stroke-width="2" stroke-linecap="round" />
        
        
        <!-- Neckline curve -->
        <path d="M ${neckLeft} ${rectY} Q ${centerX} ${rectY + neckDepthSvg * 1.3} ${neckRight} ${rectY}" 
              fill="none" stroke="black" stroke-width="1"/>
        
        <!-- Bottom measurement line -->
        <line x1="${rectX}" y1="${rectY + rectHeight + 25}" x2="${rectX + rectWidth}" y2="${rectY + rectHeight + 25}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <circle cx="${rectX + rectWidth}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <text x="${centerX}" y="${rectY + rectHeight + 45}" text-anchor="middle" font-size="12" fill="black">
          {{castOnSts}} stitches ({{width}}${units === 'inches' ? '"' : 'cm'})
        </text>
        
        <!-- Left measurement line - full rectangle height showing total rows knitted -->
        <line x1="${rectX - 25}" y1="${rectY}" x2="${rectX - 25}" y2="${rectY + rectHeight}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX - 25}" cy="${rectY}" r="2" fill="black"/>
        <circle cx="${rectX - 25}" cy="${rectY + rectHeight}" r="2" fill="black"/>
        <text x="${rectX - 35}" y="${rectY + rectHeight/2}" text-anchor="middle" font-size="11" fill="black" 
              transform="rotate(-90, ${rectX - 35}, ${rectY + rectHeight/2})">
          {{rows}} rows ({{height}}${units === 'inches' ? '"' : 'cm'})
        </text>
        
        <!-- Neckline measurement -->
        <line x1="${neckLeft}" y1="${rectY - 15}" x2="${neckRight}" y2="${rectY - 15}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${neckLeft}" cy="${rectY - 15}" r="2" fill="black"/>
        <circle cx="${neckRight}" cy="${rectY - 15}" r="2" fill="black"/>
        <text x="${centerX}" y="${rectY - 25}" text-anchor="middle" font-size="11" fill="black">
          {{neckSts}} stitches ({{neckWidth}}${units === 'inches' ? '"' : 'cm'})
        </text>
        
        <!-- Right measurement line - neckline depth only -->
        <line x1="${rectX + rectWidth + 15}" y1="${rectY}" x2="${rectX + rectWidth + 15}" y2="${rectY + neckDepthSvg}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY}" r="2" fill="black"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY + neckDepthSvg}" r="2" fill="black"/>
        <text x="${rectX + rectWidth + 25}" y="${rectY + neckDepthSvg/2 - 5}" text-anchor="start" font-size="11" fill="black" 
              transform="rotate(90, ${rectX + rectWidth + 25}, ${rectY + neckDepthSvg/2 - 5})">
          {{neckDepthRows}} rows ({{neckDepth}}${units === 'inches' ? '"' : 'cm'})
        </text>
      </svg>
    `;
  };

  // Replace placeholders in SVG
  const replacePlaceholders = (template: string) => {
    const knittedHeight = units === 'inches' 
      ? (totalKnittingRows / rowsPerInch).toFixed(1)
      : (totalKnittingRows / rowsPerInch * 2.54).toFixed(1);
    
    return template
      .replace(/\{\{castOnSts\}\}/g, castOnSts.toString())
      .replace(/\{\{rows\}\}/g, totalRows.toString())
      .replace(/\{\{height\}\}/g, totalGarmentHeight.toFixed(1))
      .replace(/\{\{neckSts\}\}/g, neckSts.toString())
      .replace(/\{\{neckDepth\}\}/g, necklineDepth.toFixed(1))
      .replace(/\{\{neckDepthRows\}\}/g, neckDepthRows.toString())
      .replace(/\{\{width\}\}/g, garmentWidth.toFixed(1))
      .replace(/\{\{neckWidth\}\}/g, necklineWidth.toFixed(1))
      .replace(/\{\{totalKnittingRows\}\}/g, totalKnittingRows.toString())
      .replace(/\{\{knittedHeight\}\}/g, knittedHeight);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div className="header-content">
            <img 
              src={logoSvg}
              alt="Knit by Machine Logo"
              className="logo-shadow"
              style={{ height: '135px', width: 'auto', flexShrink: 0, maxHeight: '20vh' }}
            />
            <div>
              <h1 className="wizard-title">Neckline Practice Wizard</h1>
              <p className="wizard-subtitle">Knit a practice piece and master the basics of neckline shaping</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, opacity: 0.8, marginTop: '-10px' }}>Knit a sample piece to focus on techniques</p>
            </div>
          </div>
          
          {/* Action buttons - responsive positioning */}
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <button 
              type="button" 
              className="btn-round btn-round-light"
              onClick={() => {
                setUnits('inches');
                setStitchesIn4('20');
                setRowsIn4('28');
              }}
              data-testid="button-start-over"
              title="Start Over"
            >
              <i className="fas fa-undo-alt"></i>
            </button>
            <div className="btn-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Start Over</div>
          </div>
          
          {castOnSts > 0 && totalRows > 0 && neckSts > 0 && (
            <div style={{ textAlign: 'center' }}>
              <button 
                type="button" 
                className="btn-round btn-round-light"
                onClick={async () => {
                  const content = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1E7E72;">
                        <h1 style="color: #1E7E72; margin: 0; font-size: 28px;">Neckline Practice Wizard</h1>
                        <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Learn neckline shaping with step-by-step instructions and technical diagrams</p>
                      </div>
                      <div style="margin-bottom: 30px;">${generateInstructions()}</div>
                      <div style="text-align: center;">
                        <h3 style="color: #1E7E72;">Diagram</h3>
                        ${replacePlaceholders(generateSchematic())}
                      </div>
                    </div>
                  `;
                  
                  const options = {
                    margin: 0.5,
                    filename: 'neckline-pattern.pdf',
                    image: { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
                  };
                  
                  try {
                    await html2pdf().set(options).from(content).save();
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Error generating PDF. Please try again.');
                  }
                }}
                data-testid="button-download"
                title="Download"
              >
                <i className="fas fa-download"></i>
              </button>
              <div className="btn-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Download</div>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="content-area">
        {/* Data Persistence Warning */}
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(197, 81, 78, 0.1)', border: '1px solid #C2514E', borderRadius: '8px' }}>
          <strong style={{ color: '#C2514E' }}>IMPORTANT: Your pattern will not be saved on this site.</strong><br />
          <small style={{ color: '#666' }}>Please be sure to download and save your PDF — once you leave this page, your custom details won't be available again.</small>
        </div>
        
        {/* Input Form */}
        <div className="well_white">
          <h2 className="text-primary">Your Gauge</h2>
          
          <div className="form-group">
            <label>Measurement Units</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="units"
                  value="inches"
                  checked={units === 'inches'}
                  onChange={(e) => handleUnitsChange(e.target.value as 'inches' | 'cm')}
                  data-testid="radio-inches"
                />
                Inches
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="units"
                  value="cm"
                  checked={units === 'cm'}
                  onChange={(e) => handleUnitsChange(e.target.value as 'inches' | 'cm')}
                  data-testid="radio-cm"
                />
                Centimeters
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div className="form-row" style={{ display: 'flex', gap: '20px', flex: 1 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Stitches in {units === 'inches' ? '4 inches' : '10 cm'}</label>
                <input
                  type="number"
                  className="form-control"
                  value={stitchesIn4}
                  onChange={(e) => setStitchesIn4(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g., 20' : 'e.g., 20'}
                  data-testid="input-stitches"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Rows in {units === 'inches' ? '4 inches' : '10 cm'}</label>
                <input
                  type="number"
                  className="form-control"
                  value={rowsIn4}
                  onChange={(e) => setRowsIn4(e.target.value)}
                  placeholder="e.g., 28"
                  data-testid="input-rows"
                />
              </div>
            </div>
            
          </div>
          
        </div>

        {/* Instructions */}
        <div id="instructions" dangerouslySetInnerHTML={{ __html: generateInstructions() }} />

        {/* Diagram */}
        <div className="well_white">
          <h3 className="text-primary">Diagram</h3>
          <div id="schematic" style={{ textAlign: 'center', padding: '20px' }}>
            <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(generateSchematic()) }} />
          </div>
        </div>
        
        {/* Copyright Notice */}
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#666', borderTop: '1px solid #e0e0e0', marginTop: '30px' }}>
          © {new Date().getFullYear()} Knit by Machine. For personal use only. | Version {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} | support@knitbymachine.com
        </div>
      </div>
    </div>
  );
}