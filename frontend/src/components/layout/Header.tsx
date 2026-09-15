import { Link } from 'react-router-dom';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { nombreCompleto } from '../../features/auth/types';
import './Header.css';

export function Header() {
  const alternarSidebar = useUiStore((state) => state.alternarSidebar);
  const usuario = useAuthStore((state) => state.usuario);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);

  const iniciales = usuario
    ? `${usuario.nombres.charAt(0)}${usuario.apellidos.charAt(0)}`.toUpperCase()
    : 'SM';

  return (
    <header className="sm-header">
      {/* Botón hamburguesa móvil */}
      <button
        type="button"
        className="btn btn-link sm-header__toggle d-lg-none"
        onClick={alternarSidebar}
        aria-label="Abrir menú de navegación"
      >
        <i className="bi bi-list fs-4" />
      </button>

      {/* Marca / Logo */}
      <Link to="/admin/dashboard" className="sm-header__brand d-flex align-items-center gap-2">
        <div className="sm-header__logo-badge">
          SM
        </div>
        <div className="d-flex flex-column">
          <span className="sm-header__brand-name">SAN MIGUEL</span>
          <span className="sm-header__brand-sub">Sistema Comercial</span>
        </div>
      </Link>

      {/* Acciones del lado derecho */}
      <div className="ms-auto d-flex align-items-center gap-3">
        {/* Acceso directo a la tienda pública */}
        <Link
          to="/"
          className="btn btn-sm sm-header__store-btn d-none d-sm-inline-flex align-items-center gap-2"
          title="Abrir tienda web pública"
        >
          <i className="bi bi-shop" />
          <span>Ver tienda</span>
          <i className="bi bi-arrow-up-right small text-muted" />
        </Link>

        {/* Separador vertical */}
        <div className="sm-header__divider d-none d-sm-block" />

        {/* Perfil del usuario autenticado */}
        {usuario && (
          <div className="d-flex align-items-center gap-2">
            <div className="sm-header__avatar" title={nombreCompleto(usuario)}>
              {iniciales}
            </div>
            <div className="d-none d-md-flex flex-column text-start">
              <span className="sm-header__user-name">{nombreCompleto(usuario)}</span>
              <span className="sm-header__user-role">{usuario.rol}</span>
            </div>
            <button
              type="button"
              className="btn btn-link sm-header__logout-btn text-muted"
              onClick={cerrarSesion}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right fs-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
