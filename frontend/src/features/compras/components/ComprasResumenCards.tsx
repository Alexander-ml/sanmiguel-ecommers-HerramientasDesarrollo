import { formatearMoneda } from '../../../lib/format';
import type { ResumenCompras } from '../types';

interface ComprasResumenCardsProps {
  resumen?: ResumenCompras;
  isLoading?: boolean;
}

/**
 * Cintillo compacto de estado para Órdenes de Compra.
 * Ahorra espacio vertical ubicándose armónicamente bajo la barra de filtros.
 */
export function ComprasResumenCards({ resumen, isLoading }: ComprasResumenCardsProps) {
  if (isLoading || !resumen) {
    return (
      <div className="d-flex align-items-center gap-2 mb-3 text-muted small px-1">
        <i className="bi bi-receipt-cutoff text-primary" />
        <span>Cargando resumen de órdenes…</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
      <i className="bi bi-receipt-cutoff text-primary" />
      <span>
        Total: <strong className="text-dark">{resumen.totalOrdenes}</strong> órdenes
      </span>
      <span>·</span>
      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
        {resumen.pendientes} pendientes
      </span>
      <span>·</span>
      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
        {resumen.parcialmenteRecibidas} parciales
      </span>
      <span>·</span>
      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
        {resumen.recibidas} recibidas
      </span>
      <span className="ms-md-auto text-dark">
        Gasto total: <strong className="text-primary">{formatearMoneda(resumen.gastoTotal)}</strong>
      </span>
    </div>
  );
}
