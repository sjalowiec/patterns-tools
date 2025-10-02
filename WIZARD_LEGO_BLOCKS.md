# Wizard Lego Blocks Documentation

## Overview

This document describes the reusable "lego block" components for building wizards in the Wizard Builder system. All wizards should use these standardized components to ensure consistency in design, behavior, and user experience.

## Design System

All wizard components use a unified olive green theme controlled via CSS variables in `client/src/index.css`:

```css
--wizard-primary: #52682d;        /* Olive green */
--wizard-primary-dark: #3d4d21;
--wizard-accent-bg: rgba(82, 104, 45, 0.2);
--wizard-label-color: #999;
--wizard-lifeline-bg: rgba(82, 104, 45, 0.2);
```

### Key CSS Classes

- `.size-card` - Card-based size selector with hover and selection states
- `.category-header` - Category headers with decorative left border
- `.form-control::placeholder` - Styled placeholders (13px, #999 color)
- `.btn-round` - Round icon buttons (56px for mobile-friendly touch targets)
- `.no-print` - Hide elements when printing

## Components

### 1. GaugeInputs

Gauge measurement inputs with dynamic placeholders based on unit selection.

**Import:**
```typescript
import { GaugeInputs } from '@/components/lego';
```

**Props:**
```typescript
interface GaugeInputsProps {
  units: 'inches' | 'cm';
  stitchesIn4: string;
  rowsIn4: string;
  onStitchesChange: (value: string) => void;
  onRowsChange: (value: string) => void;
  stitchesTestId?: string;
  rowsTestId?: string;
}
```

**Usage Example:**
```tsx
<GaugeInputs
  units={units}
  stitchesIn4={stitchesIn4}
  rowsIn4={rowsIn4}
  onStitchesChange={setStitchesIn4}
  onRowsChange={setRowsIn4}
  stitchesTestId="input-stitches"
  rowsTestId="input-rows"
/>
```

**Features:**
- Dynamic placeholders: Shows "stitches per 4"" or "stitches per 10cm" based on unit selection
- Styled with smaller, lighter placeholders (13px, #999)
- Labels: "Stitch Gauge" and "Row Gauge"

---

### 2. RadioGroup

Styled radio button group with olive green accent color.

**Import:**
```typescript
import { RadioGroup } from '@/components/lego';
```

**Props:**
```typescript
interface RadioGroupProps {
  name: string;
  options: Array<{
    value: string;
    label: string;
    testId?: string;
  }>;
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
}
```

**Usage Example:**
```tsx
<RadioGroup
  name="units"
  label="Measurement Units"
  options={[
    { value: 'inches', label: 'Inches', testId: 'radio-inches' },
    { value: 'cm', label: 'Centimeters', testId: 'radio-cm' }
  ]}
  selectedValue={units}
  onChange={(value) => setUnits(value as 'inches' | 'cm')}
/>
```

**Features:**
- Olive green accent color matching wizard theme
- Horizontal layout with proper spacing
- Auto-generated test IDs if not provided

---

### 3. SizeSelector

Card-based size selector with category grouping and selection indicators.

**Import:**
```typescript
import { SizeSelector } from '@/components/lego';
import { getSizeOptions } from '@shared/sizing';
```

**Props:**
```typescript
interface SizeSelectorProps {
  units: 'inches' | 'cm';
  selectedSize: string;
  onSizeChange: (size: string) => void;
  sizeOptions: Array<{key: string, label: string, category: string}>;
  categories: string[];
}
```

**Usage Example:**
```tsx
const sizeOptions = getSizeOptions();
const categories = Array.from(new Set(sizeOptions.map(opt => opt.category)));

<SizeSelector
  units={units}
  selectedSize={selectedSize}
  onSizeChange={setSelectedSize}
  sizeOptions={sizeOptions}
  categories={categories}
/>
```

**Features:**
- Category headers with decorative left border
- Responsive grid layout (auto-fill, minmax(160px, 1fr))
- Hover and selection states
- Check indicator on selected card
- Automatic unit conversion for display

---

### 4. RoundIconButton

Round icon button with 56px size for mobile-friendly touch targets.

**Import:**
```typescript
import { RoundIconButton } from '@/components/lego';
```

**Props:**
```typescript
interface RoundIconButtonProps {
  icon: string;          // Font Awesome class (e.g., 'fas fa-print')
  label: string;
  onClick: () => void;
  className?: string;    // Default: 'btn-round-primary'
  testId?: string;
}
```

**Usage Example:**
```tsx
<RoundIconButton
  icon="fas fa-print"
  label="Print"
  onClick={handlePrint}
  className="btn-round-primary"
  testId="button-print"
/>
```

**Available Classes:**
- `btn-round-primary` - Olive green gradient
- `btn-round-gray` - Gray for secondary actions (e.g., Start Over)

**Features:**
- 56px size for better mobile touch targets
- Icon with label below
- `touch-action: manipulation` for mobile

---

### 5. WizardActionBar

Action bar with optional warning box and action buttons in flex layout.

**Import:**
```typescript
import { WizardActionBar } from '@/components/lego';
import type { WizardWarning, WizardAction } from '@shared/types/wizard';
```

**Props:**
```typescript
interface WizardActionBarProps {
  warning?: WizardWarning;
  actions: WizardAction[];
}

interface WizardWarning {
  message: string;
  icon?: string;
  show: boolean;
}

interface WizardAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  className?: string;
  testId?: string;
}
```

**Usage Example:**
```tsx
<WizardActionBar
  warning={{
    message: 'Your pattern will be lost! Make sure to download your PDF before leaving.',
    icon: 'fas fa-exclamation-triangle',
    show: hasUserData
  }}
  actions={[
    {
      id: 'print',
      label: 'Print',
      icon: 'fas fa-print',
      onClick: handlePrint,
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
    },
    {
      id: 'startover',
      label: 'Start Over',
      icon: 'fas fa-redo',
      onClick: handleStartOver,
      className: 'btn-round-gray',
      testId: 'button-startover'
    }
  ]}
/>
```

**Features:**
- Warning box on left, action buttons on right
- Responsive layout (flexwrap for mobile)
- Hidden on print (`no-print` class)
- Optional warning with icon

---

### 6. SchematicWrapper

Wrapper component for SVG schematic diagrams with centered layout and proper sizing.

**Import:**
```typescript
import { SchematicWrapper } from '@/components/lego';
```

**Props:**
```typescript
interface SchematicWrapperProps {
  svgHtml: string;
  testId?: string;
}
```

**Usage Example:**
```tsx
<div className="well_white">
  <h3 className="text-primary">Schematic Diagram</h3>
  <SchematicWrapper 
    svgHtml={replacePlaceholders(generateDiagram())}
    testId="schematic-diagram"
  />
</div>
```

**Features:**
- Centered layout using `textAlign: 'center'`
- Consistent padding (20px) around SVG
- Properly sizes SVG diagrams across all wizards
- Uses `dangerouslySetInnerHTML` for SVG content injection
- Includes schematic ID for styling/targeting

**Important Notes:**
- Do NOT use flex containers around SchematicWrapper - this constrains SVG width
- SVG sizing is controlled by viewBox and max-width in the SVG itself
- All wizards should use this wrapper for consistent diagram display

---

## Hooks

### useGaugeCalculations

Hook for calculating per-unit gauge values from 4"/10cm measurements.

**Import:**
```typescript
import { useGaugeCalculations } from '@/components/lego';
```

**Usage:**
```typescript
const { stitchesPerUnit, rowsPerUnit } = useGaugeCalculations(
  stitchesIn4,
  rowsIn4
);

// Calculate stitch and row counts
const widthSts = Math.round(width * stitchesPerUnit);
const lengthRows = Math.round(length * rowsPerUnit);
```

---

## Shared Types

All wizard types are defined in `shared/types/wizard.ts`:

```typescript
import type {
  Units,
  GaugeSettings,
  GaugeCalculations,
  WizardSizeOption,
  CustomSize,
  WizardAction,
  YarnEstimateInput,
  YarnEstimate,
  WizardWarning,
  RadioOption
} from '@shared/types/wizard';
```

---

## CSS Utilities

### Size Card Styles

Already defined in `client/src/index.css`:

```css
.size-card {
  position: relative;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.size-card.selected {
  border-color: var(--accent);
  background: var(--wizard-accent-bg);
}
```

### Category Header Styles

```css
.category-header {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin: 20px 0 12px 0;
  padding-left: 12px;
  border-left: 4px solid var(--accent);
}
```

---

## Building a New Wizard

**Step 1:** Import lego blocks and types
```typescript
import {
  GaugeInputs,
  RadioGroup,
  SchematicWrapper,
  SizeSelector,
  WizardActionBar,
  useGaugeCalculations
} from '@/components/lego';
import type { Units, WizardAction } from '@shared/types/wizard';
```

**Step 2:** Set up state
```typescript
const [units, setUnits] = useState<Units>('inches');
const [stitchesIn4, setStitchesIn4] = useState<string>('');
const [rowsIn4, setRowsIn4] = useState<string>('');
const [selectedSize, setSelectedSize] = useState<string>('');
```

**Step 3:** Calculate gauge
```typescript
const { stitchesPerUnit, rowsPerUnit } = useGaugeCalculations(
  stitchesIn4,
  rowsIn4
);
```

**Step 4:** Use lego blocks in your JSX
```tsx
<div className="well_white">
  <h2 className="text-primary">Gauge Settings</h2>
  
  <RadioGroup
    name="units"
    label="Measurement Units"
    options={[
      { value: 'inches', label: 'Inches' },
      { value: 'cm', label: 'Centimeters' }
    ]}
    selectedValue={units}
    onChange={(value) => setUnits(value as Units)}
  />
  
  <GaugeInputs
    units={units}
    stitchesIn4={stitchesIn4}
    rowsIn4={rowsIn4}
    onStitchesChange={setStitchesIn4}
    onRowsChange={setRowsIn4}
  />
</div>
```

---

## Navigation Component

The navigation component in `client/src/App.tsx` provides wizard switching:

```typescript
import { Link, useLocation } from 'wouter';

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav style={{ backgroundColor: 'var(--accent)', ... }}>
      <h1>Wizard Builder</h1>
      <div>
        <Link href="/">Neckline/Shoulder Practice</Link>
        <Link href="/blanket">Blanket Pattern</Link>
      </div>
    </nav>
  );
}
```

---

## Print Styles

Use the `no-print` class to hide elements when printing:

```css
@media print {
  .no-print {
    display: none !important;
  }
}
```

---

## Best Practices

1. **Always use the lego blocks** - Don't recreate components from scratch
2. **Follow the color system** - Use CSS variables from `index.css`
3. **Add test IDs** - Include `data-testid` for all interactive elements
4. **Mobile-friendly** - Use 56px touch targets for buttons
5. **Consistent spacing** - Use the established gap/padding patterns
6. **Placeholder styling** - Smaller (13px), lighter (#999) placeholders
7. **Category grouping** - Use `SizeSelector` pattern for organized size selection
8. **Dynamic content** - Update placeholders based on user selections (units, etc.)

---

## Future Wizard Ideas

Using these lego blocks, you can quickly build:
- Sweater Pattern Wizard
- Hat Pattern Wizard
- Scarf Pattern Wizard
- Shawl Pattern Wizard
- Sock Pattern Wizard

Each wizard will automatically have:
- Consistent design and theming
- Mobile-friendly interactions
- Print support
- Unit conversion
- Size selection patterns
