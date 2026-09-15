import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { umbralAlertaSchema, type UmbralAlertaFormValues } from '../schemas/umbralAlerta.schema';
import { useConfigurarUmbral } from '../hooks/useInventario';
import type { Stock } from '../types';

interface UmbralAlertaModalProps {
  show: boolean;
  stockSeleccionado: Stock | null;
  onCerrar: () => void;
}

export function UmbralAlertaModal({ show, stockSeleccionado, onCerrar }: UmbralAlertaModalProps) {
  const { mutate: configurar, isPending, error } = useConfigurarUmbral();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UmbralAlertaFormValues>({
    resolver: zodResolver(umbralAlertaSchema),
    defaultValues: { umbralMinimo: stockSeleccionado?.umbralMinimo ?? 5 },
  });

  const onSubmit = (valores: UmbralAlertaFormValues) => {
    if (!stockSeleccionado) return;
    configurar(
      { varianteId: stockSeleccionado.varianteId, valores },
      { onSuccess: () => { reset(); onCerrar(); } },
    );
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" centered>
      <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-bell text-warning" />
          <span>Configurar Umbral de Stock Mínimo</span>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {error && <div className="alert alert-danger small mb-3">{error.message}</div>}

          {/* ── Contexto de la variante (Solo lectura) ── */}
          {stockSeleccionado && (
            <div
              className="rounded p-3 mb-3"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                fontSize: 'var(--sm-text-sm)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-semibold small text-muted">
                  <i className="bi bi-box-seam me-1" /> Prenda Seleccionada
                </span>
                <span className="badge bg-light text-muted border small">Solo lectura</span>
              </div>
              <div className="fw-bold" style={{ color: 'var(--sm-ink)' }}>{stockSeleccionado.productoNombre}</div>
              <div className="text-muted small">
                {stockSeleccionado.talla} · {stockSeleccionado.color} · <code>{stockSeleccionado.sku}</code>
              </div>
              <div className="mt-2 pt-2 border-top text-muted small">
                Umbral mínimo configurado actualmente: <strong className="text-dark">{stockSeleccionado.umbralMinimo} u.</strong>
              </div>
            </div>
          )}

          {/* ── Tarjeta de Llenado Interactivo (Fondo Blanco) ── */}
          <div
            className="card border mb-0 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-2 px-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                <span className="fw-bold small" style={{ color: 'var(--sm-ink)' }}>
                  Nuevo Límite de Advertencia
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <Form.Group>
                <Form.Label htmlFor="umbral-minimo" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                  Nuevo Umbral Mínimo (Unidades) <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group input-group-sm mb-2">
                  <Form.Control
                    id="umbral-minimo"
                    type="number"
                    min="0"
                    step="1"
                    className="bg-white border form-control-sm text-end fw-bold"
                    isInvalid={!!errors.umbralMinimo}
                    {...register('umbralMinimo', { valueAsNumber: true })}
                  />
                  <span className="input-group-text bg-light text-muted">unidades</span>
                </div>
                <Form.Control.Feedback type="invalid">{errors.umbralMinimo?.message}</Form.Control.Feedback>
                <Form.Text className="text-muted small">
                  Cuando el stock disponible sea igual o menor a este número, el sistema emitirá automáticamente una alerta de abastecimiento.
                </Form.Text>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            loadingText="Guardando…"
            icon={<i className="bi bi-check2-circle" />}
          >
            Guardar umbral
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
