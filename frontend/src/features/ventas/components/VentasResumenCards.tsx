import { useResumenVentas } from '../hooks/useVentas';
import { formatearMoneda } from '../../../lib/format';

interface VentasResumenCardsProps {
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * Cintillo compacto de métricas para Listado de Ventas.
 * Ahorra espacio vertical ubicándose armónicamente bajo la barra de filtros.
 */
export function VentasResumenCards({ fechaDesde, fechaHasta }: VentasResumenCardsProps) {
  const { data, isLoading } = useResumenVentas({ fechaDesde, fechaHasta });

  if (isLoading || !data) {
    return (
      <div className="d-flex align-items-center gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-receipt text-primary" />
        <span>Cargando resumen de ventas…</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
      <i className="bi bi-receipt text-primary" />
      <span>
        Total: <strong className="text-dark">{data.totalVentas}</strong> ventas
      </span>
      <span>·</span>
      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
        {data.totalConfirmadas} confirmadas
      </span>
      <span>·</span>
      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
        {data.totalPendientes} pendientes
      </span>
      {data.totalCanceladas > 0 && (
        <>
          <span>·</span>
          <span className="badge bg-danger-subtle text-danger-emphasis border border-danger-subtle">
            {data.totalCanceladas} canceladas
          </span>
        </>
      )}
      <span className="ms-md-auto text-dark">
        Ticket prom.: <strong className="text-dark me-3">{formatearMoneda(data.ticketPromedio)}</strong>
        Total: <strong className="text-primary">{formatearMoneda(data.importeTotal)}</strong>
      </span>
    </div>
  );
}
