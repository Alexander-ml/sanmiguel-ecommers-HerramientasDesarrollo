import type { ResumenClientes } from '../types';

interface ClientesResumenCardsProps {
  resumen?: ResumenClientes;
  isLoading?: boolean;
  tab?: 'directorio' | 'rfm' | 'arco';
}

/**
 * Cintillo compacto de métricas de clientes.
 * Ahorra espacio vertical ubicándose discretamente según la pestaña activa.
 */
export function ClientesResumenCards({ resumen, isLoading, tab }: ClientesResumenCardsProps) {
  if (isLoading || !resumen) {
    return (
      <div className="d-flex align-items-center gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-people text-primary" />
        <span>Cargando métricas de clientes…</span>
      </div>
    );
  }

  if (tab === 'directorio') {
    return (
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-people text-primary" />
        <span>
          Total: <strong className="text-dark">{resumen.totalClientes}</strong> compradores
        </span>
        <span>·</span>
        <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
          {resumen.clientesActivos} activos
        </span>
        <span>·</span>
        <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
          {resumen.pedidosInvitadosSinVincular} invitados sin cuenta
        </span>
      </div>
    );
  }

  if (tab === 'arco') {
    return (
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-shield-check text-primary" />
        <span>
          Solicitudes ARCO pendientes:{' '}
          <strong className={resumen.solicitudesArcoPendientes > 0 ? 'text-danger' : 'text-success'}>
            {resumen.solicitudesArcoPendientes}
          </strong>
        </span>
        <span>·</span>
        <span className="badge bg-light text-muted border">Ley N° 29733 (Protección de Datos Personales)</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
      <i className="bi bi-graph-up-arrow text-primary" />
      <span>
        Base analizada: <strong className="text-dark">{resumen.totalClientes}</strong> compradores
      </span>
      <span>·</span>
      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
        {resumen.clientesVip} VIP / Leal
      </span>
      <span>·</span>
      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
        {resumen.clientesEnRiesgo} en riesgo
      </span>
    </div>
  );
}
