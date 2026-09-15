import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useUiStore } from '../../store/useUiStore';
import { useRoles } from '../../features/usuarios/hooks/useUsuarios';
import { MODULO_PERMISO_POR_RUTA } from '../../router/roles';
import { NAV_ADMIN } from './navegacionAdmin';
import { nombreCompleto } from '../../features/auth/types';
import './Sidebar.css';

export function Sidebar() {
  const usuario = useAuthStore((state) => state.usuario);
  const sidebarAbierto = useUiStore((state) => state.sidebarAbierto);
  const cerrarSidebar = useUiStore((state) => state.cerrarSidebar);
  const { data: roles } = useRoles();

  if (!usuario) return null;

  const rolActual = roles?.find((r) => r.id === usuario.rol);

  // Un ítem se muestra si el rol lo tiene habilitado Y, cuando la ruta tiene un módulo de
  // permiso granular, si además conserva al menos un permiso activo de ese módulo — así el
  // sidebar refleja en vivo lo que se edite en "Roles y Permisos" (ver router/roles.ts).
  const itemsVisibles = NAV_ADMIN.filter((item) => {
    if (!item.roles.includes(usuario.rol)) return false;
    const moduloPermiso = MODULO_PERMISO_POR_RUTA[item.ruta];
    if (!moduloPermiso) return true; // Dashboard/Configuración: sin permiso granular
    if (!rolActual) return true; // mientras carga, no ocultar de más
    return rolActual.permisos.some((p) => p.startsWith(`${moduloPermiso}:`));
  });

  return (
    <>
      {/* Overlay móvil: clic afuera cierra el sidebar */}
      {sidebarAbierto && <div className="sm-sidebar-overlay d-lg-none" onClick={cerrarSidebar} />}

      <aside className={`sm-sidebar ${sidebarAbierto ? 'sm-sidebar--abierto' : ''}`}>
        <nav className="sm-sidebar__nav">
          {itemsVisibles.map((item, idx) => {
            const anterior = itemsVisibles[idx - 1];
            const mostrarSeccion = item.seccion && (!anterior || anterior.seccion !== item.seccion);

            return (
              <div key={item.ruta} className="sm-sidebar__group">
                {mostrarSeccion && (
                  <div className="sm-sidebar__section-title">
                    {item.seccion}
                  </div>
                )}
                <NavLink
                  to={item.ruta}
                  onClick={cerrarSidebar}
                  className={({ isActive }) => `sm-sidebar__link${isActive ? ' sm-sidebar__link--activo' : ''}`}
                >
                  <i className={`bi ${item.icono} sm-sidebar__icon`} />
                  <span className="sm-sidebar__label">{item.etiqueta}</span>
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* Pie del Sidebar: Sesión del usuario */}
        <div className="sm-sidebar__footer">
          <div className="sm-sidebar__user-box">
            <div className="sm-sidebar__user-avatar">
              {usuario.nombres.charAt(0)}{usuario.apellidos.charAt(0)}
            </div>
            <div className="min-w-0 flex-grow-1">
              <div className="sm-sidebar__user-name text-truncate">
                {nombreCompleto(usuario)}
              </div>
              <div className="sm-sidebar__user-role">
                {usuario.rol}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
