import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { calcShoulderWidth, rowsForOneInch, distributeEvenly, generateLeftShoulderTemplate, generateRightShoulderTemplate } from '@shared/calculations';
import { GaugeInputs, RadioGroup, useGaugeCalculations, WizardActionBar } from '@/components/lego';
import type { Units, WizardAction } from '@shared/types/wizard';

interface GaugeData {
  units: 'inches' | 'cm';
  stitchesIn4: number;
  rowsIn4: number;
}

export default function NecklineWizard() {
  const [units, setUnits] = useState<Units>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('');
  const [rowsIn4, setRowsIn4] = useState<string>('');

  // Warn user before leaving page if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stitchesIn4 || rowsIn4) {
        e.preventDefault();
        e.returnValue = 'Your pattern will be lost! Make sure to download your PDF before leaving.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stitchesIn4, rowsIn4]);

  // Fixed dimensions in inches (canonical base units)
  const garmentWidthIn = 10;
  const bodyHeightIn = 5;  // Straight knitting before neck shaping
  const necklineWidthIn = 5;
  const necklineDepthIn = 4;
  const totalGarmentHeightIn = bodyHeightIn + necklineDepthIn; // 9" total

  // Calculate per-unit gauge using lego block hook (handles both inches and cm correctly)
  const { stitchesPerUnit, rowsPerUnit } = useGaugeCalculations(stitchesIn4, rowsIn4, units);
  
  // For inch-based dimensions, use per-unit values directly
  const stitchesPerInch = stitchesPerUnit;
  const rowsPerInch = rowsPerUnit;

  // Calculate stitch and row counts using canonical dimensions (always in inches)
  const castOnSts = Math.round(garmentWidthIn * stitchesPerInch) || 0;
  const bodyRows = Math.round(bodyHeightIn * rowsPerInch) || 0;
  const totalRows = Math.round(totalGarmentHeightIn * rowsPerInch) || 0;
  const neckDepthRows = Math.round(necklineDepthIn * rowsPerInch) || 0;
  
  // Calculate neck stitches with parity adjustment to ensure even shoulder division
  const neckFloat = necklineWidthIn * stitchesPerInch;
  const neckRounded = Math.round(neckFloat) || 0;
  
  // Adjust neck stitches to ensure (castOnSts - neckSts) is even for balanced shoulders
  let neckSts = neckRounded;
  if (castOnSts > 0 && (castOnSts - neckRounded) % 2 !== 0) {
    // Choose adjustment (+1 or -1) that stays closest to the original calculation
    const neckPlusOne = Math.min(neckRounded + 1, castOnSts);
    const neckMinusOne = Math.max(neckRounded - 1, 0);
    
    const diffPlusOne = Math.abs(neckFloat - neckPlusOne);
    const diffMinusOne = Math.abs(neckFloat - neckMinusOne);
    
    neckSts = diffPlusOne <= diffMinusOne ? neckPlusOne : neckMinusOne;
  }
  
  // Display dimensions in current units for labels  
  const garmentWidth = units === 'inches' ? garmentWidthIn : Math.round(garmentWidthIn * 2.54 * 10) / 10;
  const bodyHeight = units === 'inches' ? bodyHeightIn : Math.round(bodyHeightIn * 2.54 * 10) / 10;
  const totalGarmentHeight = units === 'inches' ? totalGarmentHeightIn : Math.round(totalGarmentHeightIn * 2.54 * 10) / 10;
  const necklineWidth = units === 'inches' ? necklineWidthIn : Math.round(necklineWidthIn * 2.54 * 10) / 10;
  const necklineDepth = units === 'inches' ? necklineDepthIn : Math.round(necklineDepthIn * 2.54 * 10) / 10;

  // Machine knitting neckline shaping calculations
  const bindOffSts = Math.floor(castOnSts / 3);  // initial bind off (center) - 1/3 of total cast-on
  const sideTotal = Math.floor(castOnSts / 2);  // total stitches per side
  const totalDecreases = Math.max(0, neckSts - bindOffSts);  // total stitches to decrease (clamped to prevent negative)
  const perSideRemaining = Math.floor(totalDecreases / 2);  // decreases per side 
  const extraStitch = totalDecreases % 2;  // remainder stitch (0 or 1)
  const adjustedBindOff = bindOffSts + extraStitch;  // add remainder to center bind-off
  const scrapOffTotal = sideTotal + adjustedBindOff;  // stitches to scrap off
  
  // Track if neck stitches were adjusted for UI transparency
  const neckAdjusted = neckSts !== neckRounded;
  
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

  // Generate machine knitting text instructions with event-based RC tracking
  const generateInstructions = () => {
    const unitLabel = units === 'inches' ? '"' : 'cm';
    
    // Calculate shoulder shaping values using magic formula
    const shoulderSts = calcShoulderWidth(castOnSts, neckSts);
    const shoulderDropRows = rowsForOneInch(rowsPerInch);
    const turnBlocks = distributeEvenly(shoulderDropRows, shoulderSts);
    
    // RC helper functions - only for actual events/actions
    const formatRC = (rc: number): string => {
      const paddedRC = rc.toString().padStart(3, '0');
      const position = rc % 2 === 0 ? 'COR' : 'COL';
      return `RC:${paddedRC}<span class="rc-abbrev">${position}</span>`;
    };
    
    // Track RC for events only (not every carriage pass)
    let currentRC = 0;
    
    // Step 1 - Foundation 
    let step1Instructions = `${formatRC(currentRC)} – Cast on ${castOnSts} stitches<br>`;
    currentRC++;
    step1Instructions += `<span class="bullet-indent">• Knit ${bodyRows} rows, ending COR</span><br>`;
    
    // Step 3: Left side neckline shaping - reset RC and use summary format
    currentRC = 0; // Reset row counter for left side shaping
    let leftShapingInstructions = `${formatRC(currentRC)} – Begin neckline shaping<br>`;
    currentRC++;
    
    if (section1Decreases > 0) {
      leftShapingInstructions += `<span class="bullet-indent">• Decrease 1 stitch every 2 rows, ${section1Decreases} times (${section1Decreases * 2} rows)</span><br>`;
    }
    if (section2Decreases > 0) {
      leftShapingInstructions += `<span class="bullet-indent">• Decrease 1 stitch every row, ${section2Decreases} times (${section2Decreases} rows)</span><br>`;
    }
    
    // Add remaining straight rows note (no RC needed for plain knitting)
    if (remainingRows > 0) {
      leftShapingInstructions += `<span class="bullet-indent">• Continue knitting ${remainingRows} plain rows</span><br>`;
    }
    leftShapingInstructions += `<span class="bullet-indent">• End COR (neck side)</span><br>`;
    leftShapingInstructions += `<span class="bullet-indent"><strong>${shoulderSts} stitches remain on left side</strong></span><br>`;
    leftShapingInstructions += `<strong>Reset row counter to 000</strong><br>`;
    
    // Reset RC to 000 for Step 3a
    currentRC = 0;
    
    // Left shoulder shaping with event-based RC - start from 000
    let leftShoulderInstructions = `<span class="bullet-indent">Set carriage to Hold</span><br><br>`;
    
    // Show first 2 turn blocks, then instruct to repeat
    if (turnBlocks.length > 0) {
      leftShoulderInstructions += `<span class="bullet-indent">${formatRC(currentRC)} – <span class="repeat-marker">*</span>Put ${turnBlocks[0]} needles into Hold opposite the carriage (armhole edge), knit, wrap, knit back</span><br>`;
      currentRC += 2; // Each turn block is 2 rows
    }
    if (turnBlocks.length > 1) {
      leftShoulderInstructions += `<span class="bullet-indent">${formatRC(currentRC)} – Put ${turnBlocks[1]} needles into Hold opposite the carriage (armhole edge), knit, wrap, knit back<span class="repeat-marker">*</span></span><br>`;
      currentRC += 2; // Each turn block is 2 rows
    }
    
    // If more than 2 blocks, instruct to repeat
    if (turnBlocks.length > 2) {
      leftShoulderInstructions += `<span class="bullet-indent">Repeat from <span class="repeat-marker">*</span> to <span class="repeat-marker">*</span> until all needles are in hold</span><br>`;
      // Account for remaining turn blocks (2 rows each)
      currentRC += 2 * (turnBlocks.length - 2);
    }
    
    leftShoulderInstructions += `<span class="bullet-indent">    • Cancel Hold</span><br>`;
    leftShoulderInstructions += `<span class="bullet-indent">    • Break yarn leaving a tail for seaming</span><br>`;
    leftShoulderInstructions += `<span class="bullet-indent">    • Scrap off ${shoulderSts} stitches</span><br>`;
    
    // RESTART RC TO 000 for right side after scrap off
    let rightSideRC = 0;
    
    // Step 4: Right side setup with restarted RC
    let rightSetupInstructions = `<strong>Reset row counter to 000</strong><br>`;
    rightSetupInstructions += `Re-hang scrapped stitches, re-attach yarn<br>`;
    rightSetupInstructions += `${formatRC(rightSideRC)} – Bind off ${adjustedBindOff} stitches<br>`;
    rightSideRC++;
    
    // Right side neckline shaping - use summary format
    let rightShapingInstructions = '';
    
    if (section1Decreases > 0) {
      rightShapingInstructions += `<span class="bullet-indent">• Decrease 1 stitch at neck edge every 2 rows, ${section1Decreases} times (${section1Decreases * 2} rows)</span><br>`;
      rightSideRC += section1Decreases; // Each decrease is an RC event
    }
    if (section2Decreases > 0) {
      rightShapingInstructions += `<span class="bullet-indent">• Decrease 1 stitch at neck edge every row, ${section2Decreases} times (${section2Decreases} rows)</span><br>`;
      rightSideRC += section2Decreases; // Each decrease is an RC event
    }
    
    // Add remaining straight rows note (no RC needed for plain knitting)
    if (remainingRows > 0) {
      rightShapingInstructions += `<span class="bullet-indent">• Continue knitting ${remainingRows} plain rows</span><br>`;
    }
    rightShapingInstructions += `<span class="bullet-indent">End COL (neck edge)</span><br>`;
    rightShapingInstructions += `<span class="bullet-indent"><strong>${shoulderSts} stitches remain on right side</strong></span><br>`;
    
    // Right shoulder shaping with event-based RC
    let rightShoulderInstructions = `Set carriage to Hold<br><br>`;
    
    // Show first 2 turn blocks, then instruct to repeat
    if (turnBlocks.length > 0) {
      rightShoulderInstructions += `${formatRC(rightSideRC)} – <span class="repeat-marker">*</span>Put ${turnBlocks[0]} needles into Hold opposite the carriage (armhole edge), knit, wrap, knit back<br>`;
      rightSideRC += 2; // Each turn block is 2 rows
    }
    if (turnBlocks.length > 1) {
      rightShoulderInstructions += `${formatRC(rightSideRC)} – Put ${turnBlocks[1]} needles into Hold opposite the carriage (armhole edge), knit, wrap, knit back<span class="repeat-marker">*</span><br>`;
      rightSideRC += 2; // Each turn block is 2 rows
    }
    
    // If more than 2 blocks, instruct to repeat
    if (turnBlocks.length > 2) {
      rightShoulderInstructions += `Repeat from <span class="repeat-marker">*</span> to <span class="repeat-marker">*</span> until all needles are in hold<br>`;
      // Account for remaining turn blocks (2 rows each)
      rightSideRC += 2 * (turnBlocks.length - 2);
    }
    
    rightShoulderInstructions += `<span class="bullet-indent">Cancel Hold, break yarn with tail, scrap off ${shoulderSts} stitches</span><br>`;
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Complete Knitting Pattern with Row Counter</h3>
        
        <div style="margin-bottom: 25px; padding: 15px; background: rgba(0, 100, 0, 0.1); border-left: 4px solid #2F7D32; border-radius: 4px;">
          <small class="wizard-instruction-label">Even rows = COR (carriage on right), Odd rows = COL (carriage on left)</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Step 1: Foundation</strong><br>
          ${step1Instructions}
        </div>
        
        <div class="wizard-lifeline-warning">
          <strong>IMPORTANT: In case of disaster, place a lifeline</strong><br>
          <small style="color: #666;">Place a thin yarn or thread through all active stitches to preserve your work before starting neckline shaping.</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>About Neckline Shaping:</strong>
          <div class="bullet-indent"><em>Each side of the neckline is knit separately. You will scrap off one side, shape one side, then re-hang and shape the 2nd side.</em></div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Step 2: Neckline Setup</strong><br>
          <span class="bullet-indent">• Do not break yarn, remove working yarn from feeder and set aside</span><br>
          <span class="bullet-indent">• Thread up scrap yarn</span><br>
          <span class="bullet-indent">• Scrap off ${sideTotal} stitches, ending COR</span><br>
          <span class="bullet-indent">• Set scrapped stitches aside for Step 4</span>
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Step 3: Shape Left Side (Neck Edge #1)</strong><br>
          ${leftShapingInstructions}
          <br>
          <strong>Step 3a: Left Shoulder Shaping</strong><br>
          ${leftShoulderInstructions}
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Step 4: Shape Right Side (Neck Edge #2)</strong><br>
          ${rightSetupInstructions}
          ${rightShapingInstructions}
          <br>
          <strong>Step 4a: Right Shoulder Shaping</strong><br>
          ${rightShoulderInstructions}
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
        
        <!-- Shoulder shaping row indicators -->
        <text x="${rectX + shoulderWidthSvg/2}" y="${rectY + shoulderDropSvg/2 - 10}" text-anchor="middle" 
              font-size="10" fill="#C2514E" font-weight="bold">
          {{shoulderRows}} rows
        </text>
        <text x="${rectX + shoulderWidthSvg/2}" y="${rectY + shoulderDropSvg/2 - 25}" text-anchor="middle" 
              font-size="10" fill="#C2514E" font-weight="bold">
          {{shoulderSts}} sts
        </text>
        
        
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
    
    const shoulderRows = rowsForOneInch(rowsPerInch);
    const shoulderSts = calcShoulderWidth(castOnSts, neckSts);
    
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
      .replace(/\{\{knittedHeight\}\}/g, knittedHeight)
      .replace(/\{\{shoulderRows\}\}/g, shoulderRows.toString())
      .replace(/\{\{shoulderSts\}\}/g, shoulderSts.toString());
  };

  // Define action buttons
  const hasUserData = !!(stitchesIn4 && rowsIn4);
  const hasValidPattern = castOnSts > 0 && totalRows > 0 && neckSts > 0;

  const handleDownloadPDF = async () => {
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
  };

  const handleStartOver = () => {
    setUnits('inches');
    setStitchesIn4('');
    setRowsIn4('');
  };

  const actions: WizardAction[] = [
    {
      id: 'startover',
      label: 'Start Over',
      icon: 'fas fa-redo',
      onClick: handleStartOver,
      className: 'btn-round-gray',
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
        className: 'btn-round-primary',
        testId: 'button-print'
      },
      {
        id: 'download',
        label: 'Download PDF',
        icon: 'fas fa-download',
        onClick: handleDownloadPDF,
        className: 'btn-round-primary',
        testId: 'button-download'
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
          
          <RadioGroup
            name="units"
            label="Measurement Units"
            options={[
              { value: 'inches', label: 'Inches', testId: 'radio-inches' },
              { value: 'cm', label: 'Centimeters', testId: 'radio-cm' }
            ]}
            selectedValue={units}
            onChange={(value) => setUnits(value as Units)}
          />

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <GaugeInputs
              units={units}
              stitchesIn4={stitchesIn4}
              rowsIn4={rowsIn4}
              onStitchesChange={setStitchesIn4}
              onRowsChange={setRowsIn4}
              stitchesTestId="input-stitches"
              rowsTestId="input-rows"
            />
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