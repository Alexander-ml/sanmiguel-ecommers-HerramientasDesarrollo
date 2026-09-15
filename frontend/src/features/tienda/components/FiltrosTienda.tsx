import type { Categoria } from '../../catalogo/types';

interface FiltrosTiendaProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  catActiva: string;
  onCatChange: (id: string) => void;
  categorias: Categoria[];
}

/**
 * Sidebar de filtros para el catálogo de Colecciones (Design System §3).
 */
export function FiltrosTienda({
  busqueda,
  onBusquedaChange,
  catActiva,
  onCatChange,
  categorias,
}: FiltrosTiendaProps) {
  return (
    <aside className="col-12 col-md-3 col-lg-3">
      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
        {/* Buscador de prendas */}
        <h2 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-search text-primary" />
          Buscar en Catálogo
        </h2>
        <div className="input-group input-group-sm mb-4">
          <input
            type="search"
            className="form-control"
            placeholder="Ej. camisa oxford, polo…"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
          />
        </div>

        {/* Lista de colecciones / categorías */}
        <h2 className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-tags text-primary" />
          Colecciones
        </h2>
        <ul className="list-unstyled mb-0">
          <li className="mb-1">
            <button
              type="button"
              className={`btn btn-sm w-100 text-start py-2 px-2 d-flex justify-content-between align-items-center ${
                catActiva === '' ? 'fw-bold bg-primary text-white' : 'text-dark'
              }`}
              style={{ borderRadius: 6 }}
              onClick={() => onCatChange('')}
            >
              <span>Todas las prendas</span>
              <i className="bi bi-chevron-right small opacity-50" />
            </button>
          </li>
          {categorias
            .filter((c) => !c.categoriaPadreId)
            .map((cat) => (
              <li key={cat.id} className="mb-1">
                <button
                  type="button"
                  className={`btn btn-sm w-100 text-start py-2 px-2 d-flex justify-content-between align-items-center ${
                    catActiva === String(cat.id) ? 'fw-bold bg-primary text-white' : 'text-dark'
                  }`}
                  style={{ borderRadius: 6 }}
                  onClick={() => onCatChange(String(cat.id))}
                >
                  <span>{cat.nombre}</span>
                  <i className="bi bi-chevron-right small opacity-50" />
                </button>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
