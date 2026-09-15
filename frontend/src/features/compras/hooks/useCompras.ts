import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type {
  Proveedor,
  OrdenCompra,
  PaginaRespuesta,
  ResumenCompras,
  GastoProveedor,
  ComparativoCosto,
  TiempoEntregaProveedor,
  TasaDevolucionCompras,
  RecepcionCompra,
  DevolucionProveedor,
} from '../types';
import type { ProveedorFormValues } from '../schemas/proveedor.schema';
import type { OrdenCompraFormValues } from '../schemas/ordenCompra.schema';
import type { RecepcionFormValues } from '../schemas/recepcion.schema';
import type { DevolucionProveedorFormValues } from '../schemas/devolucion.schema';

// ── PROVEEDORES ───────────────────────────────────────────────────────────────
interface FiltrosProveedores {
  busqueda?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

export function useProveedores(filtros: FiltrosProveedores = {}) {
  return useQuery({
    queryKey: ['proveedores', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
      if (filtros.estado) params.set('estado', filtros.estado);
      if (filtros.page) params.set('page', String(filtros.page));
      if (filtros.limit) params.set('limit', String(filtros.limit));
      const { data } = await apiClient.get<PaginaRespuesta<Proveedor>>(`/proveedores?${params}`);
      return data;
    },
  });
}

export function useProveedor(id: number | null) {
  return useQuery({
    queryKey: ['proveedores', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Proveedor>(`/proveedores/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
  });
}

export function useCrearProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: ProveedorFormValues) => {
      const payload: Omit<Proveedor, 'id' | 'fechaRegistro'> = {
        razonSocial: form.razonSocial,
        ruc: form.ruc,
        contacto: {
          nombre: form.contactoNombre,
          telefono: form.contactoTelefono,
          email: form.contactoEmail,
        },
        direccion: form.direccion,
        condicionesComerciales: form.condicionesComerciales,
        estado: form.estado,
      };
      const { data } = await apiClient.post<Proveedor>('/proveedores', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
    },
  });
}

export function useActualizarProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: ProveedorFormValues }) => {
      const payload: Partial<Proveedor> = {
        razonSocial: form.razonSocial,
        ruc: form.ruc,
        contacto: {
          nombre: form.contactoNombre,
          telefono: form.contactoTelefono,
          email: form.contactoEmail,
        },
        direccion: form.direccion,
        condicionesComerciales: form.condicionesComerciales,
        estado: form.estado,
      };
      const { data } = await apiClient.put<Proveedor>(`/proveedores/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
}

export function useBajaProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(`/proveedores/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
    },
  });
}

// ── ÓRDENES DE COMPRA ─────────────────────────────────────────────────────────
interface FiltrosCompras {
  proveedorId?: string;
  estado?: string;
  codigo?: string;
  page?: number;
  limit?: number;
}

export function useCompras(filtros: FiltrosCompras = {}) {
  return useQuery({
    queryKey: ['compras', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.proveedorId) params.set('proveedorId', filtros.proveedorId);
      if (filtros.estado) params.set('estado', filtros.estado);
      if (filtros.codigo) params.set('codigo', filtros.codigo);
      if (filtros.page) params.set('page', String(filtros.page));
      if (filtros.limit) params.set('limit', String(filtros.limit));
      const { data } = await apiClient.get<PaginaRespuesta<OrdenCompra>>(`/compras?${params}`);
      return data;
    },
  });
}

export function useCompra(id: number | null) {
  return useQuery({
    queryKey: ['compras', id],
    queryFn: async () => {
      const { data } = await apiClient.get<OrdenCompra>(`/compras/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
  });
}

export function useCrearCompra() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async (form: OrdenCompraFormValues) => {
      const payload = {
        ...form,
        usuarioCreadorId: usuario?.id ?? 0,
        usuarioCreadorNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post<OrdenCompra>('/compras', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compras'] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
      qc.invalidateQueries({ queryKey: ['compras-gasto-proveedor'] });
    },
  });
}

// RF-COM-007: modificar orden de compra mientras esté PENDIENTE (sin recepciones aún).
export function useActualizarCompra() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: OrdenCompraFormValues }) => {
      const payload = {
        ...form,
        usuarioModificadorId: usuario?.id ?? 0,
        usuarioModificadorNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.put<OrdenCompra>(`/compras/${id}`, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['compras'] });
      qc.invalidateQueries({ queryKey: ['compras', variables.id] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
    },
  });
}

export function useCancelarCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.patch<OrdenCompra>(`/compras/${id}/cancelar`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compras'] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
    },
  });
}

// ── RECEPCIÓN DE MERCADERÍA (RF-COM-009, RF-COM-010) ─────────────────────────
export function useRegistrarRecepcion() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: RecepcionFormValues }) => {
      const payload = {
        ...form,
        usuarioReceptorId: usuario?.id ?? 0,
        usuarioReceptorNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post<{ orden: OrdenCompra; recepcion: RecepcionCompra }>(
        `/compras/${id}/recepciones`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compras'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
      qc.invalidateQueries({ queryKey: ['compras-resumen'] });
    },
  });
}

// ── DEVOLUCIÓN A PROVEEDOR (RF-COM-011, RF-COM-012) ─────────────────────────
export function useRegistrarDevolucion() {
  const qc = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async ({
      compraId,
      form,
    }: {
      compraId: number;
      form: DevolucionProveedorFormValues;
    }) => {
      const payload = {
        ...form,
        usuarioId: usuario?.id ?? 0,
        usuarioNombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
      };
      const { data } = await apiClient.post<{ orden: OrdenCompra; devolucion: DevolucionProveedor }>(
        `/compras/${compraId}/devoluciones`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compras'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
}

// ── REPORTES ──────────────────────────────────────────────────────────────────
export function useResumenCompras() {
  return useQuery({
    queryKey: ['compras-resumen'],
    queryFn: async () => {
      const { data } = await apiClient.get<ResumenCompras>('/compras/reportes/resumen');
      return data;
    },
  });
}

export function useGastoProveedores() {
  return useQuery({
    queryKey: ['compras-gasto-proveedor'],
    queryFn: async () => {
      const { data } = await apiClient.get<GastoProveedor[]>('/compras/reportes/gasto-proveedor');
      return data;
    },
  });
}

// REP-COM-02 — Comparativo de costos por variante
export function useComparativoCostos() {
  return useQuery({
    queryKey: ['compras-comparativo-costos'],
    queryFn: async () => {
      const { data } = await apiClient.get<ComparativoCosto[]>('/compras/reportes/comparativo-costos');
      return data;
    },
  });
}

// REP-COM-03 — Tiempos de entrega promedio por proveedor
export function useTiemposEntrega() {
  return useQuery({
    queryKey: ['compras-tiempos-entrega'],
    queryFn: async () => {
      const { data } = await apiClient.get<TiempoEntregaProveedor[]>('/compras/reportes/tiempos-entrega');
      return data;
    },
  });
}

// REP-COM-04 — Tasa de devoluciones global
export function useTasaDevoluciones() {
  return useQuery({
    queryKey: ['compras-tasa-devoluciones'],
    queryFn: async () => {
      const { data } = await apiClient.get<TasaDevolucionCompras>('/compras/reportes/tasa-devoluciones');
      return data;
    },
  });
}
