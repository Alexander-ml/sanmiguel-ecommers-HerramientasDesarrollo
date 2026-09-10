import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthPrefsState {
    correoRecordado: string | null;
    idioma: 'es' | 'en';
    setCorreoRecordado: (correo: string | null) => void;
    setIdioma: (idioma: 'es' | 'en') => void;
}

/**
 * Preferencias del usuario en el login: correo recordado + idioma elegido.
 * NO es la sesión — eso vive en useAuthStore.
 *
 * Seguridad: nunca se guarda la contraseña. Solo el correo, y solo si el usuario
 * marcó el checkbox "Recordar mi correo".
 */
export const useAuthPrefsStore = create<AuthPrefsState>()(
    persist(
        (set) => ({
            correoRecordado: null,
            idioma: 'es',
            setCorreoRecordado: (correo) => set({ correoRecordado: correo }),
            setIdioma: (idioma) => {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('sm-idioma', idioma);
                }
                set({ idioma });
            },
        }),
        { name: 'sm-auth-prefs' },
    ),
);