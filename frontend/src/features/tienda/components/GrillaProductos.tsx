import { ProductoCardPublico } from './ProductoCardPublico';
import { Pagination } from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import type { Producto } from '../../catalogo/types';

interface GrillaProductosProps {
  isLoading: boolean;
  productos: Producto[];
  total: number;
  totalPaginas: number;
  paginaActual: number;
  onCambiarPagina: (pagina: number) => void;
  onLimpiarFiltros: () => void;
  onComprarRapido: (producto: Producto) => void;
}

/**
 * Cuadrícula principal de productos con estados de carga, vacío y paginación.
 */
export function GrillaProductos({
  isLoading,
  productos,
  total,
  totalPaginas,
  paginaActual,
  onCambiarPagina,
  onLimpiarFiltros,
  onComprarRapido,
}: GrillaProductosProps) {
  if (isLoading) {
    return (
      <main className="col-12 col-md-9 col-lg-9 text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted small mt-2">Cargando prendas disponibles…</p>
      </main>
    );
  }

  if (productos.length === 0) {
    return (
      <main className="col-12 col-md-9 col-lg-9">
        <div className="card border-0 shadow-sm p-5 text-center my-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
          <i className="bi bi-search fs-1 text-muted mb-3" />
          <h3 className="h5 fw-bold text-dark">No se encontraron prendas</h3>
          <p className="text-muted small mb-4" style={{ maxWidth: 420, margin: '0 auto' }}>
            No tenemos productos que coincidan con los filtros seleccionados. Prueba buscando con otro término o seleccionando otra colección.
          </p>
          <div>
            <Button size="sm" className="px-4" onClick={onLimpiarFiltros}>
              Ver todo el catálogo
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="col-12 col-md-9 col-lg-9">
      <div className="row g-3">
        {productos.map((prod) => (
          <div key={prod.id} className="col-6 col-md-6 col-lg-4">
            <ProductoCardPublico
              producto={prod}
              onComprarRapido={onComprarRapido}
            />
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 pt-3 border-top">
          <Pagination
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalItems={total}
            itemsPorPagina={12}
            onCambiarPagina={onCambiarPagina}
          />
        </div>
      )}
    </main>
  );
}
