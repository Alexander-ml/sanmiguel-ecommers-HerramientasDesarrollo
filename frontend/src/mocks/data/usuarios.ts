import type { UsuarioSesion } from '../../features/auth/types';

export interface UsuarioDemo extends UsuarioSesion {
  password: string;
  tiene2FA?: boolean;
  secret2FA?: string; // base32 — SOLO para demo
}

/**
 * Cuentas de demostración. Contraseña de todas: "demo1234".
 * El usuario 2fa@sanmiguel.pe tiene 2FA activo para probar el flujo TOTP.
 */
export const USUARIOS_DEMO: UsuarioDemo[] = [
  {
    id: 1,
    nombres: 'Ana',
    apellidos: 'Flores',
    correo: 'admin@sanmiguel.pe',
    rol: 'ADMINISTRADOR',
    password: 'demo1234',
  },
  {
    id: 2,
    nombres: 'Pedro',
    apellidos: 'Quispe',
    correo: 'almacenero@sanmiguel.pe',
    rol: 'ALMACENERO',
    password: 'demo1234',
  },
  {
    id: 3,
    nombres: 'Carlos',
    apellidos: 'Mendo',
    correo: 'vendedor@sanmiguel.pe',
    rol: 'VENDEDOR',
    password: 'demo1234',
  },
  {
    id: 4,
    nombres: 'Junior',
    apellidos: 'Llontop',
    correo: 'cliente@sanmiguel.pe',
    rol: 'CLIENTE',
    password: 'demo1234',
  },
  {
    id: 5,
    nombres: 'Demo',
    apellidos: '2FA',
    correo: 'anthonyyossar@gmail.com',
    rol: 'ADMINISTRADOR',
    password: '123456',
    tiene2FA: true,
    // Secret de prueba — se puede agregar manualmente en Google Authenticator
    // si el QR no funciona. Es el secret de ejemplo de la RFC 6238.
    secret2FA: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',
  },
];

/** Estado de intentos fallidos por correo (en memoria). */
export const INTENTOS_LOGIN: Record<
  string,
  { intentos: number; bloqueadoHasta: number | null }
> = {};

/** Máximo de intentos antes de bloquear. */
export const MAX_INTENTOS = 3;

/** Duración del bloqueo en ms (2 min para demo). */
export const BLOQUEO_MS = 2 * 60 * 1000;

/** Tokens temporales entre paso 1 y paso 2 de 2FA (tempToken → correo). */
export const TOKENS_2FA_PENDIENTES: Record<string, string> = {};