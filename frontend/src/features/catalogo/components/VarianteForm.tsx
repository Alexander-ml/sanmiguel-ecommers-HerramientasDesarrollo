import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { varianteSchema, type VarianteFormValues } from '../schemas/variante.schema';
import { useGuardarVariante } from '../hooks/useVariantes';
import type { Variante } from '../types';

interface VarianteFormProps {
  show: boolean;
  productoId: number;
  varianteEditar?: Variante | null;
  onCerrar: () => void;
}

export function VarianteForm({ show, productoId, varianteEditar, onCerrar }: VarianteFormProps) {
  const esEdicion = !!varianteEditar;
  const { mutate: guardar, isPending, error } = useGuardarVariante(productoId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VarianteFormValues>({
    resolver: zodResolver(varianteSchema),
    defaultValues: { talla: '', color: '', sku: '', precioEspecifico: null },
  });

  useEffect(() => {
    if (varianteEditar) {
      reset({
        talla: varianteEditar.talla,
        color: varianteEditar.color,
        sku: varianteEditar.sku,
        precioEspecifico: varianteEditar.precioEspecifico,
      });
    } else {
      reset({ talla: '', color: '', sku: '', precioEspecifico: null });
    }
  }, [varianteEditar, reset]);

  const onSubmit = (valores: VarianteFormValues) => {
    guardar(
      { id: varianteEditar?.id, valores },
      { onSuccess: () => { reset(); onCerrar(); } },
    );
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" centered>
      <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-collection text-primary" />
          <span>{esEdicion ? `Editar Variante: ${varianteEditar.sku}` : 'Nueva Variante de Prenda'}</span>
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

          {/* ── Tarjeta 1: Atributos de la Variante (Fondo Blanco) ── */}
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
                  Talla, Color y SKU
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-6">
                  <Form.Label htmlFor="var-talla" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Talla <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="var-talla"
                    type="text"
                    placeholder="ej. S, M, L, 32..."
                    className="bg-white border form-control-sm"
                    isInvalid={!!errors.talla}
                    {...register('talla')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.talla?.message}</Form.Control.Feedback>
                </div>

                <div className="col-6">
                  <Form.Label htmlFor="var-color" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Color <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="var-color"
                    type="text"
                    placeholder="ej. Celeste, Azul Marino..."
                    className="bg-white border form-control-sm"
                    isInvalid={!!errors.color}
                    {...register('color')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.color?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <Form.Label htmlFor="var-sku" className="small fw-medium mb-0" style={{ color: 'var(--sm-ink)' }}>
                      Código SKU <span className="text-danger">*</span>
                    </Form.Label>
                    {esEdicion && (
                      <span className="badge bg-light text-muted border small">
                        <i className="bi bi-lock-fill me-1" />
                        Inmutable (Solo lectura)
                      </span>
                    )}
                  </div>
                  <Form.Control
                    id="var-sku"
                    type="text"
                    placeholder="ej. CAM-OXF-CEL-M"
                    className={`form-control-sm font-monospace ${esEdicion ? 'bg-light border text-muted' : 'bg-white border'}`}
                    isInvalid={!!errors.sku}
                    disabled={esEdicion}
                    readOnly={esEdicion}
                    style={esEdicion ? { cursor: 'not-allowed' } : {}}
                    {...register('sku')}
                  />
                  {!esEdicion && (
                    <Form.Text className="text-muted small">Solo mayúsculas, números y guiones. No editable tras guardar.</Form.Text>
                  )}
                  <Form.Control.Feedback type="invalid">{errors.sku?.message}</Form.Control.Feedback>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tarjeta 2: Precio Específico (Fondo Blanco) ── */}
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
                  2
                </span>
                <span className="fw-bold small" style={{ color: 'var(--sm-ink)' }}>
                  Precio Específico de la Variante (Opcional)
                </span>
              </div>
              <span className="badge bg-light text-muted border small">Opcional</span>
            </div>

            <div className="card-body p-3">
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-6">
                  <Form.Label htmlFor="var-precio" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Precio Variante (S/)
                  </Form.Label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted">S/</span>
                    <Form.Control
                      id="var-precio"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Usa precio base del producto"
                      className="bg-white border text-end fw-medium"
                      isInvalid={!!errors.precioEspecifico}
                      {...register('precioEspecifico', {
                        setValueAs: (v) => v === '' || v === null ? null : Number(v),
                      })}
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.precioEspecifico?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-6">
                  <p className="text-muted small mb-0 mt-2 mt-md-4">
                    Si se deja vacío, la variante heredará automáticamente el precio base del producto.
                  </p>
                </div>
              </div>
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
            {esEdicion ? 'Guardar cambios' : 'Crear variante'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
