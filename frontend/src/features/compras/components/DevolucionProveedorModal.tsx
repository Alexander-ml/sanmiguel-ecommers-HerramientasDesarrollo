import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import {
  devolucionProveedorSchema,
  type DevolucionProveedorFormValues,
} from '../schemas/devolucion.schema';
import { useRegistrarDevolucion } from '../hooks/useCompras';
import type { OrdenCompra } from '../types';

interface DevolucionProveedorModalProps {
  show: boolean;
  orden: OrdenCompra | null;
  onCerrar: () => void;
}

export function DevolucionProveedorModal({
  show,
  orden,
  onCerrar,
}: DevolucionProveedorModalProps) {
  const { mutate: devolver, isPending, error } = useRegistrarDevolucion();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DevolucionProveedorFormValues>({
    resolver: zodResolver(devolucionProveedorSchema),
    defaultValues: {
      recepcionId: 0,
      varianteId: 0,
      cantidad: 1,
      motivo: '',
    },
  });

  const selectedVarianteId = watch('varianteId');

  useEffect(() => {
    if (orden) {
      const primeraRecepcion = orden.recepciones[0];
      const primeraLineaRecibida = orden.lineas.find((l) => l.cantidadRecibida > 0);

      reset({
        recepcionId: primeraRecepcion?.id ?? 0,
        varianteId: primeraLineaRecibida?.varianteId ?? 0,
        cantidad: 1,
        motivo: '',
      });
    }
  }, [orden, reset]);

  if (!orden) return null;

  const lineaSeleccionada = orden.lineas.find((l) => l.varianteId === Number(selectedVarianteId));
  const maxDevolver = lineaSeleccionada ? lineaSeleccionada.cantidadRecibida : 0;

  const onSubmit = (valores: DevolucionProveedorFormValues) => {
    devolver(
      {
        compraId: orden.id,
        form: valores,
      },
      {
        onSuccess: onCerrar,
      },
    );
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
          <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
            <i className="bi bi-arrow-return-left text-danger" />
            <span>Devolución a Proveedor</span>
            <span className="font-monospace text-primary small ms-1">({orden.codigo})</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {error && (
            <div className="alert alert-danger small mb-3">
              <i className="bi bi-exclamation-triangle me-2" />
              {error.message}
            </div>
          )}

          {/* ── Contexto de la orden (Solo lectura) ── */}
          <div
            className="p-3 mb-3 rounded"
            style={{
              backgroundColor: 'var(--sm-bone, #f8fafc)',
              border: '1px solid var(--sm-border, #e2e8f0)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold small text-muted">
                <i className="bi bi-info-circle me-1" /> Proveedor y orden asociada
              </span>
              <span className="badge bg-light text-muted border small">Solo lectura</span>
            </div>
            <div className="small text-muted">
              <strong>Proveedor:</strong> {orden.proveedorNombre} ({orden.proveedorRuc}) · <strong>Orden:</strong> {orden.codigo}
            </div>
          </div>

          {/* ── Tarjeta de Llenado Interactivo (Fondo Blanco) ── */}
          <div
            className="card border mb-3 shadow-sm"
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
                  Detalles de la Prenda y Motivo de Devolución
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <Form.Label htmlFor="dev-recepcion" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Recepción de Origen <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    id="dev-recepcion"
                    className="bg-white border form-select-sm"
                    isInvalid={!!errors.recepcionId}
                    {...register('recepcionId', { valueAsNumber: true })}
                  >
                    <option value={0}>Selecciona la recepción…</option>
                    {orden.recepciones.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.codigoRecepcion} — {r.fechaRecepcion.split('T')[0]} {r.comprobanteReferencia ? `(${r.comprobanteReferencia})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.recepcionId?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-6">
                  <Form.Label htmlFor="dev-variante" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Prenda a Devolver <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    id="dev-variante"
                    className="bg-white border form-select-sm"
                    isInvalid={!!errors.varianteId}
                    {...register('varianteId', { valueAsNumber: true })}
                  >
                    <option value={0}>Selecciona la prenda…</option>
                    {orden.lineas
                      .filter((l) => l.cantidadRecibida > 0)
                      .map((l) => (
                        <option key={l.varianteId} value={l.varianteId}>
                          {l.productoNombre} ({l.talla} / {l.color}) — Recibidas: {l.cantidadRecibida} u.
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.varianteId?.message}</Form.Control.Feedback>
                </div>

                {lineaSeleccionada && (
                  <div className="col-12">
                    <div
                      className="p-2 rounded d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: 'var(--sm-bone, #f8fafc)',
                        border: '1px solid var(--sm-border, #e2e8f0)',
                      }}
                    >
                      <div>
                        <span className="fw-semibold text-dark small d-block">{lineaSeleccionada.productoNombre}</span>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {lineaSeleccionada.talla} · {lineaSeleccionada.color} · <code>{lineaSeleccionada.sku}</code>
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Total recepcionado disponible</span>
                        <span className="fw-bold text-dark" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {lineaSeleccionada.cantidadRecibida} u.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="dev-cant" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Cantidad a Devolver (Máx: {maxDevolver} u.) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="dev-cant"
                    type="number"
                    min={1}
                    max={maxDevolver}
                    className="bg-white border form-control-sm text-end fw-bold"
                    isInvalid={!!errors.cantidad}
                    {...register('cantidad', { valueAsNumber: true })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.cantidad?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-8">
                  <Form.Label htmlFor="dev-motivo" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Motivo de la Devolución <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="dev-motivo"
                    as="textarea"
                    rows={2}
                    className="bg-white border form-control-sm"
                    placeholder="ej. Prenda con costura defectuosa en cuello, mancha de fábrica..."
                    isInvalid={!!errors.motivo}
                    {...register('motivo')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.motivo?.message}</Form.Control.Feedback>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-warning small mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle fs-5" />
            <div>
              Al confirmar, el sistema actualizará <strong>Inventario</strong> para dar de baja las prendas defectuosas mediante un movimiento de devolución.
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            icon={<i className="bi bi-arrow-return-left" />}
            isLoading={isPending}
            loadingText="Registrando devolución…"
            disabled={isPending || maxDevolver === 0}
          >
            Registrar devolución
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
