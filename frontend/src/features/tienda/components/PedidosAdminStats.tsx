import type { ResumenPedidos } from '../types';

interface PedidosAdminStatsProps {
  resumen?: ResumenPedidos;
}

/**
 * Cintillo compacto de métricas operativas de pedidos de e-commerce.
 * Mantiene consistencia visual con Almacén, Compras y Ventas.
 */
export function PedidosAdminStats({ resumen }: PedidosAdminStatsProps) {
  if (!resumen) return null;

  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 text-muted small px-1">
      <i className="bi bi-bag-check text-primary" />
      <span>
        Total: <strong className="text-dark">{resumen.total}</strong> pedidos
      </span>
      <span>·</span>
      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
        {resumen.pendientePago} pendientes pago
      </span>
      <span>·</span>
      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">
        {resumen.enPreparacion} en preparación
      </span>
      <span>·</span>
      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
        {resumen.listos} listos / entregados
      </span>
      {resumen.cancelados > 0 && (
        <>
          <span>·</span>
          <span className="badge bg-danger-subtle text-danger-emphasis border border-danger-subtle">
            {resumen.cancelados} cancelados
          </span>
        </>
      )}
    </div>
  );
}
