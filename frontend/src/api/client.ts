import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../features/auth/store/useAuthStore';

/**
 * Error normalizado que conserva el status HTTP y el body del backend.
 * Los componentes pueden leer `error.status` (401/403/409/429…) o
 * `error.data.intentosRestantes`, `error.data.bloqueadoHasta`, etc.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly data: any;

  constructor(mensaje: string, status: number, data: any) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Instancia única de Axios para toda la aplicación.
 * Regla: ningún feature crea su propia instancia ni llama a `fetch` directamente.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // 401 → cerrar sesión, EXCEPTO si viene de /auth/login o /auth/2fa/verify,
    // porque en esos casos 401 significa "credenciales/código incorrecto",
    // no "sesión expirada".
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const esIntentoDeLogin =
        url.includes('/auth/login') ||
        url.includes('/auth/2fa/verify') ||
        url.includes('/auth/registro');
      if (!esIntentoDeLogin) {
        useAuthStore.getState().cerrarSesion();
      }
    }

    const mensaje =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      'Ocurrió un error inesperado.';

    return Promise.reject(
      new ApiError(mensaje, error.response?.status ?? 0, error.response?.data),
    );
  },
);