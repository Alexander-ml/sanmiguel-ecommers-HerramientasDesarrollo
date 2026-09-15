import { DataTable, type ColumnaTabla } from '../../../components/ui/DataTable';
import { formatearFechaHora } from '../../../lib/format';
import type { RegistroCambioConfiguracion } from '../types';

interface HistorialCambiosTableProps {
  cambios: RegistroCambioConfiguracion[];
}

function renderBadgeSeccion(seccion: string) {
  switch (seccion) {
    case 'Empresa':
      return <span className="badge bg-primary text-white">Empresa</span>;
    case 'Comercial':
      return <span className="badge bg-success text-white">Comercial</span>;
    case 'Tienda':
      return <span className="badge bg-info text-dark">Tienda</span>;
    case 'Operativo':
      return <span className="badge bg-warning text-dark">Operativo</span>;
    case 'Seguridad':
      return <span className="badge bg-danger text-white">Seguridad</span>;
    default:
      return <span className="badge bg-light text-muted border">{seccion}</span>;
  }
}

export function HistorialCambiosTable({ cambios }: HistorialCambiosTableProps) {
  const columnas: ColumnaTabla<RegistroCambioConfiguracion>[] = [
    {
      encabezado: (
        <span className="d-inline-flex align-items-center gap-1">
          <span>Sección</span>
          {cambios.length > 0 && (
            <span
              className="badge rounded-pill bg-light text-secondary border fw-normal"
              style={{ fontSize: '11px' }}
            >
              {cambios.length}
            </span>
          )}
        </span>
      ),
      celda: (c) => renderBadgeSeccion(c.seccion),
    },
    {
      encabezado: 'Parámetro Modificado',
      celda: (c) => (
        <code className="fw-semibold text-primary">{c.parametro}</code>
      ),
    },
    {
      encabezado: 'Valor Anterior',
      celda: (c) => (
        <span className="text-muted small text-decoration-line-through">
          {c.valorAnterior}
        </span>
      ),
    },
    {
      encabezado: 'Nuevo Valor',
      celda: (c) => (
        <span className="fw-semibold small text-success">
          {c.valorNuevo}
        </span>
      ),
    },
    {
      encabezado: 'Usuario Responsable',
      celda: (c) => (
        <span className="small text-dark">
          <i className="bi bi-person me-1 text-muted" />
          {c.usuario}
        </span>
      ),
    },
    {
      encabezado: 'Fecha del Cambio',
      celda: (c) => (
        <span className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
          {formatearFechaHora(c.fecha)}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  return (
    <div
      className="card border shadow-sm p-4"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--sm-border)',
        borderRadius: 'var(--sm-radius-md, 8px)',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: 'var(--sm-ink)' }}>
            <i className="bi bi-clock-history me-2 text-primary" />
            Historial de Cambios de Configuración
          </h2>
          <p className="text-muted small mb-0">
            Registro permanente de auditoría sobre cualquier ajuste realizado a los parámetros del sistema.
          </p>
        </div>
        <span className="badge bg-light text-secondary border px-2 py-1 small">
          <i className="bi bi-shield-lock me-1 text-primary" />
          Auditoría Inmutable
        </span>
      </div>

      <DataTable
        columnas={columnas}
        datos={cambios}
        keyExtractor={(c) => c.id}
      />
    </div>
  );
}
