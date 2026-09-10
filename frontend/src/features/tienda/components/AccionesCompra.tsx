import { Button } from '../../../components/ui/Button';

interface AccionesCompraProps {
  cantidad: number;
  onCambiarCantidad: (nuevaCantidad: number) => void;
  onAgregar: () => void;
  estaAgotado: boolean;
  sku?: string;
}

/**
 * Bloque de control de cantidad, botón de compra y sellos de confianza (Design System §3).
 */
export function AccionesCompra({
  cantidad,
  onCambiarCantidad,
  onAgregar,
  estaAgotado,
  sku,
}: AccionesCompraProps) {
  return (
    <div className="pt-2 border-top">
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        {/* Selector de cantidad */}
        <div className="d-flex align-items-center border rounded-3 p-1">
          <button
            className="btn btn-sm btn-link text-dark p-0 px-2"
            type="button"
            onClick={() => onCambiarCantidad(Math.max(1, cantidad - 1))}
            disabled={estaAgotado}
            aria-label="Disminuir cantidad"
          >
            <i className="bi bi-dash fs-5" />
          </button>
          <span className="px-3 fw-bold small" style={{ minWidth: 24, textAlign: 'center' }}>
            {cantidad}
          </span>
          <button
            className="btn btn-sm btn-link text-dark p-0 px-2"
            type="button"
            onClick={() => onCambiarCantidad(cantidad + 1)}
            disabled={estaAgotado}
            aria-label="Aumentar cantidad"
          >
            <i className="bi bi-plus fs-5" />
          </button>
        </div>

        {/* Botón principal de agregar */}
        <Button
          variant="primary"
          size="lg"
          className="flex-grow-1 py-2 fw-semibold"
          disabled={estaAgotado}
          icon={<i className="bi bi-bag-plus-fill fs-5" />}
          onClick={onAgregar}
        >
          {estaAgotado ? 'Prenda Agotada' : 'Agregar al Carrito'}
        </Button>
      </div>

      {sku && (
        <p className="text-muted small mb-3">
          SKU de Variante: <code>{sku}</code>
        </p>
      )}

      {/* Badges de garantía */}
      <div className="p-3 bg-light rounded-3 d-flex flex-column gap-2 text-muted small">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-truck text-primary" />
          <span>Envío a domicilio en 24h a 48h hábiles en todo el país.</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-arrow-repeat text-primary" />
          <span>Cambios de talla gratuitos dentro de los 7 días calendario.</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-check text-primary" />
          <span>Pago protegido con comprobante electrónico SUNAT.</span>
        </div>
      </div>
    </div>
  );
}
