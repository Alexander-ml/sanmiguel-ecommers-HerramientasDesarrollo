import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge, type EstadoVisual } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Venta } from '../types';

interface VentasTableProps {
  ventas: Venta[];
  totalVentas?: number;
  onVerDetalle: (v: Venta) => void;
  onCancelar: (v: Venta) => void;
  onConfirmarPago: (v: Venta) => void;
}

function estadoVentaBadge(v: Venta) {
  const mapa: Record<string, EstadoVisual> = {
    confirmada: 'aprobada',
    pendiente: 'pendiente',
    cancelada: 'anulada',
  };
  return <StatusBadge estado={mapa[v.estado] ?? 'pendiente'} />;
}

function estadoPagoBadge(v: Venta) {
  const mapa: Record<string, EstadoVisual> = {
    confirmado: 'aprobada',
    pendiente: 'pendiente',
    rechazado: 'rechazada',
  };
  return <StatusBadge estado={mapa[v.pago.estado] ?? 'pendiente'} />;
}

const METODO_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  pasarela: 'Pasarela',
};

export function VentasTable({ ventas, totalVentas, onVerDetalle, onCancelar, onConfirmarPago }: VentasTableProps) {
  const columnas: ColumnaTabla<Venta>[] = [
    {
      encabezado: (
        <span className="d-inline-flex align-items-center">
          N.º
          {totalVentas !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal">
              {totalVentas} {totalVentas === 1 ? 'venta' : 'ventas'}
            </span>
          )}
        </span>
      ),
      celda: (v) => (
        <span className="fw-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
          V-{String(v.id).padStart(4, '0')}
        </span>
      ),
    },
    {
      encabezado: 'Fecha',
      celda: (v) => (
        <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)', whiteSpace: 'nowrap' }}>
          {formatearFechaHora(v.fecha)}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Cliente',
      celda: (v) => (
        <div>
          <div style={{ fontSize: 'var(--sm-text-sm)' }}>{v.clienteNombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>{v.clienteEmail}</div>
        </div>
      ),
    },
    {
      encabezado: 'Método',
      celda: (v) => (
        <span className="small text-muted">{METODO_LABEL[v.pago.metodoPago] ?? v.pago.metodoPago}</span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Total',
      celda: (v) => (
        <span className="fw-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatearMoneda(v.importeTotal)}
        </span>
      ),
      className: 'text-end',
    },
    {
      encabezado: 'Pago',
      celda: estadoPagoBadge,
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: estadoVentaBadge,
    },
  ];

  const acciones: AccionFila<Venta>[] = [
    {
      etiqueta: 'Ver detalle',
      icono: 'bi-eye',
      onClick: onVerDetalle,
    },
    {
      etiqueta: 'Confirmar pago',
      icono: 'bi-check-circle',
      onClick: onConfirmarPago,
      visible: (v) => v.pago.estado === 'pendiente' && v.estado === 'pendiente',
    },
    {
      etiqueta: 'Cancelar venta',
      icono: 'bi-x-circle',
      variante: 'danger',
      onClick: onCancelar,
      visible: (v) => v.estado !== 'cancelada',
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={ventas}
      acciones={acciones}
      keyExtractor={(v) => v.id}
    />
  );
}
