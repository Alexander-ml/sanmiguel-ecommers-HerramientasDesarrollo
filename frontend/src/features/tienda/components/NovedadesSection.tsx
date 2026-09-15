import { Link } from 'react-router-dom';
import { useProductosNuevos } from '../hooks/useTiendaCatalogo';
import { ProductoCardPublico } from './ProductoCardPublico';
import type { Producto } from '../../catalogo/types';

interface NovedadesSectionProps {
  onComprarRapido: (producto: Producto) => void;
}

/**
 * Sección de Novedades y Recién Llegados (Design System §3).
 * Se ubica de forma prioritaria inmediatamente debajo del Hero,
 * mostrando productos reales con disponibilidad inmediata.
 */
export function NovedadesSection({ onComprarRapido }: NovedadesSectionProps) {
  const { data: productos, isLoading } = useProductosNuevos(8);

  return (
    <section id="novedades" className="py-5 bg-white">
      <div className="container py-3">
        {/* Encabezado de la sección */}
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span
                className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1"
                style={{ fontSize: '0.72rem' }}
              >
                Temporada 2026
              </span>
              <span className="text-muted small fw-medium">Recién Llegados</span>
            </div>
            <h2
              className="sm-font-display mb-1"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--sm-ink)' }}
            >
              Novedades en Sastrería & Confección
            </h2>
            <p className="text-muted small mb-0" style={{ maxWidth: 520 }}>
              Descubre las prendas masculinas recién confeccionadas. Cortes impecables, telas frescas
              y durabilidad garantizada.
            </p>
          </div>

          <Link
            to="/colecciones"
            className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"
            style={{ borderRadius: 6 }}
          >
            <span>Ver catálogo completo</span>
            <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {/* Grilla de prendas */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary spinner-border-sm" role="status" />
            <span className="ms-2 small text-muted">Cargando novedades…</span>
          </div>
        ) : productos && productos.length > 0 ? (
          <div className="row g-3 g-md-4">
            {productos.map((producto) => (
              <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                <ProductoCardPublico
                  producto={producto}
                  onComprarRapido={onComprarRapido}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted small">
            No hay prendas disponibles en este momento.
          </div>
        )}
      </div>
    </section>
  );
}
