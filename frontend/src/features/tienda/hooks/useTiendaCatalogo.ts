import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { Categoria, Producto, Variante } from '../../catalogo/types';

/**
 * Hook para obtener las prendas más recientes (Novedades).
 */
export function useProductosNuevos(limite = 8) {
  return useQuery({
    queryKey: ['productos-nuevos', limite],
    queryFn: async () => {
      const { data } = await apiClient.get<{ datos: Producto[] }>('/productos?estado=activo&page=1');
      const productos = data.datos ?? [];
      return productos.slice(0, limite);
    },
  });
}

/**
 * Hook para obtener categorías principales para la exploración de la tienda.
 */
export function useCategoriasFeatured() {
  return useQuery({
    queryKey: ['categorias-publico-featured'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ datos: Categoria[] }>('/categorias?estado=activo&page=1');
      const todas = data.datos ?? [];
      // Solo categorías raíz principales
      return todas.filter((c) => !c.categoriaPadreId);
    },
  });
}

/**
 * Hook para catálogo con filtros en ColeccionesPage.
 */
export function useProductosPublico(filtros: { categoriaId?: string; busqueda?: string; page: number }) {
  return useQuery({
    queryKey: ['productos-publico', filtros],
    queryFn: async () => {
      const params = new URLSearchParams({ estado: 'activo', page: String(filtros.page) });
      if (filtros.categoriaId) params.set('categoriaId', filtros.categoriaId);
      if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
      const { data } = await apiClient.get<{ datos: Producto[]; total: number; totalPaginas: number }>(
        `/productos?${params}`,
      );
      return data;
    },
  });
}

/**
 * Hook para detalle de producto y resolución segura de variantes.
 */
export function useProductoDetalle(id: number) {
  return useQuery({
    queryKey: ['producto-detalle', id],
    queryFn: async () => {
      const [prodRes, varRes] = await Promise.all([
        apiClient.get<Producto>(`/productos/${id}`),
        apiClient.get<any>(`/productos/${id}/variantes`),
      ]);
      const raw = Array.isArray(varRes.data) ? varRes.data : varRes.data?.datos ?? [];
      return { producto: prodRes.data, variantes: raw as Variante[] };
    },
    enabled: id > 0,
  });
}

/**
 * Hook para carga rápida de variantes en modales de compra rápida.
 */
export function useVariantesRapidas(productoId: number | null) {
  return useQuery({
    queryKey: ['variantes-rapidas', productoId],
    queryFn: async () => {
      if (!productoId) return [];
      const { data } = await apiClient.get<any>(`/productos/${productoId}/variantes`);
      const raw = Array.isArray(data) ? data : data?.datos ?? [];
      return raw as Variante[];
    },
    enabled: !!productoId,
  });
}

/**
 * Hook para consultar el stock disponible en inventario.
 */
export function useStockInventario() {
  return useQuery({
    queryKey: ['inventario-stock-publico'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ datos: any[] }>('/inventario/stock?page=1');
      return data.datos ?? [];
    },
  });
}
