import { Modal } from 'react-bootstrap';
import { OrdenCompraForm } from './OrdenCompraForm';
import type { OrdenCompra } from '../types';

export interface NuevaOrdenCompraModalProps {
  show: boolean;
  onCerrar: () => void;
  onGuardado?: (compra: OrdenCompra) => void;
}

/**
 * Modal para creación ágil de órdenes de compra al frente de la pantalla (como Catálogo y Categorías).
 * Evita que el usuario pierda el contexto de la lista de compras y agiliza el reabastecimiento.
 */
export function NuevaOrdenCompraModal({ show, onCerrar, onGuardado }: NuevaOrdenCompraModalProps) {
  return (
    <Modal show={show} onHide={onCerrar} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom px-4 py-3 bg-white">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-receipt-cutoff text-primary" />
          <span>Nueva Orden de Compra</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
        <OrdenCompraForm
          esModal
          onGuardado={(compra) => {
            onGuardado?.(compra);
            onCerrar();
          }}
          onCancelar={onCerrar}
        />
      </Modal.Body>
    </Modal>
  );
}
