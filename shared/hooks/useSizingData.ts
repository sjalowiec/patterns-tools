import { useState, useEffect } from 'react';

/**
 * REUSABLE JSON SIZING PATTERN
 * ============================
 * This hook loads sizing data from ANY JSON file and makes it available to your wizard.
 * 
 * HOW TO USE FOR OTHER WIZARDS:
 * 
 * 1. Create your JSON file (e.g., sweater-sizes.json, hat-sizes.json) with this structure:
 *    [
 *      {
 *        "size": "Small",           // Required: size name
 *        "chest": 36,               // Your measurement fields (any names)
 *        "length": 24,              // Can be any field names
 *        "note": "optional field"   // Optional fields are fine
 *      }
 *    ]
 * 
 * 2. Put the JSON file in: public/data/your-file.json
 * 
 * 3. Use this hook in your wizard component:
 *    const { sizes, loading, error } = useSizingData('your-file.json');
 * 
 * 4. Access fields from the returned data (all field names normalized to lowercase):
 *    sizes.map(s => s.chest)  // For sweaters
 *    sizes.map(s => s.length) // For blankets
 * 
 * FEATURES:
 * - Handles flexible JSON structure (Width -> width, LENGTH -> length, etc.)
 * - Auto-categorizes sizes based on keywords in size names
 * - Converts numeric strings to numbers automatically
 * - Works with any measurement fields - not limited to specific fields
 * - Won't break if you add new fields to JSON later
 */

export interface SizingData {
  size: string;              // Display name (e.g., "Adult Throw", "Small", etc.)
  category: string;          // Auto-assigned category based on size name
  [key: string]: string | number;  // All other fields from JSON (normalized to lowercase keys)
}

interface UseSizingDataResult {
  sizes: SizingData[];
  loading: boolean;
  error: string | null;
}

/**
 * Auto-categorize sizes based on name keywords
 * This groups sizes for display (Baby, Child, Throw, etc.)
 */
function categorizeSize(sizeName: string): string {
  const name = sizeName.toLowerCase();
  
  // Baby/infant sizes
  if (name.includes('preemie') || name.includes('bassinet') || 
      name.includes('cradle') || name.includes('crib') || 
      name.includes('newborn') || name.includes('infant')) {
    return 'Baby';
  }
  
  // Child sizes
  if (name.includes('child') || name.includes('toddler') || 
      name.includes('kid') || name.includes('youth')) {
    return 'Child';
  }
  
  // Throw/blanket sizes
  if (name.includes('throw') || name.includes('afghan') || 
      name.includes('lapghan')) {
    return 'Throw';
  }
  
  // Adult sizes (for sweaters, hats, etc.)
  if (name.includes('adult') || name.includes('small') || 
      name.includes('medium') || name.includes('large') || 
      name.includes('xl')) {
    return 'Adult';
  }
  
  // Default category
  return 'Custom';
}

/**
 * Normalize field names from JSON to consistent lowercase
 * Handles: Width->width, LENGTH->length, etc.
 */
function normalizeFieldName(fieldName: string): string {
  return fieldName.toLowerCase();
}

/**
 * Convert string values to numbers where appropriate
 * This ensures numeric fields are actual numbers, not strings
 */
function parseNumericValue(value: any): string | number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return value;
}

/**
 * Main hook: Load and normalize sizing data from JSON file
 * 
 * @param jsonFileName - Name of JSON file in public/data/ (e.g., 'blanket-sizes.json')
 * @returns Normalized sizing data, loading state, and any errors
 */
export function useSizingData(jsonFileName: string): UseSizingDataResult {
  const [sizes, setSizes] = useState<SizingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the JSON file from public/data folder
    async function loadSizingData() {
      try {
        setLoading(true);
        setError(null);
        
        // Add cache busting parameter to ensure fresh load
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(`/data/${jsonFileName}${cacheBuster}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${jsonFileName}: ${response.statusText}`);
        }
        
        const rawData = await response.json();
        
        // Normalize the data - handle flexible field names and convert numbers
        const normalizedSizes: SizingData[] = rawData.map((item: any) => {
          // Start with normalized data
          const normalized: any = {};
          
          // Copy all fields with normalized names and parsed numbers
          Object.keys(item).forEach(key => {
            const normalizedKey = normalizeFieldName(key);
            normalized[normalizedKey] = parseNumericValue(item[key]);
          });
          
          // Ensure required fields exist
          if (!normalized.size) {
            console.warn('Size entry missing "size" field:', item);
            normalized.size = 'Unknown';
          }
          
          // Auto-categorize if no category provided
          if (!normalized.category) {
            normalized.category = categorizeSize(normalized.size);
          }
          
          return normalized as SizingData;
        });
        
        setSizes(normalizedSizes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sizing data');
        console.error('Error loading sizing data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadSizingData();
  }, [jsonFileName]);

  return { sizes, loading, error };
}
