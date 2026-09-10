import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useRoles } from '../features/usuarios/hooks/useUsuarios';
import { LoadingState } from '../components/feedback/LoadingState';
import { tieneAcceso, MODULO_PERMISO_POR_RUTA } from './roles';

/**
 * Protege una rama del árbol de rutas administrativas.
 * - Sin sesión → redirige a /login conservando a dónde quería ir.
 * - Con sesión de CLIENTE → expulsa a /acceso-denegado (fix de fuga de rol externo).
 * - Con sesión interna: la autorización real se resuelve contra `useRoles()` para módulos
 *   con permisos granulares; para Dashboard/Configuración usa el mapa estático de roles.ts.
 */
export function AdminRoute() {
  const usuario = useAuthStore((state) => state.usuario);
  const location = useLocation();
  const { data: roles, isLoading } = useRoles();

  // 1) Sin sesión → login con redirectTo
  if (!usuario) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  // 2) Rol externo (CLIENTE) nunca entra al panel administrativo
  if (usuario.rol === 'CLIENTE') {
    return <Navigate to="/acceso-denegado" replace />;
  }

  const rutaBase = `/${location.pathname.split('/').slice(1, 3).join('/')}`;

  // 3) Dashboard: acceso libre para cualquier rol interno autenticado
  if (rutaBase === '/admin/dashboard') {
    return <Outlet />;
  }

  const moduloPermiso = MODULO_PERMISO_POR_RUTA[rutaBase];

  if (!moduloPermiso) {
    return tieneAcceso(rutaBase, usuario.rol) ? (
      <Outlet />
    ) : (
      <Navigate to="/acceso-denegado" replace />
    );
  }

  if (isLoading) {
    return <LoadingState etiqueta="Verificando permisos…" />;
  }

  const rolActual = roles?.find((r) => r.id === usuario.rol);
  const autorizado = rolActual?.permisos.some((p) => p.startsWith(`${moduloPermiso}:`)) ?? false;

  return autorizado ? <Outlet /> : <Navigate to="/acceso-denegado" replace />;
}