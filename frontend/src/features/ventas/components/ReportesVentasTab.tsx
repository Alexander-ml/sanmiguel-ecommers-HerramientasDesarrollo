import { useVentasPorMetodo, useVentasPorVendedor, useVentasPorCliente, useResumenVentas } from '../hooks/useVentas';
import { formatearMoneda } from '../../../lib/format';

/**
 * Pestaña "Reportes de Ventas" (RF-VENT-018). Cubre los reportes que no eran solo un número
 * de resumen: por método de pago, por vendedor, por cliente — REP-VEN-04/05/07. El ticket
 * promedio (REP-VEN-06) y las canceladas (REP-VEN-08) ya vienen en `useResumenVentas()`.
 */
export function ReportesVentasTab() {
  const { data: resumen } = useResumenVentas();
  const { data: porMetodo } = useVentasPorMetodo();
  const { data: porVendedor } = useVentasPorVendedor();
  const { data: porCliente } = useVentasPorCliente();

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div
            className="card border shadow-sm p-3 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <span className="text-muted small">Ticket Promedio</span>
            <span className="fs-4 fw-bold text-primary sm-nums mt-1">
              {resumen ? formatearMoneda(resumen.ticketPromedio) : '—'}
            </span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div
            className="card border shadow-sm p-3 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <span className="text-muted small">Ventas Confirmadas</span>
            <span className="fs-4 fw-bold text-success mt-1">{resumen?.totalConfirmadas ?? '—'}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div
            className="card border shadow-sm p-3 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <span className="text-muted small">Canceladas / Rechazadas</span>
            <span className="fs-4 fw-bold text-danger mt-1">{resumen?.totalCanceladas ?? '—'}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div
            className="card border shadow-sm p-3 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <span className="text-muted small">Ingresos Totales</span>
            <span className="fs-4 fw-bold text-dark sm-nums mt-1">
              {resumen ? formatearMoneda(resumen.importeTotal) : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div
            className="card border shadow-sm p-4 h-100"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <h3 className="h6 fw-bold mb-3 text-dark">
              <i className="bi bi-credit-card me-2 text-primary" />
              Ventas por Método de Pago
            </h3>
            {porMetodo?.map((m) => (
              <div key={m.metodoPago} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                <span className="text-capitalize">{m.metodoPago.replace('_', ' ')}</span>
                <span className="fw-semibold sm-nums">{formatearMoneda(m.importeTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div
            className="card border shadow-sm p-4 h-100"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <h3 className="h6 fw-bold mb-3 text-dark">
              <i className="bi bi-person-badge me-2 text-primary" />
              Ventas por Vendedor
            </h3>
            {porVendedor?.map((v) => (
              <div key={v.vendedorId} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                <span>{v.vendedorNombre} <span className="text-muted">({v.cantidadVentas})</span></span>
                <span className="fw-semibold sm-nums">{formatearMoneda(v.importeTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div
            className="card border shadow-sm p-4 h-100"
            style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
          >
            <h3 className="h6 fw-bold mb-3 text-dark">
              <i className="bi bi-people me-2 text-primary" />
              Top Clientes por Compra
            </h3>
            {porCliente?.slice(0, 8).map((c) => (
              <div key={c.clienteNombre} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                <span className="text-truncate" style={{ maxWidth: 160 }}>{c.clienteNombre}</span>
                <span className="fw-semibold sm-nums">{formatearMoneda(c.importeTotal)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
