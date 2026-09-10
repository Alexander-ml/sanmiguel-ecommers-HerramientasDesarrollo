import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Spinner } from 'react-bootstrap';
import { checkoutSchema, type CheckoutFormValues } from '../schemas/checkout.schema';
import { useConfirmarPedido } from '../hooks/useConfirmarPedido';
import { useCarritoStore, selectSubtotal, selectTotalItems } from '../store/carritoStore';
import { formatearMoneda } from '../../../lib/format';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type { Pedido } from '../../tienda/types';

// ── Pasos del checkout ─────────────────────────────────────────────────────────
const PASOS = ['Contacto', 'Entrega', 'Pago', 'Confirmar'] as const;

function StepIndicator({ paso }: { paso: number }) {
  return (
    <div className="d-flex align-items-center gap-0 mb-4 overflow-x-auto">
      {PASOS.map((label, idx) => {
        const activo = idx === paso;
        const completado = idx < paso;
        return (
          <div key={label} className="d-flex align-items-center" style={{ flexShrink: 0 }}>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
              style={{
                width: 36, height: 36,
                background: completado ? 'var(--sm-success)' : activo ? 'var(--sm-primary)' : 'var(--sm-bone)',
                color: completado || activo ? '#fff' : 'var(--sm-ink-soft)',
                border: `2px solid ${completado ? 'var(--sm-success)' : activo ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
                fontSize: 'var(--sm-text-sm)',
                transition: 'all 0.2s',
              }}
            >
              {completado ? <i className="bi bi-check" /> : idx + 1}
            </div>
            <span
              className="ms-2 small"
              style={{
                color: activo ? 'var(--sm-primary)' : completado ? 'var(--sm-success)' : 'var(--sm-ink-soft)',
                fontWeight: activo ? 600 : 400,
                minWidth: 60,
              }}
            >
              {label}
            </span>
            {idx < PASOS.length - 1 && (
              <div
                className="mx-3"
                style={{
                  flex: 1,
                  height: 2,
                  minWidth: 20,
                  background: completado ? 'var(--sm-success)' : 'var(--sm-border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const items = useCarritoStore((s) => s.items);
  const subtotal = useCarritoStore(selectSubtotal);
  const totalItems = useCarritoStore(selectTotalItems);
  const { mutate: confirmar, isPending, error } = useConfirmarPedido();

  const [paso, setPaso] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      modalidad: 'invitado',
      nombres: usuario ? `${usuario.nombres}` : '',
      apellidos: usuario ? `${usuario.apellidos}` : '',
      email: usuario?.correo ?? '',
      telefono: '',
      modalidadEntrega: 'envio',
      direccion: '',
      ciudad: '',
      referencia: '',
      metodoPago: 'efectivo',
      notas: '',
    },
  });

  const modalidadEntrega = watch('modalidadEntrega');
  const metodoPago = watch('metodoPago');

  // Redirigir si el carrito está vacío
  if (items.length === 0 && !pedidoConfirmado) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart4" style={{ fontSize: '3rem', color: 'var(--sm-primary)', opacity: 0.3 }} />
        <p className="mt-3 text-muted">Tu carrito está vacío.</p>
        <Link to="/colecciones" className="btn btn-outline-dark btn-sm mt-2">
          Ver colecciones
        </Link>
      </div>
    );
  }

  // Paso de confirmación exitosa
  if (pedidoConfirmado) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 600 }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
          style={{ width: 80, height: 80, background: 'var(--sm-success)', color: '#fff' }}
        >
          <i className="bi bi-check-lg" style={{ fontSize: '2.5rem' }} />
        </div>
        <h1 className="sm-font-display mb-2" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--sm-ink)' }}>
          ¡Pedido confirmado!
        </h1>
        <p className="text-muted mb-1">Tu código de pedido es:</p>
        <div
          className="fw-bold mb-4"
          style={{ fontSize: '1.5rem', color: 'var(--sm-primary)', fontFamily: 'monospace' }}
        >
          {pedidoConfirmado.codigo}
        </div>
        <p className="text-muted small mb-4">
          {metodoPago === 'transferencia'
            ? 'Tu pedido queda en espera de confirmación de pago. Te contactaremos pronto.'
            : 'En breve recibirás un correo con los detalles de tu pedido.'}
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-outline-dark">
            <i className="bi bi-house me-1" />Inicio
          </Link>
          <Link to="/colecciones" className="btn" style={{ backgroundColor: 'var(--sm-primary)', color: '#fff' }}>
            <i className="bi bi-grid me-1" />Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  const avanzar = async (campos: (keyof CheckoutFormValues)[]) => {
    const ok = await trigger(campos);
    if (ok) setPaso((p) => p + 1);
  };

  const onSubmit = (valores: CheckoutFormValues) => {
    confirmar(valores, {
      onSuccess: (pedido) => setPedidoConfirmado(pedido),
    });
  };

  return (
    <>
      <div className="py-4" style={{ background: 'var(--sm-bone)', borderBottom: '1px solid var(--sm-border)' }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--sm-primary)' }}>Inicio</Link></li>
              <li className="breadcrumb-item"><Link to="/carrito" style={{ color: 'var(--sm-primary)' }}>Carrito</Link></li>
              <li className="breadcrumb-item active">Checkout</li>
            </ol>
          </nav>
          <h1 className="sm-font-display mt-1 mb-0" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 400, color: 'var(--sm-ink)' }}>
            Finalizar compra
          </h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4 align-items-start">
          {/* ── Formulario ─────────────────────────────────────────────── */}
          <div className="col-12 col-lg-7">
            <StepIndicator paso={paso} />

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && (
                <div className="alert alert-danger small mb-4">
                  <i className="bi bi-exclamation-triangle me-2" />
                  {error.message}
                </div>
              )}

              {/* ── Paso 0: Contacto ──────────────────────────────────── */}
              {paso === 0 && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
                  <h2 className="h5 fw-semibold mb-4" style={{ color: 'var(--sm-ink)' }}>
                    <i className="bi bi-person me-2" style={{ color: 'var(--sm-primary)' }} />
                    Datos de contacto
                  </h2>

                  {/* Opción invitado / autenticado */}
                  {!usuario && (
                    <div
                      className="d-flex gap-3 mb-4 p-3 rounded"
                      style={{ background: 'var(--sm-bone)', border: '1px solid var(--sm-border)' }}
                    >
                      <i className="bi bi-info-circle" style={{ color: 'var(--sm-primary)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="small mb-1 fw-medium">¿Ya tienes cuenta?</p>
                        <p className="small text-muted mb-2">Puedes continuar como invitado sin necesidad de registrarte.</p>
                        <Link to="/login" className="btn btn-sm btn-outline-secondary me-2">
                          <i className="bi bi-box-arrow-in-right me-1" />
                          Iniciar sesión
                        </Link>
                        <Link to="/registro" className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-person-plus me-1" />
                          Registrarse
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Label htmlFor="chk-nombres">Nombres <span className="text-danger">*</span></Form.Label>
                      <Form.Control id="chk-nombres" placeholder="Juan" isInvalid={!!errors.nombres} {...register('nombres')} />
                      <Form.Control.Feedback type="invalid">{errors.nombres?.message}</Form.Control.Feedback>
                    </div>
                    <div className="col-md-6">
                      <Form.Label htmlFor="chk-apellidos">Apellidos <span className="text-danger">*</span></Form.Label>
                      <Form.Control id="chk-apellidos" placeholder="Pérez García" isInvalid={!!errors.apellidos} {...register('apellidos')} />
                      <Form.Control.Feedback type="invalid">{errors.apellidos?.message}</Form.Control.Feedback>
                    </div>
                    <div className="col-md-7">
                      <Form.Label htmlFor="chk-email">Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control id="chk-email" type="email" placeholder="correo@ejemplo.com" isInvalid={!!errors.email} {...register('email')} />
                      <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </div>
                    <div className="col-md-5">
                      <Form.Label htmlFor="chk-tel">Teléfono <span className="text-danger">*</span></Form.Label>
                      <Form.Control id="chk-tel" placeholder="987654321" isInvalid={!!errors.telefono} {...register('telefono')} />
                      <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      type="button"
                      style={{ backgroundColor: 'var(--sm-primary)', borderColor: 'var(--sm-primary)' }}
                      onClick={() => avanzar(['nombres', 'apellidos', 'email', 'telefono'])}
                    >
                      Continuar <i className="bi bi-arrow-right ms-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Paso 1: Entrega ───────────────────────────────────── */}
              {paso === 1 && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
                  <h2 className="h5 fw-semibold mb-4" style={{ color: 'var(--sm-ink)' }}>
                    <i className="bi bi-truck me-2" style={{ color: 'var(--sm-primary)' }} />
                    Modalidad de entrega
                  </h2>

                  <div className="row g-3 mb-4">
                    {[
                      { value: 'envio', label: 'Envío a domicilio', icono: 'bi-truck' },
                      { value: 'recojo_tienda', label: 'Recojo en tienda', icono: 'bi-shop' },
                    ].map((opt) => (
                      <div key={opt.value} className="col-6">
                        <label
                          className="d-flex align-items-center gap-2 p-3 rounded cursor-pointer"
                          style={{
                            border: `2px solid ${modalidadEntrega === opt.value ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
                            background: modalidadEntrega === opt.value ? 'var(--sm-bone)' : '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <input type="radio" value={opt.value} className="d-none" {...register('modalidadEntrega')} />
                          <i className={`bi ${opt.icono}`} style={{ color: modalidadEntrega === opt.value ? 'var(--sm-primary)' : 'var(--sm-ink-soft)' }} />
                          <span className="small fw-medium">{opt.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {modalidadEntrega === 'envio' && (
                    <div className="row g-3">
                      <div className="col-md-8">
                        <Form.Label htmlFor="chk-dir">Dirección <span className="text-danger">*</span></Form.Label>
                        <Form.Control id="chk-dir" placeholder="Av. La Marina 2305, Miraflores" isInvalid={!!errors.direccion} {...register('direccion')} />
                        <Form.Control.Feedback type="invalid">{errors.direccion?.message}</Form.Control.Feedback>
                      </div>
                      <div className="col-md-4">
                        <Form.Label htmlFor="chk-ciudad">Ciudad <span className="text-danger">*</span></Form.Label>
                        <Form.Control id="chk-ciudad" placeholder="Lima" isInvalid={!!errors.ciudad} {...register('ciudad')} />
                        <Form.Control.Feedback type="invalid">{errors.ciudad?.message}</Form.Control.Feedback>
                      </div>
                      <div className="col-12">
                        <Form.Label htmlFor="chk-ref">Referencia</Form.Label>
                        <Form.Control id="chk-ref" placeholder="Cerca al parque, portón azul…" {...register('referencia')} />
                      </div>
                    </div>
                  )}
                  {modalidadEntrega === 'recojo_tienda' && (
                    <div className="p-3 rounded" style={{ background: 'var(--sm-bone)', border: '1px solid var(--sm-border)' }}>
                      <i className="bi bi-geo-alt me-2" style={{ color: 'var(--sm-primary)' }} />
                      <strong>San Miguel</strong> — Av. Balta 1234, Chiclayo
                      <p className="small text-muted mb-0 mt-1">Lunes a sábado de 9:00 a 19:00 hrs. Te notificaremos cuando esté listo.</p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <Button type="button" variant="outline-secondary" onClick={() => setPaso(0)}>
                      <i className="bi bi-arrow-left me-1" /> Volver
                    </Button>
                    <Button
                      type="button"
                      style={{ backgroundColor: 'var(--sm-primary)', borderColor: 'var(--sm-primary)' }}
                      onClick={() => avanzar(modalidadEntrega === 'envio' ? ['direccion', 'ciudad'] : ['modalidadEntrega'])}
                    >
                      Continuar <i className="bi bi-arrow-right ms-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Paso 2: Pago ──────────────────────────────────────── */}
              {paso === 2 && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
                  <h2 className="h5 fw-semibold mb-4" style={{ color: 'var(--sm-ink)' }}>
                    <i className="bi bi-credit-card me-2" style={{ color: 'var(--sm-primary)' }} />
                    Método de pago
                  </h2>

                  <div className="row g-3 mb-4">
                    {[
                      { value: 'efectivo', label: 'Efectivo', icono: 'bi-cash-coin' },
                      { value: 'tarjeta', label: 'Tarjeta', icono: 'bi-credit-card' },
                      { value: 'transferencia', label: 'Transferencia', icono: 'bi-bank' },
                      { value: 'pasarela', label: 'Pasarela digital', icono: 'bi-phone' },
                    ].map((opt) => (
                      <div key={opt.value} className="col-6">
                        <label
                          className="d-flex align-items-center gap-2 p-3 rounded"
                          style={{
                            border: `2px solid ${metodoPago === opt.value ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
                            background: metodoPago === opt.value ? 'var(--sm-bone)' : '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <input type="radio" value={opt.value} className="d-none" {...register('metodoPago')} />
                          <i className={`bi ${opt.icono}`} style={{ color: metodoPago === opt.value ? 'var(--sm-primary)' : 'var(--sm-ink-soft)' }} />
                          <span className="small fw-medium">{opt.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {metodoPago === 'transferencia' && (
                    <div className="alert alert-info small">
                      <i className="bi bi-info-circle me-2" />
                      Tu pedido quedará en espera hasta que confirmemos la transferencia. Te contactaremos por email.
                    </div>
                  )}

                  <div className="mb-3">
                    <Form.Label htmlFor="chk-notas">Notas adicionales (opcional)</Form.Label>
                    <Form.Control id="chk-notas" as="textarea" rows={2} placeholder="Indicaciones especiales, horario preferido…" {...register('notas')} />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Button type="button" variant="outline-secondary" onClick={() => setPaso(1)}>
                      <i className="bi bi-arrow-left me-1" /> Volver
                    </Button>
                    <Button
                      type="button"
                      style={{ backgroundColor: 'var(--sm-primary)', borderColor: 'var(--sm-primary)' }}
                      onClick={() => avanzar(['metodoPago'])}
                    >
                      Revisar pedido <i className="bi bi-arrow-right ms-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Paso 3: Confirmar ─────────────────────────────────── */}
              {paso === 3 && (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
                  <h2 className="h5 fw-semibold mb-4" style={{ color: 'var(--sm-ink)' }}>
                    <i className="bi bi-clipboard-check me-2" style={{ color: 'var(--sm-primary)' }} />
                    Resumen final
                  </h2>

                  <table className="table table-sm mb-4">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-end">Cant.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.varianteId}>
                          <td>
                            <div style={{ fontSize: 'var(--sm-text-sm)' }}>{item.productoNombre}</div>
                            <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>{item.talla} · {item.color}</div>
                          </td>
                          <td className="text-end">{item.cantidad}</td>
                          <td className="text-end" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatearMoneda(item.precioUnitario * item.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2} className="text-end fw-bold">Total</td>
                        <td className="text-end fw-bold" style={{ color: 'var(--sm-primary)', fontVariantNumeric: 'tabular-nums' }}>
                          {formatearMoneda(subtotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="d-flex justify-content-between mt-4">
                    <Button type="button" variant="outline-secondary" onClick={() => setPaso(2)}>
                      <i className="bi bi-arrow-left me-1" /> Volver
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      style={{ backgroundColor: 'var(--sm-primary)', borderColor: 'var(--sm-primary)' }}
                    >
                      {isPending
                        ? <><Spinner size="sm" className="me-2" />Procesando…</>
                        : <><i className="bi bi-check-circle me-2" />Confirmar pedido</>
                      }
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>

          {/* ── Sidebar resumen ─────────────────────────────────────────── */}
          <div className="col-12 col-lg-5">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderRadius: 'var(--sm-radius-md)', position: 'sticky', top: 80 }}
            >
              <h3 className="h6 fw-bold mb-3" style={{ color: 'var(--sm-ink)' }}>
                Tu pedido ({totalItems} producto{totalItems !== 1 ? 's' : ''})
              </h3>
              {items.map((item) => (
                <div key={item.varianteId} className="d-flex justify-content-between mb-2 small">
                  <div className="text-muted">
                    {item.productoNombre} · {item.talla}/{item.color} × {item.cantidad}
                  </div>
                  <div className="fw-medium" style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {formatearMoneda(item.precioUnitario * item.cantidad)}
                  </div>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span style={{ color: 'var(--sm-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatearMoneda(subtotal)}
                </span>
              </div>
              <p className="text-muted small mt-3 mb-0">
                <i className="bi bi-shield-check me-1" style={{ color: 'var(--sm-success)' }} />
                Compra protegida · Sin cargo adicional
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
