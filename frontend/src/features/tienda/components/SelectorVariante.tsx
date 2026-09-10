interface SelectorVarianteProps {
  tallas: string[];
  tallaSelec: string | null;
  onSeleccionarTalla: (talla: string) => void;
  colores: string[];
  colorSelec: string | null;
  onSeleccionarColor: (color: string) => void;
  stockDisponible: number;
}

/**
 * Selector interactivo de tallas, colores y visualización de disponibilidad en tiempo real.
 */
export function SelectorVariante({
  tallas,
  tallaSelec,
  onSeleccionarTalla,
  colores,
  colorSelec,
  onSeleccionarColor,
  stockDisponible,
}: SelectorVarianteProps) {
  return (
    <div className="mb-4">
      {/* Selector de Talla */}
      {tallas.length > 0 && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold small text-dark">
              Talla: <strong className="text-primary">{tallaSelec}</strong>
            </span>
            <span className="small text-muted" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-rulers me-1" /> Guía de tallas
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {tallas.map((t) => (
              <button
                key={t}
                type="button"
                className={`btn btn-sm px-3 py-2 fw-medium ${
                  tallaSelec === t
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-outline-secondary'
                }`}
                style={{ borderRadius: 8, minWidth: 46 }}
                onClick={() => onSeleccionarTalla(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {colores.length > 0 && (
        <div className="mb-3">
          <span className="fw-semibold small text-dark d-block mb-2">
            Color: <strong className="text-primary">{colorSelec}</strong>
          </span>
          <div className="d-flex flex-wrap gap-2">
            {colores.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm px-3 py-1 fw-medium ${
                  colorSelec === c ? 'btn-dark text-white' : 'btn-outline-secondary'
                }`}
                style={{ borderRadius: 8 }}
                onClick={() => onSeleccionarColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disponibilidad de inventario */}
      <div className="mt-2">
        {stockDisponible > 5 ? (
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
            <i className="bi bi-check-circle me-1" /> En stock ({stockDisponible} unidades disponibles)
          </span>
        ) : stockDisponible > 0 ? (
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">
            <i className="bi bi-exclamation-triangle me-1" /> ¡Últimas {stockDisponible} unidades disponibles!
          </span>
        ) : (
          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
            <i className="bi bi-x-circle me-1" /> Agotado temporalmente
          </span>
        )}
      </div>
    </div>
  );
}
