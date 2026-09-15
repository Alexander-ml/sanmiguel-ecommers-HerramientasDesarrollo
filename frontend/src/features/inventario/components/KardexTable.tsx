import { DataTable, type ColumnaTabla } from '../../../components/ui/DataTable';
import { StatusBadge, tipoMovimientoAEstado } from '../../../components/ui/StatusBadge';
import { formatearFechaHora } from '../../../lib/format';
import type { MovimientoInventario } from '../types';

interface KardexTableProps {
  movimientos: MovimientoInventario[];
}

/**
 * Tabla de solo lectura del historial de movimientos (kardex).
 * RN-INV-01: El kardex es inmutable — no hay botones de edición ni eliminación.
 * Los errores se corrigen con un movimiento inverso, nunca modificando el existente.
 */
export function KardexTable({ movimientos }: KardexTableProps) {
  const columnas: ColumnaTabla<MovimientoInventario>[] = [
    {
      encabezado: 'Fecha',
      celda: (m) => (
        <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)', whiteSpace: 'nowrap' }}>
          {formatearFechaHora(m.fecha)}
        </span>
      ),
    },
    {
      encabezado: 'Tipo',
      celda: (m) => <StatusBadge estado={tipoMovimientoAEstado(m.tipoMovimiento)} />,
    },
    {
      encabezado: 'Cantidad',
      celda: (m) => {
        const esEntrada = m.tipoMovimiento.startsWith('ENTRADA') || m.tipoMovimiento === 'AJUSTE_POSITIVO';
        return (
          <span
            className="fw-semibold"
            style={{
              fontVariantNumeric: 'tabular-nums',
              color: esEntrada ? 'var(--sm-success)' : 'var(--sm-danger)',
            }}
          >
            {esEntrada ? '+' : '−'}{m.cantidad}
          </span>
        );
      },
      className: 'text-end',
    },
    {
      encabezado: 'Saldo resultante',
      celda: (m) => (
        <span className="fw-medium" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--sm-text-sm)' }}>
          {m.saldoResultante}
        </span>
      ),
      className: 'text-end',
    },
    {
      encabezado: 'Responsable',
      celda: (m) => (
        <span className="text-muted small">{m.usuarioNombre}</span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Doc. referencia',
      celda: (m) => m.documentoRef
        ? <code style={{ fontSize: 'var(--sm-text-xs)', color: 'var(--sm-ink-soft)' }}>{m.documentoRef}</code>
        : <span className="text-muted">—</span>,
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Motivo',
      celda: (m) => (
        <span
          className="text-muted"
          style={{ fontSize: 'var(--sm-text-xs)', maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={m.motivo}
        >
          {m.motivo}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  // No se pasan acciones — el kardex es de solo lectura (RN-INV-01)
  return (
    <DataTable
      columnas={columnas}
      datos={movimientos}
      keyExtractor={(m) => m.id}
    />
  );
}
