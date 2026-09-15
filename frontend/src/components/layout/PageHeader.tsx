import type { ReactNode } from 'react';

interface PageHeaderProps {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
  badge?: ReactNode;
}

/**
 * Encabezado dominante de toda página administrativa (Design System §5.2).
 * Proporciona el ancla visual principal de la pantalla, complementado
 * por la línea discreta de Breadcrumbs superior.
 */
export function PageHeader({ titulo, descripcion, accion, badge }: PageHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4 pb-2 border-bottom border-light">
      <div>
        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <h1
            className="h3 fw-bold mb-0"
            style={{
              color: 'var(--sm-ink)',
              letterSpacing: '-0.025em',
              fontFamily: 'var(--sm-font-display)',
            }}
          >
            {titulo}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {descripcion && (
          <p className="text-muted small mb-0" style={{ maxWidth: 700, lineHeight: 1.5 }}>
            {descripcion}
          </p>
        )}
      </div>
      {accion && <div className="flex-shrink-0 mt-1 mt-md-0">{accion}</div>}
    </div>
  );
}
