import { Button } from '../../../components/ui/Button';

export type TipoOrden = 'recientes' | 'precio-asc' | 'precio-desc';

interface OrdenamientoSelectorProps {
  orden: TipoOrden;
  onChange: (nuevoOrden: TipoOrden) => void;
  catNombre?: string;
  busqueda?: string;
  onLimpiarCat?: () => void;
  onLimpiarBusqueda?: () => void;
  onLimpiarTodos?: () => void;
}

/**
 * Barra superior de filtros activos y selector de ordenamiento (Design System §3).
 */
export function OrdenamientoSelector({
  orden,
  onChange,
  catNombre,
  busqueda,
  onLimpiarCat,
  onLimpiarBusqueda,
  onLimpiarTodos,
}: OrdenamientoSelectorProps) {
  const tieneFiltros = !!catNombre || !!busqueda;

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom">
      {/* Badges de filtros aplicados */}
      <div className="d-flex flex-wrap align-items-center gap-2">
        {tieneFiltros && (
          <>
            <span className="small text-muted me-1">Filtros aplicados:</span>
            {catNombre && (
              <span className="badge rounded-pill bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Colección: {catNombre}
                {onLimpiarCat && (
                  <button
                    type="button"
                    className="btn-close ms-1"
                    style={{ fontSize: '0.5rem' }}
                    onClick={onLimpiarCat}
                    aria-label="Quitar filtro de colección"
                  />
                )}
              </span>
            )}
            {busqueda && (
              <span className="badge rounded-pill bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Búsqueda: "{busqueda}"
                {onLimpiarBusqueda && (
                  <button
                    type="button"
                    className="btn-close ms-1"
                    style={{ fontSize: '0.5rem' }}
                    onClick={onLimpiarBusqueda}
                    aria-label="Quitar filtro de búsqueda"
                  />
                )}
              </span>
            )}
            {onLimpiarTodos && (
              <Button variant="link" size="sm" className="text-danger ms-2" onClick={onLimpiarTodos}>
                Limpiar todos
              </Button>
            )}
          </>
        )}
      </div>

      {/* Selector de ordenamiento */}
      <div className="d-flex align-items-center gap-2 ms-auto">
        <label htmlFor="orden-sel" className="small text-muted text-nowrap">
          Ordenar por:
        </label>
        <select
          id="orden-sel"
          className="form-select form-select-sm"
          style={{ width: 190 }}
          value={orden}
          onChange={(e) => onChange(e.target.value as TipoOrden)}
        >
          <option value="recientes">Novedades y recientes</option>
          <option value="precio-asc">Precio: Menor a Mayor</option>
          <option value="precio-desc">Precio: Mayor a Menor</option>
        </select>
      </div>
    </div>
  );
}
