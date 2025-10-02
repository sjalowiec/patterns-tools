import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { WizardActionBar } from '@/components/lego';
import type { WizardAction } from '@shared/types/wizard';

export default function RectangleWizard() {
  const [units, setUnits] = useState<'inches' | 'cm'>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('');
  const [rowsIn4, setRowsIn4] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  
  // Yarn calculation state
  const [calculateYarn, setCalculateYarn] = useState<boolean>(false);
  const [swatchWidth, setSwatchWidth] = useState<string>('');
  const [swatchLength, setSwatchLength] = useState<string>('');
  const [swatchWeight, setSwatchWeight] = useState<string>('');

  // Warn user before leaving page if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stitchesIn4 || rowsIn4 || width || length) {
        e.preventDefault();
        e.returnValue = 'Your pattern will be lost! Make sure to download your PDF before leaving.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stitchesIn4, rowsIn4, width, length]);

  // Calculate per-unit gauge consistently
  const stitchesPerUnit = (Number(stitchesIn4) || 0) / 4;
  const rowsPerUnit = (Number(rowsIn4) || 0) / 4;

  // Calculate stitch and row counts
  const widthNum = Number(width) || 0;
  const lengthNum = Number(length) || 0;
  const widthSts = widthNum > 0 ? Math.round(widthNum * stitchesPerUnit) : 0;
  const lengthRows = lengthNum > 0 ? Math.round(lengthNum * rowsPerUnit) : 0;

  // Calculate yarn needed based on swatch
  const calculateYarnNeeded = () => {
    if (!widthNum || !lengthNum || !widthSts || !lengthRows || !calculateYarn) {
      return { grams: 0, balls: 0, method: 'none' };
    }
    
    // If yarn calculation is enabled and we have complete swatch data
    if (swatchWidth && swatchLength && swatchWeight) {
      const swatchWidthNum = parseFloat(swatchWidth);
      const swatchLengthNum = parseFloat(swatchLength);
      const swatchWeightNum = parseFloat(swatchWeight);
      
      if (swatchWidthNum > 0 && swatchLengthNum > 0 && swatchWeightNum > 0) {
        // Calculate area-based yarn estimate
        const swatchArea = swatchWidthNum * swatchLengthNum;
        const rectangleArea = widthNum * lengthNum;
        const gramsNeeded = Math.round((rectangleArea / swatchArea) * swatchWeightNum);
        const ballsNeeded = Math.ceil(gramsNeeded / 100);
        
        return { grams: gramsNeeded, balls: ballsNeeded, method: 'swatch' };
      }
    }
    
    return { grams: 0, balls: 0, method: 'none' };
  };

  // Generate SVG diagram
  const generateDiagram = () => {
    if (!widthNum || !lengthNum || !widthSts || !lengthRows) {
      return `<div style="padding: 20px; text-align: center; color: #666;">Enter valid gauge and dimensions to see the diagram</div>`;
    }

    // Calculate proportional dimensions based on rectangle aspect ratio
    const aspectRatio = widthNum / lengthNum;
    
    // Set SVG container size
    const svgWidth = 400;
    const svgHeight = 300;
    
    // Calculate rectangle dimensions to fit proportionally within SVG
    const maxRectWidth = 250;
    const maxRectHeight = 200;
    
    let rectWidth, rectHeight;
    if (aspectRatio > 1) {
      // Rectangle is wider than tall (landscape)
      rectWidth = maxRectWidth;
      rectHeight = maxRectWidth / aspectRatio;
    } else {
      // Rectangle is taller than wide (portrait)
      rectHeight = maxRectHeight;
      rectWidth = maxRectHeight * aspectRatio;
    }
    
    // Center the rectangle in the SVG
    const rectX = (svgWidth - rectWidth) / 2;
    const rectY = (svgHeight - rectHeight) / 2;
    
    const unitLabel = units === 'inches' ? '"' : 'cm';
    
    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; max-width: 500px; height: auto;">
        <!-- Main rectangle -->
        <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" 
              fill="none" stroke="black" stroke-width="2"/>
        
        <!-- Width measurement line -->
        <line x1="${rectX}" y1="${rectY + rectHeight + 25}" x2="${rectX + rectWidth}" y2="${rectY + rectHeight + 25}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <circle cx="${rectX + rectWidth}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <text x="${rectX + rectWidth/2}" y="${rectY + rectHeight + 45}" text-anchor="middle" font-size="12" fill="black">
          {{widthSts}} stitches ({{width}}${unitLabel})
        </text>
        
        <!-- Height measurement line -->
        <line x1="${rectX - 25}" y1="${rectY}" x2="${rectX - 25}" y2="${rectY + rectHeight}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX - 25}" cy="${rectY}" r="3" fill="black"/>
        <circle cx="${rectX - 25}" cy="${rectY + rectHeight}" r="3" fill="black"/>
        <text x="${rectX - 35}" y="${rectY + rectHeight/2}" text-anchor="middle" font-size="12" fill="black" 
              transform="rotate(-90, ${rectX - 35}, ${rectY + rectHeight/2})">
          {{lengthRows}} rows ({{length}}${unitLabel})
        </text>
        
        <!-- Center label -->
        <text x="${rectX + rectWidth/2}" y="${rectY + rectHeight/2 - 5}" text-anchor="middle" font-size="14" fill="#52682d" font-weight="bold">
          Rectangle Pattern
        </text>
        {{yarnText}}
      </svg>
    `;
  };

  // Replace placeholders in diagram
  const replacePlaceholders = (template: string) => {
    const yarnCalculation = calculateYarnNeeded();
    
    // Calculate rectangle dimensions for yarn text positioning
    if (!widthNum || !lengthNum) return template;
    
    const aspectRatio = widthNum / lengthNum;
    const svgWidth = 400;
    const svgHeight = 300;
    const maxRectWidth = 250;
    const maxRectHeight = 200;
    
    let rectWidth, rectHeight;
    if (aspectRatio > 1) {
      rectWidth = maxRectWidth;
      rectHeight = maxRectWidth / aspectRatio;
    } else {
      rectHeight = maxRectHeight;
      rectWidth = maxRectHeight * aspectRatio;
    }
    
    const rectX = (svgWidth - rectWidth) / 2;
    const rectY = (svgHeight - rectHeight) / 2;
    
    // Only show yarn text if calculation is enabled and has valid data
    const yarnTextElement = calculateYarn && yarnCalculation.method !== 'none' 
      ? `<text x="${rectX + rectWidth/2}" y="${rectY + rectHeight/2 + 15}" text-anchor="middle" font-size="12" fill="#666">
          ${yarnCalculation.grams}g (~${yarnCalculation.balls} balls)
        </text>`
      : '';
    
    return template
      .replace(/\{\{widthSts\}\}/g, widthSts.toString())
      .replace(/\{\{lengthRows\}\}/g, lengthRows.toString())
      .replace(/\{\{width\}\}/g, widthNum.toString())
      .replace(/\{\{length\}\}/g, lengthNum.toString())
      .replace(/\{\{yarnText\}\}/g, yarnTextElement);
  };

  // Generate pattern instructions
  const generateInstructions = () => {
    if (!widthNum || !lengthNum || !widthSts || !lengthRows) {
      return '<div>Please enter gauge information and dimensions to generate your pattern.</div>';
    }

    const unitLabel = units === 'inches' ? '"' : 'cm';
    const unitSize = units === 'inches' ? '4"' : '10cm';
    const yarnCalculation = calculateYarnNeeded();
    
    const yarnText = yarnCalculation.method === 'none' 
      ? 'Worsted weight yarn'
      : `Worsted weight yarn (${yarnCalculation.grams}g or ~${yarnCalculation.balls} balls of 100g, based on your swatch)`;
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Rectangle Knitting Pattern</h3>
        
        <div style="margin-bottom: 25px; padding: 15px; background: rgba(82, 104, 45, 0.2); border-left: 4px solid #52682d; border-radius: 4px;">
          <strong style="color: #52682d;">Custom Rectangle</strong><br>
          <small style="color: #666;">Finished size: ${widthNum}${unitLabel} × ${lengthNum}${unitLabel}</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Materials Needed:</strong>
          <div style="margin-left: 20px;">
            • Machine: Any knitting machine<br>
            • Yarn: ${yarnText}<br>
            • Gauge: ${stitchesIn4} stitches and ${rowsIn4} rows = ${unitSize}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Pattern Instructions:</strong>
          <div style="margin-left: 20px;">
            1. Cast on ${widthSts} stitches<br>
            2. Knit every row for ${lengthRows} rows<br>
            3. Bind off all stitches
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Finishing:</strong>
          <div style="margin-left: 20px;">
            • Weave in all ends<br>
            • Block to finished measurements<br>
            • Add edging if desired
          </div>
        </div>
        
        <div style="margin-top: 25px; padding: 15px; background: rgba(82, 104, 45, 0.2); border-left: 4px solid #52682d; border-radius: 4px;">
          <strong style="color: #52682d;">Pattern Summary:</strong><br>
          <small style="color: #666;">
            Cast on ${widthSts} stitches, knit ${lengthRows} rows, bind off. 
            Finished size: ${widthNum}${unitLabel} × ${lengthNum}${unitLabel}${yarnCalculation.method !== 'none' ? `<br>Yarn needed: ${yarnCalculation.grams}g (~${yarnCalculation.balls} balls of 100g)` : ''}
          </small>
        </div>
      </div>
    `;
  };

  // Define action buttons
  const hasUserData = !!(stitchesIn4 && rowsIn4);
  const hasValidPattern = widthNum > 0 && lengthNum > 0 && widthSts > 0 && lengthRows > 0;

  const handleDownloadPDF = async () => {
    if (!hasValidPattern) return;
    
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #52682d;">
          <h1 style="color: #52682d; margin: 0; font-size: 28px;">Rectangle Pattern Wizard</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Custom ${widthNum}${units === 'inches' ? '"' : 'cm'} × ${lengthNum}${units === 'inches' ? '"' : 'cm'} Pattern</p>
        </div>
        <div style="margin-bottom: 30px;">${generateInstructions()}</div>
        <div style="text-align: center;">
          <h3 style="color: #52682d;">Diagram</h3>
          ${replacePlaceholders(generateDiagram())}
        </div>
      </div>
    `;
    
    const opt = {
      margin: 1,
      filename: `Rectangle_${widthNum}x${lengthNum}_Pattern.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    
    await html2pdf().set(opt).from(content).save();
  };

  const handleStartOver = () => {
    setUnits('inches');
    setStitchesIn4('');
    setRowsIn4('');
    setWidth('');
    setLength('');
    setCalculateYarn(false);
    setSwatchWidth('');
    setSwatchLength('');
    setSwatchWeight('');
  };

  const actions: WizardAction[] = [
    {
      id: 'startover',
      label: 'Start Over',
      icon: 'fas fa-redo',
      onClick: handleStartOver,
      className: 'btn-round-wizard',
      testId: 'button-start-over'
    }
  ];

  // Add print/download buttons only when pattern is valid
  if (hasValidPattern) {
    actions.push(
      {
        id: 'print',
        label: 'Print',
        icon: 'fas fa-print',
        onClick: () => window.print(),
        className: 'btn-round-wizard',
        testId: 'button-print'
      },
      {
        id: 'download',
        label: 'Download PDF',
        icon: 'fas fa-download',
        onClick: handleDownloadPDF,
        className: 'btn-round-wizard',
        testId: 'button-download-pdf'
      }
    );
  }

  return (
    <div className="wizard-container">
      {hasUserData && (
        <div style={{ padding: '20px 20px 0 20px' }}>
          <WizardActionBar
            warning={{
              message: 'IMPORTANT: Your pattern will not be saved on this site. Please be sure to download and save your PDF - once you leave this page, your custom details won\'t be available again.',
              show: true
            }}
            actions={actions}
          />
        </div>
      )}

      <div className="content-area">
        
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
                  onChange={(e) => setUnits(e.target.value as 'inches' | 'cm')}
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
                  onChange={(e) => setUnits(e.target.value as 'inches' | 'cm')}
                  data-testid="radio-cm"
                />
                Centimeters
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div className="form-row" style={{ display: 'flex', gap: '20px', flex: 1 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Stitch Gauge</label>
                <input
                  type="number"
                  className="form-control"
                  value={stitchesIn4}
                  onChange={(e) => setStitchesIn4(e.target.value)}
                  placeholder={units === 'inches' ? 'stitches per 4"' : 'stitches per 10cm'}
                  data-testid="input-stitches"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Row Gauge</label>
                <input
                  type="number"
                  className="form-control"
                  value={rowsIn4}
                  onChange={(e) => setRowsIn4(e.target.value)}
                  placeholder={units === 'inches' ? 'rows per 4"' : 'rows per 10cm'}
                  data-testid="input-rows"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="well_white">
          <h2 className="text-primary">Rectangle Dimensions</h2>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Width ({units === 'inches' ? 'inches' : 'cm'})</label>
              <input
                type="number"
                className="form-control"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={units === 'inches' ? 'Width in inches' : 'Width in cm'}
                data-testid="input-width"
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label>Length ({units === 'inches' ? 'inches' : 'cm'})</label>
              <input
                type="number"
                className="form-control"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder={units === 'inches' ? 'Length in inches' : 'Length in cm'}
                data-testid="input-length"
              />
            </div>
          </div>
        </div>

        {/* Yarn Calculator (Optional) */}
        <div className="well_white">
          <h2 className="text-primary">Yarn Calculator (Optional)</h2>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={calculateYarn}
                onChange={(e) => setCalculateYarn(e.target.checked)}
                data-testid="checkbox-calculate-yarn"
              />
              Calculate yarn needed based on swatch
            </label>
          </div>

          {calculateYarn && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Knit a swatch with your chosen yarn and enter its measurements and weight:
              </p>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 150px' }}>
                  <label>Swatch Width ({units === 'inches' ? '"' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchWidth}
                    onChange={(e) => setSwatchWidth(e.target.value)}
                    placeholder="Width"
                    data-testid="input-swatch-width"
                  />
                </div>
                
                <div className="form-group" style={{ flex: '1 1 150px' }}>
                  <label>Swatch Length ({units === 'inches' ? '"' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchLength}
                    onChange={(e) => setSwatchLength(e.target.value)}
                    placeholder="Length"
                    data-testid="input-swatch-length"
                  />
                </div>
                
                <div className="form-group" style={{ flex: '1 1 150px' }}>
                  <label>Swatch Weight (grams)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchWeight}
                    onChange={(e) => setSwatchWeight(e.target.value)}
                    placeholder="Weight in g"
                    data-testid="input-swatch-weight"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generated Pattern */}
        {hasValidPattern && (
          <>
            <div dangerouslySetInnerHTML={{ __html: generateInstructions() }} />
            
            <div className="well_white">
              <h3 className="text-primary">Schematic Diagram</h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '20px 0'
              }}>
                <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(generateDiagram()) }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
