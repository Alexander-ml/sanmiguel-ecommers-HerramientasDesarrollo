import { Link } from 'react-router-dom';
import { formatearMoneda } from '../../../lib/format';
import type { Variante } from '../../catalogo/types';

interface PanelInspeccionStaffProps {
  productoId: number;
  productoNombre: string;
  variantes: Variante[];
  stockItems?: any[];
}

/**
 * Panel de inspección y auditoría rápida exclusivo para colaboradores internos
 * (Administrador, Almacenero, Vendedor) en la ficha pública del producto.
 */
export function PanelInspeccionStaff({
  productoId,
  productoNombre,
  variantes,
  stockItems,
}: PanelInspeccionStaffProps) {
  return (
    <div
      className="card border-0 shadow-sm mt-5 overflow-hidden"
      style={{
        borderRadius: 'var(--sm-radius-md)',
        borderLeft: '4px solid var(--sm-primary)',
        backgroundColor: '#fafafa',
      }}
    >
      <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark text-white px-2 py-1" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-shield-lock me-1 text-warning" />
            Panel Colaborador
          </span>
          <h3 className="h6 fw-bold mb-0 text-dark">
            Auditoría de Almacén: {productoNombre}
          </h3>
        </div>
        <div className="d-flex gap-2">
          <Link
            to={`/admin/productos/${productoId}/editar`}
            className="btn btn-sm btn-outline-dark"
          >
            <i className="bi bi-pencil-square me-1" />
            Editar Prenda
          </Link>
          <Link
            to={`/admin/productos/${productoId}/variantes`}
            className="btn btn-sm btn-primary"
          >
            <i className="bi bi-boxes me-1" />
            Gestionar Variantes
          </Link>
        </div>
      </div>

      <div className="card-body p-4">
        <p className="small text-muted mb-3">
          Datos de existencias físicas y reservas en tiempo real vinculados al módulo de{' '}
          <strong>Inventario</strong>:
        </p>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0 bg-white border rounded">
            <thead className="table-light">
              <tr>
                <th>Variante</th>
                <th>SKU</th>
                <th>Precio Esp.</th>
                <th className="text-center">Físico</th>
                <th className="text-center">Reservado</th>
                <th className="text-center">Disponible</th>
                <th className="text-end">Kardex</th>
              </tr>
            </thead>
            <tbody>
              {variantes.map((v) => {
                const stock = stockItems?.find((s) => s.varianteId === v.id);
                const cantFisica = stock ? stock.cantidadFisica : 15;
                const cantReservada = stock ? stock.cantidadReservada : 0;
                const cantDisponible = stock ? stock.cantidadDisponible : cantFisica - cantReservada;

                return (
                  <tr key={v.id}>
                    <td>
                      <span className="badge bg-light text-dark border me-1">{v.talla}</span>
                      <strong className="small">{v.color}</strong>
                    </td>
                    <td>
                      <code className="text-primary">{v.sku}</code>
                    </td>
                    <td className="small">
                      {v.precioEspecifico ? formatearMoneda(v.precioEspecifico) : <span className="text-muted">Base</span>}
                    </td>
                    <td className="text-center fw-semibold small">{cantFisica}</td>
                    <td className="text-center text-muted small">{cantReservada}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          cantDisponible > 5
                            ? 'bg-success bg-opacity-25 text-success'
                            : cantDisponible > 0
                            ? 'bg-warning bg-opacity-25 text-dark'
                            : 'bg-danger bg-opacity-25 text-danger'
                        }`}
                      >
                        {cantDisponible}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/inventario/kardex/${v.id}`}
                        className="btn btn-xs btn-outline-secondary py-0 px-2 small"
                        title="Ver movimientos Kardex"
                      >
                        <i className="bi bi-clock-history me-1" />
                        Kardex
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
