import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import logoSvg from '@assets/knitting-brand.svg';
import { type SizeSelection } from '@shared/sizing';
import { useSizingData } from '@shared/hooks/useSizingData';
import { WizardActionBar, GaugeInputs, UnitsToggle, PrintFooter, PrintHeader } from '@/components/lego';
import type { WizardAction, Units } from '@shared/types/wizard';

interface GaugeData {
  units: 'inches' | 'cm';
  stitchesIn4: string;
  rowsIn4: string;
}

// Helper function to safely extract number from sizing data
function toNumber(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
}

export default function BlanketWizard() {
  // Load blanket sizes from external URL
  const { sizes: blanketSizes, loading: sizesLoading, error: sizesError } = useSizingData('https://sizing-data.knitbymachine.com/sizing_blankets.json');
  
  const [units, setUnits] = useState<Units>('inches');
  const [stitchesIn4, setStitchesIn4] = useState<string>('');
  const [rowsIn4, setRowsIn4] = useState<string>('');
  const [hasGaugeError, setHasGaugeError] = useState<boolean>(false);
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
      if (stitchesIn4 || rowsIn4 || selectedSize || customSize.length || customSize.width) {
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

  // Get size data from JSON-loaded sizes
  const sizeSelection: SizeSelection | null = useCustomSize 
    ? (customSize.length && customSize.width ? {
        size: "Custom",
        dimensions: {
          length: Number(customSize.length) || 0,
          width: Number(customSize.width) || 0
        },
        category: "Custom"
      } : null)
    : (selectedSize ? (() => {
        const foundSize = blanketSizes.find(s => s.size === selectedSize);
        if (!foundSize) return null;
        
        // Extract numeric values safely
        const lengthInches = toNumber(foundSize.length);
        const widthInches = toNumber(foundSize.width);
        
        // Convert dimensions if needed
        const dimensions = units === 'cm' 
          ? {
              length: Math.round(lengthInches * 2.54 * 10) / 10,
              width: Math.round(widthInches * 2.54 * 10) / 10
            }
          : {
              length: lengthInches,
              width: widthInches
            };
        
        return {
          size: foundSize.size,
          dimensions,
          category: String(foundSize.category || 'Custom')
        };
      })() : null);

  // Calculate stitch and row counts
  const widthSts = sizeSelection ? Math.round(sizeSelection.dimensions.width * stitchesPerUnit) : 0;
  const lengthRows = sizeSelection ? Math.round(sizeSelection.dimensions.length * rowsPerUnit) : 0;

  // Get size options grouped by category from JSON-loaded data
  const categories = Array.from(new Set(blanketSizes.map(size => size.category)));

  // Calculate yarn needed based on swatch or rough estimate
  const calculateYarnNeeded = () => {
    if (!sizeSelection || !widthSts || !lengthRows || !calculateYarn) {
      return { grams: 0, balls: 0, method: 'none' };
    }
    
    // If yarn calculation is enabled and we have complete swatch data
    if (swatchWidth && swatchLength && swatchWeight) {
      const swatchWidthNum = parseFloat(swatchWidth);
      const swatchLengthNum = parseFloat(swatchLength);
      const swatchWeightNum = parseFloat(swatchWeight);
      
      if (swatchWidthNum > 0 && swatchLengthNum > 0 && swatchWeightNum > 0) {
        // Calculate area-based yarn estimate
        // Swatch area = width × length
        const swatchArea = swatchWidthNum * swatchLengthNum;
        
        // Blanket area = width × length
        const blanketArea = sizeSelection.dimensions.width * sizeSelection.dimensions.length;
        
        // Weight needed = (blanket area / swatch area) × swatch weight
        const gramsNeeded = Math.round((blanketArea / swatchArea) * swatchWeightNum);
        
        // Calculate number of 100g balls needed (round up)
        const ballsNeeded = Math.ceil(gramsNeeded / 100);
        
        return { grams: gramsNeeded, balls: ballsNeeded, method: 'swatch' };
      }
    }
    
    // No fallback estimate - require swatch data
    return { grams: 0, balls: 0, method: 'none' };
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
        <text x="${rectX + rectWidth/2}" y="${rectY + rectHeight/2 - 5}" text-anchor="middle" font-size="14" fill="#52682d" font-weight="bold">
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
          ${yarnCalculation.grams}g
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
    
    const yarnLine = yarnCalculation.method !== 'none' 
      ? `• Yarn: ${yarnCalculation.grams}g (based on your swatch)<br>`
      : `• Yarn: —<br>`;
    
    return `
      <div class="well_white">
        <h3 class="text-primary">Blanket Knitting Pattern</h3>
        
        <div style="margin-bottom: 25px; padding: 15px; background: rgba(82, 104, 45, 0.2); border-left: 4px solid #52682d; border-radius: 4px;">
          <strong style="color: #52682d;">${sizeSelection.size} Blanket</strong><br>
          <small style="color: #666;">Finished size: ${sizeSelection.dimensions.width}${unitLabel} × ${sizeSelection.dimensions.length}${unitLabel}</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Materials Needed:</strong>
          <div style="margin-left: 20px;">
            • Machine: Any knitting machine<br>
            ${yarnLine}• Gauge: ${stitchesIn4} stitches and ${rowsIn4} rows = ${unitSize}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Pattern Instructions:</strong>
          <div style="margin-left: 20px;">
            1. Cast on ${widthSts} stitches<br>
            2. Knit in pattern for ${lengthRows} rows<br>
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
        
        <div style="margin-top: 25px; padding: 15px; background: rgba(82, 104, 45, 0.2); border-left: 4px solid #52682d; border-radius: 4px;">
          <strong style="color: #52682d;">Pattern Summary:</strong><br>
          <small style="color: #666;">
            Cast on ${widthSts} stitches, knit ${lengthRows} rows, bind off. 
            Finished size: ${sizeSelection.dimensions.width}${unitLabel} × ${sizeSelection.dimensions.length}${unitLabel}${yarnCalculation.method !== 'none' ? `<br>Yarn needed: ${yarnCalculation.grams}g` : ''}
          </small>
        </div>
      </div>
    `;
  };

  // Define action buttons
  const hasUserData = !!(stitchesIn4 && rowsIn4);
  const hasValidPattern = !hasGaugeError && sizeSelection && widthSts > 0 && lengthRows > 0;

  const handleDownloadPDF = async () => {
    if (!sizeSelection) return;
    
    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <!-- Print Header -->
        <div style="font-family: 'Shadows Into Light Two', cursive; font-size: 1.3em; font-weight: 400; color: #649841; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #649841; padding-bottom: 5px; margin-bottom: 10px;">
          <span style="font-size: 1.5em;">Knit by Machine</span>
          <a href="https://www.knitbymachine.com" style="text-decoration: none; color: #649841; font-size: 0.9em;">www.knitbymachine.com</a>
        </div>
        
        <!-- Pattern Content -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #52682d;">
          <h1 style="color: #52682d; margin: 0; font-size: 28px;">Blanket Pattern Wizard</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Custom ${sizeSelection.size} Blanket Pattern</p>
        </div>
        <div style="margin-bottom: 30px;">${generateInstructions()}</div>
        <div style="text-align: center;">
          <h3 style="color: #52682d;">Diagram</h3>
          ${replacePlaceholders(generateDiagram())}
        </div>
        
        <!-- Print Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 10px; color: #666; line-height: 1.6;">
          © ${year} Knit by Machine — All rights reserved. | www.knitbymachine.com | Generated ${month} ${year}
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
  };

  const handleStartOver = () => {
    setUnits('inches');
    setStitchesIn4('');
    setRowsIn4('');
    setSelectedSize('');
    setCustomSize({length: '', width: ''});
    setUseCustomSize(false);
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

  // Show loading state while sizes are being loaded
  if (sizesLoading) {
    return (
      <div className="wizard-container">
        <div className="content-area">
          <div className="well_white" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading blanket sizes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if sizes failed to load
  if (sizesError) {
    return (
      <div className="wizard-container">
        <div className="content-area">
          <div className="well_white" style={{ padding: '40px' }}>
            <h2 className="text-primary" style={{ color: '#d9534f' }}>Error Loading Sizes</h2>
            <p style={{ marginTop: '20px' }}>
              Unable to load blanket sizing data. Please refresh the page to try again.
            </p>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
              Error: {sizesError}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-round-wizard"
              style={{ marginTop: '20px' }}
              data-testid="button-reload"
            >
              <i className="fas fa-redo" style={{ marginRight: '8px' }} />
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      {/* Print-only header */}
      <PrintHeader />
      
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
          
          <UnitsToggle
            units={units}
            onChange={setUnits}
            label="Measurement Units"
          />

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <GaugeInputs
              units={units}
              stitchesIn4={stitchesIn4}
              rowsIn4={rowsIn4}
              onStitchesChange={setStitchesIn4}
              onRowsChange={setRowsIn4}
              onValidationChange={setHasGaugeError}
            />
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
              <label style={{ marginBottom: '15px', display: 'block' }}>Select Standard Size</label>
              
              {/* Card Grid organized by category */}
              <div>
                {categories.map(category => (
                  <div key={category} className="category-section">
                    {/* Category Header */}
                    <h4 className="category-header">
                      {category}
                    </h4>
                    
                    {/* Cards for this category */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                      gap: '12px'
                    }}>
                      {blanketSizes
                        .filter(size => size.category === category)
                        .map(size => {
                          const isSelected = selectedSize === size.size;
                          const unitLabel = units === 'inches' ? '"' : 'cm';
                          const widthNum = toNumber(size.width);
                          const lengthNum = toNumber(size.length);
                          const width = units === 'inches' ? widthNum : Math.round(widthNum * 2.54);
                          const length = units === 'inches' ? lengthNum : Math.round(lengthNum * 2.54);
                          const sizeKey = size.size.toLowerCase().replace(/\s+/g, '-');
                          
                          return (
                            <label 
                              key={size.size}
                              className={`size-card ${isSelected ? 'selected' : ''}`}
                              data-testid={`card-size-${sizeKey}`}
                            >
                              {/* Hidden Radio Button */}
                              <input
                                type="radio"
                                name="blanketSize"
                                value={size.size}
                                checked={isSelected}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                style={{ 
                                  position: 'absolute', 
                                  opacity: 0, 
                                  width: 0, 
                                  height: 0 
                                }}
                                data-testid={`radio-size-${sizeKey}`}
                              />
                              
                              {/* Size Name */}
                              <div className="size-name">
                                {size.size}
                              </div>
                              
                              {/* Dimensions */}
                              <div className="size-dimensions">
                                {width}{unitLabel} × {length}{unitLabel}
                              </div>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="check-indicator">
                                  <i className="fas fa-check" />
                                </div>
                              )}
                            </label>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
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
          <div 
            onClick={() => setCalculateYarn(!calculateYarn)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '15px',
              background: 'rgba(82, 104, 45, 0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: calculateYarn ? '15px' : '0',
              transition: 'all 0.3s ease'
            }}
            data-testid="accordion-calculate-yarn"
          >
            <h2 className="text-primary" style={{ margin: 0, fontSize: '1.3rem' }}>Calculate Yarn Needed (Optional)</h2>
            <i 
              className={`fas fa-chevron-${calculateYarn ? 'up' : 'down'}`}
              style={{ 
                color: '#52682d', 
                fontSize: '1.2rem',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
          
          {calculateYarn && (
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              Get accurate yarn estimate based on your swatch measurements.
            </p>
          )}

          {calculateYarn && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <h4 style={{ marginBottom: '15px', color: '#52682d' }}>Swatch Measurements</h4>
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
                    placeholder={`Swatch Width`}
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
                    placeholder={`Swatch Length`}
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
                    placeholder="Swatch Weight"
                    step="0.1"
                    data-testid="input-swatch-weight"
                  />
                </div>
              </div>
              
              {swatchWidth && swatchLength && swatchWeight && (
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(82, 104, 45, 0.2)', borderRadius: '4px' }}>
                  <strong style={{ color: '#52682d' }}>Calculation Preview:</strong><br />
                  <small style={{ color: '#666' }}>
                    {(() => {
                      const calc = calculateYarnNeeded();
                      return calc.method === 'swatch' 
                        ? `Your blanket will need approximately ${calc.grams}g of yarn based on your swatch.`
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
        
        {/* Print-only copyright footer */}
        <PrintFooter />
      </div>
    </div>
  );
}