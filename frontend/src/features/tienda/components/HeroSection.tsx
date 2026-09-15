import { Link } from 'react-router-dom';

/**
 * Hero Banner principal de la Tienda (Design System §3).
 * Utiliza los tokens de marca (--sm-ink, --sm-bone, --sm-primary) y
 * tipografía editorial Fraunces sin degradados saturados externos.
 */
export function HeroSection() {
  return (
    <section
      className="py-5 text-white position-relative overflow-hidden"
      style={{
        backgroundColor: 'var(--sm-ink)',
        backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container py-4 py-lg-5">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-7">
            <span
              className="badge px-3 py-2 mb-3 text-uppercase fw-semibold"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--sm-bone)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                letterSpacing: '0.08em',
                fontSize: '0.72rem',
              }}
            >
              Confección Masculina · Chiclayo, Perú
            </span>

            <h1
              className="sm-font-display mb-3"
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Elegancia Contemporánea y Sastrería de Precisión
            </h1>

            <p
              className="lead mb-4 text-white-50"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', maxWidth: 580, lineHeight: 1.6 }}
            >
              Prendas de alta confección diseñadas para el caballero moderno. Camisas en algodón pima,
              lino puro y trajes estructurados con el legado sartorial de Chiclayo.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <a
                href="#novedades"
                className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                style={{ borderRadius: 8 }}
              >
                <span>Ver Novedades 2026</span>
                <i className="bi bi-arrow-down-short fs-5" />
              </a>

              <Link
                to="/colecciones"
                className="btn btn-outline-light px-4 py-2 fw-medium d-inline-flex align-items-center gap-2"
                style={{ borderRadius: 8 }}
              >
                <i className="bi bi-grid" />
                <span>Explorar Colecciones</span>
              </Link>
            </div>

            {/* Micro-puntos de valor */}
            <div className="d-flex flex-wrap gap-4 pt-3 border-top border-white border-opacity-10 text-white-50 small">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-patch-check-fill text-primary" />
                <span>100% Algodón Pima & Lino</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-truck text-primary" />
                <span>Envíos a todo el Perú</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-primary" />
                <span>Tienda Física en Chiclayo</span>
              </div>
            </div>
          </div>

          {/* Columna visual editorial */}
          <div className="col-12 col-lg-5 d-none d-lg-block">
            <div className="position-relative mx-auto" style={{ maxWidth: 420 }}>
              <div
                className="rounded-4 overflow-hidden shadow-lg position-relative"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  aspectRatio: '4/5',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop&q=80"
                  alt="Moda Masculina San Miguel"
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute bottom-0 start-0 end-0 p-4"
                  style={{
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 100%)',
                  }}
                >
                  <span className="badge bg-primary mb-1">Nueva Temporada</span>
                  <h2 className="h5 fw-bold text-white mb-0">Colección Caballero 2026</h2>
                  <p className="text-white-50 small mb-0">Disponibilidad en tallas S a XL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
