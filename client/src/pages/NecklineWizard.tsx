import { useState, useEffect } from 'react';
import '../sweater-planner.css';

interface GaugeData {
  units: 'inches' | 'cm';
  stitchesIn4: number;
  rowsIn4: number;
}

export default function NecklineWizard() {
  const [units, setUnits] = useState<'inches' | 'cm'>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('20');
  const [rowsIn4, setRowsIn4] = useState<string>('28');

  // Fixed dimensions
  const garmentWidth = 10; // inches or cm
  const garmentHeight = 5; // inches or cm  
  const necklineWidth = 5; // inches or cm
  const necklineDepth = 4; // inches or cm

  // Calculate per-unit gauge with validation
  const stitchesPerUnit = units === 'inches' 
    ? (Number(stitchesIn4) || 0) / 4 
    : (Number(stitchesIn4) || 0) / 10;
  const rowsPerUnit = units === 'inches' 
    ? (Number(rowsIn4) || 0) / 4 
    : (Number(rowsIn4) || 0) / 10;

  // Calculate stitch and row counts with validation
  const castOnSts = Math.round(garmentWidth * stitchesPerUnit) || 0;
  const totalRows = Math.round(garmentHeight * rowsPerUnit) || 0;
  const neckSts = Math.round(necklineWidth * stitchesPerUnit) || 0;
  const neckDepthRows = Math.round(necklineDepth * rowsPerUnit) || 0;

  // Machine knitting neckline shaping calculations
  const bindOffSts = Math.floor(neckSts / 3);  // initial bind off (center)
  const sideTotal = Math.floor(castOnSts / 2);  // total stitches per side
  const totalDecreases = neckSts - bindOffSts;  // total stitches to decrease
  const perSideRemaining = Math.floor(totalDecreases / 2);  // decreases per side 
  const extraStitch = totalDecreases % 2;  // remainder stitch (0 or 1)
  const adjustedBindOff = bindOffSts + extraStitch;  // add remainder to center bind-off
  const scrapOffTotal = sideTotal + adjustedBindOff;  // stitches to scrap off
  
  // Split per-side decreases into stair steps and singles
  const perSideStair = Math.floor(perSideRemaining / 2);
  const perSideSingle = perSideRemaining - perSideStair;
  
  // Calculate shaping rows used per side
  const stairStepRows = Math.ceil(perSideStair / 2.5); // approx 2-3 stitches per step
  const singleDecreaseRows = perSideSingle; // one decrease per row
  const shapingRows = stairStepRows + singleDecreaseRows;
  const remainingRows = Math.max(0, neckDepthRows - shapingRows);

  // Generate machine knitting text instructions
  const generateInstructions = () => {
    const unitLabel = units === 'inches' ? '"' : 'cm';
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Machine Knitting Neckline Instructions</h3>
        
        <div style="margin-bottom: 20px;">
          <strong>Setup:</strong><br>
          • Full stitch count: ${castOnSts} stitches<br>
          • Initial bind off: ${adjustedBindOff} stitches (center${extraStitch ? ' + 1 remainder' : ''})<br>
          • One side: ${sideTotal} stitches<br>
          • Total decreases needed: ${totalDecreases} (${perSideRemaining} per side)<br>
          • Remaining rows: ${remainingRows} rows
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 1:</strong> Scrap off ${scrapOffTotal} stitches (${sideTotal} + ${adjustedBindOff})
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 2:</strong> Shape the remaining ${sideTotal} stitches with ${perSideRemaining} decreases per side:<br>
          • ${perSideStair} stitches in stair steps (2-3 stitch groups)<br>
          • ${perSideSingle} stitches as single decreases<br>
          • Total shaping rows: ${shapingRows}
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 3:</strong> Knit the remaining ${remainingRows} rows and bind off
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 4:</strong> Pick up the held stitches<br>
          Bind off center ${adjustedBindOff} stitches when working the second side
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 5:</strong> Reverse the shaping on the other side:<br>
          • Work the same ${perSideStair} + ${perSideSingle} decrease sequence<br>
          • Knit ${remainingRows} straight rows and bind off
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <strong>Summary:</strong><br>
          Neckline: ${neckSts} stitches (${necklineWidth}${unitLabel} wide)<br>
          Depth: ${neckDepthRows} rows (${necklineDepth}${unitLabel})<br>
          Shaping: ${shapingRows} rows + Straight: ${remainingRows} rows = ${neckDepthRows} total<br>
          <strong>Validation:</strong> 2×${perSideRemaining} + ${adjustedBindOff} = ${2*perSideRemaining + adjustedBindOff} (should equal ${neckSts})
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

    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; max-width: 500px; height: auto;">
        <!-- Main rectangle -->
        <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" 
              fill="none" stroke="black" stroke-width="2"/>
        
        <!-- Neckline curve -->
        <path d="M ${neckLeft} ${rectY} Q ${centerX} ${rectY + neckDepthSvg * 1.3} ${neckRight} ${rectY}" 
              fill="none" stroke="black" stroke-width="2"/>
        
        <!-- Bottom measurement line -->
        <line x1="${rectX}" y1="${rectY + rectHeight + 25}" x2="${rectX + rectWidth}" y2="${rectY + rectHeight + 25}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <circle cx="${rectX + rectWidth}" cy="${rectY + rectHeight + 25}" r="3" fill="black"/>
        <text x="${centerX}" y="${rectY + rectHeight + 45}" text-anchor="middle" font-size="12" fill="black">
          {{castOnSts}} stitches ({{width}}${units === 'inches' ? '"' : 'cm'})
        </text>
        
        <!-- Left measurement line -->
        <line x1="${rectX - 25}" y1="${rectY}" x2="${rectX - 25}" y2="${rectY + rectHeight}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX - 25}" cy="${rectY}" r="3" fill="black"/>
        <circle cx="${rectX - 25}" cy="${rectY + rectHeight}" r="3" fill="black"/>
        <text x="${rectX - 35}" y="${rectY + rectHeight/2}" text-anchor="middle" font-size="12" fill="black" 
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
        
        <!-- Neckline depth - extends to lowest point of curve -->
        <line x1="${rectX + rectWidth + 15}" y1="${rectY}" x2="${rectX + rectWidth + 15}" y2="${rectY + neckDepthSvg * 1.3}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY}" r="2" fill="black"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY + neckDepthSvg * 1.3}" r="2" fill="black"/>
        <text x="${rectX + rectWidth + 25}" y="${rectY + (neckDepthSvg * 1.3)/2}" text-anchor="start" font-size="11" fill="black" 
              transform="rotate(90, ${rectX + rectWidth + 25}, ${rectY + (neckDepthSvg * 1.3)/2})">
          {{neckDepthRows}} rows ({{neckDepth}}${units === 'inches' ? '"' : 'cm'})
        </text>
      </svg>
    `;
  };

  // Replace placeholders in SVG
  const replacePlaceholders = (template: string) => {
    return template
      .replace(/\{\{castOnSts\}\}/g, castOnSts.toString())
      .replace(/\{\{rows\}\}/g, totalRows.toString())
      .replace(/\{\{height\}\}/g, garmentHeight.toString())
      .replace(/\{\{neckSts\}\}/g, neckSts.toString())
      .replace(/\{\{neckDepth\}\}/g, necklineDepth.toString())
      .replace(/\{\{neckDepthRows\}\}/g, neckDepthRows.toString())
      .replace(/\{\{width\}\}/g, garmentWidth.toString())
      .replace(/\{\{neckWidth\}\}/g, necklineWidth.toString());
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1 className="wizard-title">Neckline Practice Wizard</h1>
        <p className="wizard-subtitle">Learn neckline shaping with step-by-step instructions and technical diagrams</p>
      </div>

      <div className="content-area">
        {/* Input Form */}
        <div className="well_white">
          <h2 className="text-primary">Your Gauge</h2>
          
          <div className="form-group">
            <label>Measurement Units</label>
            <select 
              className="form-control"
              value={units}
              onChange={(e) => setUnits(e.target.value as 'inches' | 'cm')}
              data-testid="select-units"
            >
              <option value="inches">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stitches in {units === 'inches' ? '4 inches' : '10 cm'}</label>
            <input
              type="number"
              className="form-control"
              value={stitchesIn4}
              onChange={(e) => setStitchesIn4(e.target.value)}
              placeholder="e.g., 20"
              data-testid="input-stitches"
            />
          </div>

          <div className="form-group">
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

        {/* Instructions */}
        <div id="instructions" dangerouslySetInnerHTML={{ __html: generateInstructions() }} />

        {/* Schematic */}
        <div className="well_white">
          <h3 className="text-primary">Technical Schematic</h3>
          <div id="schematic" style={{ textAlign: 'center', padding: '20px' }}>
            <div dangerouslySetInnerHTML={{ __html: replacePlaceholders(generateSchematic()) }} />
          </div>
        </div>
      </div>
    </div>
  );
}