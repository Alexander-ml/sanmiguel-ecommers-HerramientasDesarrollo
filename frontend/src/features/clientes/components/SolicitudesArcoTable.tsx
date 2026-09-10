import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { formatearFechaHora } from '../../../lib/format';
import type { SolicitudARCO, TipoDerechoARCO } from '../types';

interface SolicitudesArcoTableProps {
  solicitudes: SolicitudARCO[];
  onAtender: (solicitud: SolicitudARCO) => void;
}

function renderBadgeDerecho(tipo: TipoDerechoARCO) {
  switch (tipo) {
    case 'ACCESO':
      return <span className="badge bg-info text-dark">Acceso</span>;
    case 'RECTIFICACION':
      return <span className="badge bg-primary text-white">Rectificación</span>;
    case 'CANCELACION':
      return <span className="badge bg-danger text-white">Cancelación</span>;
    case 'OPOSICION':
      return <span className="badge bg-warning text-dark">Oposición</span>;
  }
}

export function SolicitudesArcoTable({ solicitudes, onAtender }: SolicitudesArcoTableProps) {
  const columnas: ColumnaTabla<SolicitudARCO>[] = [
    {
      encabezado: 'Titular / Correo',
      celda: (s) => (
        <div>
          <div className="fw-semibold small">{s.clienteNombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            {s.clienteEmail}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Derecho ARCO',
      celda: (s) => renderBadgeDerecho(s.tipoDerecho),
    },
    {
      encabezado: 'Detalle de Solicitud',
      celda: (s) => (
        <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: 280 }}>
          {s.detalle}
        </span>
      ),
    },
    {
      encabezado: 'Fecha Radicación',
      celda: (s) => (
        <span className="text-muted small">
          {formatearFechaHora(s.fechaSolicitud).split(' ')[0]}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (s) => {
        if (s.estado === 'PENDIENTE') {
          return <span className="badge bg-warning text-dark">Pendiente</span>;
        }
        if (s.estado === 'ATENDIDA') {
          return <span className="badge bg-success text-white">Atendida</span>;
        }
        return <span className="badge bg-danger text-white">Rechazada</span>;
      },
    },
  ];

  const acciones: AccionFila<SolicitudARCO>[] = [
    {
      etiqueta: 'Evaluar y atender solicitud',
      icono: 'bi-pencil-square',
      onClick: (s) => onAtender(s),
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={solicitudes}
      acciones={acciones}
      keyExtractor={(s) => s.id}
    />
  );
}
