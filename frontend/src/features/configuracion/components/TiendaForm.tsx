import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { tiendaSchema, type TiendaFormValues } from '../schemas/configuracion.schema';
import { useActualizarTienda } from '../hooks/useConfiguracion';
import type { ParametroTienda } from '../types';

interface TiendaFormProps {
  datos: ParametroTienda;
}

export function TiendaForm({ datos }: TiendaFormProps) {
  const { mutate: actualizar, isPending, isSuccess } = useActualizarTienda();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TiendaFormValues>({
    resolver: zodResolver(tiendaSchema),
    defaultValues: datos,
  });

  useEffect(() => {
    reset(datos);
  }, [datos, reset]);

  const onSubmit = (valores: TiendaFormValues) => {
    actualizar(valores);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSuccess && (
        <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle fs-5" />
          <span>
            Políticas institucionales actualizadas con éxito. El portal web y el módulo de Clientes expondrán los nuevos textos vigentes.
          </span>
        </div>
      )}

      {/* ── Sección 1: Versionado y Marco Legal ───────────────────────────── */}
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
                Versionado y Marco Legal
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Políticas de privacidad (Ley N° 29733) y términos comerciales de compra
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label htmlFor="tie-ver" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Versión Oficial de la Política <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="tie-ver"
                className="bg-white border"
                placeholder="v2.1 - 2025"
                isInvalid={!!errors.versionPolitica}
                {...register('versionPolitica')}
              />
              <Form.Control.Feedback type="invalid">{errors.versionPolitica?.message}</Form.Control.Feedback>
              <Form.Text className="text-muted small">
                Identificador trazable para el consentimiento registrado de clientes.
              </Form.Text>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="tie-priv" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Política de Privacidad y Protección de Datos Personales (Ley N° 29733) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="tie-priv"
                as="textarea"
                rows={4}
                className="bg-white border"
                isInvalid={!!errors.politicaPrivacidad}
                {...register('politicaPrivacidad')}
              />
              <Form.Control.Feedback type="invalid">{errors.politicaPrivacidad?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="tie-term" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Términos y Condiciones Generales de Compra <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="tie-term"
                as="textarea"
                rows={4}
                className="bg-white border"
                isInvalid={!!errors.terminosCondiciones}
                {...register('terminosCondiciones')}
              />
              <Form.Control.Feedback type="invalid">{errors.terminosCondiciones?.message}</Form.Control.Feedback>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección 2: Envíos y Devoluciones ───────────────────────────────── */}
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
              2
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Políticas de Logística y Posventa
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Condiciones de despacho a domicilio y cambios o devoluciones de prendas
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Form.Label htmlFor="tie-env" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Política de Envíos y Despacho <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="tie-env"
                as="textarea"
                rows={3}
                className="bg-white border"
                isInvalid={!!errors.politicaEnvios}
                {...register('politicaEnvios')}
              />
              <Form.Control.Feedback type="invalid">{errors.politicaEnvios?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12 col-md-6">
              <Form.Label htmlFor="tie-dev" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Política de Devoluciones y Cambios de Talla <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="tie-dev"
                as="textarea"
                rows={3}
                className="bg-white border"
                isInvalid={!!errors.politicaDevoluciones}
                {...register('politicaDevoluciones')}
              />
              <Form.Control.Feedback type="invalid">{errors.politicaDevoluciones?.message}</Form.Control.Feedback>
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
          Guardar políticas de tienda
        </Button>
      </div>
    </Form>
  );
}
