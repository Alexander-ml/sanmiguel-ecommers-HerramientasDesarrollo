import type { Rol } from '../../features/auth/types';

export interface ItemNav {
  etiqueta: string;
  ruta: string;
  icono: string; // clase bootstrap-icons
  roles: Rol[];
  seccion?: string;
}

/**
 * Navegación administrativa moderna.
 */
export const NAV_ADMIN: ItemNav[] = [
  {
    seccion: 'Principal',
    etiqueta: 'Dashboard',
    ruta: '/admin/dashboard',
    icono: 'bi-grid-1x2-fill',
    roles: ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'],
  },
  {
    seccion: 'Almacén y Abastecimiento',
    etiqueta: 'Catálogo',
    ruta: '/admin/productos',
    icono: 'bi-tags',
    roles: ['ADMINISTRADOR', 'ALMACENERO'],
  },
  {
    etiqueta: 'Inventario',
    ruta: '/admin/inventario',
    icono: 'bi-box-seam',
    roles: ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'],
  },
  {
    etiqueta: 'Compras',
    ruta: '/admin/compras',
    icono: 'bi-cart-check',
    roles: ['ADMINISTRADOR', 'ALMACENERO'],
  },
  {
    seccion: 'Gestión Comercial',
    etiqueta: 'Pedidos web',
    ruta: '/admin/pedidos',
    icono: 'bi-bag-check',
    roles: ['ADMINISTRADOR', 'VENDEDOR'],
  },
  {
    etiqueta: 'Ventas',
    ruta: '/admin/ventas',
    icono: 'bi-receipt',
    roles: ['ADMINISTRADOR', 'VENDEDOR'],
  },
  {
    seccion: 'Sistema',
    etiqueta: 'Clientes',
    ruta: '/admin/clientes',
    icono: 'bi-people',
    roles: ['ADMINISTRADOR'],
  },
  {
    etiqueta: 'Usuarios y roles',
    ruta: '/admin/usuarios-sistema',
    icono: 'bi-shield-lock',
    roles: ['ADMINISTRADOR'],
  },
  {
    etiqueta: 'Configuración',
    ruta: '/admin/configuracion',
    icono: 'bi-sliders',
    roles: ['ADMINISTRADOR'],
  },
];
