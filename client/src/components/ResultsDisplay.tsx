import SweaterDiagram from './SweaterDiagram';

interface GaugeData {
  units: 'inches' | 'centimeters';
  stitchGauge: number;
  rowGauge: number;
}

interface ResultsDisplayProps {
  gaugeData: GaugeData;
}

interface Calculations {
  castOnStitches: number;
  necklineStitches: number;
  preNeckRows: number;
  necklineRows: number;
  necklineShaping: {
    bindOffStitches: number;
    decreaseGroup1: number;
    decreaseGroup2: number;
  };
}

export default function ResultsDisplay({ gaugeData }: ResultsDisplayProps) {
  const { units, stitchGauge, rowGauge } = gaugeData;
  
  // Fixed garment dimensions
  const castOnWidth = 10; // inches/cm
  const preNeckHeight = 5; // inches/cm  
  const necklineWidth = 5; // inches/cm
  const necklineDepth = 4; // inches/cm
  
  // Calculate stitch and row counts
  const calculations: Calculations = {
    castOnStitches: Math.round(castOnWidth * stitchGauge),
    necklineStitches: Math.round(necklineWidth * stitchGauge),
    preNeckRows: Math.round(preNeckHeight * rowGauge),
    necklineRows: Math.round(necklineDepth * rowGauge),
    necklineShaping: {
      bindOffStitches: 0,
      decreaseGroup1: 0,
      decreaseGroup2: 0
    }
  };
  
  // Calculate neckline shaping groups
  const totalNeckStitches = calculations.necklineStitches;
  calculations.necklineShaping.bindOffStitches = Math.floor(totalNeckStitches / 3);
  const remainingStitches = totalNeckStitches - calculations.necklineShaping.bindOffStitches;
  calculations.necklineShaping.decreaseGroup1 = Math.floor(remainingStitches / 2);
  calculations.necklineShaping.decreaseGroup2 = remainingStitches - calculations.necklineShaping.decreaseGroup1;
  
  const unitLabel = units === 'inches' ? 'inches' : 'centimeters';
  
  return (
    <div className="well_white">
      <h2 className="text-primary">Step 2: Your Sweater Calculations</h2>
      
      {/* Summary Panel */}
      <div className="summary-panel">
        <div className="summary-item">
          <span className="summary-label">Cast On:</span>
          <span className="summary-value" data-testid="text-cast-on">
            {castOnWidth} {unitLabel} = {calculations.castOnStitches} stitches
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Knit Before Neckline:</span>
          <span className="summary-value" data-testid="text-pre-neck">
            {preNeckHeight} {unitLabel} = {calculations.preNeckRows} rows
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Neckline Width:</span>
          <span className="summary-value" data-testid="text-neckline-width">
            {necklineWidth} {unitLabel} = {calculations.necklineStitches} stitches
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Neckline Depth:</span>
          <span className="summary-value" data-testid="text-neckline-depth">
            {necklineDepth} {unitLabel} = {calculations.necklineRows} rows
          </span>
        </div>
      </div>
      
      {/* Neckline Shaping Instructions */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="text-primary">Neckline Shaping Instructions</h3>
        
        <div className="well_white" style={{ marginBottom: '15px', paddingLeft: '20px' }}>
          <strong>STEP 1:</strong> Bind off or place on a holder{' '}
          <span data-testid="text-bind-off">{calculations.necklineShaping.bindOffStitches} stitches</span> (one-third of neckline stitches).
        </div>
        
        <div className="well_white" style={{ marginBottom: '15px', paddingLeft: '20px' }}>
          <strong>STEP 2:</strong> Decrease{' '}
          <span data-testid="text-decrease-group1">{calculations.necklineShaping.decreaseGroup1} stitches</span> in 2- or 3-stitch stair steps, 
          divided half on each neckline edge. If combining 2- and 3-stitch decreases, bind off the 3-stitch steps first.
        </div>
        
        <div className="well_white" style={{ paddingLeft: '20px' }}>
          <strong>STEP 3:</strong> Decrease the last{' '}
          <span data-testid="text-decrease-group2">{calculations.necklineShaping.decreaseGroup2} stitches</span> with single decreases, 
          half at each neckline edge. If stitches don't divide evenly, borrow a stitch or two from another group.
        </div>
      </div>
      
      {/* Diagram */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="text-primary">Visual Diagram</h3>
        <SweaterDiagram 
          castOnStitches={calculations.castOnStitches}
          necklineStitches={calculations.necklineStitches}
          preNeckRows={calculations.preNeckRows}
          necklineRows={calculations.necklineRows}
          units={units}
        />
      </div>
    </div>
  );
}