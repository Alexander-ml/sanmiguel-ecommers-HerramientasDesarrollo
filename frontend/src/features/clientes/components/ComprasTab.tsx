import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { StatusBadge, estadoPedidoAEstado } from '../../../components/ui/StatusBadge';
import { usePedidos } from '../../tienda/hooks/usePedidos';
import { usePedidosInvitadoPendientes, useVincularPedidosInvitado } from '../hooks/useClientes';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Cliente } from '../types';

interface ComprasTabProps {
  cliente: Cliente;
}

/** Pestaña "Historial de Compras" (RF-CLI-011, RN-CLI-03) + vinculación de invitado (RF-CLI-003). */
export function ComprasTab({ cliente }: ComprasTabProps) {
  const { data: pedidosData } = usePedidos();
  const misPedidos = (pedidosData?.datos ?? []).filter(
    (p) => p.clienteId === cliente.id || p.contacto.email.toLowerCase() === cliente.email.toLowerCase(),
  );

  const { data: pedidosInvitado } = usePedidosInvitadoPendientes('me');
  const { mutate: vincularInvitado, isPending: vinculando } = useVincularPedidosInvitado();
  const [mensajeVinculacion, setMensajeVinculacion] = useState<string | null>(null);

  const handleVincular = () => {
    vincularInvitado('me', { onSuccess: (res) => setMensajeVinculacion(res.message) });
  };

  return (
    <div>
      {pedidosInvitado && pedidosInvitado.length > 0 && (
        <div className="alert alert-warning border-0 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-link-45deg fs-2 text-warning" />
            <div>
              <h6 className="fw-bold mb-0">Compras previas como invitado encontradas</h6>
              <p className="small text-muted mb-0">
                Se encontraron {pedidosInvitado.length} pedido(s) asociados a tu correo (<code>{cliente.email}</code>). Puedes vincularlos formalmente a tu historial.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" isLoading={vinculando} loadingText="Vinculando…" onClick={handleVincular}>
            Vincular a mi cuenta
          </Button>
        </div>
      )}

      {mensajeVinculacion && (
        <div className="alert alert-success small mb-3">
          <i className="bi bi-check-circle me-2" />
          {mensajeVinculacion}
        </div>
      )}

      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
        <h2 className="h5 fw-bold mb-3">Historial Personal de Compras</h2>
        <p className="text-muted small mb-4">
          Visualiza tus pedidos confirmados, estados de preparación y seguimiento en vivo.
        </p>

        {misPedidos.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-cart-x fs-2 d-block mb-2 opacity-50" />
            Aún no tienes pedidos registrados en tu cuenta.
            <div className="mt-3">
              <Link to="/colecciones" className="btn btn-primary btn-sm">
                Explorar tienda
              </Link>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
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
                {misPedidos.map((ped) => (
                  <tr key={ped.id}>
                    <td className="font-monospace fw-semibold text-primary">{ped.codigo}</td>
                    <td className="small text-muted">{formatearFechaHora(ped.fecha).split(' ')[0]}</td>
                    <td className="small">
                      {ped.modalidadEntrega === 'envio' ? (
                        <span><i className="bi bi-truck me-1" />Envío a domicilio</span>
                      ) : (
                        <span><i className="bi bi-shop me-1" />Recojo en tienda</span>
                      )}
                    </td>
                    <td className="text-end fw-semibold sm-nums">{formatearMoneda(ped.importeTotal)}</td>
                    <td className="text-center">
                      <StatusBadge estado={estadoPedidoAEstado(ped.estado)} />
                    </td>
                    <td className="text-end">
                      <Link to={`/seguimiento/${ped.codigo}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-geo-alt me-1" />
                        Seguimiento
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
