import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatearFechaHora } from '../../../lib/format';
import type { Proveedor } from '../types';

interface ProveedoresTableProps {
  proveedores: Proveedor[];
  totalProveedores?: number;
  onEditar: (proveedor: Proveedor) => void;
  onBaja: (proveedor: Proveedor) => void;
  onVerHistorial: (proveedor: Proveedor) => void;
}

export function ProveedoresTable({
  proveedores,
  totalProveedores,
  onEditar,
  onBaja,
  onVerHistorial,
}: ProveedoresTableProps) {
  const columnas: ColumnaTabla<Proveedor>[] = [
    {
      encabezado: (
        <span>
          Razón Social
          {totalProveedores !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalProveedores} {totalProveedores === 1 ? 'proveedor' : 'proveedores'}
            </span>
          )}
        </span>
      ),
      celda: (p) => (
        <div>
          <div className="fw-semibold" style={{ fontSize: 'var(--sm-text-sm)' }}>
            {p.razonSocial}
          </div>
          <div className="text-muted small" style={{ fontSize: 'var(--sm-text-xs)' }}>
            RUC: <span className="font-monospace">{p.ruc}</span>
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Contacto',
      celda: (p) => (
        <div>
          <div className="small fw-medium">{p.contacto.nombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            <i className="bi bi-telephone me-1" />{p.contacto.telefono} · <i className="bi bi-envelope me-1" />{p.contacto.email}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'Dirección',
      celda: (p) => (
        <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: 220 }}>
          {p.direccion}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Condiciones',
      celda: (p) => (
        <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: 220 }}>
          {p.condicionesComerciales}
        </span>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Estado',
      celda: (p) => <StatusBadge estado={p.estado} />,
    },
    {
      encabezado: 'Registrado',
      celda: (p) => (
        <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
          {formatearFechaHora(p.fechaRegistro).split(' ')[0]}
        </span>
      ),
      ocultarEnMovil: true,
    },
  ];

  const acciones: AccionFila<Proveedor>[] = [
    {
      etiqueta: 'Ver historial',
      icono: 'bi-clock-history',
      onClick: (p) => onVerHistorial(p),
    },
    {
      etiqueta: 'Editar proveedor',
      icono: 'bi-pencil',
      onClick: (p) => onEditar(p),
    },
    {
      etiqueta: 'Dar de baja',
      icono: 'bi-slash-circle',
      variante: 'danger',
      onClick: (p) => onBaja(p),
      visible: (p) => p.estado === 'activo',
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={proveedores}
      acciones={acciones}
      keyExtractor={(p) => p.id}
    />
  );
}
