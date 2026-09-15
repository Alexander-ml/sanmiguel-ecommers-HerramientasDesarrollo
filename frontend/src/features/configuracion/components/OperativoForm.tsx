import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { operativoSchema, type OperativoFormValues } from '../schemas/configuracion.schema';
import { useActualizarOperativo } from '../hooks/useConfiguracion';
import type { ParametroOperativo } from '../types';

interface OperativoFormProps {
  datos: ParametroOperativo;
}

export function OperativoForm({ datos }: OperativoFormProps) {
  const { mutate: actualizar, isPending, isSuccess } = useActualizarOperativo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OperativoFormValues>({
    resolver: zodResolver(operativoSchema),
    defaultValues: datos,
  });

  useEffect(() => {
    reset(datos);
  }, [datos, reset]);

  const onSubmit = (valores: OperativoFormValues) => {
    actualizar(valores);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSuccess && (
        <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle fs-5" />
          <span>
            Parámetros operativos actualizados con éxito. Los módulos de Inventario y Pedidos aplicarán los nuevos umbrales.
          </span>
        </div>
      )}

      {/* ── Umbrales y Tiempos Operativos ─────────────────────────────────── */}
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
                Parámetros y Umbrales Operativos
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Umbrales automáticos de existencias críticas, expiración de pedidos y garantías
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
              <strong>Automatización Logística:</strong> Los cambios en el stock mínimo actualizan al instante el semáforo de inventario y compras de reposición.
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <Form.Label htmlFor="op-stock" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Umbral de Stock Mínimo por Defecto <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="op-stock"
                  className="bg-white border"
                  type="number"
                  placeholder="5"
                  isInvalid={!!errors.umbralStockMinimoDefecto}
                  {...register('umbralStockMinimoDefecto', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">unidades</span>
                <Form.Control.Feedback type="invalid">
                  {errors.umbralStockMinimoDefecto?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Cantidad límite que dispara las alertas automáticas de reposición en Inventario.
              </Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="op-res" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Tiempo de Reserva en Carrito/Pedido <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="op-res"
                  className="bg-white border"
                  type="number"
                  placeholder="60"
                  isInvalid={!!errors.tiempoReservaMinutos}
                  {...register('tiempoReservaMinutos', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">minutos</span>
                <Form.Control.Feedback type="invalid">
                  {errors.tiempoReservaMinutos?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Tiempo antes de que un pedido pendiente no pagado libere su stock al catálogo disponible.
              </Form.Text>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="op-dev" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Garantía de Devolución / Cambio <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  id="op-dev"
                  className="bg-white border"
                  type="number"
                  placeholder="7"
                  isInvalid={!!errors.diasGarantiaDevolucion}
                  {...register('diasGarantiaDevolucion', { valueAsNumber: true })}
                />
                <span className="input-group-text bg-white border">días</span>
                <Form.Control.Feedback type="invalid">
                  {errors.diasGarantiaDevolucion?.message}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted small">
                Ventana máxima para que el comprador solicite un cambio o devolución de prenda.
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
          Guardar parámetros operativos
        </Button>
      </div>
    </Form>
  );
}
