import { Link } from 'react-router-dom';
import { useCategoriasFeatured } from '../hooks/useTiendaCatalogo';

const IMAGENES_CATEGORIA: Record<string, string> = {
  Camisas: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
  Pantalones: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
  Polos: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  Casacas: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&auto=format&fit=crop&q=80',
};

/**
 * Sección de Categorías como exploración secundaria (Design System §3).
 * Ofrece acceso estructurado a los distintos tipos de prendas masculinas.
 */
export function CategoriasDestacadasSection() {
  const { data: categorias, isLoading } = useCategoriasFeatured();

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--sm-bone)' }}>
      <div className="container py-3">
        <div className="text-center mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="text-primary small fw-bold text-uppercase" style={{ letterSpacing: '0.08em' }}>
            Explora por Colección
          </span>
          <h2
            className="sm-font-display mt-1 mb-2"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--sm-ink)' }}
          >
            Líneas de Prendas Masculinas
          </h2>
          <p className="text-muted small mb-0">
            Prendas seleccionadas por tipo de ocasión: negocios, casual elegante o uso diario.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm" role="status" />
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {(categorias ?? []).slice(0, 4).map((cat) => {
              const imgUrl = IMAGENES_CATEGORIA[cat.nombre] ?? IMAGENES_CATEGORIA.default;
              return (
                <div key={cat.id} className="col-6 col-md-6 col-lg-3">
                  <Link
                    to={`/colecciones?categoriaId=${cat.id}`}
                    className="card border-0 overflow-hidden text-decoration-none shadow-sm h-100 position-relative group"
                    style={{
                      borderRadius: 'var(--sm-radius-md)',
                      aspectRatio: '4/5',
                      backgroundColor: 'var(--sm-surface)',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={cat.nombre}
                      className="w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.3s ease' }}
                    />
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-3 d-flex flex-column justify-content-end"
                      style={{
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0) 100%)',
                      }}
                    >
                      <h3 className="h6 fw-bold text-white mb-0 text-truncate">{cat.nombre}</h3>
                      <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>
                        Ver colección ›
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
