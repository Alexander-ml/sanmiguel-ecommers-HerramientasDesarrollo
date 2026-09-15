import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { formatearMoneda } from '../../../lib/format';
import { Button } from '../../../components/ui/Button';
import type { Producto } from '../../catalogo/types';

interface ProductoCardPublicoProps {
  producto: Producto;
  onComprarRapido?: (producto: Producto) => void;
}

/**
 * Tarjeta de prenda comercial para el e-commerce (Design System §3).
 * Utiliza tokens de marca (--sm-ink, --sm-bone, --sm-primary) y diseño de alta gama.
 */
export function ProductoCardPublico({ producto, onComprarRapido }: ProductoCardPublicoProps) {
  const usuario = useAuthStore((state) => state.usuario);
  const esColaborador = !!usuario && ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'].includes(usuario.rol);

  return (
    <div
      className="card border-0 h-100 position-relative shadow-sm"
      style={{
        borderRadius: 'var(--sm-radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--sm-surface)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sm-shadow-md)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sm-shadow-sm)';
      }}
    >
      {/* Badge de acceso rápido para personal interno */}
      {esColaborador && (
        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
          <Link
            to={`/admin/productos/${producto.id}/editar`}
            className="badge bg-dark bg-opacity-75 text-white text-decoration-none py-1 px-2 d-inline-flex align-items-center gap-1"
            title="Editar prenda en Inventario"
          >
            <i className="bi bi-pencil-square text-warning" />
            <span style={{ fontSize: '0.68rem' }}>Inventario</span>
          </Link>
        </div>
      )}

      {/* Imagen y enlace a detalle */}
      <Link to={`/producto/${producto.id}`} className="text-decoration-none d-block">
        <div
          className="ratio ratio-4x3 d-flex align-items-center justify-content-center"
          style={{ background: 'var(--sm-bone)' }}
        >
          {producto.imagenes?.[0] ? (
            <img
              src={producto.imagenes[0]}
              alt={producto.nombre}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <i className="bi bi-image" style={{ fontSize: '2.5rem', color: 'var(--sm-neutral)', opacity: 0.3 }} />
          )}
        </div>

        <div className="card-body p-3 pb-2">
          <span
            className="text-muted small fw-semibold text-uppercase d-block mb-1"
            style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
          >
            {producto.marca}
          </span>
          <h3
            className="h6 fw-semibold mb-2 text-truncate"
            style={{ color: 'var(--sm-ink)', lineHeight: 1.3 }}
          >
            {producto.nombre}
          </h3>
          <p
            className="fw-bold fs-5 mb-0"
            style={{ color: 'var(--sm-primary)', fontVariantNumeric: 'tabular-nums' }}
          >
            {formatearMoneda(producto.precioBase)}
          </p>
        </div>
      </Link>

      {/* Acciones de compra rápida */}
      <div className="card-footer bg-white border-0 pt-0 p-3 d-flex gap-2">
        {onComprarRapido ? (
          <Button
            variant="primary"
            size="sm"
            className="flex-grow-1 py-1"
            icon={<i className="bi bi-bag-plus" />}
            onClick={() => onComprarRapido(producto)}
          >
            Agregar
          </Button>
        ) : (
          <Link
            to={`/producto/${producto.id}`}
            className="btn btn-sm btn-primary flex-grow-1 py-1 d-inline-flex align-items-center justify-content-center gap-1"
            style={{ borderRadius: 6 }}
          >
            <i className="bi bi-bag-plus" />
            <span>Ver prenda</span>
          </Link>
        )}

        <Link
          to={`/producto/${producto.id}`}
          className="btn btn-sm btn-outline-secondary px-2 py-1 d-inline-flex align-items-center justify-content-center"
          style={{ borderRadius: 6 }}
          title="Ver ficha completa"
          aria-label="Ver ficha completa"
        >
          <i className="bi bi-eye" />
        </Link>
      </div>
    </div>
  );
}
