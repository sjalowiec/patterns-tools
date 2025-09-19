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

  // Neckline shaping calculations
  const bindOffSts = Math.floor(neckSts / 3);
  const remainingSts = neckSts - bindOffSts;
  const stairStepSts = Math.floor(remainingSts / 2);
  const singleDecreaseSts = remainingSts - stairStepSts;

  // Generate text instructions
  const generateInstructions = () => {
    const unitLabel = units === 'inches' ? '"' : 'cm';
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Neckline Shaping Instructions</h3>
        
        <div style="margin-bottom: 20px;">
          <strong>Base Piece:</strong><br>
          Cast on ${castOnSts} stitches (${garmentWidth}${unitLabel} wide)<br>
          Knit for ${totalRows} rows (${garmentHeight}${unitLabel} length)
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 1: Center Bind-Off</strong><br>
          Bind off (or place on holder) ${bindOffSts} stitches straight across the center.
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 2: Stair-Step Decreases</strong><br>
          Decrease ${stairStepSts} stitches in 2- or 3-stitch stair steps:<br>
          • Work ${Math.floor(stairStepSts/2)} stitches on each side<br>
          • If mixing 2- and 3-stitch steps, work 3-stitch steps first<br>
          • Work each side separately
        </div>

        <div style="margin-bottom: 15px;">
          <strong>STEP 3: Single Decreases</strong><br>
          Decrease the final ${singleDecreaseSts} stitches as single decreases:<br>
          • ${Math.floor(singleDecreaseSts/2)} decreases on each neckline edge<br>
          • Work each side separately
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <strong>Summary:</strong><br>
          Total neckline stitches: ${neckSts}<br>
          Neckline depth: ${neckDepthRows} rows (${necklineDepth}${unitLabel})<br>
          ${bindOffSts} bind off + ${stairStepSts} stair steps + ${singleDecreaseSts} single decreases = ${neckSts} total
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
          {{castOnSts}} stitches
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
          {{neckSts}} stitches
        </text>
        
        <!-- Neckline depth -->
        <line x1="${rectX + rectWidth + 15}" y1="${rectY}" x2="${rectX + rectWidth + 15}" y2="${rectY + neckDepthSvg}" 
              stroke="black" stroke-width="1"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY}" r="2" fill="black"/>
        <circle cx="${rectX + rectWidth + 15}" cy="${rectY + neckDepthSvg}" r="2" fill="black"/>
        <text x="${rectX + rectWidth + 25}" y="${rectY + neckDepthSvg/2}" text-anchor="start" font-size="11" fill="black" 
              transform="rotate(90, ${rectX + rectWidth + 25}, ${rectY + neckDepthSvg/2})">
          {{neckDepth}}${units === 'inches' ? '"' : 'cm'}
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
      .replace(/\{\{neckDepth\}\}/g, necklineDepth.toString());
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