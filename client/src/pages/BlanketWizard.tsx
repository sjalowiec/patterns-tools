import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  // Generate pattern instructions
  const generateInstructions = () => {
    if (!sizeSelection || !widthSts || !lengthRows) {
      return '<div>Please select a size and enter gauge information to generate your pattern.</div>';
    }

    const unitLabel = units === 'inches' ? '"' : 'cm';
    
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
            • Yarn: Worsted weight yarn<br>
            • Gauge: ${stitchesIn4} stitches and ${rowsIn4} rows = 4${unitLabel}
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
            Finished size: ${sizeSelection.dimensions.width}${unitLabel} × ${sizeSelection.dimensions.length}${unitLabel}
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
                        ${generateInstructions()}
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

      <div className="wizard-content">
        <div className="input-section">
          <Card>
            <CardHeader>
              <CardTitle>Gauge Information</CardTitle>
              <CardDescription>Enter your gauge swatch measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Units:</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={units === 'inches' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUnits('inches')}
                    data-testid="button-units-inches"
                  >
                    Inches
                  </Button>
                  <Button 
                    variant={units === 'cm' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUnits('cm')}
                    data-testid="button-units-cm"
                  >
                    Centimeters
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stitches-gauge">
                    Stitches in 4{units === 'inches' ? '"' : 'cm'}
                  </Label>
                  <Input
                    id="stitches-gauge"
                    type="number"
                    value={stitchesIn4}
                    onChange={(e) => setStitchesIn4(e.target.value)}
                    placeholder="20"
                    data-testid="input-stitches-gauge"
                  />
                </div>
                <div>
                  <Label htmlFor="rows-gauge">
                    Rows in 4{units === 'inches' ? '"' : 'cm'}
                  </Label>
                  <Input
                    id="rows-gauge"
                    type="number"
                    value={rowsIn4}
                    onChange={(e) => setRowsIn4(e.target.value)}
                    placeholder="28"
                    data-testid="input-rows-gauge"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blanket Size</CardTitle>
              <CardDescription>Choose a standard size or enter custom dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant={!useCustomSize ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseCustomSize(false)}
                  data-testid="button-standard-size"
                >
                  Standard Size
                </Button>
                <Button 
                  variant={useCustomSize ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseCustomSize(true)}
                  data-testid="button-custom-size"
                >
                  Custom Size
                </Button>
              </div>

              {!useCustomSize ? (
                <div>
                  <Label htmlFor="size-select">Select Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger data-testid="select-blanket-size">
                      <SelectValue placeholder="Choose blanket size" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <div key={category}>
                          <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                            {category}
                          </div>
                          {sizeOptions
                            .filter(opt => opt.category === category)
                            .map(option => (
                              <SelectItem key={option.key} value={option.key}>
                                {option.label}
                              </SelectItem>
                            ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {sizeSelection && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <Badge variant="secondary">{sizeSelection.category}</Badge>
                      <p className="text-sm mt-1">
                        {sizeSelection.dimensions.width}{units === 'inches' ? '"' : 'cm'} × {sizeSelection.dimensions.length}{units === 'inches' ? '"' : 'cm'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="custom-width">
                      Width ({units === 'inches' ? 'inches' : 'cm'})
                    </Label>
                    <Input
                      id="custom-width"
                      type="number"
                      value={customSize.width}
                      onChange={(e) => setCustomSize(prev => ({...prev, width: e.target.value}))}
                      placeholder="48"
                      data-testid="input-custom-width"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-length">
                      Length ({units === 'inches' ? 'inches' : 'cm'})
                    </Label>
                    <Input
                      id="custom-length"
                      type="number"
                      value={customSize.length}
                      onChange={(e) => setCustomSize(prev => ({...prev, length: e.target.value}))}
                      placeholder="60"
                      data-testid="input-custom-length"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="pattern-section">
          {sizeSelection && widthSts > 0 && lengthRows > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Pattern</CardTitle>
                <CardDescription>
                  {sizeSelection.size} blanket: {widthSts} stitches × {lengthRows} rows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  dangerouslySetInnerHTML={{ __html: generateInstructions() }}
                  className="pattern-content"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}