import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatearMoneda } from '../../../lib/format';
import type { Variante } from '../types';

interface VarianteTableProps {
  variantes: Variante[];
  precioBase: number;
  onEditar: (v: Variante) => void;
  onBaja: (v: Variante) => void;
}

export function VarianteTable({ variantes, precioBase, onEditar, onBaja }: VarianteTableProps) {
  const columnas: ColumnaTabla<Variante>[] = [
    {
      encabezado: 'Talla',
      celda: (v) => <span className="fw-medium">{v.talla}</span>,
    },
    {
      encabezado: 'Color',
      celda: (v) => v.color,
    },
    {
      encabezado: 'SKU',
      celda: (v) => (
        <code style={{ fontSize: 'var(--sm-text-xs)', color: 'var(--sm-ink-soft)' }}>
          {v.sku}
        </code>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Precio',
      celda: (v) => (
        <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--sm-text-sm)' }}>
          {v.precioEspecifico !== null
            ? <>{formatearMoneda(v.precioEspecifico)} <small className="text-muted">(específico)</small></>
            : <span className="text-muted">{formatearMoneda(precioBase)} <small>(base)</small></span>
          }
        </div>
      ),
      className: 'text-end',
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (v) => <StatusBadge estado={v.estado === 'activo' ? 'activo' : 'inactivo'} />,
    },
  ];

  const acciones: AccionFila<Variante>[] = [
    {
      etiqueta: 'Editar',
      icono: 'bi-pencil',
      onClick: onEditar,
      deshabilitada: (v) => v.estado === 'inactivo',
    },
    {
      etiqueta: 'Dar de baja',
      icono: 'bi-archive',
      variante: 'danger',
      onClick: onBaja,
      visible: (v) => v.estado === 'activo',
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={variantes}
      acciones={acciones}
      keyExtractor={(v) => v.id}
    />
  );
}
