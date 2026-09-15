import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Cliente, SegmentoRFM } from '../types';

interface ClientesTableProps {
  clientes: Cliente[];
  totalClientes?: number;
  onVerDetalle: (cliente: Cliente) => void;
  onCambiarEstado: (cliente: Cliente) => void;
}

export function renderBadgeSegmento(segmento: SegmentoRFM) {
  switch (segmento) {
    case 'VIP':
      return (
        <span className="badge rounded-pill bg-primary text-white" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-star-fill me-1 text-warning" />
          VIP / Leal
        </span>
      );
    case 'FRECUENTE':
      return (
        <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-repeat me-1" />
          Frecuente
        </span>
      );
    case 'EN_RIESGO':
      return (
        <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-exclamation-triangle me-1" />
          En riesgo
        </span>
      );
    case 'INACTIVO':
      return (
        <span className="badge rounded-pill bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
          Inactivo
        </span>
      );
    case 'NUEVO':
      return (
        <span className="badge rounded-pill bg-success text-white" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-sparkles me-1" />
          Nuevo
        </span>
      );
  }
}

export function ClientesTable({ clientes, totalClientes, onVerDetalle, onCambiarEstado }: ClientesTableProps) {
  const columnas: ColumnaTabla<Cliente>[] = [
    {
      encabezado: (
        <span className="d-inline-flex align-items-center">
          Cliente / Correo
          {totalClientes !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalClientes} {totalClientes === 1 ? 'cliente' : 'clientes'}
            </span>
          )}
        </span>
      ),
      celda: (c) => (
        <div>
          <div className="fw-semibold" style={{ fontSize: 'var(--sm-text-sm)' }}>
            {c.nombres} {c.apellidos}
          </div>
          <div className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
            <i className="bi bi-envelope me-1" />
            {c.email}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Documento',
      celda: (c) => (
        <div>
          <span className="badge bg-light text-dark border me-1" style={{ fontSize: '0.7rem' }}>
            {c.tipoDocumento}
          </span>
          <span className="font-monospace small">{c.numeroDocumento}</span>
        </div>
      ),
    },
    {
      encabezado: 'Teléfono',
      celda: (c) => (
        <span className="small text-muted font-monospace">
          <i className="bi bi-telephone me-1" />
          {c.telefono}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Segmento RFM',
      celda: (c) => renderBadgeSegmento(c.segmentoRFM),
    },
    {
      encabezado: 'Historial Compras',
      celda: (c) => (
        <div>
          <div className="fw-semibold small" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatearMoneda(c.totalGastado)}
          </div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            {c.cantidadPedidos} pedido(s)
          </div>
        </div>
      ),
      className: 'text-end',
    },
    {
      encabezado: 'Estado',
      celda: (c) => <StatusBadge estado={c.estado} />,
    },
    {
      encabezado: 'Registrado',
      celda: (c) => (
        <span className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
          {formatearFechaHora(c.fechaRegistro).split(' ')[0]}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  const acciones: AccionFila<Cliente>[] = [
    {
      etiqueta: 'Ver expediente completo',
      icono: 'bi-person-vcard',
      onClick: (c) => onVerDetalle(c),
    },
    {
      etiqueta: 'Alternar estado activo/inactivo',
      icono: 'bi-arrow-repeat',
      onClick: (c) => onCambiarEstado(c),
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={clientes}
      acciones={acciones}
      keyExtractor={(c) => c.id}
    />
  );
}
