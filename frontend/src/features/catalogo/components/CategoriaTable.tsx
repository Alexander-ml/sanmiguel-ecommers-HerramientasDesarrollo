import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Categoria } from '../types';

interface CategoriaTableProps {
  categorias: Categoria[];
  totalCategorias?: number;
  onEditar: (cat: Categoria) => void;
  onBaja: (cat: Categoria) => void;
}

export function CategoriaTable({ categorias, totalCategorias, onEditar, onBaja }: CategoriaTableProps) {
  const columnas: ColumnaTabla<Categoria>[] = [
    {
      encabezado: (
        <span>
          Categoría
          {totalCategorias !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalCategorias} {totalCategorias === 1 ? 'categoría' : 'categorías'}
            </span>
          )}
        </span>
      ),
      celda: (c) => <span className="fw-medium">{c.nombre}</span>,
    },
    {
      encabezado: 'Categoría padre',
      celda: (c) => c.categoriaPadreNombre
        ? <span className="text-muted small">{c.categoriaPadreNombre}</span>
        : <span className="text-muted small fst-italic">Raíz</span>,
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Descripción',
      celda: (c) => (
        <span className="text-muted small" style={{ maxWidth: 260, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.descripcion || '—'}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (c) => <StatusBadge estado={c.activo ? 'activo' : 'inactivo'} />,
    },
  ];

  const acciones: AccionFila<Categoria>[] = [
    {
      etiqueta: 'Editar',
      icono: 'bi-pencil',
      onClick: onEditar,
    },
    {
      etiqueta: 'Dar de baja',
      icono: 'bi-archive',
      variante: 'danger',
      onClick: onBaja,
      visible: (c) => c.activo,
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={categorias}
      acciones={acciones}
      keyExtractor={(c) => c.id}
    />
  );
}
