import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '../../../api/client';
import { useAuthStore } from '../store/useAuthStore';
import type { UsuarioSesion } from '../types';
import type { LoginFormValues } from '../schemas/login.schema';

interface RespuestaLogin extends UsuarioSesion {
  expiraEn?: number;
  requiere2FA?: boolean;
  tempToken?: string;
}

/**
 * Paso 1 del login.
 * - Si el backend responde con `requiere2FA: true`, NO inicia sesión todavía:
 *   el componente debe pasar a la pantalla de verificación TOTP.
 * - Si es login directo, inicia sesión y guarda `expiraEn` para el modal
 *   de expiración (punto 14).
 */
export function useLogin() {
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);

  return useMutation<RespuestaLogin, ApiError, LoginFormValues>({
    mutationFn: async (credenciales) => {
      const { data } = await apiClient.post<RespuestaLogin>('/auth/login', credenciales);
      return data;
    },
    onSuccess: (data) => {
      if (data.requiere2FA) return; // espera verificación 2FA
      iniciarSesion(data, data.expiraEn);
    },
  });
}

/**
 * Paso 2 del login (solo si el usuario tiene 2FA).
 * Recibe el tempToken emitido en el paso 1 y el código TOTP de 6 dígitos.
 */
export function useVerificar2FA() {
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);

  return useMutation<RespuestaLogin, ApiError, { tempToken: string; codigo: string }>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<RespuestaLogin>('/auth/2fa/verify', payload);
      return data;
    },
    onSuccess: (data) => iniciarSesion(data, data.expiraEn),
  });
}