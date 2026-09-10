import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { Variante } from '../types';
import type { VarianteFormValues } from '../schemas/variante.schema';

export function useVariantes(productoId: number | null) {
  return useQuery({
    queryKey: ['variantes', productoId],
    queryFn: async () => {
      const { data } = await apiClient.get<Variante[]>(`/productos/${productoId}/variantes`);
      return data;
    },
    enabled: productoId !== null,
  });
}

export function useGuardarVariante(productoId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, valores }: { id?: number; valores: VarianteFormValues }) => {
      if (id) {
        // En edición NO se envía el SKU (el handler lo ignora por RN-INV-02)
        const { sku: _sku, ...resto } = valores;
        const { data } = await apiClient.put<Variante>(`/variantes/${id}`, resto);
        return data;
      }
      const { data } = await apiClient.post<Variante>(`/productos/${productoId}/variantes`, valores);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variantes', productoId] });
      // Invalida stock también ya que una variante nueva tendrá stock 0
      qc.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

export function useBajaVariante(productoId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete<Variante>(`/variantes/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variantes', productoId] });
    },
  });
}
