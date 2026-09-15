import { Modal, Button } from 'react-bootstrap';

interface ConfirmDialogProps {
  show: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar?: string;
  tono?: 'danger' | 'primary';
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Reemplaza el `confirm()` nativo del navegador usado hoy en Thymeleaf para acciones
 * destructivas (eliminar producto, aprobar venta, rechazar venta). Accesible, con foco
 * gestionado por react-bootstrap y estilo consistente con el resto de la app.
 */
export function ConfirmDialog({
  show,
  titulo,
  descripcion,
  textoConfirmar = 'Confirmar',
  tono = 'primary',
  cargando = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal show={show} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{descripcion}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Button>
        <Button variant={tono === 'danger' ? 'danger' : 'dark'} onClick={onConfirmar} disabled={cargando}>
          {cargando ? 'Procesando…' : textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
