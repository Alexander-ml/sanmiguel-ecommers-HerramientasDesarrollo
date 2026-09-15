import { useReporteValorizado, useReporteRotacion } from '../hooks/useInventario';
import { formatearMoneda } from '../../../lib/format';

/** Pestaña "Kardex y Reportes" (RF-INV-022): valorización + rotación. Autocontenida. */
export function ReportesTab() {
  const { data: reporteValorizado } = useReporteValorizado();
  const { data: reporteRotacion } = useReporteRotacion();

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 'var(--sm-radius-md)' }}>
          <div className="card-body">
            <h3 className="h6 fw-semibold mb-3">
              <i className="bi bi-currency-dollar me-2 text-primary" />
              Valorización del inventario
            </h3>
            {reporteValorizado ? (
              <>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-end">Unidades</th>
                        <th className="text-end">Valor total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteValorizado.items.slice(0, 8).map((item) => (
                        <tr key={item.productoId}>
                          <td style={{ fontSize: 'var(--sm-text-sm)' }}>{item.productoNombre}</td>
                          <td className="text-end text-muted small">{item.unidadesTotales}</td>
                          <td className="text-end fw-medium small sm-nums">{formatearMoneda(item.valorTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pt-2 border-top d-flex justify-content-between">
                  <span className="fw-semibold small">Total valorizado:</span>
                  <span className="fw-bold text-primary sm-nums">{formatearMoneda(reporteValorizado.totalGeneral)}</span>
                </div>
              </>
            ) : (
              <p className="text-muted small">Sin datos de valorización.</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 'var(--sm-radius-md)' }}>
          <div className="card-body">
            <h3 className="h6 fw-semibold mb-3">
              <i className="bi bi-arrow-repeat me-2 text-primary" />
              Rotación de stock
            </h3>
            {reporteRotacion ? (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Prenda</th>
                      <th>Marca</th>
                      <th className="text-end">Salidas</th>
                      <th className="text-end">Stock actual</th>
                      <th className="text-end">Índice de Rotación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteRotacion.slice(0, 8).map((item) => (
                      <tr key={item.productoId}>
                        <td style={{ fontSize: 'var(--sm-text-sm)' }}>{item.productoNombre}</td>
                        <td className="text-muted small">{item.marca}</td>
                        <td className="text-end small">{item.totalSalidas}</td>
                        <td className="text-end small">{item.stockActual}</td>
                        <td className="text-end fw-semibold small text-primary">{item.indiceRotacion.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted small">Sin datos de rotación.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
