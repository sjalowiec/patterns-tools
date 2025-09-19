import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { GaugeCalculation, InsertGaugeCalculation } from '@shared/schema';

interface GaugeData {
  units: 'inches' | 'centimeters';
  stitchGauge: number;
  rowGauge: number;
}

export function useCreateGaugeCalculation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: GaugeData): Promise<GaugeCalculation> => {
      const requestData: InsertGaugeCalculation = {
        units: data.units,
        stitchGauge: data.stitchGauge,
        rowGauge: data.rowGauge
      };
      
      const response = await apiRequest('POST', '/api/calculations', requestData);
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch recent calculations
      queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
    },
  });
}

export function useRecentGaugeCalculations(limit: number = 10) {
  return useQuery<GaugeCalculation[]>({
    queryKey: ['/api/calculations', `limit=${limit}`],
  });
}

export function useGaugeCalculation(id: string) {
  return useQuery<GaugeCalculation>({
    queryKey: ['/api/calculations', id],
    enabled: !!id,
  });
}