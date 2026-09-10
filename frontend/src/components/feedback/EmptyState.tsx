import type { ReactNode } from 'react';

interface EmptyStateProps {
  icono?: string; // clase de bootstrap-icons, ej. "bi-inbox"
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

/**
 * Estado vacío estándar. Regla de contenido (sección "UX de tablas" del prompt maestro):
 * un vacío es una invitación a actuar, no una disculpa — por eso siempre admite una `accion`.
 */
export function EmptyState({ icono = 'bi-inbox', titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icono}`} style={{ fontSize: '2.5rem', color: 'var(--sm-neutral)' }} />
      <p className="fw-semibold mt-3 mb-1">{titulo}</p>
      {descripcion && (
        <p className="text-muted small mb-3" style={{ maxWidth: 360, marginInline: 'auto' }}>
          {descripcion}
        </p>
      )}
      {accion}
    </div>
  );
}
