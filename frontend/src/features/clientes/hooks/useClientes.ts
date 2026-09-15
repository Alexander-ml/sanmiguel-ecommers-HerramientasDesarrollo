import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type {
  Cliente,
  Direccion,
  SolicitudARCO,
  ResumenClientes,
  PaginaRespuesta,
} from '../types';
import type { ClienteFormValues } from '../schemas/cliente.schema';
import type { DireccionFormValues } from '../schemas/direccion.schema';
import type { SolicitudArcoFormValues, AtenderArcoFormValues } from '../schemas/arco.schema';
import type { Pedido } from '../../tienda/types';

interface FiltrosClientes {
  busqueda?: string;
  estado?: string;
  segmento?: string;
  page?: number;
  limit?: number;
}

// ── CLIENTES & DIRECTORIO ─────────────────────────────────────────────────────
export function useClientes(filtros: FiltrosClientes = {}) {
  return useQuery({
    queryKey: ['clientes', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
      if (filtros.estado) params.set('estado', filtros.estado);
      if (filtros.segmento) params.set('segmento', filtros.segmento);
      if (filtros.page) params.set('page', String(filtros.page));
      if (filtros.limit) params.set('limit', String(filtros.limit));
      const { data } = await apiClient.get<PaginaRespuesta<Cliente>>(`/clientes?${params}`);
      return data;
    },
  });
}

export function useCliente(id: number | null) {
  return useQuery({
    queryKey: ['clientes', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Cliente>(`/clientes/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
  });
}

// ── PERFIL CLIENTE AUTENTICADO (RF-CLI-004, RF-CLI-005) ──────────────────────
export function useMiPerfil() {
  return useQuery({
    queryKey: ['mi-perfil-cliente'],
    queryFn: async () => {
      const { data } = await apiClient.get<Cliente>('/clientes/me');
      return data;
    },
  });
}

export function useActualizarPerfil() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: number | 'me'; form: ClienteFormValues }) => {
      const { data } = await apiClient.put<Cliente>(`/clientes/${id}`, form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-perfil-cliente'] });
      qc.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useCambiarEstadoCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: 'activo' | 'inactivo' }) => {
      const { data } = await apiClient.patch<Cliente>(`/clientes/${id}/estado`, { estado });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] });
      qc.invalidateQueries({ queryKey: ['clientes-resumen'] });
    },
  });
}

// ── GESTIÓN DE DIRECCIONES (RF-CLI-006 a RF-CLI-010) ─────────────────────────
export function useDirecciones(clienteId: number | 'me' = 'me') {
  return useQuery({
    queryKey: ['direcciones', clienteId],
    queryFn: async () => {
      const { data } = await apiClient.get<Direccion[]>(`/clientes/${clienteId}/direcciones`);
      return data;
    },
  });
}

export function useGuardarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clienteId,
      id,
      form,
    }: {
      clienteId: number | 'me';
      id?: number;
      form: DireccionFormValues;
    }) => {
      if (id) {
        const { data } = await apiClient.put<Direccion>(`/direcciones/${id}`, form);
        return data;
      }
      const { data } = await apiClient.post<Direccion>(`/clientes/${clienteId}/direcciones`, form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['direcciones'] });
      qc.invalidateQueries({ queryKey: ['mi-perfil-cliente'] });
      qc.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useEliminarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(`/direcciones/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['direcciones'] });
      qc.invalidateQueries({ queryKey: ['mi-perfil-cliente'] });
    },
  });
}

export function usePredeterminarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.patch<Direccion>(`/direcciones/${id}/predeterminada`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['direcciones'] });
      qc.invalidateQueries({ queryKey: ['mi-perfil-cliente'] });
    },
  });
}

// ── VINCULACIÓN DE INVITADO (RF-CLI-003, RN-CLI-02) ──────────────────────────
export function usePedidosInvitadoPendientes(clienteId: number | 'me' = 'me') {
  return useQuery({
    queryKey: ['pedidos-invitado-pendientes', clienteId],
    queryFn: async () => {
      const { data } = await apiClient.get<Pedido[]>(
        `/clientes/${clienteId}/pedidos-invitado-pendientes`,
      );
      return data;
    },
  });
}

export function useVincularPedidosInvitado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (clienteId: number | 'me' = 'me') => {
      const { data } = await apiClient.post<{ message: string; vinculados: number }>(
        `/clientes/${clienteId}/vincular-pedidos-invitado`,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pedidos-invitado-pendientes'] });
      qc.invalidateQueries({ queryKey: ['pedidos'] });
      qc.invalidateQueries({ queryKey: ['mi-perfil-cliente'] });
      qc.invalidateQueries({ queryKey: ['clientes-resumen'] });
    },
  });
}

// ── DERECHOS ARCO (RF-CLI-013, RF-CLI-014, RN-CLI-05) ────────────────────────
export function useSolicitudesArco(estado?: string) {
  return useQuery({
    queryKey: ['arco-solicitudes', estado],
    queryFn: async () => {
      const params = estado ? `?estado=${estado}` : '';
      const { data } = await apiClient.get<SolicitudARCO[]>(`/arco/solicitudes${params}`);
      return data;
    },
  });
}

export function useCrearSolicitudArco() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clienteId,
      form,
    }: {
      clienteId: number;
      form: SolicitudArcoFormValues;
    }) => {
      const { data } = await apiClient.post<SolicitudARCO>('/arco/solicitudes', {
        clienteId,
        ...form,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['arco-solicitudes'] });
      qc.invalidateQueries({ queryKey: ['clientes-resumen'] });
    },
  });
}

export function useAtenderSolicitudArco() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: number;
      form: AtenderArcoFormValues;
    }) => {
      const { data } = await apiClient.patch<SolicitudARCO>(`/arco/solicitudes/${id}/atender`, form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['arco-solicitudes'] });
      qc.invalidateQueries({ queryKey: ['clientes-resumen'] });
    },
  });
}

// ── RESUMEN ──────────────────────────────────────────────────────────────────
export function useResumenClientes() {
  return useQuery({
    queryKey: ['clientes-resumen'],
    queryFn: async () => {
      const { data } = await apiClient.get<ResumenClientes>('/clientes/reportes/resumen');
      return data;
    },
  });
}
