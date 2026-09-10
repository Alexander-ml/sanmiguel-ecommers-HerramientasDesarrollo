import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { formatearMoneda } from '../../../lib/format';
import type { Producto } from '../../catalogo/types';

interface ModalConfirmacionAgregadoProps {
  show: boolean;
  onHide: () => void;
  producto: Producto;
  talla: string | null;
  color: string | null;
  cantidad: number;
  precioUnitario: number;
}

/**
 * Modal de confirmación al agregar prenda al carrito.
 */
export function ModalConfirmacionAgregado({
  show,
  onHide,
  producto,
  talla,
  color,
  cantidad,
  precioUnitario,
}: ModalConfirmacionAgregadoProps) {
  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h5 fw-bold text-success d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success fs-4" />
          ¡Agregado a tu Carrito!
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-3">
        <div className="d-flex gap-3 align-items-center p-3 rounded-3 bg-light border mb-2">
          <div
            className="rounded overflow-hidden flex-shrink-0"
            style={{ width: 64, height: 64, background: '#e2e8f0' }}
          >
            {producto.imagenes?.[0] ? (
              <img
                src={producto.imagenes[0]}
                alt={producto.nombre}
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <i className="bi bi-image text-muted fs-3" />
            )}
          </div>
          <div className="flex-grow-1 min-w-0">
            <span
              className="text-muted small fw-semibold text-uppercase d-block"
              style={{ fontSize: '0.72rem' }}
            >
              {producto.marca}
            </span>
            <h4 className="h6 fw-bold mb-1 text-truncate text-dark">{producto.nombre}</h4>
            <p className="small text-muted mb-0">
              Talla: <strong className="text-dark me-2">{talla}</strong>
              Color: <strong className="text-dark me-2">{color}</strong>
              Cant: <strong className="text-dark">{cantidad}</strong>
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <span className="small text-muted">Subtotal de esta prenda:</span>
          <span className="fw-bold fs-5 text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatearMoneda(precioUnitario * cantidad)}
          </span>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex gap-2">
        <Button variant="secondary" size="sm" className="flex-grow-1" onClick={onHide}>
          Seguir Comprando
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-grow-1"
          icon={<i className="bi bi-bag-check" />}
          onClick={() => {
            onHide();
            navigate('/carrito');
          }}
        >
          Ir a Pagar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
