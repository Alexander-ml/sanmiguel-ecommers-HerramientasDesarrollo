import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type {
  UsuarioInterno,
  RolSeguridad,
  Permiso,
  SesionActiva,
  EventoSeguridad,
  ResumenSeguridad,
  PaginaRespuesta,
} from '../types';
import type { UsuarioInternoFormValues } from '../schemas/usuario.schema';
import type { RolFormValues } from '../schemas/rol.schema';

interface FiltrosUsuarios {
  busqueda?: string;
  rol?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

// ── USUARIOS INTERNOS ─────────────────────────────────────────────────────────
export function useUsuarios(filtros: FiltrosUsuarios = {}) {
  return useQuery({
    queryKey: ['usuarios-internos', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
      if (filtros.rol) params.set('rol', filtros.rol);
      if (filtros.estado) params.set('estado', filtros.estado);
      if (filtros.page) params.set('page', String(filtros.page));
      if (filtros.limit) params.set('limit', String(filtros.limit));
      const { data } = await apiClient.get<PaginaRespuesta<UsuarioInterno>>(
        `/usuarios-internos?${params}`,
      );
      return data;
    },
  });
}

export function useCrearUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: UsuarioInternoFormValues) => {
      const { data } = await apiClient.post<UsuarioInterno>('/usuarios-internos', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-internos'] });
      qc.invalidateQueries({ queryKey: ['seguridad-resumen'] });
      qc.invalidateQueries({ queryKey: ['seguridad-eventos'] });
    },
  });
}

export function useActualizarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: Partial<UsuarioInternoFormValues> }) => {
      const { data } = await apiClient.put<UsuarioInterno>(`/usuarios-internos/${id}`, form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-internos'] });
      qc.invalidateQueries({ queryKey: ['seguridad-resumen'] });
    },
  });
}

export function useCambiarEstadoUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: 'activo' | 'inactivo' }) => {
      const { data } = await apiClient.patch<UsuarioInterno>(`/usuarios-internos/${id}/estado`, {
        estado,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-internos'] });
      qc.invalidateQueries({ queryKey: ['seguridad-sesiones'] });
      qc.invalidateQueries({ queryKey: ['seguridad-resumen'] });
      qc.invalidateQueries({ queryKey: ['seguridad-eventos'] });
    },
  });
}

export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.post<{ message: string }>(
        `/usuarios-internos/${id}/reset-password`,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seguridad-sesiones'] });
      qc.invalidateQueries({ queryKey: ['seguridad-eventos'] });
    },
  });
}

// ── ROLES Y PERMISOS ──────────────────────────────────────────────────────────
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await apiClient.get<RolSeguridad[]>('/roles');
      return data;
    },
  });
}

export function usePermisos() {
  return useQuery({
    queryKey: ['permisos'],
    queryFn: async () => {
      const { data } = await apiClient.get<Permiso[]>('/permisos');
      return data;
    },
  });
}

export function useGuardarRol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: RolFormValues) => {
      const { data } = await apiClient.post<RolSeguridad>('/roles', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      qc.invalidateQueries({ queryKey: ['seguridad-resumen'] });
    },
  });
}

export function useActualizarPermisosRol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rolId, permisos }: { rolId: string; permisos: string[] }) => {
      const { data } = await apiClient.put<RolSeguridad>(`/roles/${rolId}/permisos`, {
        permisos,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// ── SESIONES ACTIVAS ──────────────────────────────────────────────────────────
export function useSesionesActivas() {
  return useQuery({
    queryKey: ['seguridad-sesiones'],
    queryFn: async () => {
      const { data } = await apiClient.get<SesionActiva[]>('/seguridad/sesiones');
      return data;
    },
  });
}

export function useRevocarSesion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/seguridad/sesiones/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seguridad-sesiones'] });
      qc.invalidateQueries({ queryKey: ['seguridad-resumen'] });
      qc.invalidateQueries({ queryKey: ['seguridad-eventos'] });
    },
  });
}

// ── AUDITORÍA Y EVENTOS ───────────────────────────────────────────────────────
export function useEventosSeguridad(tipo?: string) {
  return useQuery({
    queryKey: ['seguridad-eventos', tipo],
    queryFn: async () => {
      const params = tipo ? `?tipo=${tipo}` : '';
      const { data } = await apiClient.get<EventoSeguridad[]>(`/seguridad/eventos${params}`);
      return data;
    },
  });
}

export function useResumenSeguridad() {
  return useQuery({
    queryKey: ['seguridad-resumen'],
    queryFn: async () => {
      const { data } = await apiClient.get<ResumenSeguridad>('/seguridad/resumen');
      return data;
    },
  });
}
