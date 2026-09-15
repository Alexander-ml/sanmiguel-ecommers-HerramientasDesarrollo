import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { Pedido, PaginaRespuesta, ResumenPedidos, EstadoPedido, PedidoSeguimientoPublico } from '../types';

// ── Listado admin ──────────────────────────────────────────────────────────────
interface FiltroPedidos {
  estado?: string;
  cliente?: string;
  codigo?: string;
  page?: number;
}

export function usePedidos(filtros: FiltroPedidos = {}) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.estado)  params.set('estado', filtros.estado);
      if (filtros.cliente) params.set('cliente', filtros.cliente);
      if (filtros.codigo)  params.set('codigo', filtros.codigo);
      if (filtros.page)    params.set('page', String(filtros.page));
      const { data } = await apiClient.get<PaginaRespuesta<Pedido>>(`/pedidos?${params}`);
      return data;
    },
  });
}

export function usePedido(id: number | null) {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Pedido>(`/pedidos/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}

// ── Seguimiento público por código (RF-TIE-018) ────────────────────────────────
export function useSeguimientoPedido(codigo: string) {
  return useQuery({
    queryKey: ['pedido-seguimiento', codigo],
    queryFn: async () => {
      const { data } = await apiClient.get<PedidoSeguimientoPublico>(`/pedidos/seguimiento/${codigo}`);
      return data;
    },
    enabled: codigo.length > 3,
    retry: false,
  });
}

// ── Mis pedidos (cliente autenticado) ─────────────────────────────────────────
export function useMisPedidos(clienteId: number | null) {
  return useQuery({
    queryKey: ['mis-pedidos', clienteId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ datos: Pedido[] }>(`/pedidos/mis-pedidos?clienteId=${clienteId}`);
      return data.datos;
    },
    enabled: clienteId !== null,
  });
}

// ── Actualizar estado (admin/vendedor — RF-TIE-015, RF-TIE-016) ───────────────
export function useActualizarEstadoPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: EstadoPedido }) => {
      const { data } = await apiClient.patch<Pedido>(`/pedidos/${id}/estado`, { estado });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pedidos'] });
      qc.invalidateQueries({ queryKey: ['pedidos-resumen'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

// ── Reportes ───────────────────────────────────────────────────────────────────
export function useResumenPedidos() {
  return useQuery({
    queryKey: ['pedidos-resumen'],
    queryFn: async () => {
      const { data } = await apiClient.get<ResumenPedidos>('/pedidos/reportes/resumen');
      return data;
    },
  });
}
