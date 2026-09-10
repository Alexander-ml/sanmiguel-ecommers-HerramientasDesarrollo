import { DataTable, type ColumnaTabla } from '../../../components/ui/DataTable';
import { formatearFechaHora } from '../../../lib/format';
import type { EventoSeguridad, TipoEventoSeguridad } from '../types';

interface EventosSeguridadTableProps {
  eventos: EventoSeguridad[];
}

function renderBadgeEvento(tipo: TipoEventoSeguridad) {
  switch (tipo) {
    case 'LOGIN_EXITOSO':
      return <span className="badge bg-success text-white">Login Exitoso</span>;
    case 'LOGIN_FALLIDO':
      return <span className="badge bg-warning text-dark">Login Fallido</span>;
    case 'LOGOUT':
      return <span className="badge bg-light text-muted border">Cierre de Sesión</span>;
    case 'SESION_REVOCADA':
      return <span className="badge bg-danger text-white">Sesión Revocada</span>;
    case 'CAMBIO_PASSWORD':
      return <span className="badge bg-info text-dark">Cambio Contraseña</span>;
    case 'BLOQUEO_TEMPORAL':
      return <span className="badge bg-danger text-white">Bloqueo Cuenta</span>;
    case 'USUARIO_DESACTIVADO':
      return <span className="badge bg-dark text-white">Usuario Desactivado</span>;
  }
}

export function EventosSeguridadTable({ eventos }: EventosSeguridadTableProps) {
  const columnas: ColumnaTabla<EventoSeguridad>[] = [
    {
      encabezado: 'Evento',
      celda: (e) => renderBadgeEvento(e.tipoEvento),
    },
    {
      encabezado: 'Cuenta / Correo',
      celda: (e) => (
        <span className="small fw-medium text-dark">
          {e.usuarioCorreo}
        </span>
      ),
    },
    {
      encabezado: 'Dirección IP',
      celda: (e) => <code className="small">{e.ip}</code>,
    },
    {
      encabezado: 'Detalle de Auditoría',
      celda: (e) => (
        <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: 350 }}>
          {e.detalle}
        </span>
      ),
    },
    {
      encabezado: 'Fecha y Hora',
      celda: (e) => (
        <span className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
          {formatearFechaHora(e.fecha)}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={eventos}
      keyExtractor={(e) => e.id}
    />
  );
}
