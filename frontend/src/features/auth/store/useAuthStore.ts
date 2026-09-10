import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UsuarioSesion } from '../types';

/**
 * Client state (Zustand) — ver docs/02-arquitectura-frontend.md §3.
 * Guarda SOLO la sesión visual (quién está autenticado y su rol). El backend usa sesión HTTP
 * (JSESSIONID + cookie), así que este store no es la fuente de verdad de autenticación, es un
 * reflejo local para que la UI (router, sidebar) pueda reaccionar sin volver a consultar la API
 * en cada render.
 *
 * `expiraEn` es un timestamp en ms que dispara la alerta de "sesión por expirar" (punto 14).
 * El backend real debe devolver `expiraEn` (segundos) en el login; si no lo hace, queda en null
 * y el modal nunca aparece — no rompe nada.
 */
interface AuthState {
  usuario: UsuarioSesion | null;
  expiraEn: number | null;
  iniciarSesion: (usuario: UsuarioSesion, expiraEnSegundos?: number) => void;
  extenderSesion: (expiraEnSegundos: number) => void;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      expiraEn: null,

      iniciarSesion: (usuario, expiraEnSegundos) =>
        set({
          usuario,
          expiraEn: expiraEnSegundos ? Date.now() + expiraEnSegundos * 1000 : null,
        }),

      extenderSesion: (expiraEnSegundos) =>
        set({
          expiraEn: Date.now() + expiraEnSegundos * 1000,
        }),

      cerrarSesion: () => set({ usuario: null, expiraEn: null }),
    }),
    { name: 'sm-auth-session' },
  ),
);