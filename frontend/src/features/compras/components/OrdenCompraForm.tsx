import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { StatusBadge, estadoOrdenCompraAEstado } from '../../../components/ui/StatusBadge';
import { ordenCompraSchema, type OrdenCompraFormValues } from '../schemas/ordenCompra.schema';
import { useCrearCompra, useActualizarCompra, useProveedores } from '../hooks/useCompras';
import { useProductos } from '../../catalogo/hooks/useProductos';
import { useVariantes } from '../../catalogo/hooks/useVariantes';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { OrdenCompra } from '../types';

interface SelectorVarianteLineaProps {
  onAgregar: (
    varianteId: number,
    productoNombre: string,
    talla: string,
    color: string,
    sku: string,
    costoEstimado: number,
  ) => void;
}

function SelectorVarianteLinea({ onAgregar }: SelectorVarianteLineaProps) {
  const [productoId, setProductoId] = useState<number | null>(null);
  const [varianteId, setVarianteId] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(10);
  const [costo, setCosto] = useState<number>(35.0);

  const { data: productosData } = useProductos({ estado: 'activo' });
  const { data: variantesData } = useVariantes(productoId);

  const productoSeleccionado = productosData?.datos.find((p) => p.id === productoId);
  const varianteSeleccionada = variantesData?.find((v) => v.id === varianteId);

  const handleProductoChange = (id: number) => {
    setProductoId(id || null);
    setVarianteId(null);
    const p = productosData?.datos.find((prod) => prod.id === id);
    if (p) {
      setCosto(Math.round(p.precioBase * 0.5));
    }
  };

  const handleAgregar = () => {
    if (!varianteSeleccionada || !productoSeleccionado || cantidad <= 0 || costo <= 0) return;
    onAgregar(
      varianteSeleccionada.id,
      productoSeleccionado.nombre,
      varianteSeleccionada.talla,
      varianteSeleccionada.color,
      varianteSeleccionada.sku,
      costo,
    );
    setVarianteId(null);
    setCantidad(10);
  };

  return (
    <div
      className="p-3 mb-3 rounded"
      style={{
        backgroundColor: 'var(--sm-primary-tint, #eff6ff)',
        border: '1px solid var(--sm-primary-subtle, #dbeafe)',
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="fw-semibold mb-0 text-primary small d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle-fill" />
          Añadir prenda a la orden
        </h6>
        <span className="badge bg-white text-primary border small">Campos para ingresar</span>
      </div>

      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-4">
          <label className="form-label small mb-1 fw-medium" style={{ color: 'var(--sm-ink)' }}>
            Producto
          </label>
          <select
            className="form-select form-select-sm bg-white border"
            value={productoId ?? ''}
            onChange={(e) => handleProductoChange(Number(e.target.value))}
          >
            <option value="">Selecciona un producto…</option>
            {productosData?.datos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.marca})
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label small mb-1 fw-medium" style={{ color: 'var(--sm-ink)' }}>
            Variante (Talla / Color)
          </label>
          <select
            className="form-select form-select-sm bg-white border"
            value={varianteId ?? ''}
            disabled={!productoId || !variantesData}
            onChange={(e) => setVarianteId(Number(e.target.value))}
          >
            <option value="">Selecciona la variante…</option>
            {variantesData?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.talla} · {v.color} ({v.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 fw-medium" style={{ color: 'var(--sm-ink)' }}>
            Costo Unit. (S/)
          </label>
          <input
            type="number"
            step="0.10"
            min="0.10"
            className="form-control form-control-sm text-end bg-white border fw-medium"
            value={costo}
            onChange={(e) => setCosto(Math.max(0.1, Number(e.target.value)))}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 fw-medium" style={{ color: 'var(--sm-ink)' }}>
            Cant. Pedida
          </label>
          <input
            type="number"
            min="1"
            className="form-control form-control-sm text-end bg-white border fw-medium"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <div className="col-12 col-md-1">
          <Button
            size="sm"
            className="w-100"
            disabled={!varianteId || cantidad <= 0 || costo <= 0}
            onClick={handleAgregar}
            title="Agregar a la lista"
            icon={<i className="bi bi-plus-lg" />}
          />
        </div>
      </div>
    </div>
  );
}

export interface OrdenCompraFormProps {
  ordenExistente?: OrdenCompra | null;
  onGuardado: (compra: OrdenCompra) => void;
  onCancelar: () => void;
  esModal?: boolean;
}

export function OrdenCompraForm({
  ordenExistente,
  onGuardado,
  onCancelar,
  esModal = false,
}: OrdenCompraFormProps) {
  const modoEdicion = !!ordenExistente;
  const ordenId = ordenExistente?.id ?? null;

  const { mutate: crearOrden, isPending: creando, error: errorCrear } = useCrearCompra();
  const { mutate: actualizarOrden, isPending: actualizando, error: errorActualizar } = useActualizarCompra();
  const { data: proveedoresData } = useProveedores({ estado: 'activo' });

  const isPending = modoEdicion ? actualizando : creando;
  const error = modoEdicion ? errorActualizar : errorCrear;

  const [metaLineas, setMetaLineas] = useState<
    Record<number, { productoNombre: string; talla: string; color: string; sku: string }>
  >({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrdenCompraFormValues>({
    resolver: zodResolver(ordenCompraSchema),
    defaultValues: {
      proveedorId: 0,
      fechaEstimadaEntrega: '',
      notas: '',
      lineas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' });
  const lineas = watch('lineas');
  const proveedorId = watch('proveedorId');

  // Precargar formulario en modo edición
  useEffect(() => {
    if (!ordenExistente) return;
    setMetaLineas(
      Object.fromEntries(
        ordenExistente.lineas.map((l) => [
          l.varianteId,
          { productoNombre: l.productoNombre, talla: l.talla, color: l.color, sku: l.sku },
        ]),
      ),
    );
    reset({
      proveedorId: ordenExistente.proveedorId,
      fechaEstimadaEntrega: ordenExistente.fechaEstimadaEntrega ?? '',
      notas: ordenExistente.notas ?? '',
      lineas: ordenExistente.lineas.map((l) => ({
        varianteId: l.varianteId,
        cantidadPedida: l.cantidadPedida,
        costoUnitario: l.costoUnitario,
      })),
    });
  }, [ordenExistente, reset]);

  const proveedorSeleccionado = proveedoresData?.datos.find((p) => p.id === Number(proveedorId));

  const totalEstimado = lineas.reduce(
    (acc, l) => acc + (l.cantidadPedida || 0) * (l.costoUnitario || 0),
    0,
  );

  const handleAgregarLinea = (
    varianteId: number,
    productoNombre: string,
    talla: string,
    color: string,
    sku: string,
    costoEstimado: number,
  ) => {
    const idxExistente = lineas.findIndex((l) => l.varianteId === varianteId);
    if (idxExistente >= 0) {
      const cantActual = lineas[idxExistente].cantidadPedida;
      setValue(`lineas.${idxExistente}.cantidadPedida`, cantActual + 10);
      return;
    }

    setMetaLineas((prev) => ({
      ...prev,
      [varianteId]: { productoNombre, talla, color, sku },
    }));

    append({
      varianteId,
      cantidadPedida: 10,
      costoUnitario: costoEstimado,
    });
  };

  const onSubmit = (valores: OrdenCompraFormValues) => {
    if (modoEdicion && ordenId) {
      actualizarOrden({ id: ordenId, form: valores }, { onSuccess: (actualizada) => onGuardado(actualizada) });
    } else {
      crearOrden(valores, { onSuccess: (nueva) => onGuardado(nueva) });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* ── Banner de contexto histórico cuando se está en MODO EDICIÓN ── */}
      {modoEdicion && ordenExistente && (
        <div
          className="p-3 mb-4 rounded d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{
            backgroundColor: 'var(--sm-bone, #f8fafc)',
            border: '1px solid var(--sm-border, #e2e8f0)',
            borderRadius: 'var(--sm-radius-md, 8px)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'var(--sm-primary-subtle, #dbeafe)',
                color: 'var(--sm-primary, #2563eb)',
                fontSize: '1.2rem',
              }}
            >
              <i className="bi bi-receipt-cutoff" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="fw-bold font-monospace" style={{ fontSize: 'var(--sm-text-base)', color: 'var(--sm-ink)' }}>
                  {ordenExistente.codigo}
                </span>
                <StatusBadge estado={estadoOrdenCompraAEstado(ordenExistente.estado)} />
                <span className="badge bg-secondary-subtle text-secondary border small">
                  <i className="bi bi-lock-fill me-1" />
                  Identificador del sistema (Solo lectura)
                </span>
              </div>
              <div className="text-muted small mt-1">
                Registrada el {formatearFechaHora(ordenExistente.fechaCreacion)} · Las tarjetas y casillas con <strong>fondo blanco</strong> son editables.
              </div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-muted small">Total estimado original</div>
            <div className="fw-bold" style={{ fontSize: 'var(--sm-text-lg)', color: 'var(--sm-ink)', fontVariantNumeric: 'tabular-nums' }}>
              {formatearMoneda(ordenExistente.totalEstimado)}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger small mb-4">
          <i className="bi bi-exclamation-triangle me-2" />
          {error.message}
        </div>
      )}

      <div className="row g-4 align-items-start">
        {/* Columna Principal: Tarjetas Blancas para Llenar Datos */}
        <div className={esModal ? 'col-12 col-lg-8' : 'col-12 col-lg-8'}>
          {/* ── Tarjeta 1: Proveedor y Condiciones ── */}
          <div
            className="card border mb-4 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                    Proveedor y Condiciones de Compra
                  </h6>
                  <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                    Selecciona el proveedor registrado y la fecha estimada de llegada a almacén
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
                <div className="col-md-7">
                  <Form.Label htmlFor="oc-prov" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Proveedor <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    id="oc-prov"
                    className="bg-white border"
                    isInvalid={!!errors.proveedorId}
                    {...register('proveedorId', { valueAsNumber: true })}
                  >
                    <option value={0}>Selecciona un proveedor activo…</option>
                    {proveedoresData?.datos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.razonSocial} (RUC: {p.ruc})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.proveedorId?.message}</Form.Control.Feedback>

                  {/* Ficha contextual de solo lectura del proveedor */}
                  {proveedorSeleccionado && (
                    <div
                      className="mt-3 p-3 rounded small"
                      style={{
                        backgroundColor: 'var(--sm-bone, #f8fafc)',
                        border: '1px solid var(--sm-border, #e2e8f0)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold text-muted">
                          <i className="bi bi-building me-1" /> Ficha de referencia del proveedor
                        </span>
                        <span className="badge bg-light text-muted border">Solo lectura</span>
                      </div>
                      <div className="text-muted">
                        <strong>Contacto:</strong> {proveedorSeleccionado.contacto.nombre} ({proveedorSeleccionado.contacto.telefono})
                        <br />
                        <strong>Condiciones:</strong> {proveedorSeleccionado.condicionesComerciales}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-5">
                  <Form.Label htmlFor="oc-fecha" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Fecha Estimada de Entrega
                  </Form.Label>
                  <Form.Control
                    id="oc-fecha"
                    type="date"
                    className="bg-white border"
                    {...register('fechaEstimadaEntrega')}
                  />
                </div>

                <div className="col-12">
                  <Form.Label htmlFor="oc-notas" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                    Notas u Observaciones del Pedido
                  </Form.Label>
                  <Form.Control
                    id="oc-notas"
                    as="textarea"
                    rows={2}
                    className="bg-white border"
                    placeholder="ej. Horario matutino, entrega en almacén central..."
                    {...register('notas')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Tarjeta 2: Prendas Solicitadas ── */}
          <div
            className="card border mb-4 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  2
                </span>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                    Prendas y Variantes Solicitadas
                  </h6>
                  <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                    Agrega prendas y edita los valores directamente en las casillas con fondo blanco
                  </span>
                </div>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                <i className="bi bi-pencil-square me-1" />
                Tabla interactiva
              </span>
            </div>

            <div className="card-body p-4">
              {/* Selector interactivo para agregar líneas */}
              <SelectorVarianteLinea onAgregar={handleAgregarLinea} />

              {errors.lineas && (
                <div className="alert alert-danger small py-2 mb-3">
                  <i className="bi bi-exclamation-circle me-1" />
                  {errors.lineas.message}
                </div>
              )}

              {fields.length === 0 ? (
                <div
                  className="text-center py-4 border rounded text-muted"
                  style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}
                >
                  <i className="bi bi-box-seam fs-3 d-block mb-2 text-muted opacity-50" />
                  No hay prendas agregadas a la orden de compra. Usa el selector de arriba para añadir prendas.
                </div>
              ) : (
                <>
                  <div
                    className="d-flex align-items-center gap-2 p-2 mb-3 rounded small"
                    style={{
                      backgroundColor: 'var(--sm-bone, #f8fafc)',
                      border: '1px solid var(--sm-border, #e2e8f0)',
                      color: 'var(--sm-ink-soft)',
                    }}
                  >
                    <i className="bi bi-info-circle text-primary" />
                    <span>
                      Las celdas con <strong>fondo blanco</strong> en la tabla son editables: puedes ajustar el <strong>Costo Unitario</strong> y la <strong>Cantidad</strong> directamente.
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ minWidth: 160 }}>Prenda / Talla / Color</th>
                          <th className="text-end" style={{ width: 140 }}>
                            Costo Unit. (S/) <span className="text-danger">*</span>
                          </th>
                          <th className="text-end" style={{ width: 130 }}>
                            Cantidad <span className="text-danger">*</span>
                          </th>
                          <th className="text-end" style={{ width: 120 }}>Subtotal</th>
                          <th style={{ width: 45 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, idx) => {
                          const meta = metaLineas[field.varianteId];
                          const cant = lineas[idx]?.cantidadPedida || 0;
                          const cst = lineas[idx]?.costoUnitario || 0;
                          const sub = cant * cst;

                          return (
                            <tr key={field.id}>
                              <td>
                                <div className="fw-semibold small" style={{ color: 'var(--sm-ink)' }}>
                                  {meta?.productoNombre ?? `Variante #${field.varianteId}`}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  {meta ? `${meta.talla} · ${meta.color} (${meta.sku})` : `Variante ID ${field.varianteId}`}
                                </div>
                              </td>
                              <td className="text-end">
                                <input
                                  type="number"
                                  step="0.10"
                                  min="0.10"
                                  className="form-control form-control-sm text-end bg-white border fw-medium"
                                  title="Costo unitario editable"
                                  {...register(`lineas.${idx}.costoUnitario`, { valueAsNumber: true })}
                                />
                              </td>
                              <td className="text-end">
                                <input
                                  type="number"
                                  min="1"
                                  className="form-control form-control-sm text-end bg-white border fw-medium"
                                  title="Cantidad pedida editable"
                                  {...register(`lineas.${idx}.cantidadPedida`, { valueAsNumber: true })}
                                />
                              </td>
                              <td className="text-end fw-semibold small" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatearMoneda(sub)}
                              </td>
                              <td className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger p-1"
                                  onClick={() => remove(idx)}
                                  title="Eliminar ítem"
                                  icon={<i className="bi bi-trash" />}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Columna Lateral: Tarjeta Blanca de Resumen de la Orden */}
        <div className={esModal ? 'col-12 col-lg-4' : 'col-12 col-lg-4'}>
          <div
            className="card border shadow-sm p-4"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
              position: esModal ? 'static' : 'sticky',
              top: 80,
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="h6 fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Resumen de la Orden
              </h3>
              <span className="badge bg-light text-muted border">Cálculo en vivo</span>
            </div>

            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>Proveedor</span>
              <span className="fw-medium text-dark text-truncate" style={{ maxWidth: 160 }}>
                {proveedorSeleccionado ? proveedorSeleccionado.razonSocial : 'No seleccionado'}
              </span>
            </div>

            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>Líneas de prendas</span>
              <span className="fw-semibold text-dark">{fields.length} ítems</span>
            </div>

            <div className="d-flex justify-content-between text-muted small mb-3">
              <span>Total unidades</span>
              <span className="fw-semibold text-dark">
                {lineas.reduce((s, l) => s + (l.cantidadPedida || 0), 0)} u.
              </span>
            </div>

            <hr className="my-2" />

            <div className="d-flex justify-content-between align-items-center my-3">
              <span className="fw-bold" style={{ color: 'var(--sm-ink)' }}>Total Estimado</span>
              <span className="fw-bold fs-4 text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatearMoneda(totalEstimado)}
              </span>
            </div>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                disabled={fields.length === 0 || !proveedorId}
                isLoading={isPending}
                loadingText={modoEdicion ? 'Guardando cambios…' : 'Generando orden…'}
                icon={<i className="bi bi-check2-circle" />}
              >
                {modoEdicion ? 'Guardar cambios' : 'Registrar orden de compra'}
              </Button>
              <Button variant="secondary" onClick={onCancelar} disabled={isPending}>
                Cancelar
              </Button>
            </div>

            <p className="text-muted small mt-3 mb-0 text-center">
              <i className="bi bi-info-circle me-1" />
              La orden quedará en estado <strong>Pendiente</strong> sin alterar el stock físico hasta su recepción.
            </p>
          </div>
        </div>
      </div>
    </Form>
  );
}
