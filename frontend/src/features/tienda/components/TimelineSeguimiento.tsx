import { StatusBadge, estadoPedidoAEstado } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Pedido, EstadoPedido, PedidoSeguimientoPublico } from '../types';

const PASOS_ESTADO: { estado: EstadoPedido; label: string; desc: string; icono: string }[] = [
  {
    estado: 'pendiente_pago',
    label: 'Pendiente de pago',
    desc: 'Esperando procesamiento del pago.',
    icono: 'bi-clock',
  },
  {
    estado: 'confirmado',
    label: 'Pago confirmado',
    desc: 'El pago fue aprobado e Inventario reservó las prendas.',
    icono: 'bi-check-circle',
  },
  {
    estado: 'en_preparacion',
    label: 'En preparación',
    desc: 'El almacén está alistando las prendas para despacho.',
    icono: 'bi-box-seam',
  },
  {
    estado: 'listo_entregado',
    label: 'Listo / Entregado',
    desc: 'El pedido fue entregado o está listo para recojo.',
    icono: 'bi-bag-check',
  },
];

function indicePaso(estado: EstadoPedido): number {
  switch (estado) {
    case 'pendiente_pago':
    case 'en_espera_confirmacion':
      return 0;
    case 'confirmado':
      return 1;
    case 'en_preparacion':
      return 2;
    case 'listo_entregado':
      return 3;
    case 'cancelado':
      return -1;
    default:
      return 0;
  }
}

interface TimelineSeguimientoProps {
  pedido: Pedido | PedidoSeguimientoPublico;
}

/**
 * Visualización del avance del pedido en línea de tiempo (Design System §3).
 */
export function TimelineSeguimiento({ pedido }: TimelineSeguimientoProps) {
  const pasoActual = indicePaso(pedido.estado);
  const esCancelado = pedido.estado === 'cancelado';

  return (
    <div className="card border-0 shadow-sm p-4 p-md-5 mb-5" style={{ borderRadius: 'var(--sm-radius-md)' }}>
      {/* Encabezado del Pedido */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-3 mb-4 border-bottom">
        <div>
          <span className="text-muted small fw-semibold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
            Código de seguimiento
          </span>
          <h2
            className="sm-font-display mb-1 text-primary"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 700, fontFamily: 'monospace' }}
          >
            {pedido.codigo}
          </h2>
          <p className="text-muted small mb-0">
            Emitido el {formatearFechaHora(pedido.fecha)}
            {'contacto' in pedido && <> · Cliente: {pedido.contacto.nombres} {pedido.contacto.apellidos}</>}
          </p>
        </div>
        <StatusBadge estado={estadoPedidoAEstado(pedido.estado)} />
      </div>

      {/* Alerta si fue cancelado */}
      {esCancelado ? (
        <div className="alert alert-danger d-flex align-items-center gap-3 my-3">
          <i className="bi bi-x-octagon-fill fs-3" />
          <div>
            <h3 className="h6 fw-bold mb-0">Pedido Cancelado</h3>
            <p className="small mb-0">Este pedido fue cancelado. Si consideras que es un error, contáctanos.</p>
          </div>
        </div>
      ) : (
        /* Stepper Visual */
        <div className="py-4 my-2">
          <div className="row g-3">
            {PASOS_ESTADO.map((paso, idx) => {
              const completado = idx < pasoActual;
              const activo = idx === pasoActual;

              return (
                <div key={paso.estado} className="col-12 col-md-3 text-center text-md-start">
                  <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-2">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                        completado
                          ? 'bg-success text-white'
                          : activo
                          ? 'bg-primary text-white shadow'
                          : 'bg-light text-muted border'
                      }`}
                      style={{ width: 42, height: 42, flexShrink: 0 }}
                    >
                      {completado ? <i className="bi bi-check-lg fs-5" /> : <i className={`bi ${paso.icono}`} />}
                    </div>
                    <div className="text-center text-md-start">
                      <h3
                        className={`small fw-bold mb-0 ${activo ? 'text-primary' : completado ? 'text-dark' : 'text-muted'}`}
                      >
                        {paso.label}
                      </h3>
                      <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                        {paso.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desglose de Prendas y Entrega */}
      <div className="row g-4 pt-3 border-top">
        <div className="col-12 col-md-6">
          <h4 className="h6 fw-bold mb-3 text-dark">Prendas en este pedido</h4>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Prenda</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.detalles.map((item) => (
                  <tr key={item.varianteId}>
                    <td>
                      <div className="fw-semibold text-dark small">{item.productoNombre}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Talla: {item.talla} · Color: {item.color}
                      </div>
                    </td>
                    <td className="text-center small">{item.cantidad}</td>
                    <td className="text-end small fw-semibold">
                      {formatearMoneda(item.precioUnitario * item.cantidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-end fw-bold">Total</td>
                  <td className="text-end fw-bold text-primary fs-6">
                    {formatearMoneda(pedido.importeTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h4 className="h6 fw-bold mb-3 text-dark">Datos de Despacho</h4>
          <div className="p-3 bg-light rounded-3 text-muted small">
            <p className="mb-1 text-dark">
              <strong>Modalidad:</strong>{' '}
              {pedido.modalidadEntrega === 'envio' ? 'Envío a domicilio' : 'Recojo en tienda'}
            </p>
            {'contacto' in pedido && pedido.modalidadEntrega === 'envio' && (
              <p className="mb-1 text-dark">
                <strong>Dirección:</strong> {pedido.contacto.direccion}, {pedido.contacto.ciudad}
                {pedido.contacto.referencia && <> — {pedido.contacto.referencia}</>}
              </p>
            )}
            {'contacto' in pedido && (
              <>
                <p className="mb-1">
                  <strong>Teléfono de contacto:</strong> {pedido.contacto.telefono}
                </p>
                <p className="mb-0">
                  <strong>Correo:</strong> {pedido.contacto.email}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
