/**
 * Sizing tables and utilities for knitting patterns
 * Reusable module for all pattern wizards
 */

export interface SizeData {
  name: string;
  length: number;
  width: number;
  category: string;
}

export interface SizeSelection {
  size: string;
  dimensions: {
    length: number;
    width: number;
  };
  category: string;
}

// Blanket sizing chart - all measurements in inches
export const blanketSizes: Record<string, SizeData> = {
  "adult-throw": { 
    name: "Adult Throw", 
    length: 78, 
    width: 48, 
    category: "Throw" 
  },
  "bassinet": { 
    name: "Bassinet", 
    length: 36, 
    width: 16, 
    category: "Baby" 
  },
  "child": { 
    name: "Child", 
    length: 48, 
    width: 42, 
    category: "Child" 
  },
  "cradle": { 
    name: "Cradle", 
    length: 36, 
    width: 20, 
    category: "Baby" 
  },
  "crib": { 
    name: "Crib", 
    length: 54, 
    width: 30, 
    category: "Baby" 
  },
  "large-preemie": { 
    name: "Large Preemie", 
    length: 36, 
    width: 36, 
    category: "Baby" 
  },
  "small-preemie": { 
    name: "Small Preemie", 
    length: 24, 
    width: 24, 
    category: "Baby" 
  },
  "standard-throw": { 
    name: "Standard Throw", 
    length: 60, 
    width: 48, 
    category: "Throw" 
  },
  "toddler": { 
    name: "Toddler or Lapghan", 
    length: 48, 
    width: 36, 
    category: "Child" 
  }
};

/**
 * Get size data by key
 * @param sizeKey - The size key (e.g., "adult-throw")
 * @returns Size data or null if not found
 */
export function getSizeData(sizeKey: string): SizeData | null {
  return blanketSizes[sizeKey] || null;
}

/**
 * Get all sizes grouped by category
 * @returns Object with categories as keys and size arrays as values
 */
export function getSizesByCategory(): Record<string, SizeData[]> {
  const categories: Record<string, SizeData[]> = {};
  
  Object.values(blanketSizes).forEach(size => {
    if (!categories[size.category]) {
      categories[size.category] = [];
    }
    categories[size.category].push(size);
  });
  
  return categories;
}

/**
 * Get all available size options for dropdowns
 * @returns Array of size options with display names
 */
export function getSizeOptions(): Array<{key: string, label: string, category: string}> {
  return Object.entries(blanketSizes).map(([key, data]) => ({
    key,
    label: data.name,
    category: data.category
  }));
}

/**
 * Convert dimensions to different units
 * @param dimensions - Dimensions in inches
 * @param targetUnit - Target unit ('inches' or 'cm')
 * @returns Converted dimensions
 */
export function convertDimensions(
  dimensions: { length: number; width: number }, 
  targetUnit: 'inches' | 'cm'
): { length: number; width: number } {
  if (targetUnit === 'cm') {
    return {
      length: Math.round(dimensions.length * 2.54 * 10) / 10,
      width: Math.round(dimensions.width * 2.54 * 10) / 10
    };
  }
  return dimensions; // Already in inches
}

/**
 * Create a size selection object
 * @param sizeKey - The selected size key
 * @param units - Display units ('inches' or 'cm')
 * @returns Complete size selection data
 */
export function createSizeSelection(
  sizeKey: string, 
  units: 'inches' | 'cm' = 'inches'
): SizeSelection | null {
  const sizeData = getSizeData(sizeKey);
  if (!sizeData) return null;
  
  const dimensions = convertDimensions(
    { length: sizeData.length, width: sizeData.width }, 
    units
  );
  
  return {
    size: sizeData.name,
    dimensions,
    category: sizeData.category
  };
}