import { StatusBadge, estadoPedidoAEstado } from '../../../components/ui/StatusBadge';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import { Button } from '../../../components/ui/Button';
import type { Pedido } from '../types';

interface MisPedidosListaProps {
  pedidos: Pedido[];
  onSeleccionarPedido: (codigo: string) => void;
}

/**
 * Lista de compras realizadas por el usuario actual logueado.
 */
export function MisPedidosLista({ pedidos, onSeleccionarPedido }: MisPedidosListaProps) {
  if (pedidos.length === 0) return null;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
      <h2 className="h6 fw-bold mb-3 text-dark">
        <i className="bi bi-clock-history text-primary me-2" />
        Tus Pedidos Recientes
      </h2>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Fecha</th>
              <th>Entrega</th>
              <th className="text-end">Total</th>
              <th className="text-center">Estado</th>
              <th className="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td className="font-monospace fw-bold text-primary">{p.codigo}</td>
                <td className="small text-muted">{formatearFechaHora(p.fecha).split(' ')[0]}</td>
                <td className="small">
                  {p.modalidadEntrega === 'envio' ? (
                    <span><i className="bi bi-truck me-1" />Envío a domicilio</span>
                  ) : (
                    <span><i className="bi bi-shop me-1" />Recojo en tienda</span>
                  )}
                </td>
                <td className="text-end fw-semibold small" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatearMoneda(p.importeTotal)}
                </td>
                <td className="text-center">
                  <StatusBadge estado={estadoPedidoAEstado(p.estado)} />
                </td>
                <td className="text-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<i className="bi bi-eye" />}
                    onClick={() => onSeleccionarPedido(p.codigo)}
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
