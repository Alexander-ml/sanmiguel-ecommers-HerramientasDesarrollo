import type { ResumenSeguridad } from '../types';

interface SeguridadResumenCardsProps {
  resumen?: ResumenSeguridad;
  isLoading?: boolean;
  tab?: 'usuarios' | 'roles' | 'sesiones';
}

/**
 * Cintillo compacto de métricas de Seguridad y Accesos.
 * Ahorra espacio vertical ubicándose discretamente según la pestaña activa.
 */
export function SeguridadResumenCards({ resumen, isLoading, tab }: SeguridadResumenCardsProps) {
  if (isLoading || !resumen) {
    return (
      <div className="d-flex align-items-center gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-shield-lock text-primary" />
        <span>Cargando indicadores de seguridad…</span>
      </div>
    );
  }

  if (tab === 'usuarios') {
    return (
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-people text-primary" />
        <span>
          Total: <strong className="text-dark">{resumen.totalUsuarios}</strong> usuarios internos
        </span>
        <span>·</span>
        <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
          {resumen.usuariosActivos} activos habilitados
        </span>
      </div>
    );
  }

  if (tab === 'roles') {
    return (
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-shield-shaded text-primary" />
        <span>
          Roles del sistema: <strong className="text-dark">{resumen.totalRoles}</strong>
        </span>
        <span>·</span>
        <span>
          Personal asignado: <strong className="text-dark">{resumen.totalUsuarios}</strong>
        </span>
        <span>·</span>
        <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
          {resumen.sesionesActivas} sesiones activas
        </span>
      </div>
    );
  }

  // En 'sesiones'
  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
      <i className="bi bi-display text-primary" />
      <span>
        Sesiones activas en tiempo real: <strong className="text-dark">{resumen.sesionesActivas}</strong>
      </span>
      <span>·</span>
      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
        {resumen.intentosFallidos24h} intentos fallidos (24h)
      </span>
    </div>
  );
}
