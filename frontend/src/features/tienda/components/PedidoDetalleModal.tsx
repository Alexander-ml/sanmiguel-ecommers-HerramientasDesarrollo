import { Modal } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { StatusBadge, estadoPedidoAEstado } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Pedido, EstadoPedido } from '../types';

interface PedidoDetalleModalProps {
  pedido: Pedido | null;
  onCerrar: () => void;
  onSolicitarCambioEstado: (pedido: Pedido, nuevoEstado: EstadoPedido, titulo: string, desc: string, tono?: 'danger' | 'primary') => void;
  esAdminOVendedor: boolean;
}

/**
 * Modal administrativo para inspección de prendas, comprobantes y cambio de estado de pedido.
 */
export function PedidoDetalleModal({
  pedido,
  onCerrar,
  onSolicitarCambioEstado,
  esAdminOVendedor,
}: PedidoDetalleModalProps) {
  if (!pedido) return null;

  return (
    <Modal show={!!pedido} onHide={onCerrar} size="lg" centered>
      <Modal.Header closeButton>
        <div>
          <span className="small text-muted text-uppercase d-block">Detalle del Pedido</span>
          <Modal.Title className="h5 fw-bold text-primary font-monospace mb-0">
            {pedido.codigo}
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <span className="small text-muted">
            Fecha: <strong>{formatearFechaHora(pedido.fecha)}</strong>
          </span>
          <StatusBadge estado={estadoPedidoAEstado(pedido.estado)} />
        </div>

        {/* Datos del Cliente y Despacho */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded text-muted small h-100"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <h4 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-person text-primary" />
                Datos del Cliente
              </h4>
              <p className="mb-1 text-dark">
                <strong>Nombre:</strong> {pedido.contacto.nombres} {pedido.contacto.apellidos}
              </p>
              <p className="mb-1">
                <strong>Correo:</strong> {pedido.contacto.email}
              </p>
              <p className="mb-0">
                <strong>Teléfono:</strong> {pedido.contacto.telefono}
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded text-muted small h-100"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <h4 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-truck text-primary" />
                Despacho y Pago
              </h4>
              <p className="mb-1 text-dark">
                <strong>Modalidad:</strong>{' '}
                {pedido.modalidadEntrega === 'envio' ? 'Envío a domicilio' : 'Recojo en tienda'}
              </p>
              {pedido.modalidadEntrega === 'envio' && (
                <p className="mb-1">
                  <strong>Dirección:</strong> {pedido.contacto.direccion},{' '}
                  {pedido.contacto.ciudad}
                </p>
              )}
              <p className="mb-0">
                <strong>Método de pago:</strong>{' '}
                <span className="badge bg-white text-dark border text-uppercase">
                  {pedido.metodoPago}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de prendas */}
        <h4 className="h6 fw-bold mb-2 text-dark">Prendas Solicitadas</h4>
        <div className="table-responsive mb-3">
          <table className="table table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Prenda</th>
                <th>Talla/Color</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Precio Unit.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles.map((it) => (
                <tr key={it.varianteId}>
                  <td className="fw-medium small text-dark">{it.productoNombre}</td>
                  <td className="small text-muted">{it.talla} · {it.color}</td>
                  <td className="text-center small">{it.cantidad}</td>
                  <td className="text-end small">{formatearMoneda(it.precioUnitario)}</td>
                  <td className="text-end small fw-bold">
                    {formatearMoneda(it.precioUnitario * it.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-end fw-bold">Total</td>
                <td className="text-end fw-bold text-primary fs-6">
                  {formatearMoneda(pedido.importeTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onCerrar}>
          Cerrar
        </Button>

        {esAdminOVendedor && pedido.estado !== 'cancelado' && (
          <div className="d-flex gap-2">
            {pedido.estado === 'pendiente_pago' && (
              <Button
                variant="primary"
                size="sm"
                icon={<i className="bi bi-check-circle" />}
                onClick={() =>
                  onSolicitarCambioEstado(
                    pedido,
                    'confirmado',
                    'Confirmar Pago',
                    `¿Confirmar que se validó el pago de ${pedido.codigo}? Se reservará stock en inventario.`,
                  )
                }
              >
                Aprobar Pago
              </Button>
            )}

            {pedido.estado === 'confirmado' && (
              <Button
                variant="primary"
                size="sm"
                icon={<i className="bi bi-box-seam" />}
                onClick={() =>
                  onSolicitarCambioEstado(
                    pedido,
                    'en_preparacion',
                    'Pasar a Preparación',
                    `¿Pasar el pedido ${pedido.codigo} a preparación en almacén?`,
                  )
                }
              >
                Enviar a Preparación
              </Button>
            )}

            {pedido.estado === 'en_preparacion' && (
              <Button
                variant="primary"
                size="sm"
                icon={<i className="bi bi-bag-check" />}
                onClick={() =>
                  onSolicitarCambioEstado(
                    pedido,
                    'listo_entregado',
                    'Marcar como Entregado',
                    `¿Confirmar la entrega definitiva o recojo del pedido ${pedido.codigo}?`,
                  )
                }
              >
                Confirmar Entrega
              </Button>
            )}

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() =>
                onSolicitarCambioEstado(
                  pedido,
                  'cancelado',
                  'Cancelar Pedido',
                  `¿Estás seguro de cancelar el pedido ${pedido.codigo}? Se liberará cualquier reserva de stock.`,
                  'danger',
                )
              }
            >
              Cancelar Pedido
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}
