import { Button } from '../../../components/ui/Button';

interface PedidosAdminFiltersProps {
  estadoFiltro: string;
  onEstadoChange: (val: string) => void;
  busquedaCliente: string;
  onBusquedaClienteChange: (val: string) => void;
  busquedaCodigo: string;
  onBusquedaCodigoChange: (val: string) => void;
  onLimpiar: () => void;
}

/**
 * Barra de filtros operativos para la gestión interna de pedidos.
 */
export function PedidosAdminFilters({
  estadoFiltro,
  onEstadoChange,
  busquedaCliente,
  onBusquedaClienteChange,
  busquedaCodigo,
  onBusquedaCodigoChange,
  onLimpiar,
}: PedidosAdminFiltersProps) {
  const tieneFiltros = !!estadoFiltro || !!busquedaCliente || !!busquedaCodigo;

  return (
    <div
      className="card border mb-3 shadow-sm"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--sm-border)',
        borderRadius: 'var(--sm-radius-md, 8px)',
      }}
    >
      <div className="card-body p-3">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-3">
            <label className="form-label small text-muted mb-1 fw-medium">Código de Pedido</label>
            <input
              type="text"
              className="form-control form-control-sm text-uppercase font-monospace bg-white border"
              placeholder="Ej: PED-2026-0001"
              value={busquedaCodigo}
              onChange={(e) => onBusquedaCodigoChange(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small text-muted mb-1 fw-medium">Cliente / Correo</label>
            <input
              type="search"
              className="form-control form-control-sm bg-white border"
              placeholder="Buscar por nombre o correo…"
              value={busquedaCliente}
              onChange={(e) => onBusquedaClienteChange(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small text-muted mb-1 fw-medium">Estado Operativo</label>
            <select
              className="form-select form-select-sm bg-white border"
              value={estadoFiltro}
              onChange={(e) => onEstadoChange(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente_pago">Pendiente de pago</option>
              <option value="confirmado">Confirmado</option>
              <option value="en_preparacion">En preparación</option>
              <option value="listo_entregado">Listo / Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-flex align-items-end mt-md-4">
            {tieneFiltros && (
              <Button
                variant="secondary"
                size="sm"
                className="w-100"
                onClick={onLimpiar}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
