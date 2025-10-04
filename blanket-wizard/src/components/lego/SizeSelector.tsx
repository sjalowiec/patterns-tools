import { type Units } from '@shared/types/wizard';

export interface SizeOptionWithData {
  key: string;
  name: string;
  width: number;      // Always in inches
  length: number;     // Always in inches
  category: string;
}

interface SizeSelectorProps {
  units: Units;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  sizeOptions: SizeOptionWithData[];
  categories: string[];
  label?: string;
  radioName?: string;
}

/**
 * SizeSelector - Reusable lego block for card-based size selection
 * Features category grouping, hover states, and selection indicators
 * 
 * NOTE: Expects size dimensions in inches - will auto-convert for display based on units
 */
export function SizeSelector({
  units,
  selectedSize,
  onSizeChange,
  sizeOptions,
  categories,
  label = 'Select Size',
  radioName = 'itemSize'
}: SizeSelectorProps) {
  return (
    <div className="form-group">
      <label style={{ marginBottom: '15px', display: 'block' }}>{label}</label>
      
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
              {sizeOptions
                .filter(opt => opt.category === category)
                .map(option => {
                  const isSelected = selectedSize === option.key;
                  const unitLabel = units === 'inches' ? '"' : 'cm';
                  const width = units === 'inches' ? option.width : Math.round(option.width * 2.54);
                  const length = units === 'inches' ? option.length : Math.round(option.length * 2.54);
                  
                  return (
                    <label 
                      key={option.key}
                      className={`size-card ${isSelected ? 'selected' : ''}`}
                      data-testid={`card-size-${option.key}`}
                    >
                      {/* Hidden Radio Button */}
                      <input
                        type="radio"
                        name={radioName}
                        value={option.key}
                        checked={isSelected}
                        onChange={(e) => onSizeChange(e.target.value)}
                        style={{ 
                          position: 'absolute', 
                          opacity: 0, 
                          width: 0, 
                          height: 0 
                        }}
                        data-testid={`radio-size-${option.key}`}
                      />
                      
                      {/* Size Name */}
                      <div className="size-name">
                        {option.name}
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
  );
}
