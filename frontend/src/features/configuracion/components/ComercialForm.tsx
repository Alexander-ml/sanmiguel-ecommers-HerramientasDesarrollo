import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { comercialSchema, type ComercialFormValues } from '../schemas/configuracion.schema';
import { useActualizarComercial } from '../hooks/useConfiguracion';
import type { ParametroComercial } from '../types';

interface ComercialFormProps {
  datos: ParametroComercial;
}

export function ComercialForm({ datos }: ComercialFormProps) {
  const { mutate: actualizar, isPending, isSuccess } = useActualizarComercial();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ComercialFormValues>({
    resolver: zodResolver(comercialSchema),
    defaultValues: datos,
  });

  useEffect(() => {
    reset(datos);
  }, [datos, reset]);

  const onSubmit = (valores: ComercialFormValues) => {
    actualizar(valores);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSuccess && (
        <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle fs-5" />
          <span>
            Parámetros comerciales actualizados con éxito. El módulo de Ventas y Comprobantes aplicará la nueva tasa de inmediato.
          </span>
        </div>
      )}

      {/* ── Parámetros Comerciales e Impuestos ────────────────────────────── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div
          className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom"
          style={{ borderColor: 'var(--sm-border)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
            >
              1
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Régimen Monetario e Impuestos
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Moneda base de la operación comercial y tasa fiscal de IGV aplicable
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="alert alert-light border small d-flex align-items-center gap-2 mb-4" style={{ backgroundColor: 'var(--sm-bone)' }}>
            <i className="bi bi-info-circle text-primary fs-5" />
            <div style={{ color: 'var(--sm-ink)' }}>
              <strong>Cálculo Automático:</strong> Este módulo centraliza la tasa tributaria oficial. El desglose de base imponible e IGV se aplica en cada comprobante electrónico y venta.
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <Form.Label htmlFor="com-cod" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Código de Moneda (ISO) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="com-cod"
                className="bg-white border"
                placeholder="PEN"
                isInvalid={!!errors.monedaCodigo}
                {...register('monedaCodigo')}
              />
              <Form.Control.Feedback type="invalid">{errors.monedaCodigo?.message}</Form.Control.Feedback>
              <Form.Text className="text-muted small">ej. PEN (Soles peruanos)</Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="com-sim" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Símbolo Monetario <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="com-sim"
                className="bg-white border"
                placeholder="S/"
                isInvalid={!!errors.monedaSimbolo}
                {...register('monedaSimbolo')}
              />
              <Form.Control.Feedback type="invalid">{errors.monedaSimbolo?.message}</Form.Control.Feedback>
              <Form.Text className="text-muted small">Mostrado en catálogo, carritos y recibos.</Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="com-igv" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Tasa de IGV Vigente (%) <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="com-igv"
                  className="bg-white border"
                  type="number"
                  step="0.1"
                  placeholder="18"
                  isInvalid={!!errors.tasaIgv}
                  {...register('tasaIgv', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">%</span>
                <Form.Control.Feedback type="invalid">{errors.tasaIgv?.message}</Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">Tasa tributaria oficial en el Perú (actualmente 18.0%).</Form.Text>
            </div>

            <div className="col-12 mt-3 pt-2">
              <div
                className="p-3 rounded border"
                style={{ backgroundColor: 'var(--sm-bone)' }}
              >
                <Form.Check
                  id="com-inc"
                  type="checkbox"
                  label={
                    <span className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                      Los precios publicados en catálogo y tienda virtual ya incluyen IGV
                    </span>
                  }
                  {...register('incluirIgvEnPrecios')}
                />
                <div className="text-muted small ms-4 mt-1">
                  Si está marcado, el desglose impositivo deducirá el IGV del total en el comprobante fiscal.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Barra de Acciones ─────────────────────────────────────────────────── */}
      <div
        className="d-flex justify-content-end align-items-center gap-2 p-3 bg-white border rounded shadow-sm"
        style={{ borderColor: 'var(--sm-border)' }}
      >
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          disabled={!isDirty || isPending}
        >
          <i className="bi bi-save me-1" />
          Guardar parámetros comerciales
        </Button>
      </div>
    </Form>
  );
}
