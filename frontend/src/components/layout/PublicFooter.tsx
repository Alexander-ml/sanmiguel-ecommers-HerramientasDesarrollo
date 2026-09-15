import { Link } from 'react-router-dom';

export function PublicFooter() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25" style={{ backgroundColor: '#090e1a' }}>
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Columna 1: Marca & Misión */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center gap-1 mb-3">
              <span className="h4 fw-extrabold text-white mb-0" style={{ letterSpacing: '0.06em', fontFamily: 'var(--sm-font-display)' }}>
                SAN MIGUEL
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--sm-primary)', display: 'inline-block' }} />
            </div>
            <p className="text-white-50 small mb-3" style={{ lineHeight: 1.6 }}>
              Marca peruana dedicada a la confección y comercialización de indumentaria masculina contemporánea. Diseños sobrios, cortes precisos y tejidos de calidad superior.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }} aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }} aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }} aria-label="TikTok">
                <i className="bi bi-tiktok" />
              </a>
            </div>
          </div>

          {/* Columna 2: Catálogo y Colecciones */}
          <div className="col-6 col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.08em' }}>
              Colecciones
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <Link to="/colecciones" className="text-white-50 text-decoration-none hover-white">
                  Todas las prendas
                </Link>
              </li>
              <li>
                <Link to="/colecciones?novedades=true" className="text-white-50 text-decoration-none hover-white">
                  Nuevos ingresos de temporada
                </Link>
              </li>
              <li>
                <Link to="/colecciones?ofertas=true" className="text-white-50 text-decoration-none hover-white">
                  Ofertas y promociones
                </Link>
              </li>
              <li>
                <Link to="/colecciones" className="text-white-50 text-decoration-none hover-white">
                  Camisas y Polos
                </Link>
              </li>
              <li>
                <Link to="/colecciones" className="text-white-50 text-decoration-none hover-white">
                  Pantalones y Casacas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicio al Cliente & Legal */}
          <div className="col-6 col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.08em' }}>
              Atención & Seguridad
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <Link to="/seguimiento" className="text-white-50 text-decoration-none hover-white d-inline-flex align-items-center gap-1">
                  <i className="bi bi-truck text-primary" />
                  Rastrear mi pedido
                </Link>
              </li>
              <li>
                <Link to="/mi-cuenta" className="text-white-50 text-decoration-none hover-white">
                  Portal de cliente (Mi Cuenta)
                </Link>
              </li>
              <li>
                <span className="text-white-50">
                  Cambios de talla y devoluciones
                </span>
              </li>
              <li>
                <span className="text-white-50">
                  Protección de datos (Ley N° 29733)
                </span>
              </li>
              <li>
                <Link to="/mi-cuenta" className="text-white-50 text-decoration-none hover-white">
                  Solicitar derechos ARCO
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-white-50 text-decoration-none hover-white">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-white-50 text-decoration-none hover-white">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Tienda Física y Contacto */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.08em' }}>
              Tienda & Contacto
            </h6>
            <ul className="list-unstyled small mb-3 d-flex flex-column gap-2 text-white-50">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt text-primary mt-1" />
                <span>Av. José Balta 780, Chiclayo, Lambayeque</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-clock text-primary mt-1" />
                <span>Lun - Sáb: 9:00 am - 8:30 pm</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-whatsapp text-success fs-6" />
                <a
                  href="https://wa.me/51974000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none fw-semibold"
                >
                  +51 974 000 000
                </a>
              </li>
            </ul>

            {/* Libro de Reclamaciones */}
            <div className="p-2 rounded border border-secondary border-opacity-50 bg-black bg-opacity-25 d-inline-flex align-items-center gap-2">
              <i className="bi bi-journal-bookmark fs-4 text-warning" />
              <div style={{ lineHeight: 1.2 }}>
                <span className="d-block fw-bold text-white" style={{ fontSize: '0.75rem' }}>
                  LIBRO DE RECLAMACIONES
                </span>
                <span className="text-white-50" style={{ fontSize: '0.68rem' }}>
                  Conforme al D.S. N° 011-2011-PCM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador y barra final de pagos */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="text-white-50 small mb-0 text-center text-md-start">
            © 2026 <strong>SAN MIGUEL</strong> — Sistema de Gestión Comercial y Tienda E-commerce. Todos los derechos reservados.
          </p>

          <div className="d-flex align-items-center gap-2 text-white-50 small">
            <span className="me-1">Medios de pago:</span>
            <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50 px-2 py-1">Visa</span>
            <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50 px-2 py-1">Mastercard</span>
            <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50 px-2 py-1">Yape</span>
            <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50 px-2 py-1">Plin</span>
            <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50 px-2 py-1">BCP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
