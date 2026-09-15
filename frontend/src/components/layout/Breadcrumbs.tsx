import { Link } from 'react-router-dom';

export interface Miga {
  etiqueta: string;
  ruta?: string; // sin ruta = página actual (no clicable)
  esDato?: boolean; // true = representa un dato/registro específico (ej. nombre de prenda, código)
}

interface BreadcrumbsProps {
  migas: Miga[];
}

/**
 * Breadcrumbs con jerarquía visual refinada (Design System §2.3 / Bloque C).
 * Presentado como una "píldora de ubicación" sutil con icono y chevrons limpios,
 * diferenciando inequívocamente la ruta jerárquica del título principal inferior.
 */
export function Breadcrumbs({ migas }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-3 d-inline-block">
      <div
        className="d-inline-flex flex-wrap align-items-center gap-1 px-3 py-1.5 rounded-pill"
        style={{
          background: 'var(--sm-bone)',
          border: '1px solid var(--sm-border)',
          fontSize: '0.78rem',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        <i
          className="bi bi-geo-alt-fill text-muted me-1"
          style={{ fontSize: '0.72rem', opacity: 0.7 }}
          aria-hidden="true"
        />

        {migas.map((miga, indice) => {
          const esUltima = indice === migas.length - 1;
          const esDato = miga.esDato || (!miga.ruta && !esUltima);

          return (
            <div key={`${miga.etiqueta}-${indice}`} className="d-inline-flex align-items-center gap-1">
              {indice > 0 && (
                <i
                  className="bi bi-chevron-right text-muted opacity-50"
                  style={{ fontSize: '0.62rem', margin: '0 2px' }}
                  aria-hidden="true"
                />
              )}

              {miga.ruta && !esUltima ? (
                <Link
                  to={miga.ruta}
                  className="text-secondary text-decoration-none fw-medium"
                  style={{ transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sm-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {miga.etiqueta}
                </Link>
              ) : esDato ? (
                <span
                  className="px-2 py-0.5 rounded-pill fw-semibold"
                  style={{
                    backgroundColor: 'var(--sm-surface)',
                    border: '1px solid var(--sm-border)',
                    color: 'var(--sm-ink)',
                    fontSize: '0.74rem',
                  }}
                >
                  {miga.etiqueta}
                </span>
              ) : (
                <span className={esUltima ? 'text-dark fw-semibold' : 'text-muted'}>
                  {miga.etiqueta}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
