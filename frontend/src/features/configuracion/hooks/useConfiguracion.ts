import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type {
  ConfiguracionGeneral,
  EmpresaConfig,
  ParametroComercial,
  ParametroTienda,
  ParametroOperativo,
  ParametroSeguridad,
  RegistroCambioConfiguracion,
} from '../types';
import type {
  EmpresaFormValues,
  ComercialFormValues,
  TiendaFormValues,
  OperativoFormValues,
  SeguridadConfigFormValues,
} from '../schemas/configuracion.schema';

// ── OBTENER CONFIGURACIÓN COMPLETA VIGENTE (RN-CFG-01) ───────────────────────
export function useConfiguracion() {
  return useQuery({
    queryKey: ['configuracion-general'],
    queryFn: async () => {
      const { data } = await apiClient.get<ConfiguracionGeneral>('/configuracion');
      return data;
    },
  });
}

// ── MUTACIONES POR SECCIÓN (RF-CFG-003, RF-CFG-005, RF-CFG-007, RF-CFG-009, RF-CFG-011)
export function useActualizarEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: EmpresaFormValues) => {
      const { data } = await apiClient.put<EmpresaConfig>('/configuracion/empresa', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion-general'] });
      qc.invalidateQueries({ queryKey: ['configuracion-historial'] });
    },
  });
}

export function useActualizarComercial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: ComercialFormValues) => {
      const { data } = await apiClient.put<ParametroComercial>('/configuracion/comercial', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion-general'] });
      qc.invalidateQueries({ queryKey: ['configuracion-historial'] });
    },
  });
}

export function useActualizarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: TiendaFormValues) => {
      const { data } = await apiClient.put<ParametroTienda>('/configuracion/tienda', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion-general'] });
      qc.invalidateQueries({ queryKey: ['configuracion-historial'] });
    },
  });
}

export function useActualizarOperativo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: OperativoFormValues) => {
      const { data } = await apiClient.put<ParametroOperativo>('/configuracion/operativo', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion-general'] });
      qc.invalidateQueries({ queryKey: ['configuracion-historial'] });
    },
  });
}

export function useActualizarSeguridad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: SeguridadConfigFormValues) => {
      const { data } = await apiClient.put<ParametroSeguridad>('/configuracion/seguridad', form);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion-general'] });
      qc.invalidateQueries({ queryKey: ['configuracion-historial'] });
    },
  });
}

// ── AUDITORÍA HISTÓRICA (RF-CFG-013, REP-CFG-01) ────────────────────────────
export function useHistorialConfiguracion() {
  return useQuery({
    queryKey: ['configuracion-historial'],
    queryFn: async () => {
      const { data } = await apiClient.get<RegistroCambioConfiguracion[]>('/configuracion/historial');
      return data;
    },
  });
}
