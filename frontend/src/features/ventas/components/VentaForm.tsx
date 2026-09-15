import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { ventaSchema, type VentaFormValues } from '../schemas/venta.schema';
import { useRegistrarVenta } from '../hooks/useVentas';
import { useProductos } from '../../catalogo/hooks/useProductos';
import { useVariantes } from '../../catalogo/hooks/useVariantes';
import { formatearMoneda } from '../../../lib/format';
import type { Venta } from '../types';

interface VentaFormProps {
  onGuardada: (v: Venta) => void;
  onCancelar: () => void;
}

export function VentaForm({ onGuardada, onCancelar }: VentaFormProps) {
  const { mutate: registrar, isPending, error } = useRegistrarVenta();
  const [productoSelecId, setProductoSelecId] = useState<number | null>(null);
  const { data: productosData } = useProductos({ estado: 'activo' });
  const { data: variantes } = useVariantes(productoSelecId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VentaFormValues>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      detalles: [],
      clienteId: null,
      clienteNombre: '',
      clienteEmail: '',
      metodoPago: 'efectivo',
      referencia: null,
      tipoComprobante: 'boleta',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' });
  const detalles = watch('detalles');

  const total = detalles.reduce((acc, d) => acc + (d.cantidad || 0) * (d.precioUnitario || 0), 0);

  const agregarDetalle = () => {
    if (!productoSelecId) return;
    append({ varianteId: 0, cantidad: 1, precioUnitario: 0 });
  };

  const onVarianteChange = (idx: number, varianteId: number) => {
    const v = variantes?.find((v) => v.id === varianteId);
    const p = productosData?.datos.find((p) => p.id === v?.productoId);
    setValue(`detalles.${idx}.varianteId`, varianteId);
    setValue(`detalles.${idx}.precioUnitario`, v?.precioEspecifico ?? p?.precioBase ?? 0);
  };

  const onSubmit = (valores: VentaFormValues) => {
    registrar(valores, { onSuccess: (v) => onGuardada(v) });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="alert alert-danger small mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2" />
          {error.message}
        </div>
      )}

      <div className="row g-4">
        {/* Columna Principal: Secciones del Formulario */}
        <div className="col-12 col-lg-8">
          {/* ── Sección 1: Datos del cliente ─────────────────────────────────── */}
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
                    Datos del Cliente
                  </h6>
                  <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                    Identificación del comprador para la emisión del comprobante
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
                  <Form.Label htmlFor="ven-nombre" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Nombre del cliente <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="ven-nombre"
                    className="bg-white border"
                    placeholder="ej. Juan Pérez"
                    isInvalid={!!errors.clienteNombre}
                    {...register('clienteNombre')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.clienteNombre?.message}</Form.Control.Feedback>
                </div>
                <div className="col-md-6">
                  <Form.Label htmlFor="ven-email" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="ven-email"
                    type="email"
                    className="bg-white border"
                    placeholder="cliente@email.com"
                    isInvalid={!!errors.clienteEmail}
                    {...register('clienteEmail')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.clienteEmail?.message}</Form.Control.Feedback>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sección 2: Prendas y Variantes a Vender ──────────────────────── */}
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
                    Prendas y Variantes a Vender
                  </h6>
                  <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                    Selecciona las prendas del catálogo que se registrarán en la venta
                  </span>
                </div>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                <i className="bi bi-pencil-square me-1" />
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-4">
              {/* Barra para agregar línea */}
              <div
                className="p-3 mb-3 rounded"
                style={{
                  backgroundColor: 'var(--sm-bone, #f8fafc)',
                  border: '1px solid var(--sm-border, #e2e8f0)',
                }}
              >
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-md-9">
                    <Form.Label htmlFor="prod-sel" className="small fw-medium mb-1" style={{ color: 'var(--sm-ink)' }}>
                      Catálogo de prendas activas
                    </Form.Label>
                    <Form.Select
                      id="prod-sel"
                      className="bg-white border"
                      value={productoSelecId ?? ''}
                      onChange={(e) => setProductoSelecId(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">— Elegir prenda del catálogo —</option>
                      {(productosData?.datos ?? []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} · {p.marca} (S/ {p.precioBase.toFixed(2)})
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-12 col-md-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={agregarDetalle}
                      disabled={!productoSelecId}
                      className="w-100"
                      icon={<i className="bi bi-plus-lg" />}
                    >
                      Añadir línea
                    </Button>
                  </div>
                </div>
              </div>

              {fields.length === 0 && (
                <div
                  className="p-4 text-center rounded text-muted small"
                  style={{ border: '2px dashed var(--sm-border)', backgroundColor: '#fafbfc' }}
                >
                  <i className="bi bi-bag-plus fs-3 d-block mb-2 text-muted" />
                  Elige una prenda en el catálogo superior y haz clic en "Añadir línea" para ingresar las variantes a vender.
                </div>
              )}

              {/* Tabla de detalles */}
              {fields.length > 0 && (
                <div className="table-responsive mb-2 border rounded">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Variante (Talla / Color / SKU)</th>
                        <th style={{ width: 110 }}>Cant.</th>
                        <th style={{ width: 140 }}>Precio unit. (S/)</th>
                        <th className="text-end" style={{ width: 120 }}>Subtotal</th>
                        <th style={{ width: 48 }} className="pe-3 text-center" />
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, idx) => {
                        const det = detalles[idx];
                        const subtotal = (det?.cantidad || 0) * (det?.precioUnitario || 0);
                        return (
                          <tr key={field.id}>
                            <td className="ps-3">
                              <Form.Select
                                size="sm"
                                className="bg-white border"
                                isInvalid={!!errors.detalles?.[idx]?.varianteId}
                                onChange={(e) => onVarianteChange(idx, Number(e.target.value))}
                                value={det?.varianteId || ''}
                              >
                                <option value="">— Elegir variante —</option>
                                {(variantes ?? []).filter((v) => v.estado === 'activo').map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.talla} / {v.color} ({v.sku})
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control
                                size="sm"
                                type="number"
                                min="1"
                                step="1"
                                className="bg-white border"
                                isInvalid={!!errors.detalles?.[idx]?.cantidad}
                                {...register(`detalles.${idx}.cantidad`, { valueAsNumber: true })}
                              />
                            </td>
                            <td>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="0.01"
                                min="0"
                                className="bg-white border"
                                isInvalid={!!errors.detalles?.[idx]?.precioUnitario}
                                {...register(`detalles.${idx}.precioUnitario`, { valueAsNumber: true })}
                              />
                            </td>
                            <td className="text-end fw-semibold" style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                              {formatearMoneda(subtotal)}
                            </td>
                            <td className="pe-3 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger"
                                onClick={() => remove(idx)}
                                aria-label="Eliminar línea"
                                icon={<i className="bi bi-trash" />}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {errors.detalles?.root && (
                <p className="text-danger small mt-2">{errors.detalles.root.message}</p>
              )}
            </div>
          </div>

          {/* ── Sección 3: Pago y Comprobante ────────────────────────────────── */}
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
                  3
                </span>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                    Método de Pago y Facturación
                  </h6>
                  <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                    Medio de recaudación y tipo de comprobante de pago emitido
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
                <div className="col-md-4">
                  <Form.Label htmlFor="ven-metodo" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Método de pago <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select id="ven-metodo" className="bg-white border" isInvalid={!!errors.metodoPago} {...register('metodoPago')}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de débito/crédito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="pasarela">Pasarela de pago digital</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.metodoPago?.message}</Form.Control.Feedback>
                  <Form.Text className="text-muted small">
                    Transferencias requieren confirmación manual previa al despacho.
                  </Form.Text>
                </div>
                <div className="col-md-4">
                  <Form.Label htmlFor="ven-referencia" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Referencia / N.º Operación
                  </Form.Label>
                  <Form.Control
                    id="ven-referencia"
                    className="bg-white border"
                    placeholder="ej. BCP-123456 / POS-789"
                    {...register('referencia')}
                  />
                </div>
                <div className="col-md-4">
                  <Form.Label htmlFor="ven-comprobante" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Comprobante <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select id="ven-comprobante" className="bg-white border" isInvalid={!!errors.tipoComprobante} {...register('tipoComprobante')}>
                    <option value="boleta">Boleta de Venta</option>
                    <option value="factura">Factura</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.tipoComprobante?.message}</Form.Control.Feedback>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral: Resumen Sticky */}
        <div className="col-12 col-lg-4">
          <div
            className="card border shadow-sm sticky-top"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
              top: '1.5rem',
            }}
          >
            <div
              className="card-header bg-white py-3 px-4 border-bottom"
              style={{ borderColor: 'var(--sm-border)' }}
            >
              <h6 className="fw-bold mb-0 text-dark">
                <i className="bi bi-receipt me-2 text-primary" />
                Resumen de la Venta
              </h6>
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                <span>Líneas agregadas:</span>
                <span className="fw-semibold text-dark">{fields.length}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                <span>Unidades totales:</span>
                <span className="fw-semibold text-dark">
                  {detalles.reduce((acc, d) => acc + (Number(d.cantidad) || 0), 0)}
                </span>
              </div>

              <hr className="my-3" style={{ borderColor: 'var(--sm-border)' }} />

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark">Total a Cobrar:</span>
                <span
                  className="fw-bold fs-4 text-primary"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatearMoneda(total)}
                </span>
              </div>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  disabled={fields.length === 0}
                  isLoading={isPending}
                  loadingText="Registrando…"
                  icon={<i className="bi bi-check-lg" />}
                >
                  Registrar venta
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancelar}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
