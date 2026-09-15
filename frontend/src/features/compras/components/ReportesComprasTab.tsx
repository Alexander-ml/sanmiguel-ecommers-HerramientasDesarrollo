import { useGastoProveedores, useComparativoCostos, useTiemposEntrega, useTasaDevoluciones } from '../hooks/useCompras';
import { formatearMoneda } from '../../../lib/format';

/** Pestaña "Reportes de Abastecimiento" (RF-COM-015, REP-COM-01 a 04). Autocontenida. */
export function ReportesComprasTab() {
  const { data: gastoProveedores } = useGastoProveedores();
  const { data: comparativoCostos } = useComparativoCostos();
  const { data: tiemposEntrega } = useTiemposEntrega();
  const { data: tasaDevolucion } = useTasaDevoluciones();
  const totalGlobal = gastoProveedores?.reduce((s, g) => s + g.montoTotal, 0) ?? 0;

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        <div className="card border-0 shadow-sm p-4 h-100">
          <h3 className="h6 fw-bold mb-3">
            <i className="bi bi-pie-chart me-2 text-primary" />
            Gasto Acumulado por Proveedor
          </h3>
          <p className="text-muted small mb-4">
            Distribución del volumen de compra y presupuesto por proveedor registrado.
          </p>

          {gastoProveedores && (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    <th className="text-center">Órdenes</th>
                    <th className="text-end">Monto Total</th>
                    <th className="text-end" style={{ width: 140 }}>% del Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {gastoProveedores.map((g) => {
                    const pct = totalGlobal > 0 ? (g.montoTotal / totalGlobal) * 100 : 0;
                    return (
                      <tr key={g.proveedorId}>
                        <td>
                          <div className="fw-medium small">{g.proveedorNombre}</div>
                        </td>
                        <td className="text-center small">{g.totalOrdenes}</td>
                        <td className="text-end fw-semibold small sm-nums">{formatearMoneda(g.montoTotal)}</td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <div className="progress flex-grow-1" style={{ height: 6, backgroundColor: 'var(--sm-border)' }}>
                              <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="small text-muted" style={{ fontSize: '0.75rem', width: 35 }}>
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm p-4 h-100">
          <h3 className="h6 fw-bold mb-3">
            <i className="bi bi-clock-history me-2 text-primary" />
            Tiempos de Entrega Promedio
          </h3>
          {tiemposEntrega?.length ? (
            tiemposEntrega.map((t) => (
              <div key={t.proveedorId} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                <span className="text-truncate" style={{ maxWidth: 160 }}>{t.proveedorNombre}</span>
                <span className="fw-semibold">{t.diasPromedio} días</span>
              </div>
            ))
          ) : (
            <p className="text-muted small mb-0">Aún no hay recepciones registradas para calcular este indicador.</p>
          )}

          <div className="mt-4 pt-3 border-top">
            <h4 className="small fw-bold mb-2">
              <i className="bi bi-arrow-return-left me-1 text-danger" />
              Tasa de Devolución Global
            </h4>
            {tasaDevolucion ? (
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-4 fw-bold text-danger">{tasaDevolucion.tasaDevolucion}%</span>
                <span className="text-muted small">
                  ({tasaDevolucion.totalUnidadesDevueltas} de {tasaDevolucion.totalUnidadesRecibidas} unidades)
                </span>
              </div>
            ) : (
              <p className="text-muted small mb-0">Sin datos suficientes.</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm p-4 h-100">
          <h3 className="h6 fw-bold mb-3">
            <i className="bi bi-graph-up me-2 text-primary" />
            Comparativo de Costos por Prenda
          </h3>
          {comparativoCostos?.length ? (
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Prenda</th>
                    <th className="text-end">Mín.</th>
                    <th className="text-end">Prom.</th>
                    <th className="text-end">Máx.</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativoCostos.slice(0, 8).map((c) => (
                    <tr key={c.varianteId}>
                      <td className="small">{c.productoNombre} ({c.talla}/{c.color})</td>
                      <td className="text-end small text-muted">{formatearMoneda(c.costoMinimo)}</td>
                      <td className="text-end small fw-semibold">{formatearMoneda(c.costoPromedio)}</td>
                      <td className="text-end small text-muted">{formatearMoneda(c.costoMaximo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted small mb-0">Sin órdenes suficientes para comparar costos.</p>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm p-4">
          <h3 className="h6 fw-bold mb-3">
            <i className="bi bi-shield-check me-2 text-primary" />
            Políticas Operativas de Abastecimiento
          </h3>
          <ul className="list-unstyled small mb-0 row g-2">
            <li className="mb-3 d-flex gap-2 col-md-6">
              <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Validación de Existencia de Variante:</strong>
                <div className="text-muted">Solo se pueden ordenar prendas activas registradas en el inventario.</div>
              </div>
            </li>
            <li className="mb-3 d-flex gap-2 col-md-6">
              <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Control de Recepción Exacta:</strong>
                <div className="text-muted">Las recepciones parciales están estrictamente limitadas al saldo pendiente de cada línea.</div>
              </div>
            </li>
            <li className="mb-3 d-flex gap-2 col-md-6">
              <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Cancelación Restringida:</strong>
                <div className="text-muted">Solo es posible cancelar órdenes que no tengan recepciones físicas registradas.</div>
              </div>
            </li>
            <li className="mb-3 d-flex gap-2 col-md-6">
              <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Cálculo Automático de Estado:</strong>
                <div className="text-muted">El avance de la orden se calcula automáticamente en base a las cantidades ingresadas.</div>
              </div>
            </li>
            <li className="d-flex gap-2 col-md-6">
              <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Sincronización Inmediata con Almacén:</strong>
                <div className="text-muted">Cada entrega recibida incrementa el stock físico de almacén en tiempo real.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
