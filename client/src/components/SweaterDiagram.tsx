interface SweaterDiagramProps {
  castOnStitches: number;
  necklineStitches: number;
  preNeckRows: number;
  necklineRows: number;
  units: 'inches' | 'centimeters';
}

export default function SweaterDiagram({ 
  castOnStitches, 
  necklineStitches, 
  preNeckRows, 
  necklineRows, 
  units 
}: SweaterDiagramProps) {
  const unitLabel = units === 'inches' ? '"' : 'cm';
  
  return (
    <div className="diagram-container" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <svg 
        viewBox="0 0 400 360" 
        style={{ width: '100%', height: 'auto' }}
        data-testid="svg-sweater-diagram"
      >
        {/* Main sweater body */}
        <rect 
          x="50" 
          y="100" 
          width="300" 
          height="225" 
          fill="#e6f3ff" 
          stroke="#2c5282" 
          strokeWidth="2"
        />
        
        {/* Neckline cutout */}
        <rect 
          x="175" 
          y="100" 
          width="150" 
          height="120" 
          fill="#ffe6f3" 
          stroke="#2c5282" 
          strokeWidth="2"
        />
        
        {/* Cast-on width label */}
        <line x1="50" y1="85" x2="350" y2="85" stroke="#2c5282" strokeWidth="1" />
        <line x1="50" y1="80" x2="50" y2="90" stroke="#2c5282" strokeWidth="1" />
        <line x1="350" y1="80" x2="350" y2="90" stroke="#2c5282" strokeWidth="1" />
        <text x="200" y="78" textAnchor="middle" fontSize="12" fill="#2c5282" fontWeight="600">
          Cast On: 10{unitLabel} ({castOnStitches} sts)
        </text>
        
        {/* Pre-neck height label */}
        <line x1="35" y1="100" x2="35" y2="220" stroke="#2c5282" strokeWidth="1" />
        <line x1="30" y1="100" x2="40" y2="100" stroke="#2c5282" strokeWidth="1" />
        <line x1="30" y1="220" x2="40" y2="220" stroke="#2c5282" strokeWidth="1" />
        <text x="25" y="165" textAnchor="middle" fontSize="10" fill="#2c5282" fontWeight="600" transform="rotate(-90, 25, 165)">
          Pre-neck: 5{unitLabel} ({preNeckRows} rows)
        </text>
        
        {/* Neckline depth label */}
        <line x1="365" y1="100" x2="365" y2="220" stroke="#2c5282" strokeWidth="1" />
        <line x1="360" y1="100" x2="370" y2="100" stroke="#2c5282" strokeWidth="1" />
        <line x1="360" y1="220" x2="370" y2="220" stroke="#2c5282" strokeWidth="1" />
        <text x="375" y="165" textAnchor="middle" fontSize="10" fill="#2c5282" fontWeight="600" transform="rotate(90, 375, 165)">
          Neck: 4{unitLabel} ({necklineRows} rows)
        </text>
        
        {/* Neckline width label */}
        <line x1="175" y1="340" x2="325" y2="340" stroke="#2c5282" strokeWidth="1" />
        <line x1="175" y1="335" x2="175" y2="345" stroke="#2c5282" strokeWidth="1" />
        <line x1="325" y1="335" x2="325" y2="345" stroke="#2c5282" strokeWidth="1" />
        <text x="250" y="355" textAnchor="middle" fontSize="12" fill="#2c5282" fontWeight="600">
          Neckline: 5{unitLabel} ({necklineStitches} sts)
        </text>
      </svg>
    </div>
  );
}