import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge, estadoOrdenCompraAEstado } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { OrdenCompra } from '../types';

interface OrdenesTableProps {
  ordenes: OrdenCompra[];
  totalOrdenes?: number;
  onVerDetalle: (orden: OrdenCompra) => void;
  onEditar?: (orden: OrdenCompra) => void;
  onRecepcionar?: (orden: OrdenCompra) => void;
  onCancelar?: (orden: OrdenCompra) => void;
}

export function OrdenesTable({
  ordenes,
  totalOrdenes,
  onVerDetalle,
  onEditar,
  onRecepcionar,
  onCancelar,
}: OrdenesTableProps) {
  const columnas: ColumnaTabla<OrdenCompra>[] = [
    {
      encabezado: (
        <span>
          Código
          {totalOrdenes !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalOrdenes} {totalOrdenes === 1 ? 'orden' : 'órdenes'}
            </span>
          )}
        </span>
      ),
      celda: (o) => (
        <span className="fw-semibold font-monospace" style={{ fontSize: 'var(--sm-text-sm)' }}>
          {o.codigo}
        </span>
      ),
    },
    {
      encabezado: 'Proveedor',
      celda: (o) => (
        <div>
          <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>
            {o.proveedorNombre}
          </div>
          <div className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
            RUC: <span className="font-monospace">{o.proveedorRuc}</span>
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Fecha Emisión',
      celda: (o) => (
        <span className="text-muted small" style={{ whiteSpace: 'nowrap' }}>
          {formatearFechaHora(o.fechaCreacion).split(' ')[0]}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'F. Estimada',
      celda: (o) => (
        <span className="small text-muted" style={{ whiteSpace: 'nowrap' }}>
          {o.fechaEstimadaEntrega ? o.fechaEstimadaEntrega.split('T')[0] : '—'}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Prendas',
      celda: (o) => {
        const pedidas = o.lineas.reduce((s, l) => s + l.cantidadPedida, 0);
        const recibidas = o.lineas.reduce((s, l) => s + l.cantidadRecibida, 0);
        return (
          <div>
            <span className="small fw-semibold">
              {recibidas} / {pedidas} u.
            </span>
            <div className="progress mt-1" style={{ height: 4, width: 70, backgroundColor: 'var(--sm-border)' }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${pedidas > 0 ? (recibidas / pedidas) * 100 : 0}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      encabezado: 'Total Estimado',
      celda: (o) => (
        <span className="fw-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatearMoneda(o.totalEstimado)}
        </span>
      ),
      className: 'text-end',
    },
    {
      encabezado: 'Estado',
      celda: (o) => <StatusBadge estado={estadoOrdenCompraAEstado(o.estado)} />,
    },
  ];

  const acciones: AccionFila<OrdenCompra>[] = [
    {
      etiqueta: 'Ver detalle completo',
      icono: 'bi-eye',
      onClick: (o) => onVerDetalle(o),
    },
    ...(onEditar
      ? [
          {
            etiqueta: 'Editar orden',
            icono: 'bi-pencil',
            onClick: (o: OrdenCompra) => onEditar(o),
            visible: (o: OrdenCompra) => o.estado === 'PENDIENTE' && o.recepciones.length === 0,
          },
        ]
      : []),
    ...(onRecepcionar
      ? [
          {
            etiqueta: 'Registrar recepción',
            icono: 'bi-box-arrow-in-down',
            onClick: (o: OrdenCompra) => onRecepcionar(o),
            visible: (o: OrdenCompra) =>
              o.estado === 'PENDIENTE' || o.estado === 'PARCIALMENTE_RECIBIDA',
          },
        ]
      : []),
    ...(onCancelar
      ? [
          {
            etiqueta: 'Cancelar orden',
            icono: 'bi-x-circle',
            variante: 'danger' as const,
            onClick: (o: OrdenCompra) => onCancelar(o),
            visible: (o: OrdenCompra) =>
              o.estado === 'PENDIENTE' && o.recepciones.length === 0,
          },
        ]
      : []),
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={ordenes}
      acciones={acciones}
      keyExtractor={(o) => o.id}
    />
  );
}
