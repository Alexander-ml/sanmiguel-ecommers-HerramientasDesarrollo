import { Modal } from 'react-bootstrap';
import { ProductoForm } from './ProductoForm';
import type { Producto } from '../types';

interface ProductoModalProps {
  show: boolean;
  onCerrar: () => void;
  onGuardado?: (p: Producto) => void;
}

/**
 * Modal para creación ágil de productos al frente de la pantalla (como Categorías).
 * Evita perder el contexto de la lista del catálogo.
 */
export function ProductoModal({ show, onCerrar, onGuardado }: ProductoModalProps) {
  return (
    <Modal show={show} onHide={onCerrar} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-plus-circle text-primary" />
          <span>Nuevo Producto</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
        <ProductoForm
          onGuardado={(producto) => {
            onGuardado?.(producto);
            onCerrar();
          }}
          onCancelar={onCerrar}
        />
      </Modal.Body>
    </Modal>
  );
}
