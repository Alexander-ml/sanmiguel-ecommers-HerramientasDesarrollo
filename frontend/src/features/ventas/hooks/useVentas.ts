import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type {
  Venta, PaginaRespuesta, DevolucionVenta,
  ResumenVentas, ProductoMasVendido, VentaPorMetodo, VentaPorVendedor, VentaPorCliente,
} from '../types';
import type { VentaFormValues } from '../schemas/venta.schema';
import type { DevolucionVentaFormValues } from '../schemas/devolucion.schema';
import { useAuthStore } from '../../auth/store/useAuthStore';

// ── Listado ────────────────────────────────────────────────────────────────────
interface FiltroVentas {
  estado?: string;
  cliente?: string;
  vendedorId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
}

export function useVentas(filtros: FiltroVentas = {}) {
  return useQuery({
    queryKey: ['ventas', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.estado)    params.set('estado', filtros.estado);
      if (filtros.cliente)   params.set('cliente', filtros.cliente);
      if (filtros.vendedorId) params.set('vendedorId', filtros.vendedorId);
      if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta);
      if (filtros.page)      params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<Venta>>(`/ventas?${params}`);
      return data;
    },
  });
}

export function useVenta(id: number | null) {
  return useQuery({
    queryKey: ['ventas', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Venta & { devoluciones: DevolucionVenta[] }>(`/ventas/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}

// ── Registrar venta ────────────────────────────────────────────────────────────
export function useRegistrarVenta() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async (valores: VentaFormValues) => {
      const payload = {
        ...valores,
        vendedorId: usuario?.id ?? 0,
        vendedorNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post<Venta>('/ventas', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
}

// ── Cancelar venta ─────────────────────────────────────────────────────────────
export function useCancelarVenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.post<Venta>(`/ventas/${id}/cancelar`, {});
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
}

// ── Confirmar pago manual (transferencia) ──────────────────────────────────────
export function useConfirmarPago() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, referencia }: { id: number; referencia?: string }) => {
      const { data } = await apiClient.post<Venta>(`/ventas/${id}/confirmar-pago`, { referencia });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

// ── Devolucion ─────────────────────────────────────────────────────────────────
export function useRegistrarDevolucion(ventaId: number) {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async (valores: DevolucionVentaFormValues) => {
      const payload = {
        ...valores,
        usuarioId: usuario?.id ?? 0,
        usuarioNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post<DevolucionVenta>(`/ventas/${ventaId}/devoluciones`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas', ventaId] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
}

// ── Reportes ───────────────────────────────────────────────────────────────────
interface FiltroReporte {
  fechaDesde?: string;
  fechaHasta?: string;
}

export function useResumenVentas(filtros: FiltroReporte = {}) {
  return useQuery({
    queryKey: ['ventas-resumen', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta);
      const { data } = await apiClient.get<ResumenVentas>(`/ventas/reportes/resumen?${params}`);
      return data;
    },
  });
}

export function useProductosMasVendidos() {
  return useQuery({
    queryKey: ['ventas-productos'],
    queryFn: async () => {
      const { data } = await apiClient.get<ProductoMasVendido[]>('/ventas/reportes/productos-vendidos');
      return data;
    },
  });
}

export function useVentasPorMetodo() {
  return useQuery({
    queryKey: ['ventas-metodo'],
    queryFn: async () => {
      const { data } = await apiClient.get<VentaPorMetodo[]>('/ventas/reportes/por-metodo');
      return data;
    },
  });
}

export function useVentasPorVendedor() {
  return useQuery({
    queryKey: ['ventas-vendedor'],
    queryFn: async () => {
      const { data } = await apiClient.get<VentaPorVendedor[]>('/ventas/reportes/por-vendedor');
      return data;
    },
  });
}

export function useVentasPorCliente() {
  return useQuery({
    queryKey: ['ventas-cliente'],
    queryFn: async () => {
      const { data } = await apiClient.get<VentaPorCliente[]>('/ventas/reportes/por-cliente');
      return data;
    },
  });
}
