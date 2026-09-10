import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { formatearMoneda } from '../../../lib/format';
import type { ItemCarrito } from '../types';

interface CarritoItemListProps {
  items: ItemCarrito[];
  onCambiarCantidad: (varianteId: number, cantidad: number) => void;
  onQuitar: (varianteId: number) => void;
}

/**
 * Lista de prendas agregadas a la bolsa de compras.
 */
export function CarritoItemList({
  items,
  onCambiarCantidad,
  onQuitar,
}: CarritoItemListProps) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 'var(--sm-radius-md)', overflow: 'hidden' }}>
      <div className="card-body p-0">
        {items.map((item, idx) => (
          <div
            key={item.varianteId}
            className={`d-flex flex-wrap gap-3 p-3 p-md-4 align-items-center ${
              idx < items.length - 1 ? 'border-bottom' : ''
            }`}
          >
            {/* Imagen de la prenda */}
            <div
              className="rounded overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center"
              style={{ width: 85, height: 85, background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            >
              {item.imagenUrl ? (
                <img
                  src={item.imagenUrl}
                  alt={item.productoNombre}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <i className="bi bi-image text-muted fs-3" />
              )}
            </div>

            {/* Datos del producto */}
            <div className="flex-grow-1 min-w-0">
              <span
                className="text-muted small fw-semibold text-uppercase d-block"
                style={{ fontSize: '0.72rem' }}
              >
                {item.marca}
              </span>
              <h2 className="h6 fw-bold mb-1 text-dark text-truncate">
                <Link to={`/producto/${item.productoId}`} className="text-decoration-none text-dark">
                  {item.productoNombre}
                </Link>
              </h2>
              <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>
                Talla: <span className="badge bg-light text-dark border me-2">{item.talla}</span>
                Color: <strong className="text-dark me-2">{item.color}</strong>
                SKU: <code>{item.sku}</code>
              </p>

              {/* Selector de cantidad y eliminar */}
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center border rounded-3 p-1">
                  <button
                    className="btn btn-sm btn-link text-dark p-0 px-2"
                    type="button"
                    onClick={() => onCambiarCantidad(item.varianteId, item.cantidad - 1)}
                    aria-label="Disminuir cantidad"
                  >
                    <i className="bi bi-dash fs-6" />
                  </button>
                  <span className="px-2 fw-bold small" style={{ minWidth: 20, textAlign: 'center' }}>
                    {item.cantidad}
                  </span>
                  <button
                    className="btn btn-sm btn-link text-dark p-0 px-2"
                    type="button"
                    onClick={() => onCambiarCantidad(item.varianteId, item.cantidad + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <i className="bi bi-plus fs-6" />
                  </button>
                </div>

                <Button
                  variant="link"
                  size="sm"
                  className="text-danger"
                  onClick={() => onQuitar(item.varianteId)}
                  icon={<i className="bi bi-trash3" />}
                >
                  <span className="d-none d-sm-inline">Eliminar</span>
                </Button>
              </div>
            </div>

            {/* Precio unitario y subtotal de la línea */}
            <div className="text-end ms-auto">
              <span className="fw-bold fs-5 text-primary d-block" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatearMoneda(item.precioUnitario * item.cantidad)}
              </span>
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                {formatearMoneda(item.precioUnitario)} c/u
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
