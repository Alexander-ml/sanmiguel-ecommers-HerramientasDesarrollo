/**
 * Almacén en memoria de códigos de recuperación de contraseña (RF-USR-015/016).
 * Como no hay backend ni servicio de correo real, el código se devuelve directamente en la
 * respuesta del mock (ver mocks/handlers/auth.handlers.ts) para poder demostrar el flujo
 * completo de dos pasos sin salir del navegador — se marca explícitamente como "modo
 * demostración" en la UI, no se simula un envío de correo real.
 */
export const CODIGOS_RECUPERACION: Record<string, string> = {};

export function generarCodigoRecuperacion(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
