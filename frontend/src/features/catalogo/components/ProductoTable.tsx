import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatearMoneda } from '../../../lib/format';
import type { Producto } from '../types';

interface ProductoTableProps {
  productos: Producto[];
  totalProductos?: number;
  onEditar: (p: Producto) => void;
  onVariantes: (p: Producto) => void;
  onBaja: (p: Producto) => void;
}

export function ProductoTable({
  productos,
  totalProductos,
  onEditar,
  onVariantes,
  onBaja,
}: ProductoTableProps) {
  const columnas: ColumnaTabla<Producto>[] = [
    {
      encabezado: (
        <span>
          Producto
          {totalProductos !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </span>
      ),
      celda: (p) => (
        <div>
          <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>{p.nombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>{p.marca}</div>
        </div>
      ),
    },
    {
      encabezado: 'Categoría',
      celda: (p) => <span className="small text-muted">{p.categoriaNombre}</span>,
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Precio base',
      celda: (p) => (
        <span className="small" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatearMoneda(p.precioBase)}
        </span>
      ),
      className: 'text-end',
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (p) => <StatusBadge estado={p.estado === 'activo' ? 'activo' : 'inactivo'} />,
    },
  ];

  const acciones: AccionFila<Producto>[] = [
    {
      etiqueta: 'Editar',
      icono: 'bi-pencil',
      onClick: onEditar,
    },
    {
      etiqueta: 'Gestionar variantes',
      icono: 'bi-collection',
      onClick: onVariantes,
    },
    {
      etiqueta: 'Dar de baja',
      icono: 'bi-archive',
      variante: 'danger',
      onClick: onBaja,
      visible: (p) => p.estado === 'activo',
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={productos}
      acciones={acciones}
      keyExtractor={(p) => p.id}
    />
  );
}
