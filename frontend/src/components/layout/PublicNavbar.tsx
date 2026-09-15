import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useCarritoStore, selectTotalItems } from '../../features/carrito/store/carritoStore';
import type { Rol } from '../../features/auth/types';
import './PublicNavbar.css';

const ROLES_INTERNOS: Rol[] = ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'];

export function PublicNavbar() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);
  const totalCarrito = useCarritoStore(selectTotalItems);
  const esColaborador = !!usuario && ROLES_INTERNOS.includes(usuario.rol);

  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busqueda.trim()) return;
    navigate(`/colecciones?busqueda=${encodeURIComponent(busqueda.trim())}`);
  };

  return (
    <header className="sm-public-header sticky-top">
      {/* ── 1. BARRA DE COLABORADOR (Exclusiva para Personal Interno) ────── */}
      {esColaborador && (
        <aside className="sm-staff-bar py-1 px-3 text-white">
          <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="d-flex align-items-center gap-2 small">
              <span className="badge bg-primary text-white text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                <i className="bi bi-shield-lock-fill me-1" />
                Modo Colaborador
              </span>
              <span className="text-white-50">
                Conectado como <strong className="text-white">{usuario?.nombres} {usuario?.apellidos}</strong> ({usuario?.rol})
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Link
                to="/admin/dashboard"
                className="btn btn-sm btn-primary py-0 px-2 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', height: 26 }}
              >
                <i className="bi bi-speedometer2" />
                <span>Panel Administrativo</span>
              </Link>
              <Link
                to="/admin/inventario"
                className="btn btn-sm btn-outline-light py-0 px-2 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', height: 26 }}
              >
                <i className="bi bi-box-seam" />
                <span>Inventario</span>
              </Link>
              <Link
                to="/admin/ventas/nueva"
                className="btn btn-sm btn-outline-light py-0 px-2 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', height: 26 }}
              >
                <i className="bi bi-receipt" />
                <span>POS Mostrador</span>
              </Link>
              <button
                type="button"
                className="btn btn-link text-white-50 p-0 text-decoration-none ms-2"
                style={{ fontSize: '0.75rem' }}
                onClick={cerrarSesion}
                title="Cerrar sesión de personal"
              >
                <i className="bi bi-box-arrow-right me-1" />
                Salir
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── 2. BARRA DE UTILIDAD Y ANUNCIOS ───────────────────────────────── */}
      <div className="sm-utility-bar py-1 px-3">
        <div className="container d-flex flex-wrap justify-content-between align-items-center small">
          <div className="d-flex align-items-center gap-3 text-white-50">
            <span>
              <i className="bi bi-truck me-1 text-primary" />
              Envíos a todo el Perú · Tienda oficial en Chiclayo
            </span>
            <span className="d-none d-md-inline opacity-50">|</span>
            <span className="d-none d-md-inline">
              <i className="bi bi-patch-check me-1 text-primary" />
              Confección nacional 100% garantizada
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto text-white-50">
            <a
              href="https://wa.me/51974000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-50 text-decoration-none hover-white d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-whatsapp text-success" />
              <span>Ventas WhatsApp</span>
            </a>
            <span className="opacity-50">·</span>
            <Link to="/seguimiento" className="text-white-50 text-decoration-none hover-white d-inline-flex align-items-center gap-1">
              <i className="bi bi-geo-alt" />
              <span>Rastrear pedido</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. NAVBAR COMERCIAL PRINCIPAL ─────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg sm-public-nav">
        <div className="container">
          {/* Logo de la marca */}
          <Link className="navbar-brand d-flex flex-column" to="/">
            <div className="d-flex align-items-center gap-1">
              <span className="sm-brand-title">SAN MIGUEL</span>
              <span className="sm-brand-dot" />
            </div>
            <span className="sm-brand-subtitle">Moda & Confección</span>
          </Link>

          {/* Botón responsive */}
          <button
            className="navbar-toggler border-0 text-white shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-label="Abrir menú"
          >
            <i className="bi bi-list fs-2" />
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            {/* Navegación comercial central */}
            <ul className="navbar-nav mx-auto align-items-lg-center gap-1 my-2 my-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/colecciones">
                  Colecciones
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/colecciones?novedades=true">
                  <span className="d-inline-flex align-items-center gap-1">
                    Novedades
                    <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.62rem' }}>HOT</span>
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/colecciones?ofertas=true">
                  Ofertas
                </NavLink>
              </li>
            </ul>

            {/* Buscador interactivo en la cabecera */}
            <form className="sm-search-form me-lg-3 my-2 my-lg-0" onSubmit={handleBuscar}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-0 text-white-50 ps-2 pe-1">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control bg-transparent border-0 text-white shadow-none ps-1"
                  placeholder="Buscar prendas, camisas, polos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </form>

            {/* Acciones de usuario y carrito */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              {/* Portal de Cliente con Menú y Cerrar Sesión */}
              {usuario?.rol === 'CLIENTE' ? (
                <div className="d-flex align-items-center gap-1">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="outline-light"
                      size="sm"
                      className="d-inline-flex align-items-center gap-2 text-white border-white-50"
                      style={{ borderRadius: 20 }}
                      id="dropdown-cliente-navbar"
                    >
                      <i className="bi bi-person-circle text-primary" />
                      <span className="d-none d-sm-inline">{usuario.nombres.split(' ')[0]}</span>
                      <span className="d-sm-none">Cuenta</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-lg border-0 mt-2 py-2" style={{ minWidth: 220, borderRadius: 'var(--sm-radius-md, 8px)' }}>
                      <div className="px-3 py-2 border-bottom mb-1">
                        <div className="fw-bold small text-dark">{usuario.nombres} {usuario.apellidos}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: 180, fontSize: '0.75rem' }}>{usuario.correo}</div>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle mt-1" style={{ fontSize: '0.65rem' }}>
                          Cliente
                        </span>
                      </div>

                      <Dropdown.Item as={Link} to="/mi-cuenta" className="small py-2 d-flex align-items-center gap-2 text-dark">
                        <i className="bi bi-person text-primary" />
                        <span>Mi Cuenta / Mis Datos</span>
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/mi-cuenta?tab=compras" className="small py-2 d-flex align-items-center gap-2 text-dark">
                        <i className="bi bi-bag-check text-primary" />
                        <span>Mis Pedidos</span>
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/mi-cuenta?tab=direcciones" className="small py-2 d-flex align-items-center gap-2 text-dark">
                        <i className="bi bi-geo-alt text-primary" />
                        <span>Direcciones de Entrega</span>
                      </Dropdown.Item>

                      <Dropdown.Divider />

                      <Dropdown.Item
                        as="button"
                        type="button"
                        className="small py-2 d-flex align-items-center gap-2 text-danger fw-medium"
                        onClick={() => {
                          cerrarSesion();
                          navigate('/');
                        }}
                      >
                        <i className="bi bi-box-arrow-right" />
                        <span>Cerrar sesión</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : !usuario ? (
                <div className="d-flex align-items-center gap-1">
                  <NavLink className="nav-link text-white-50 px-2" to="/login">
                    Ingresar
                  </NavLink>
                  <span className="text-white-50 opacity-25">/</span>
                  <NavLink className="nav-link text-white-50 px-2" to="/registro">
                    Crear cuenta
                  </NavLink>
                </div>
              ) : null}

              {/* Botón Carrito de Compras */}
              <Link
                className="btn btn-primary btn-sm sm-cart-btn d-inline-flex align-items-center gap-2 ms-lg-1"
                to="/carrito"
              >
                <i className="bi bi-bag-check-fill fs-6" />
                <span className="d-none d-sm-inline fw-semibold">Carrito</span>
                {totalCarrito > 0 ? (
                  <span className="badge bg-white text-primary rounded-pill px-2 py-0 fw-bold" style={{ fontSize: '0.75rem' }}>
                    {totalCarrito}
                  </span>
                ) : (
                  <span className="badge bg-white-10 text-white-50 rounded-pill px-2 py-0" style={{ fontSize: '0.72rem' }}>
                    0
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
