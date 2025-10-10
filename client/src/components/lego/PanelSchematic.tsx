import type { Units } from '@shared/types/wizard';

interface PanelSchematicProps {
  // Panel configuration
  panels: Array<{
    label: string;
    width: number;  // in selected units (top width for trapezoid)
    height: number; // in selected units
    castOnSts?: number;
    totalRows?: number;
    bottomWidth?: number; // for trapezoid shapes (sleeve cuff)
  }>;
  
  // Armhole/Cap marker (optional)
  marker?: {
    label: string;
    depthFromTop: number; // depth from top of panel in selected units
    color?: string;
  };
  
  // Units
  units: Units;
  
  // Optional styling
  svgWidth?: number;
  svgHeight?: number;
  testId?: string;
}

/**
 * PanelSchematic - Reusable lego block for knitting panel schematics
 * 
 * Displays knitting panels with correct bottom-to-top orientation:
 * - Cast-on at BOTTOM (where knitting starts)
 * - Armhole/cap markers at TOP (where knitting ends)
 * 
 * Works for ALL sweater pieces: front, back, sleeves (unless sideways knit)
 */
export function PanelSchematic({
  panels,
  marker,
  units,
  svgWidth = 500,
  svgHeight = 500,
  testId = 'panel-schematic'
}: PanelSchematicProps) {
  const unitLabel = units === 'inches' ? '"' : 'cm';
  
  // Calculate panel positioning
  const panelWidth = 150;
  const panelHeight = 300;
  const panelSpacing = 50;
  const startX = 50;
  const startY = 50;
  
  // Calculate marker position (from top, since armhole is at top)
  const markerYFromTop = marker ? (marker.depthFromTop / panels[0].height) * panelHeight : 0;
  const markerY = startY + markerYFromTop;
  const markerColor = marker?.color || '#d32f2f';

  return (
    <div style={{ textAlign: 'center', padding: '20px' }} data-testid={testId}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ maxWidth: '600px', width: '100%' }}>
        {panels.map((panel, index) => {
          const panelX = startX + (index * (panelWidth + panelSpacing));
          const isTrapezoid = panel.bottomWidth !== undefined;
          
          // For trapezoid (sleeve): calculate widths based on actual measurements
          const topPanelWidth = panelWidth;
          const bottomPanelWidth = isTrapezoid && panel.bottomWidth && panel.width > 0
            ? (panel.bottomWidth / panel.width) * panelWidth
            : panelWidth;
          
          // Center the trapezoid
          const topX = panelX;
          const bottomX = panelX + (topPanelWidth - bottomPanelWidth) / 2;
          
          return (
            <g key={index}>
              {/* Panel shape - rectangle or trapezoid */}
              {isTrapezoid ? (
                <polygon 
                  points={`${bottomX},${startY + panelHeight} ${topX},${startY} ${topX + topPanelWidth},${startY} ${bottomX + bottomPanelWidth},${startY + panelHeight}`}
                  fill="none" 
                  stroke="#52682d" 
                  strokeWidth="2"
                />
              ) : (
                <rect 
                  x={panelX} 
                  y={startY} 
                  width={panelWidth} 
                  height={panelHeight} 
                  fill="none" 
                  stroke="#52682d" 
                  strokeWidth="2"
                />
              )}
              
              {/* Panel label at top */}
              <text 
                x={panelX + panelWidth / 2} 
                y={startY - 10} 
                textAnchor="middle" 
                fill="#52682d" 
                fontSize="14" 
                fontWeight="bold"
              >
                {panel.label}
              </text>
              
              {/* Cast-on label at BOTTOM */}
              <text 
                x={panelX + panelWidth / 2} 
                y={startY + panelHeight + 20} 
                textAnchor="middle" 
                fill="#666" 
                fontSize="11"
              >
                Cast on{panel.castOnSts ? `: ${panel.castOnSts} sts` : ''}
              </text>
              
              {/* Marker line (if provided) - positioned from TOP */}
              {marker && (
                <>
                  <line 
                    x1={panelX} 
                    y1={markerY} 
                    x2={panelX + panelWidth} 
                    y2={markerY} 
                    stroke={markerColor} 
                    strokeWidth="1" 
                    strokeDasharray="5,5"
                  />
                  
                  {/* Marker label on first panel only */}
                  {index === 0 && (
                    <text 
                      x={panelX - 5} 
                      y={markerY - 5} 
                      textAnchor="end" 
                      fill={markerColor} 
                      fontSize="12"
                    >
                      {marker.label}
                    </text>
                  )}
                </>
              )}
              
              {/* Width dimension (below cast-on) */}
              <line 
                x1={panelX} 
                y1={startY + panelHeight + 40} 
                x2={panelX + panelWidth} 
                y2={startY + panelHeight + 40} 
                stroke="#666" 
                strokeWidth="1"
              />
              <line 
                x1={panelX} 
                y1={startY + panelHeight + 35} 
                x2={panelX} 
                y2={startY + panelHeight + 45} 
                stroke="#666" 
                strokeWidth="1"
              />
              <line 
                x1={panelX + panelWidth} 
                y1={startY + panelHeight + 35} 
                x2={panelX + panelWidth} 
                y2={startY + panelHeight + 45} 
                stroke="#666" 
                strokeWidth="1"
              />
              <text 
                x={panelX + panelWidth / 2} 
                y={startY + panelHeight + 60} 
                textAnchor="middle" 
                fill="#666" 
                fontSize="12"
              >
                {panel.width.toFixed(1)}{unitLabel}
              </text>
            </g>
          );
        })}
        
        {/* Height dimension (on right side of last panel) */}
        {panels.length > 0 && (
          <>
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 20} 
              y1={startY} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 20} 
              y2={startY + panelHeight} 
              stroke="#666" 
              strokeWidth="1"
            />
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 15} 
              y1={startY} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 25} 
              y2={startY} 
              stroke="#666" 
              strokeWidth="1"
            />
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 15} 
              y1={startY + panelHeight} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 25} 
              y2={startY + panelHeight} 
              stroke="#666" 
              strokeWidth="1"
            />
            <text 
              x={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 30} 
              y={startY + panelHeight / 2 + 5} 
              fill="#666" 
              fontSize="12"
            >
              {panels[0].height.toFixed(1)}{unitLabel}
            </text>
          </>
        )}
        
        {/* Marker depth dimension (if marker exists) */}
        {marker && (
          <>
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 50} 
              y1={markerY} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 50} 
              y2={startY + panelHeight} 
              stroke={markerColor} 
              strokeWidth="1"
            />
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 45} 
              y1={markerY} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 55} 
              y2={markerY} 
              stroke={markerColor} 
              strokeWidth="1"
            />
            <line 
              x1={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 45} 
              y1={startY + panelHeight} 
              x2={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 55} 
              y2={startY + panelHeight} 
              stroke={markerColor} 
              strokeWidth="1"
            />
            <text 
              x={startX + (panels.length * (panelWidth + panelSpacing)) - panelSpacing + 60} 
              y={(markerY + startY + panelHeight) / 2 + 5} 
              fill={markerColor} 
              fontSize="12"
            >
              {marker.depthFromTop.toFixed(1)}{unitLabel}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
