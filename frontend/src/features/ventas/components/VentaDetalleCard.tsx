import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import { useConfiguracion } from '../../configuracion/hooks/useConfiguracion';
import { StatusBadge, type EstadoVisual } from '../../../components/ui/StatusBadge';
import { useRegistrarDevolucion } from '../hooks/useVentas';
import { devolucionVentaSchema, type DevolucionVentaFormValues } from '../schemas/devolucion.schema';
import type { Venta, DevolucionVenta } from '../types';

interface VentaDetalleCardProps {
  venta: Venta & { devoluciones?: DevolucionVenta[] };
}

const METODO_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia bancaria',
  pasarela: 'Pasarela digital',
};

function estadoBadge(estado: string): EstadoVisual {
  const m: Record<string, EstadoVisual> = {
    confirmada: 'aprobada', pendiente: 'pendiente', cancelada: 'anulada',
    confirmado: 'aprobada', rechazado: 'rechazada',
  };
  return m[estado] ?? 'pendiente';
}

function DevolucionModal({ venta, show, onCerrar }: { venta: Venta; show: boolean; onCerrar: () => void }) {
  const { mutate: registrar, isPending, error } = useRegistrarDevolucion(venta.id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DevolucionVentaFormValues>({
    resolver: zodResolver(devolucionVentaSchema),
    defaultValues: { varianteId: 0, cantidad: 1, motivo: '' },
  });

  const onSubmit = (valores: DevolucionVentaFormValues) => {
    registrar(valores, { onSuccess: () => { reset(); onCerrar(); } });
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5" className="fw-bold" style={{ color: 'var(--sm-ink)' }}>
          Registrar Devolución de Prenda
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="p-4">
          {error && <div className="alert alert-danger small mb-3">{error.message}</div>}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dev-variante" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
              Variante a devolver <span className="text-danger" aria-hidden="true">*</span>
            </Form.Label>
            <Form.Select
              id="dev-variante"
              className="bg-white border"
              isInvalid={!!errors.varianteId}
              {...register('varianteId', { valueAsNumber: true })}
            >
              <option value={0}>— Seleccionar variante —</option>
              {venta.detalles.map((d) => (
                <option key={d.varianteId} value={d.varianteId}>
                  {d.productoNombre} · {d.talla} / {d.color} ({d.cantidad} vendidas)
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.varianteId?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dev-cant" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
              Cantidad <span className="text-danger" aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id="dev-cant"
              type="number"
              min="1"
              step="1"
              className="bg-white border"
              isInvalid={!!errors.cantidad}
              {...register('cantidad', { valueAsNumber: true })}
            />
            <Form.Control.Feedback type="invalid">{errors.cantidad?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="dev-motivo" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
              Motivo <span className="text-danger" aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id="dev-motivo"
              as="textarea"
              rows={3}
              className="bg-white border"
              placeholder="ej. Talla incorrecta — cliente solicita cambio o nota de crédito"
              isInvalid={!!errors.motivo}
              {...register('motivo')}
            />
            <Form.Text className="text-muted small">Mínimo 10 caracteres. El monto reembolsado se calcula automáticamente.</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.motivo?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-top px-4 py-3 bg-light">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} isLoading={isPending} loadingText="Registrando…">
            Registrar devolución
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export function VentaDetalleCard({ venta }: VentaDetalleCardProps) {
  const [mostrarDevolucion, setMostrarDevolucion] = useState(false);
  const { data: config } = useConfiguracion();

  // El precio de venta ya incluye IGV (RN comercial vigente en Perú) — se desglosa a partir
  // de la tasa configurada en Configuración General en vez de asumir un 18% fijo en el código.
  const tasaIgv = config?.comercial.tasaIgv ?? 18;
  const baseImponible = venta.importeTotal / (1 + tasaIgv / 100);
  const montoIgv = venta.importeTotal - baseImponible;

  return (
    <div>
      {/* Encabezado */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-4 mb-4 rounded border shadow-sm"
        style={{ backgroundColor: '#ffffff', borderColor: 'var(--sm-border)', borderRadius: 'var(--sm-radius-md, 8px)' }}
      >
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--sm-ink)' }}>
            Venta V-{String(venta.id).padStart(4, '0')}
          </h2>
          <div className="text-muted small">{formatearFechaHora(venta.fecha)} · {venta.vendedorNombre}</div>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <StatusBadge estado={estadoBadge(venta.estado)} />
          {venta.estado === 'confirmada' && (
            <Button
              size="sm"
              variant="secondary"
              icon={<i className="bi bi-arrow-return-left" />}
              onClick={() => setMostrarDevolucion(true)}
            >
              Registrar devolución
            </Button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* ── Columna izquierda ─────────────────────────────────────────── */}
        <div className="col-12 col-lg-7">
          {/* Detalles de productos */}
          <div
            className="card border mb-4 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
              <h3 className="h6 fw-bold mb-0 text-dark">
                <i className="bi bi-bag me-2 text-primary" />
                Prendas vendidas
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-2">Producto / Variante</th>
                      <th className="text-end">Cant.</th>
                      <th className="text-end">P. Unit.</th>
                      <th className="text-end pe-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venta.detalles.map((d) => (
                      <tr key={d.id}>
                        <td className="ps-2">
                          <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>{d.productoNombre}</div>
                          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                            {d.talla} · {d.color} · <code style={{ fontSize: 'inherit' }}>{d.sku}</code>
                          </div>
                        </td>
                        <td className="text-end" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.cantidad}</td>
                        <td className="text-end" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatearMoneda(d.precioUnitario)}</td>
                        <td className="text-end fw-semibold pe-2" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatearMoneda(d.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end text-muted pt-3">Valor de venta</td>
                      <td className="text-end text-muted pt-3 pe-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatearMoneda(baseImponible)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end text-muted">IGV ({tasaIgv}%)</td>
                      <td className="text-end text-muted pe-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatearMoneda(montoIgv)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end fw-bold text-dark fs-6">Total</td>
                      <td className="text-end fw-bold text-primary fs-6 pe-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatearMoneda(venta.importeTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Devoluciones */}
          {venta.devoluciones && venta.devoluciones.length > 0 && (
            <div
              className="card border shadow-sm mb-4"
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'var(--sm-border)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
                <h3 className="h6 fw-bold mb-0" style={{ color: 'var(--sm-warning)' }}>
                  <i className="bi bi-arrow-return-left me-2" />
                  Devoluciones registradas
                </h3>
              </div>
              <div className="card-body p-4">
                {venta.devoluciones.map((dev) => (
                  <div key={dev.id} className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>
                        {dev.productoNombre} · {dev.talla} / {dev.color} × {dev.cantidad}
                      </div>
                      <div className="text-muted small mt-1">{dev.motivo}</div>
                      <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                        {formatearFechaHora(dev.fecha)} · {dev.usuarioNombre}
                      </div>
                    </div>
                    <span className="fw-bold" style={{ color: 'var(--sm-warning)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      -{formatearMoneda(dev.montoReembolsado)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Columna derecha ───────────────────────────────────────────── */}
        <div className="col-12 col-lg-5">
          {/* Cliente */}
          <div
            className="card border mb-4 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
              <h3 className="h6 fw-bold mb-0 text-dark">
                <i className="bi bi-person me-2 text-primary" />
                Cliente
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="fw-semibold text-dark">{venta.clienteNombre}</div>
              <div className="text-muted small">{venta.clienteEmail}</div>
              {!venta.clienteId && (
                <span className="badge bg-light text-muted border mt-2">Comprador invitado</span>
              )}
            </div>
          </div>

          {/* Pago */}
          <div
            className="card border mb-4 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
              <h3 className="h6 fw-bold mb-0 text-dark">
                <i className="bi bi-credit-card me-2 text-primary" />
                Detalle del Pago
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Método:</span>
                <span className="small fw-medium">{METODO_LABEL[venta.pago.metodoPago]}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Estado:</span>
                <StatusBadge estado={estadoBadge(venta.pago.estado)} />
              </div>
              {venta.pago.referencia && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Referencia:</span>
                  <code className="small bg-light px-2 py-1 rounded border">{venta.pago.referencia}</code>
                </div>
              )}
              <hr className="my-2" style={{ borderColor: 'var(--sm-border)' }} />
              <div className="d-flex justify-content-between align-items-center pt-1">
                <span className="fw-bold text-dark small">Monto pagado:</span>
                <span className="fw-bold text-primary fs-5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatearMoneda(venta.pago.monto)}
                </span>
              </div>
            </div>
          </div>

          {/* Comprobante */}
          {venta.comprobante && (
            <div
              className="card border shadow-sm mb-4"
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'var(--sm-border)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
                <h3 className="h6 fw-bold mb-0 text-dark">
                  <i className="bi bi-file-earmark-text me-2 text-primary" />
                  Comprobante Emitido
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Tipo:</span>
                  <span className="small fw-medium text-capitalize">{venta.comprobante.tipo}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Serie / N.º:</span>
                  <code className="small bg-light px-2 py-1 rounded border">{venta.comprobante.serie}-{venta.comprobante.numero}</code>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Emisión:</span>
                  <span className="small text-muted">{formatearFechaHora(venta.comprobante.fechaEmision)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DevolucionModal venta={venta} show={mostrarDevolucion} onCerrar={() => setMostrarDevolucion(false)} />
    </div>
  );
}
