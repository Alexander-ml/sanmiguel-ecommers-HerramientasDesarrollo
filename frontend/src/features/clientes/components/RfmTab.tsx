import { useResumenClientes, useClientes } from '../hooks/useClientes';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { formatearMoneda } from '../../../lib/format';

/**
 * Pestaña "Segmentación RFM y Reportes" (RF-CLI-015/016, RN-CLI-04).
 *
 * Corrección aplicada: antes, los conteos por segmento se calculaban filtrando
 * `dataClientes.datos` — es decir, solo los clientes de la página actual del directorio (10 de
 * N), dando un total incorrecto. Ahora usa `useResumenClientes()`, que agrega sobre la base
 * completa de clientes (ver mocks/handlers/clientes.handlers.ts).
 */
export function RfmTab() {
  const { data: resumen, isLoading } = useResumenClientes();
  const { data: dataClientes } = useClientes({});

  const topClientesPorValor = [...(dataClientes?.datos ?? [])]
    .sort((a, b) => b.totalGastado - a.totalGastado)
    .slice(0, 8);

  if (isLoading || !resumen) return <LoadingState etiqueta="Calculando segmentación…" />;

  const segmentos = [
    {
      id: 'VIP',
      etiqueta: 'VIP / Leal',
      badge: 'bg-primary text-white',
      icono: 'bi-star-fill text-warning',
      criterio: 'Alta frecuencia y monto elevado, compra reciente',
      cantidad: resumen.clientesVip,
      accion: 'Prioridad en atención y stock',
      accionClase: 'text-primary',
    },
    {
      id: 'FRECUENTE',
      etiqueta: 'Frecuente',
      badge: 'bg-info text-dark',
      icono: 'bi-repeat',
      criterio: 'Compras recurrentes de valor medio',
      cantidad: resumen.clientesFrecuentes,
      accion: 'Fidelización continua',
      accionClase: 'text-muted',
    },
    {
      id: 'EN_RIESGO',
      etiqueta: 'En riesgo',
      badge: 'bg-warning text-dark',
      icono: 'bi-exclamation-triangle',
      criterio: 'Cliente habitual que no compra hace más de 180 días',
      cantidad: resumen.clientesEnRiesgo,
      accion: 'Reactivación preventiva',
      accionClase: 'text-warning fw-medium',
    },
    {
      id: 'INACTIVO',
      etiqueta: 'Inactivo',
      badge: 'bg-light text-muted border',
      icono: '',
      criterio: 'Sin compras en el último año',
      cantidad: resumen.clientesInactivos,
      accion: 'Evaluación de permanencia',
      accionClase: 'text-muted',
    },
    {
      id: 'NUEVO',
      etiqueta: 'Nuevo',
      badge: 'bg-success text-white',
      icono: 'bi-sparkles',
      criterio: 'Primera compra realizada recientemente',
      cantidad: resumen.clientesNuevos,
      accion: 'Bienvenida y seguimiento',
      accionClase: 'text-success fw-medium',
    },
  ];

  const totalVinculacion = resumen.pedidosInvitadosVinculados + resumen.pedidosInvitadosSinVincular;
  const pctVinculacion = totalVinculacion > 0 ? (resumen.pedidosInvitadosVinculados / totalVinculacion) * 100 : 0;

  return (
    <div className="row g-4">
      <div className="col-12 col-xl-7">
        <div
          className="card border shadow-sm p-4 h-100"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--sm-border)',
            borderRadius: 'var(--sm-radius-md, 8px)',
          }}
        >
          <h3 className="h6 fw-bold mb-3 text-dark">
            <i className="bi bi-graph-up-arrow me-2 text-primary" />
            Matriz de Segmentación RFM (Recencia, Frecuencia y Monto)
          </h3>
          <p className="text-muted small mb-4">
            El sistema clasifica a los compradores a partir de su frecuencia de compra, volumen
            de gasto y fecha de última interacción comercial — calculado sobre la base completa
            de clientes, no solo la página visible del directorio.
          </p>

          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Segmento</th>
                  <th>Criterio de Clasificación</th>
                  <th className="text-center">Compradores</th>
                  <th className="text-end">Acción Sugerida</th>
                </tr>
              </thead>
              <tbody>
                {segmentos.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className={`badge rounded-pill ${s.badge}`}>
                        {s.icono && <i className={`bi ${s.icono} me-1`} />}
                        {s.etiqueta}
                      </span>
                    </td>
                    <td className="small text-muted">{s.criterio}</td>
                    <td className="text-center fw-bold small">{s.cantidad}</td>
                    <td className={`text-end small ${s.accionClase}`}>{s.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="alert alert-light border small mt-4 mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-info-circle text-primary fs-5 flex-shrink-0" />
            <div>
              <strong>Segmentación Comercial:</strong> Esta clasificación es de consulta interna
              gerencial para análisis y fidelización. El sistema no envía comunicaciones
              comerciales automáticas a los clientes.
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-5">
        <div className="d-flex flex-column gap-4 h-100">
          <div
            className="card border shadow-sm p-4"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <h3 className="h6 fw-bold mb-2 text-dark">
              <i className="bi bi-trophy me-2 text-primary" />
              Valor Acumulado por Cliente
            </h3>
            <p className="text-muted small mb-3">
              Monto total representado por cada comprador a lo largo del tiempo (REP-CLI-03).
            </p>
            {topClientesPorValor.map((c) => (
              <div key={c.id} className="d-flex justify-content-between align-items-center py-2 border-bottom small">
                <span className="text-truncate" style={{ maxWidth: 200 }}>{c.nombres} {c.apellidos}</span>
                <span className="fw-semibold sm-nums">{formatearMoneda(c.totalGastado)}</span>
              </div>
            ))}
          </div>

          <div
            className="card border shadow-sm p-4 flex-grow-1"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <h3 className="h6 fw-bold mb-2 text-dark">
              <i className="bi bi-person-check me-2 text-primary" />
              Tasa de Vinculación de Invitados
            </h3>
            <p className="text-muted small mb-3">
              Mide la proporción de pedidos hechos como invitado que terminan vinculados a una cuenta formal.
            </p>

            <div
              className="p-3 rounded text-center mb-3"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <span className="text-muted small d-block mb-1">Pedidos de invitado vinculados</span>
              <div className="fw-bold fs-3 text-primary mb-1">
                {resumen.pedidosInvitadosVinculados} de {totalVinculacion}
              </div>
              <div className="progress mt-2" style={{ height: 8, backgroundColor: 'var(--sm-border)' }}>
                <div className="progress-bar bg-success" style={{ width: `${pctVinculacion}%` }} />
              </div>
              <span className="small text-muted mt-2 d-block">
                {pctVinculacion.toFixed(0)}% de efectividad en registro
              </span>
            </div>

            <p className="text-muted small mb-0">
              <i className="bi bi-shield-lock me-1 text-primary" />
              <strong>Seguridad y Verificación:</strong> Los pedidos solo se asocian tras comprobar
              la titularidad del correo electrónico del comprador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
