import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { formatearFechaHora } from '../../../lib/format';
import type { SesionActiva } from '../types';

interface SesionesActivasTableProps {
  sesiones: SesionActiva[];
  onRevocar: (sesion: SesionActiva) => void;
}

export function SesionesActivasTable({ sesiones, onRevocar }: SesionesActivasTableProps) {
  const columnas: ColumnaTabla<SesionActiva>[] = [
    {
      encabezado: 'Usuario / Correo',
      celda: (s) => (
        <div>
          <div className="fw-semibold small">{s.usuarioNombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            {s.usuarioCorreo}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Rol',
      celda: (s) => (
        <span className="badge bg-light text-dark border small">{s.rol}</span>
      ),
    },
    {
      encabezado: 'Dispositivo / Navegador',
      celda: (s) => (
        <div>
          <span className="small text-dark d-block">
            <i className="bi bi-display me-1 text-primary" />
            {s.dispositivo}
          </span>
          <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            IP: <code>{s.ip}</code>
          </span>
        </div>
      ),
    },
    {
      encabezado: 'Inicio Sesión',
      celda: (s) => (
        <span className="text-muted small">
          {formatearFechaHora(s.fechaInicio)}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (s) =>
        s.estado === 'vigente' ? (
          <span className="badge bg-success text-white">Vigente</span>
        ) : (
          <span className="badge bg-danger text-white">Revocada</span>
        ),
    },
  ];

  const acciones: AccionFila<SesionActiva>[] = [
    {
      etiqueta: 'Revocar sesión de inmediato',
      icono: 'bi-x-octagon',
      variante: 'danger',
      onClick: (s) => onRevocar(s),
      visible: (s) => s.estado === 'vigente',
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={sesiones}
      acciones={acciones}
      keyExtractor={(s) => s.id}
    />
  );
}
