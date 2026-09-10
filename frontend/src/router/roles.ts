import type { Rol } from '../features/auth/types';

/**
 * Mapa de rutas → roles permitidos, usado como AUTORIZACIÓN DE RESPALDO para las dos rutas
 * que no tienen módulo de permiso granular en `PERMISOS_SISTEMA` (mocks/data/seguridad.ts):
 * - /admin/dashboard: acceso libre a cualquier rol interno, no requiere permiso específico.
 * - /admin/configuracion: exclusivo de Administrador, no expone permisos editables por diseño.
 *
 * Para el resto de rutas, la autorización real la decide `AdminRoute` consultando
 * `useRoles()` en vivo — ver `MODULO_PERMISO_POR_RUTA` más abajo. Esto es lo que conecta la
 * pantalla "Roles y Permisos" con el control de acceso real (antes era solo informativa —
 * ver docs/07-prompt-reorganizacion-final.md sección 6.1).
 */
export const RUTAS_POR_ROL: Record<string, Rol[]> = {
  '/admin/dashboard': ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'],
  '/admin/configuracion': ['ADMINISTRADOR'],
};

/**
 * Traduce cada ruta administrativa a su prefijo de módulo dentro de `PERMISOS_SISTEMA`
 * (ej. permiso `catalogo:crear` → módulo `catalogo`). Un rol tiene acceso a la ruta si tiene
 * AL MENOS UN permiso de ese módulo asignado — el detalle de qué acción exacta puede hacer
 * dentro de la pantalla ya lo decide cada botón/acción por separado, no el guard de rutas.
 */
export const MODULO_PERMISO_POR_RUTA: Record<string, string> = {
  '/admin/productos': 'catalogo',
  '/admin/categorias': 'catalogo',
  '/admin/inventario': 'inventario',
  '/admin/compras': 'compras',
  '/admin/pedidos': 'pedidos',
  '/admin/ventas': 'ventas',
  '/admin/clientes': 'clientes',
  '/admin/usuarios-sistema': 'seguridad',
};

export function tieneAcceso(ruta: string, rol: Rol | undefined): boolean {
  if (!rol) return false;
  const rolesPermitidos = RUTAS_POR_ROL[ruta];
  if (!rolesPermitidos) return false;
  return rolesPermitidos.includes(rol);
}
