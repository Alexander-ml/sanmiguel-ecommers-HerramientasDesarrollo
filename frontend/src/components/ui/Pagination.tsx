interface PaginationProps {
  /** Página actual (1-based) */
  paginaActual: number;
  totalPaginas: number;
  /** Total de ítems, para mostrar leyenda "Mostrando X de Y" */
  totalItems?: number;
  itemsPorPagina?: number;
  onCambiarPagina: (pagina: number) => void;
}

/**
 * Paginación estándar para todos los listados del panel administrativo.
 * Muestra max 5 páginas visibles centradas en la página actual.
 */
export function Pagination({
  paginaActual,
  totalPaginas,
  totalItems,
  itemsPorPagina,
  onCambiarPagina,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  // Calcular rango de páginas visibles
  const MAX_VISIBLE = 5;
  let inicio = Math.max(1, paginaActual - Math.floor(MAX_VISIBLE / 2));
  const fin = Math.min(totalPaginas, inicio + MAX_VISIBLE - 1);
  if (fin - inicio + 1 < MAX_VISIBLE) {
    inicio = Math.max(1, fin - MAX_VISIBLE + 1);
  }
  const paginas = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);

  const desde = totalItems !== undefined && itemsPorPagina !== undefined
    ? (paginaActual - 1) * itemsPorPagina + 1
    : null;
  const hasta = totalItems !== undefined && itemsPorPagina !== undefined
    ? Math.min(paginaActual * itemsPorPagina, totalItems)
    : null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      {totalItems !== undefined && desde !== null && hasta !== null && (
        <span className="text-muted small">
          Mostrando {desde}–{hasta} de {totalItems} resultados
        </span>
      )}

      <nav aria-label="Paginación">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onCambiarPagina(paginaActual - 1)}
              aria-label="Página anterior"
              disabled={paginaActual === 1}
            >
              <i className="bi bi-chevron-left" />
            </button>
          </li>

          {inicio > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => onCambiarPagina(1)}>1</button>
              </li>
              {inicio > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              )}
            </>
          )}

          {paginas.map((p) => (
            <li key={p} className={`page-item ${p === paginaActual ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => onCambiarPagina(p)}
                aria-current={p === paginaActual ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ))}

          {fin < totalPaginas && (
            <>
              {fin < totalPaginas - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              )}
              <li className="page-item">
                <button className="page-link" onClick={() => onCambiarPagina(totalPaginas)}>
                  {totalPaginas}
                </button>
              </li>
            </>
          )}

          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onCambiarPagina(paginaActual + 1)}
              aria-label="Página siguiente"
              disabled={paginaActual === totalPaginas}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
