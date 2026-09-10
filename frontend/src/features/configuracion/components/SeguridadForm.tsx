import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import {
  seguridadConfigSchema,
  type SeguridadConfigFormValues,
} from '../schemas/configuracion.schema';
import { useActualizarSeguridad } from '../hooks/useConfiguracion';
import type { ParametroSeguridad } from '../types';

interface SeguridadFormProps {
  datos: ParametroSeguridad;
}

export function SeguridadForm({ datos }: SeguridadFormProps) {
  const { mutate: actualizar, isPending, isSuccess } = useActualizarSeguridad();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SeguridadConfigFormValues>({
    resolver: zodResolver(seguridadConfigSchema),
    defaultValues: datos,
  });

  useEffect(() => {
    reset(datos);
  }, [datos, reset]);

  const onSubmit = (valores: SeguridadConfigFormValues) => {
    actualizar(valores);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSuccess && (
        <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle fs-5" />
          <span>
            Políticas de seguridad actualizadas con éxito. Las nuevas sesiones aplicarán la duración e intentos configurados.
          </span>
        </div>
      )}

      {/* ── Directivas de Acceso y Sesión ──────────────────────────────────── */}
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
                Directivas de Acceso y Prevención de Fuerza Bruta
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Vigencia de credenciales de sesión activa, umbrales de reintento y bloqueo temporal
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="alert alert-info small d-flex align-items-center gap-2 mb-4" style={{ backgroundColor: 'var(--sm-bone)', borderColor: 'var(--sm-border)' }}>
            <i className="bi bi-lock text-primary fs-5" />
            <div style={{ color: 'var(--sm-ink)' }}>
              <strong>Seguridad de Credenciales:</strong> Este módulo únicamente gestiona políticas de caducidad de tokens e intentos de login. Las credenciales de bases de datos y llaves criptográficas se resguardan de forma segura a nivel de entorno de producción.
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <Form.Label htmlFor="seg-dur" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Duración Máxima de Sesión <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="seg-dur"
                  className="bg-white border"
                  type="number"
                  placeholder="8"
                  isInvalid={!!errors.duracionSesionHoras}
                  {...register('duracionSesionHoras', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">horas</span>
                <Form.Control.Feedback type="invalid">
                  {errors.duracionSesionHoras?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Tiempo tras el cual la credencial de renovación exigirá autenticación formal.
              </Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="seg-att" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Intentos Fallidos Permitidos <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="seg-att"
                  className="bg-white border"
                  type="number"
                  placeholder="5"
                  isInvalid={!!errors.maxIntentosFallidos}
                  {...register('maxIntentosFallidos', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">intentos</span>
                <Form.Control.Feedback type="invalid">
                  {errors.maxIntentosFallidos?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Intentos consecutivos erróneos de login antes del bloqueo temporal de la cuenta.
              </Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="seg-blq" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Duración de Bloqueo Temporal <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="seg-blq"
                  className="bg-white border"
                  type="number"
                  placeholder="15"
                  isInvalid={!!errors.bloqueoMinutos}
                  {...register('bloqueoMinutos', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">minutos</span>
                <Form.Control.Feedback type="invalid">
                  {errors.bloqueoMinutos?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Tiempo que la cuenta permanecerá bloqueada tras exceder el límite de intentos.
              </Form.Text>
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
          Guardar políticas de seguridad
        </Button>
      </div>
    </Form>
  );
}
