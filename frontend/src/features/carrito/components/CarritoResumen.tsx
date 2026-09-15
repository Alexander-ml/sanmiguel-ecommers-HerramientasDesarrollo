import { Button } from '../../../components/ui/Button';
import { formatearMoneda } from '../../../lib/format';
import { CuponDescuento } from './CuponDescuento';

interface CarritoResumenProps {
  subtotalNeto: number;
  igvCalculado: number;
  descuentoPorcentaje: number;
  montoDescuento: number;
  subtotalConDescuento: number;
  faltaParaGratis: number;
  onProcederCheckout: () => void;
  onAplicarCupon: (porcentaje: number) => void;
}

/**
 * Tarjeta de resumen de compra, desglose de impuestos y botón de checkout (Design System §3).
 */
export function CarritoResumen({
  subtotalNeto,
  igvCalculado,
  descuentoPorcentaje,
  montoDescuento,
  subtotalConDescuento,
  faltaParaGratis,
  onProcederCheckout,
  onAplicarCupon,
}: CarritoResumenProps) {
  return (
    <div
      className="card border-0 shadow-sm p-4"
      style={{ borderRadius: 'var(--sm-radius-md)', position: 'sticky', top: 90 }}
    >
      <h3
        className="h6 fw-bold mb-3 text-dark text-uppercase"
        style={{ letterSpacing: '0.05em' }}
      >
        Resumen del Pedido
      </h3>

      {/* Input de cupón promocional */}
      <CuponDescuento onAplicarCupon={onAplicarCupon} />

      <hr className="my-2" />

      {/* Desglose tributario y comercial */}
      <div className="d-flex justify-content-between mb-2 small text-muted">
        <span>Subtotal neto</span>
        <span className="text-dark fw-semibold">{formatearMoneda(subtotalNeto)}</span>
      </div>
      <div className="d-flex justify-content-between mb-2 small text-muted">
        <span>I.G.V. (18% incluido)</span>
        <span className="text-dark fw-semibold">{formatearMoneda(igvCalculado)}</span>
      </div>
      {descuentoPorcentaje > 0 && (
        <div className="d-flex justify-content-between mb-2 small text-success">
          <span>Descuento ({descuentoPorcentaje * 100}%)</span>
          <span>-{formatearMoneda(montoDescuento)}</span>
        </div>
      )}
      <div className="d-flex justify-content-between mb-3 small text-muted">
        <span>Envío</span>
        {faltaParaGratis === 0 ? (
          <span className="badge bg-success bg-opacity-25 text-success">¡Gratis!</span>
        ) : (
          <span className="fst-italic">Calculado en checkout</span>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center pt-2 mb-4 border-top">
        <span className="fw-bold fs-6 text-dark">Total a Pagar</span>
        <span
          className="fw-extrabold fs-4 text-primary"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatearMoneda(subtotalConDescuento)}
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-100 py-2 fw-semibold"
        icon={<i className="bi bi-shield-check fs-5" />}
        onClick={onProcederCheckout}
      >
        Proceder al Pago Seguro
      </Button>

      <div className="mt-4 pt-3 border-top text-center text-muted small" style={{ fontSize: '0.78rem' }}>
        <p className="mb-2">
          <i className="bi bi-lock-fill text-success me-1" />
          Transacción 100% encriptada y protegida.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <span className="badge bg-light text-muted border">Yape</span>
          <span className="badge bg-light text-muted border">Plin</span>
          <span className="badge bg-light text-muted border">Tarjetas</span>
          <span className="badge bg-light text-muted border">Transferencias</span>
        </div>
      </div>
    </div>
  );
}
