import type { Miga } from './Breadcrumbs';

/**
 * Constantes canónicas de navegación para Breadcrumbs administrativos.
 * Centralizar estos tramos evita que cambios de rutas o reorganizaciones de módulos
 * dejen migas desincronizadas a lo largo del sistema (Design System §2.3 / Bloque C).
 */

export const BREADCRUMB_INICIO: Miga = {
  etiqueta: 'Inicio',
  ruta: '/admin/dashboard',
};

export const BREADCRUMB_CATALOGO: Miga[] = [
  { etiqueta: 'Catálogo', ruta: '/admin/productos' },
  { etiqueta: 'Productos', ruta: '/admin/productos' },
];

export const BREADCRUMB_INVENTARIO: Miga[] = [
  { etiqueta: 'Inventario', ruta: '/admin/inventario' },
];

export const BREADCRUMB_COMPRAS: Miga[] = [
  { etiqueta: 'Compras', ruta: '/admin/compras' },
];

export const BREADCRUMB_VENTAS: Miga[] = [
  { etiqueta: 'Ventas', ruta: '/admin/ventas' },
];

export const BREADCRUMB_CLIENTES: Miga[] = [
  { etiqueta: 'Clientes', ruta: '/admin/clientes' },
];

export const BREADCRUMB_USUARIOS: Miga[] = [
  { etiqueta: 'Usuarios y roles', ruta: '/admin/usuarios-sistema' },
];

export const BREADCRUMB_CONFIGURACION: Miga[] = [
  { etiqueta: 'Configuración', ruta: '/admin/configuracion' },
];
