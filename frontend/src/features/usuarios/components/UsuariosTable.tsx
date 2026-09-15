import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatearFechaHora } from '../../../lib/format';
import type { UsuarioInterno } from '../types';

interface UsuariosTableProps {
  usuarios: UsuarioInterno[];
  totalUsuarios?: number;
  onEditar: (usuario: UsuarioInterno) => void;
  onCambiarEstado: (usuario: UsuarioInterno) => void;
  onResetPassword: (usuario: UsuarioInterno) => void;
}

function renderBadgeRol(rol: string) {
  switch (rol) {
    case 'ADMINISTRADOR':
      return (
        <span className="badge bg-primary text-white" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-shield-lock-fill me-1" />
          Administrador
        </span>
      );
    case 'ALMACENERO':
      return (
        <span className="badge bg-info text-dark" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-box-seam me-1" />
          Almacenero
        </span>
      );
    case 'VENDEDOR':
      return (
        <span className="badge bg-success text-white" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-tag me-1" />
          Vendedor
        </span>
      );
    default:
      return <span className="badge bg-light text-dark border">{rol}</span>;
  }
}

export function UsuariosTable({
  usuarios,
  totalUsuarios,
  onEditar,
  onCambiarEstado,
  onResetPassword,
}: UsuariosTableProps) {
  const columnas: ColumnaTabla<UsuarioInterno>[] = [
    {
      encabezado: (
        <span className="d-inline-flex align-items-center">
          Usuario / Correo
          {totalUsuarios !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalUsuarios} {totalUsuarios === 1 ? 'usuario' : 'usuarios'}
            </span>
          )}
        </span>
      ),
      celda: (u) => (
        <div>
          <div className="fw-semibold" style={{ fontSize: 'var(--sm-text-sm)' }}>
            {u.nombres} {u.apellidos}
          </div>
          <div className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
            <i className="bi bi-envelope me-1" />
            {u.correo}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Rol Asignado',
      celda: (u) => renderBadgeRol(u.rol),
    },
    {
      encabezado: 'Estado',
      celda: (u) => <StatusBadge estado={u.estado} />,
    },
    {
      encabezado: 'Último Acceso',
      celda: (u) => (
        <span className="text-muted small">
          {u.ultimoAcceso ? formatearFechaHora(u.ultimoAcceso) : 'Sin accesos registrados'}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Fecha Registro',
      celda: (u) => (
        <span className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
          {formatearFechaHora(u.fechaCreacion).split(' ')[0]}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  const acciones: AccionFila<UsuarioInterno>[] = [
    {
      etiqueta: 'Editar datos o rol',
      icono: 'bi-pencil',
      onClick: (u) => onEditar(u),
    },
    {
      etiqueta: 'Restablecer contraseña',
      icono: 'bi-key',
      onClick: (u) => onResetPassword(u),
    },
    {
      etiqueta: 'Alternar estado activo/inactivo',
      icono: 'bi-power',
      variante: 'danger',
      onClick: (u) => onCambiarEstado(u),
      visible: (u) => u.correo !== 'admin@sanmiguel.pe', // no auto-desactivar superadmin
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={usuarios}
      acciones={acciones}
      keyExtractor={(u) => u.id}
    />
  );
}
