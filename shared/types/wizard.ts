/**
 * Shared TypeScript types for wizard "lego block" components
 * These types ensure consistency across all wizards in the system
 */

export type Units = 'inches' | 'cm';

export interface GaugeSettings {
  units: Units;
  stitchesIn4: string;
  rowsIn4: string;
}

export interface GaugeCalculations {
  stitchesPerUnit: number;
  rowsPerUnit: number;
}

export interface WizardSizeOption {
  id: string;
  label: string;
  dimensions: {
    length: number;
    width: number;
  };
  category: string;
}

export interface CustomSize {
  length: string;
  width: string;
}

export interface WizardAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  className?: string;
  testId?: string;
}

export interface YarnEstimateInput {
  swatchWidth: string;
  swatchLength: string;
  swatchWeight: string;
}

export interface YarnEstimate {
  grams: number;
  balls: number;
  method: 'swatch' | 'rough' | 'none';
}

export interface WizardWarning {
  message: string;
  icon?: string;
  show: boolean;
}

export interface RadioOption {
  value: string;
  label: string;
  testId?: string;
}
