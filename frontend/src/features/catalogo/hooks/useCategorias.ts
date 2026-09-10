import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { Categoria, PaginaRespuesta } from '../types';
import type { CategoriaFormValues } from '../schemas/categoria.schema';

interface FiltroCategorias {
  busqueda?: string;
  activo?: string;
  page?: number;
}

export function useCategorias(filtros: FiltroCategorias = {}) {
  return useQuery({
    queryKey: ['categorias', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set('q', filtros.busqueda);
      if (filtros.activo !== undefined) params.set('activo', filtros.activo);
      if (filtros.page) params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<Categoria>>(`/categorias?${params}`);
      return data;
    },
  });
}

export function useCategoria(id: number | null) {
  return useQuery({
    queryKey: ['categorias', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Categoria>(`/categorias/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}

export function useGuardarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, valores }: { id?: number; valores: CategoriaFormValues }) => {
      const payload = { ...valores, activo: true };
      if (id) {
        const { data } = await apiClient.put<Categoria>(`/categorias/${id}`, payload);
        return data;
      }
      const { data } = await apiClient.post<Categoria>('/categorias', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useBajaCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete<Categoria>(`/categorias/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}
