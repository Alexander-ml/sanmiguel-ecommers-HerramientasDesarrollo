import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { Producto, PaginaRespuesta } from '../types';
import type { ProductoFormValues } from '../schemas/producto.schema';

interface FiltroProductos {
  busqueda?: string;
  categoriaId?: string;
  estado?: string;
  page?: number;
}

export function useProductos(filtros: FiltroProductos = {}) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda)   params.set('q', filtros.busqueda);
      if (filtros.categoriaId) params.set('categoriaId', filtros.categoriaId);
      if (filtros.estado)     params.set('estado', filtros.estado);
      if (filtros.page)       params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<Producto>>(`/productos?${params}`);
      return data;
    },
  });
}

export function useProducto(id: number | null) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Producto>(`/productos/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}

export function useGuardarProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, valores }: { id?: number; valores: ProductoFormValues }) => {
      if (id) {
        const { data } = await apiClient.put<Producto>(`/productos/${id}`, valores);
        return data;
      }
      const { data } = await apiClient.post<Producto>('/productos', valores);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useBajaProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete<Producto>(`/productos/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}
