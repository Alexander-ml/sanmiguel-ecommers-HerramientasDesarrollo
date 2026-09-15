/**
 * Roles del sistema San Miguel (ver docs/02-arquitectura-frontend.md §2 y prompt maestro §4).
 * Modelo actualizado de 8 roles heredados del Thymeleaf a 3 roles internos + 1 externo:
 *
 * | Rol           | Alcance                                                                |
 * |---------------|------------------------------------------------------------------------|
 * | ADMINISTRADOR | Acceso completo a todos los módulos y configuración                    |
 * | ALMACENERO    | Catálogo, variantes, stock, movimientos, compras y recepción           |
 * | VENDEDOR      | Ventas, pedidos; consulta catálogo y stock; no modifica productos      |
 * | CLIENTE       | Rol externo — solo tienda pública, nunca el panel administrativo       |
 */
export type Rol = 'ADMINISTRADOR' | 'ALMACENERO' | 'VENDEDOR' | 'CLIENTE';

/** Subconjunto de `Usuario` (backend) necesario para la sesión visual. */
export interface UsuarioSesion {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Rol;
}

export const nombreCompleto = (usuario: UsuarioSesion): string =>
  `${usuario.nombres} ${usuario.apellidos}`.trim();
