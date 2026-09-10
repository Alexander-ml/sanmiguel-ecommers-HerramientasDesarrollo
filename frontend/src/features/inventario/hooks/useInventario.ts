import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type {
  Stock, PaginaRespuesta, MovimientoInventario,
  AlertaStock, ItemRotacion, ReporteValorizado,
} from '../types';
import type { AjusteStockFormValues } from '../schemas/ajusteStock.schema';
import type { UmbralAlertaFormValues } from '../schemas/umbralAlerta.schema';
import { useAuthStore } from '../../auth/store/useAuthStore';

// ── Stock ──────────────────────────────────────────────────────────────────────
interface FiltroStock {
  busqueda?: string;
  estado?: string;
  page?: number;
}

export function useStock(filtros: FiltroStock = {}) {
  return useQuery({
    queryKey: ['stock', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set('q', filtros.busqueda);
      if (filtros.estado)   params.set('estado', filtros.estado);
      if (filtros.page)     params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<Stock>>(`/inventario/stock?${params}`);
      return data;
    },
  });
}

// ── Movimientos ────────────────────────────────────────────────────────────────
interface FiltroMovimientos {
  varianteId?: number;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
}

export function useMovimientos(filtros: FiltroMovimientos = {}) {
  return useQuery({
    queryKey: ['movimientos', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.varianteId) params.set('varianteId', String(filtros.varianteId));
      if (filtros.tipo)       params.set('tipo', filtros.tipo);
      if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta);
      if (filtros.page)       params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<MovimientoInventario>>(
        `/inventario/movimientos?${params}`,
      );
      return data;
    },
  });
}

// ── Ajuste manual de stock ─────────────────────────────────────────────────────
export function useAjustarStock() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async (valores: AjusteStockFormValues) => {
      const payload = {
        ...valores,
        usuarioId: usuario?.id ?? 0,
        usuarioNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post('/inventario/ajuste', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
      qc.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
}

// ── Alertas ────────────────────────────────────────────────────────────────────
export function useAlertas() {
  return useQuery({
    queryKey: ['alertas'],
    queryFn: async () => {
      const { data } = await apiClient.get<AlertaStock[]>('/inventario/alertas');
      return data;
    },
  });
}

export function useConfigurarUmbral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ varianteId, valores }: { varianteId: number; valores: UmbralAlertaFormValues }) => {
      const { data } = await apiClient.put(`/inventario/alertas/${varianteId}`, valores);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alertas'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

// ── Reportes ───────────────────────────────────────────────────────────────────
export function useReporteRotacion() {
  return useQuery({
    queryKey: ['reporte-rotacion'],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemRotacion[]>('/inventario/reportes/rotacion');
      return data;
    },
  });
}

export function useReporteValorizado() {
  return useQuery({
    queryKey: ['reporte-valorizado'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReporteValorizado>('/inventario/reportes/valorizado');
      return data;
    },
  });
}
