import type { ReactNode, ChangeEvent } from 'react';

export interface FiltroSelect {
  /** Texto del placeholder o primera opción ("Todos los estados") */
  nombre: string;
  /** Rótulo o micro-etiqueta superior visible (ej. "Estado de producto", "Categoría") */
  etiqueta?: string;
  opciones: { valor: string; etiqueta: string }[];
  valor: string;
  onChange: (valor: string) => void;
}

interface FiltersBarProps {
  /** Rótulo o micro-etiqueta superior visible del campo de búsqueda */
  etiquetaBusqueda?: string;
  /** Valor actual del campo de búsqueda de texto */
  busqueda?: string;
  /** Placeholder del campo de búsqueda */
  placeholderBusqueda?: string;
  onBusquedaChange?: (valor: string) => void;
  /** Selects adicionales (categoría, estado, etc.) */
  filtros?: FiltroSelect[];
  /** Botones u otros elementos que se añaden al extremo derecho */
  acciones?: ReactNode;
  /** Controles o inputs adicionales integrados dentro del contenedor de filtros */
  children?: ReactNode;
}

/**
 * Barra de filtros genérica para todos los listados administrativos.
 * Posee contenedor visual propio (--sm-surface, borde y radio) con micro-etiquetas
 * descriptivas superiores para que el usuario siempre sepa qué criterio está aplicando.
 */
export function FiltersBar({
  etiquetaBusqueda,
  busqueda,
  placeholderBusqueda = 'Buscar…',
  onBusquedaChange,
  filtros = [],
  acciones,
  children,
}: FiltersBarProps) {
  return (
    <div
      className="d-flex flex-wrap align-items-end gap-3 p-3 mb-3"
      style={{
        background: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius-md)',
        boxShadow: 'var(--sm-shadow-sm)',
      }}
    >
      {onBusquedaChange !== undefined && (
        <div className="d-flex flex-column" style={{ minWidth: 220, maxWidth: 320, flex: '1 1 220px' }}>
          <label
            className="text-muted fw-semibold mb-1 text-truncate"
            style={{ fontSize: 'var(--sm-text-xs)', letterSpacing: '0.01em' }}
          >
            {etiquetaBusqueda || 'Búsqueda rápida'}
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted" style={{ fontSize: '0.85rem' }} />
            </span>
            <input
              type="search"
              className="form-control border-start-0 ps-0"
              placeholder={placeholderBusqueda}
              value={busqueda ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onBusquedaChange(e.target.value)}
              aria-label={etiquetaBusqueda || placeholderBusqueda}
            />
          </div>
        </div>
      )}

      {filtros.map((filtro) => (
        <div
          key={filtro.nombre}
          className="d-flex flex-column"
          style={{ minWidth: 150, flex: '0 1 auto' }}
        >
          <label
            className="text-muted fw-semibold mb-1 text-truncate"
            style={{ fontSize: 'var(--sm-text-xs)', letterSpacing: '0.01em' }}
          >
            {filtro.etiqueta || 'Filtrar por'}
          </label>
          <select
            className="form-select"
            value={filtro.valor}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => filtro.onChange(e.target.value)}
            aria-label={filtro.etiqueta || filtro.nombre}
          >
            <option value="">{filtro.nombre}</option>
            {filtro.opciones.map((op) => (
              <option key={op.valor} value={op.valor}>
                {op.etiqueta}
              </option>
            ))}
          </select>
        </div>
      ))}

      {children && (
        <div className="d-flex flex-wrap align-items-end gap-2">
          {children}
        </div>
      )}

      {acciones && <div className="ms-auto align-self-end">{acciones}</div>}
    </div>
  );
}
