import { createBrowserRouter } from 'react-router-dom';

import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminRoute } from './AdminRoute';

import { HomePage } from '../features/tienda/pages/HomePage';
import { ColeccionesPage } from '../features/tienda/pages/ColeccionesPage';
import { ProductoDetallePage } from '../features/tienda/pages/ProductoDetallePage';
import { SeguimientoPedidoPage } from '../features/tienda/pages/SeguimientoPedidoPage';
import { PedidosAdminPage } from '../features/tienda/pages/PedidosAdminPage';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegistroPage } from '../features/auth/pages/RegistroPage';
import { SolicitarRecuperacionPage } from '../features/auth/pages/SolicitarRecuperacionPage';
import { RestablecerContrasenaPage } from '../features/auth/pages/RestablecerContrasenaPage';
import { NosotrosPage } from '../features/tienda/pages/NosotrosPage';
import { ContactoPage } from '../features/tienda/pages/ContactoPage';

import { CarritoPage } from '../features/carrito/pages/CarritoPage';
import { CheckoutPage } from '../features/carrito/pages/CheckoutPage';

import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProductoFormPage } from '../features/catalogo/pages/ProductoFormPage';
import { ProductoVariantesPage } from '../features/catalogo/pages/ProductoVariantesPage';
import { InventarioPage } from '../features/inventario/pages/InventarioPage';
import { ProductosPage } from '../features/catalogo/pages/ProductosPage';
import { CategoriasPage } from '../features/catalogo/pages/CategoriasPage';
import { KardexPage } from '../features/inventario/pages/KardexPage';
import { ComprasPage } from '../features/compras/pages/ComprasPage';
import { OrdenCompraFormPage } from '../features/compras/pages/OrdenCompraFormPage';
import { OrdenCompraDetallePage } from '../features/compras/pages/OrdenCompraDetallePage';
import { VentasPage } from '../features/ventas/pages/VentasPage';
import { VentaFormPage } from '../features/ventas/pages/VentaFormPage';
import { VentaDetallePage } from '../features/ventas/pages/VentaDetallePage';
import { ClientesPage } from '../features/clientes/pages/ClientesPage';
import { MiCuentaPage } from '../features/clientes/pages/MiCuentaPage';
import { UsuariosSistemaPage } from '../features/usuarios/pages/UsuariosSistemaPage';
import { ConfiguracionPage } from '../features/configuracion/pages/ConfiguracionPage';

import { AccesoDenegadoPage } from '../pages/AccesoDenegadoPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/**
 * Árbol de rutas por feature (ver docs/02-arquitectura-frontend.md §2).
 * Agregar un módulo nuevo = agregar sus rutas aquí, sin tocar los layouts.
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/colecciones', element: <ColeccionesPage /> },
      { path: '/colecciones/:categoriaId', element: <ColeccionesPage /> },
      { path: '/producto/:id', element: <ProductoDetallePage /> },
      { path: '/seguimiento', element: <SeguimientoPedidoPage /> },
      { path: '/seguimiento/:codigo', element: <SeguimientoPedidoPage /> },
      { path: '/nosotros', element: <NosotrosPage /> },
      { path: '/contacto', element: <ContactoPage /> },
      { path: '/carrito', element: <CarritoPage /> },
      { path: '/carrito/checkout', element: <CheckoutPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegistroPage /> },
      { path: '/recuperar-contrasena', element: <SolicitarRecuperacionPage /> },
      { path: '/restablecer-contrasena', element: <RestablecerContrasenaPage /> },
      { path: '/mi-cuenta', element: <MiCuentaPage /> },
      { path: '/acceso-denegado', element: <AccesoDenegadoPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard', element: <DashboardPage /> },
          { path: '/admin/productos', element: <ProductosPage /> },
          { path: '/admin/productos/nuevo', element: <ProductoFormPage /> },
          { path: '/admin/productos/:id/editar', element: <ProductoFormPage /> },
          { path: '/admin/productos/:id/variantes', element: <ProductoVariantesPage /> },
          { path: '/admin/categorias', element: <CategoriasPage /> },
          { path: '/admin/inventario', element: <InventarioPage /> },
          { path: '/admin/inventario/kardex/:varianteId', element: <KardexPage /> },
          { path: '/admin/compras', element: <ComprasPage /> },
          { path: '/admin/compras/nueva', element: <OrdenCompraFormPage /> },
          { path: '/admin/compras/:id', element: <OrdenCompraDetallePage /> },
          { path: '/admin/compras/:id/editar', element: <OrdenCompraFormPage /> },
          { path: '/admin/pedidos', element: <PedidosAdminPage /> },
          { path: '/admin/ventas', element: <VentasPage /> },
          { path: '/admin/ventas/nueva', element: <VentaFormPage /> },
          { path: '/admin/ventas/:id', element: <VentaDetallePage /> },
          { path: '/admin/clientes', element: <ClientesPage /> },
          { path: '/admin/usuarios-sistema', element: <UsuariosSistemaPage /> },
          { path: '/admin/configuracion', element: <ConfiguracionPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
