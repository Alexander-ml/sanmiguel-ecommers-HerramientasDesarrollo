import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { ajusteStockSchema, type AjusteStockFormValues } from '../schemas/ajusteStock.schema';
import { useAjustarStock } from '../hooks/useInventario';
import type { Stock } from '../types';

interface AjusteStockFormProps {
  show: boolean;
  stockSeleccionado: Stock | null;
  onCerrar: () => void;
}

export function AjusteStockForm({ show, stockSeleccionado, onCerrar }: AjusteStockFormProps) {
  const { mutate: ajustar, isPending, error } = useAjustarStock();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AjusteStockFormValues>({
    resolver: zodResolver(ajusteStockSchema),
    defaultValues: {
      varianteId: stockSeleccionado?.varianteId ?? 0,
      tipo: 'AJUSTE_POSITIVO',
      cantidad: undefined,
      motivo: '',
    },
  });

  const tipoSeleccionado = watch('tipo');

  const onSubmit = (valores: AjusteStockFormValues) => {
    const payload = { ...valores, varianteId: stockSeleccionado!.varianteId };
    ajustar(payload, {
      onSuccess: () => {
        reset();
        onCerrar();
      },
    });
  };

  const handleCerrar = () => {
    reset();
    onCerrar();
  };

  return (
    <Modal show={show} onHide={handleCerrar} backdrop="static" size="lg" centered>
      <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-sliders text-primary" />
          <span>Ajuste Manual de Stock</span>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {error && (
            <div className="alert alert-danger small mb-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2" />
              {error.message}
            </div>
          )}

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
                  <i className="bi bi-box-seam me-1" /> Prenda y Stock Actual
                </span>
                <span className="badge bg-light text-muted border small">Solo lectura</span>
              </div>
              <div className="fw-bold" style={{ color: 'var(--sm-ink)' }}>{stockSeleccionado.productoNombre}</div>
              <div className="text-muted small">
                Talla: <strong>{stockSeleccionado.talla}</strong> · Color: <strong>{stockSeleccionado.color}</strong> · SKU: <code>{stockSeleccionado.sku}</code>
              </div>
              <div className="mt-2 pt-2 border-top d-flex gap-4 small">
                <span>Físico actual: <strong className="text-dark">{stockSeleccionado.cantidadFisica} u.</strong></span>
                <span>Reservado: <strong className="text-warning">{stockSeleccionado.cantidadReservada} u.</strong></span>
                <span>Disponible: <strong className="text-success">{stockSeleccionado.cantidadDisponible} u.</strong></span>
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
                  Detalles del Movimiento de Ajuste
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="mb-3">
                <Form.Label className="small fw-medium mb-1" style={{ color: 'var(--sm-ink)' }}>
                  Tipo de Ajuste <span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex gap-4 p-2 rounded bg-light border">
                  <Form.Check
                    type="radio"
                    id="tipo-positivo"
                    label="Ajuste positivo (+ incrementar físico)"
                    value="AJUSTE_POSITIVO"
                    className="fw-medium small"
                    {...register('tipo')}
                  />
                  <Form.Check
                    type="radio"
                    id="tipo-negativo"
                    label="Ajuste negativo (- decrementar físico)"
                    value="AJUSTE_NEGATIVO"
                    className="fw-medium small text-danger"
                    {...register('tipo')}
                  />
                </div>
                {tipoSeleccionado === 'AJUSTE_NEGATIVO' && (
                  <div className="mt-2 alert alert-warning small py-2 mb-0" role="alert">
                    <i className="bi bi-exclamation-triangle me-1" />
                    Un ajuste negativo reduce el stock físico. El sistema rechazará cantidades que resultarían en stock negativo.
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-5">
                  <Form.Label htmlFor="ajuste-cantidad" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Cantidad a Ajustar (u.) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="ajuste-cantidad"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="ej. 10"
                    className="bg-white border form-control-sm text-end fw-bold"
                    isInvalid={!!errors.cantidad}
                    {...register('cantidad', { valueAsNumber: true })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.cantidad?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-7">
                  <div className="text-muted small mt-md-4 pt-1">
                    Ingresa el número absoluto de prendas a sumar o restar del conteo en almacén.
                  </div>
                </div>

                <div className="col-12">
                  <Form.Label htmlFor="ajuste-motivo" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Justificación o Motivo <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="ajuste-motivo"
                    as="textarea"
                    rows={2}
                    className="bg-white border form-control-sm"
                    placeholder="ej. Conteo físico de inventario mensual: diferencia encontrada en estantería..."
                    isInvalid={!!errors.motivo}
                    {...register('motivo')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.motivo?.message}</Form.Control.Feedback>
                  <Form.Text className="text-muted small">Mínimo 10 caracteres. Quedará registrado en el historial de Kardex.</Form.Text>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={handleCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            loadingText="Registrando…"
            icon={<i className="bi bi-check2-circle" />}
          >
            Registrar ajuste
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
