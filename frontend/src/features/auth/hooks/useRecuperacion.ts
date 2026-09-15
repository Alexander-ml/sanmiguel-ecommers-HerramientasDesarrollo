import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import type { SolicitarRecuperacionFormValues } from '../schemas/solicitarRecuperacion.schema';
import type { RestablecerContrasenaFormValues } from '../schemas/restablecerContrasena.schema';

interface RespuestaSolicitud {
  message: string;
  codigoDemo?: string;
}

/** RF-USR-015 — Solicitar recuperación de contraseña. */
export function useSolicitarRecuperacion() {
  return useMutation({
    mutationFn: async (valores: SolicitarRecuperacionFormValues) => {
      const { data } = await apiClient.post<RespuestaSolicitud>('/auth/recuperar', valores);
      return data;
    },
  });
}

/** RF-USR-016 — Restablecer contraseña, una vez verificado el código. */
export function useRestablecerContrasena() {
  return useMutation({
    mutationFn: async (valores: RestablecerContrasenaFormValues) => {
      const { data } = await apiClient.post<{ message: string }>('/auth/restablecer', valores);
      return data;
    },
  });
}
