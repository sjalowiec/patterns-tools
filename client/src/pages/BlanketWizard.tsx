import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import logoSvg from '@assets/knitting-brand.svg';
import { getSizeOptions, createSizeSelection, type SizeSelection } from '@shared/sizing';

interface GaugeData {
  units: 'inches' | 'cm';
  stitchesIn4: string;
  rowsIn4: string;
}

export default function BlanketWizard() {
  const [units, setUnits] = useState<'inches' | 'cm'>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('20');
  const [rowsIn4, setRowsIn4] = useState<string>('28');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customSize, setCustomSize] = useState<{length: string, width: string}>({length: '', width: ''});
  const [useCustomSize, setUseCustomSize] = useState<boolean>(false);
  
  // Yarn calculation state
  const [calculateYarn, setCalculateYarn] = useState<boolean>(false);
  const [swatchWidth, setSwatchWidth] = useState<string>('');
  const [swatchLength, setSwatchLength] = useState<string>('');
  const [swatchWeight, setSwatchWeight] = useState<string>('');

  // Warn user before leaving page if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stitchesIn4 !== '20' || rowsIn4 !== '28' || selectedSize || customSize.length || customSize.width) {
        e.preventDefault();
        e.returnValue = 'Your pattern will be lost! Make sure to download your PDF before leaving.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stitchesIn4, rowsIn4, selectedSize, customSize]);

  // Calculate per-unit gauge consistently
  const stitchesPerUnit = (Number(stitchesIn4) || 0) / 4;
  const rowsPerUnit = (Number(rowsIn4) || 0) / 4;

  // Get size data
  const sizeSelection: SizeSelection | null = useCustomSize 
    ? (customSize.length && customSize.width ? {
        size: "Custom",
        dimensions: {
          length: Number(customSize.length) || 0,
          width: Number(customSize.width) || 0
        },
        category: "Custom"
      } : null)
    : (selectedSize ? createSizeSelection(selectedSize, units) : null);

  // Calculate stitch and row counts
  const widthSts = sizeSelection ? Math.round(sizeSelection.dimensions.width * stitchesPerUnit) : 0;
  const lengthRows = sizeSelection ? Math.round(sizeSelection.dimensions.length * rowsPerUnit) : 0;

  // Get size options grouped by category
  const sizeOptions = getSizeOptions();
  const categories = Array.from(new Set(sizeOptions.map(opt => opt.category)));

  // Calculate yarn needed based on swatch or rough estimate
  const calculateYarnNeeded = () => {
    if (!sizeSelection || !widthSts || !lengthRows || !calculateYarn) {
      return { yards: 0, method: 'none' };
    }
    
    const totalStitches = widthSts * lengthRows;
    
    // If yarn calculation is enabled and we have complete swatch data
    if (swatchWidth && swatchLength && swatchWeight) {
      const swatchWidthNum = parseFloat(swatchWidth);
      const swatchLengthNum = parseFloat(swatchLength);
      const swatchWeightNum = parseFloat(swatchWeight);
      
      if (swatchWidthNum > 0 && swatchLengthNum > 0 && swatchWeightNum > 0) {
        // Calculate stitches per unit area from gauge
        const unitSize = units === 'inches' ? 4 : 10;
        const stitchesPerUnit = parseFloat(stitchesIn4);
        const rowsPerUnit = parseFloat(rowsIn4);
        
        // Calculate swatch area in square units and convert to total stitches in swatch
        const swatchAreaInUnits = (swatchWidthNum / unitSize) * (swatchLengthNum / unitSize);
        const swatchStitches = swatchAreaInUnits * stitchesPerUnit * rowsPerUnit;
        
        // Calculate grams per stitch, then total weight needed
        const gramsPerStitch = swatchWeightNum / swatchStitches;
        const totalWeightNeeded = totalStitches * gramsPerStitch;
        
        // Convert to yards (rough estimate: 1 gram = 1.1 yards for worsted weight)
        const yardsNeeded = Math.round(totalWeightNeeded * 1.1);
        
        return { yards: yardsNeeded, method: 'swatch' };
      }
    }
    
    // Fallback to rough estimate only if calculation is enabled
    const yardsNeeded = Math.round(totalStitches / 4);
    return { yards: yardsNeeded, method: 'estimate' };
  };

  // Generate SVG diagram
  const generateDiagram = () => {
    if (!sizeSelection || !widthSts || !lengthRows) {
      return `<div style="padding: 20px; text-align: center; color: #666;">Enter valid gauge values to see the diagram</div>`;
    }

    // Calculate proportional dimensions based on blanket aspect ratio
    const blanketWidth = sizeSelection.dimensions.width;
    const blanketLength = sizeSelection.dimensions.length;
    const aspectRatio = blanketWidth / blanketLength;
    
    // Set SVG container size
    const svgWidth = 400;
    const svgHeight = 300;
    
    // Calculate rectangle dimensions to fit proportionally within SVG
    const maxRectWidth = 250;
    const maxRectHeight = 200;
    
    let rectWidth, rectHeight;
    if (aspectRatio > 1) {
      // Blanket is wider than tall (landscape)
      rectWidth = maxRectWidth;
      rectHeight = maxRectWidth / aspectRatio;
    } else {
      // Blanket is taller than wide (portrait) - typical for blankets
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
        <text x="${rectX + rectWidth/2}" y="${rectY + rectHeight/2 - 5}" text-anchor="middle" font-size="14" fill="#1E7E72" font-weight="bold">
          {{sizeName}} Blanket
        </text>
        {{yarnText}}
      </svg>
    `;
  };

  // Replace placeholders in diagram
  const replacePlaceholders = (template: string) => {
    const yarnCalculation = calculateYarnNeeded();
    
    // Calculate rectangle dimensions for yarn text positioning (same logic as generateDiagram)
    if (!sizeSelection) return template;
    
    const blanketWidth = sizeSelection.dimensions.width;
    const blanketLength = sizeSelection.dimensions.length;
    const aspectRatio = blanketWidth / blanketLength;
    
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
          ~${yarnCalculation.yards} yards needed${yarnCalculation.method === 'swatch' ? ' (swatch-based)' : ' (approx)'}
        </text>`
      : '';
    
    return template
      .replace(/\{\{widthSts\}\}/g, widthSts.toString())
      .replace(/\{\{lengthRows\}\}/g, lengthRows.toString())
      .replace(/\{\{width\}\}/g, sizeSelection?.dimensions.width.toString() || '0')
      .replace(/\{\{length\}\}/g, sizeSelection?.dimensions.length.toString() || '0')
      .replace(/\{\{sizeName\}\}/g, sizeSelection?.size || 'Custom')
      .replace(/\{\{yarnText\}\}/g, yarnTextElement);
  };

  // Generate pattern instructions
  const generateInstructions = () => {
    if (!sizeSelection || !widthSts || !lengthRows) {
      return '<div>Please select a size and enter gauge information to generate your pattern.</div>';
    }

    const unitLabel = units === 'inches' ? '"' : 'cm';
    const unitSize = units === 'inches' ? '4"' : '10cm';
    const yarnCalculation = calculateYarnNeeded();
    
    const yarnText = yarnCalculation.method === 'none' 
      ? 'Worsted weight yarn'
      : yarnCalculation.method === 'swatch' 
        ? `Worsted weight yarn (${yarnCalculation.yards} yards based on your swatch measurements)`
        : `Worsted weight yarn (~${yarnCalculation.yards} yards approx)`;
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Blanket Knitting Pattern</h3>
        
        <div style="margin-bottom: 25px; padding: 15px; background: rgba(0, 100, 0, 0.1); border-left: 4px solid #2F7D32; border-radius: 4px;">
          <strong style="color: #2F7D32;">${sizeSelection.size} Blanket</strong><br>
          <small style="color: #666;">Finished size: ${sizeSelection.dimensions.width}${unitLabel} × ${sizeSelection.dimensions.length}${unitLabel}</small>
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
            • Add fringe or edging if desired
          </div>
        </div>
        
        <div style="margin-top: 25px; padding: 15px; background: rgba(197, 81, 78, 0.1); border-left: 4px solid #C2514E; border-radius: 4px;">
          <strong style="color: #C2514E;">Pattern Summary:</strong><br>
          <small style="color: #666;">
            Cast on ${widthSts} stitches, knit ${lengthRows} rows, bind off. 
            Finished size: ${sizeSelection.dimensions.width}${unitLabel} × ${sizeSelection.dimensions.length}${unitLabel}${yarnCalculation.method !== 'none' ? `<br>Yarn needed: ${yarnCalculation.method === 'swatch' ? `${yarnCalculation.yards} yards (based on your swatch)` : `~${yarnCalculation.yards} yards (approx)`}` : ''}
          </small>
        </div>
      </div>
    `;
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
              <h1 className="wizard-title">Blanket Pattern Wizard</h1>
              <p className="wizard-subtitle">Generate custom blanket patterns for any size</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, opacity: 0.8, marginTop: '-10px' }}>Choose from standard sizes or create your own custom dimensions</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <button 
                type="button" 
                className="btn-round btn-round-light"
                onClick={() => {
                  setUnits('inches');
                  setStitchesIn4('20');
                  setRowsIn4('28');
                  setSelectedSize('');
                  setCustomSize({length: '', width: ''});
                  setUseCustomSize(false);
                }}
                data-testid="button-start-over"
                title="Start Over"
              >
                <i className="fas fa-undo-alt"></i>
              </button>
              <div className="btn-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Start Over</div>
            </div>
            
            {sizeSelection && widthSts > 0 && lengthRows > 0 && (
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="btn-round btn-round-light"
                  onClick={async () => {
                    const content = `
                      <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1E7E72;">
                          <h1 style="color: #1E7E72; margin: 0; font-size: 28px;">Blanket Pattern Wizard</h1>
                          <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Custom ${sizeSelection.size} Blanket Pattern</p>
                        </div>
                        <div style="margin-bottom: 30px;">${generateInstructions()}</div>
                        <div style="text-align: center;">
                          <h3 style="color: #1E7E72;">Diagram</h3>
                          ${replacePlaceholders(generateDiagram())}
                        </div>
                      </div>
                    `;
                    
                    const opt = {
                      margin: 1,
                      filename: `${sizeSelection.size.replace(/\s+/g, '_')}_Blanket_Pattern.pdf`,
                      image: { type: 'jpeg' as const, quality: 0.98 },
                      html2canvas: { scale: 2 },
                      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
                    };
                    
                    await html2pdf().set(opt).from(content).save();
                  }}
                  data-testid="button-download-pdf"
                  title="Download PDF"
                >
                  <i className="fas fa-download"></i>
                </button>
                <div className="btn-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Download PDF</div>
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

        {/* Blanket Size Selection */}
        <div className="well_white">
          <h2 className="text-primary">Blanket Size</h2>
          
          <div className="form-group">
            <label>Size Type</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="sizeType"
                  value="standard"
                  checked={!useCustomSize}
                  onChange={() => setUseCustomSize(false)}
                  data-testid="radio-standard-size"
                />
                Standard Size
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="sizeType"
                  value="custom"
                  checked={useCustomSize}
                  onChange={() => setUseCustomSize(true)}
                  data-testid="radio-custom-size"
                />
                Custom Size
              </label>
            </div>
          </div>

          {!useCustomSize ? (
            <div className="form-group">
              <label>Select Standard Size</label>
              <select 
                className="form-control"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                data-testid="select-blanket-size"
                style={{ marginTop: '8px' }}
              >
                <option value="">Choose blanket size</option>
                {categories.map(category => (
                  <optgroup key={category} label={category}>
                    {sizeOptions
                      .filter(opt => opt.category === category)
                      .map(option => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
                
              {sizeSelection && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <strong>{sizeSelection.category}</strong><br />
                  <small>
                    {sizeSelection.dimensions.width}{units === 'inches' ? '"' : 'cm'} × {sizeSelection.dimensions.length}{units === 'inches' ? '"' : 'cm'}
                  </small>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div className="form-row" style={{ display: 'flex', gap: '20px', flex: 1 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Width ({units === 'inches' ? 'inches' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customSize.width}
                    onChange={(e) => setCustomSize(prev => ({...prev, width: e.target.value}))}
                    placeholder="48"
                    data-testid="input-custom-width"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Length ({units === 'inches' ? 'inches' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customSize.length}
                    onChange={(e) => setCustomSize(prev => ({...prev, length: e.target.value}))}
                    placeholder="60"
                    data-testid="input-custom-length"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Yarn Calculation (Optional) */}
        <div className="well_white">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <input
              type="checkbox"
              checked={calculateYarn}
              onChange={(e) => setCalculateYarn(e.target.checked)}
              data-testid="checkbox-calculate-yarn"
            />
            <h2 className="text-primary" style={{ margin: 0 }}>Calculate Yarn Needed</h2>
          </div>
          
          {calculateYarn && (
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              Get accurate yarn estimate based on your swatch measurements.
            </p>
          )}

          {calculateYarn && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <h4 style={{ marginBottom: '15px', color: '#1E7E72' }}>Swatch Measurements</h4>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Measure your gauge swatch and weigh it to get the most accurate yarn estimate.
              </p>
              
              <div className="form-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1', minWidth: '120px' }}>
                  <label>Swatch Width ({units === 'inches' ? 'inches' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchWidth}
                    onChange={(e) => setSwatchWidth(e.target.value)}
                    placeholder={units === 'inches' ? '4' : '10'}
                    step="0.1"
                    data-testid="input-swatch-width"
                  />
                </div>
                
                <div className="form-group" style={{ flex: '1', minWidth: '120px' }}>
                  <label>Swatch Length ({units === 'inches' ? 'inches' : 'cm'})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchLength}
                    onChange={(e) => setSwatchLength(e.target.value)}
                    placeholder={units === 'inches' ? '4' : '10'}
                    step="0.1"
                    data-testid="input-swatch-length"
                  />
                </div>
                
                <div className="form-group" style={{ flex: '1', minWidth: '120px' }}>
                  <label>Swatch Weight (grams)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={swatchWeight}
                    onChange={(e) => setSwatchWeight(e.target.value)}
                    placeholder="8"
                    step="0.1"
                    data-testid="input-swatch-weight"
                  />
                </div>
              </div>
              
              {swatchWidth && swatchLength && swatchWeight && (
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(30, 126, 114, 0.1)', borderRadius: '4px' }}>
                  <strong style={{ color: '#1E7E72' }}>Calculation Preview:</strong><br />
                  <small style={{ color: '#666' }}>
                    {(() => {
                      const calc = calculateYarnNeeded();
                      return calc.method === 'swatch' 
                        ? `Your blanket will need approximately ${calc.yards} yards of yarn based on your swatch.`
                        : 'Complete all swatch measurements to see the calculation.';
                    })()}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        {sizeSelection && widthSts > 0 && lengthRows > 0 && (
          <div id="instructions" dangerouslySetInnerHTML={{ __html: generateInstructions() }} />
        )}

        {/* Diagram */}
        {sizeSelection && widthSts > 0 && lengthRows > 0 && (
          <div className="well_white">
            <h3 className="text-primary">Diagram</h3>
            <div id="schematic" style={{ textAlign: 'center', padding: '20px' }}>
              <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(generateDiagram()) }} />
            </div>
          </div>
        )}
        
        {/* Copyright Notice */}
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#666', borderTop: '1px solid #e0e0e0', marginTop: '30px' }}>
          © {new Date().getFullYear()} Knit by Machine. For personal use only. | Version {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} | support@knitbymachine.com
        </div>
      </div>
    </div>
  );
}