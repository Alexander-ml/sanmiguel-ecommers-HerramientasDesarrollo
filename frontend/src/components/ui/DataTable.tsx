import type { ReactNode } from 'react';
import './DataTable.css';

export interface AccionFila<T> {
  etiqueta: string;
  icono?: string;
  variante?: 'danger' | 'normal';
  onClick: (fila: T) => void;
  /** Si devuelve false, la acción no se muestra para esa fila */
  visible?: (fila: T) => boolean;
  /** Si devuelve true, la acción aparece deshabilitada */
  deshabilitada?: (fila: T) => boolean;
}

export interface ColumnaTabla<T> {
  encabezado: ReactNode;
  /** Renderiza la celda para la fila T */
  celda: (fila: T) => ReactNode;
  /** Clase CSS adicional para la celda y el encabezado (ej. 'text-end') */
  className?: string;
  /** Ocultar la columna en pantallas pequeñas (d-none d-md-table-cell) */
  ocultarEnMovil?: boolean;
}

interface DataTableProps<T> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  acciones?: AccionFila<T>[];
  /** Función para extraer una clave única de cada fila */
  keyExtractor: (fila: T) => string | number;
}

/**
 * Tabla genérica reutilizable — primer componente de este tipo en el proyecto.
 * Creado por el módulo Inventario y Catálogo para evitar duplicar la estructura HTML
 * de tabla en Productos, Categorías, Proveedores, Ventas, etc.
 *
 * Regla de diseño (docs/03-design-system.md §8):
 * - Máximo 5–6 columnas visibles; el resto se oculta en móvil con `ocultarEnMovil`.
 * - Acciones destructivas solo dentro del dropdown ⋮, nunca como botón suelto.
 */
export function DataTable<T>({ columnas, datos, acciones, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="table-responsive">
      <table className="table sm-data-table align-middle mb-0">
        <thead>
          <tr>
            {columnas.map((col, i) => (
              <th
                key={i}
                className={[
                  col.className,
                  col.ocultarEnMovil ? 'd-none d-md-table-cell' : '',
                ].filter(Boolean).join(' ')}
              >
                {col.encabezado}
              </th>
            ))}
            {acciones && acciones.length > 0 && (
              <th className="text-end" style={{ width: 48 }}>
                <span className="visually-hidden">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={keyExtractor(fila)}>
              {columnas.map((col, i) => (
                <td
                  key={i}
                  className={[
                    col.className,
                    col.ocultarEnMovil ? 'd-none d-md-table-cell' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {col.celda(fila)}
                </td>
              ))}
              {acciones && acciones.length > 0 && (
                <td className="text-end">
                  <AccionesDropdown fila={fila} acciones={acciones} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccionesDropdown<T>({ fila, acciones }: { fila: T; acciones: AccionFila<T>[] }) {
  const accionesVisibles = acciones.filter((a) => a.visible === undefined || a.visible(fila));
  if (accionesVisibles.length === 0) return null;

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm sm-btn-acciones"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Abrir menú de acciones"
      >
        <i className="bi bi-three-dots-vertical" />
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {accionesVisibles.map((accion, i) => {
          const deshabilitada = accion.deshabilitada?.(fila) ?? false;
          return (
            <li key={i}>
              <button
                type="button"
                className={`dropdown-item d-flex align-items-center gap-2 ${
                  accion.variante === 'danger' ? 'text-danger' : ''
                }`}
                onClick={() => accion.onClick(fila)}
                disabled={deshabilitada}
              >
                {accion.icono && <i className={`bi ${accion.icono}`} />}
                {accion.etiqueta}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
