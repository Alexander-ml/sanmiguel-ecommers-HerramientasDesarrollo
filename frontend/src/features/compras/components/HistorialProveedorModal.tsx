import { Modal } from 'react-bootstrap';
import { StatusBadge, estadoOrdenCompraAEstado } from '../../../components/ui/StatusBadge';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { KpiCardGroup } from '../../../components/ui/KpiCard';
import { Button } from '../../../components/ui/Button';
import { useCompras } from '../hooks/useCompras';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Proveedor } from '../types';

interface HistorialProveedorModalProps {
  show: boolean;
  proveedor: Proveedor | null;
  onCerrar: () => void;
}

/**
 * RF-COM-014 — Consultar Historial de Proveedor: órdenes, tiempos de entrega y devoluciones
 * asociadas a un proveedor. Vive como modal dentro de Proveedores (no una página aparte),
 * tal como lo sugiere docs/07-prompt-reorganizacion-final.md sección 6.2.
 */
export function HistorialProveedorModal({ show, proveedor, onCerrar }: HistorialProveedorModalProps) {
  const { data, isLoading } = useCompras({ proveedorId: proveedor ? String(proveedor.id) : undefined, limit: 50 });
  const ordenes = data?.datos ?? [];

  const ordenesRecibidas = ordenes.filter((o) => o.recepciones.length > 0);
  const tiemposEntrega = ordenesRecibidas.map((o) => {
    const ultimaRecepcion = o.recepciones[o.recepciones.length - 1];
    const dias =
      (new Date(ultimaRecepcion.fechaRecepcion).getTime() - new Date(o.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(dias));
  });
  const tiempoPromedio =
    tiemposEntrega.length > 0 ? tiemposEntrega.reduce((s, d) => s + d, 0) / tiemposEntrega.length : null;

  const totalDevoluciones = ordenes.reduce((s, o) => s + o.devoluciones.length, 0);
  const totalUnidadesRecibidas = ordenes.reduce(
    (s, o) => s + o.lineas.reduce((s2, l) => s2 + l.cantidadRecibida, 0),
    0,
  );
  const tasaDevolucion = totalUnidadesRecibidas > 0 ? (totalDevoluciones / totalUnidadesRecibidas) * 100 : 0;

  return (
    <Modal show={show} onHide={onCerrar} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <i className="bi bi-clock-history me-2 text-primary" />
          Historial de {proveedor?.razonSocial}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <LoadingState etiqueta="Cargando historial…" />}

        {!isLoading && ordenes.length === 0 && (
          <EmptyState icono="bi-receipt-cutoff" titulo="Sin órdenes registradas" descripcion="Este proveedor todavía no tiene órdenes de compra asociadas." />
        )}

        {!isLoading && ordenes.length > 0 && (
          <>
            <KpiCardGroup
              items={[
                {
                  titulo: 'Órdenes totales',
                  valor: ordenes.length,
                  icono: 'bi-receipt',
                  tono: 'neutral',
                },
                {
                  titulo: 'Tiempo entrega prom.',
                  valor: tiempoPromedio !== null ? `${tiempoPromedio.toFixed(1)} d` : '—',
                  icono: 'bi-clock-history',
                  tono: 'primary',
                },
                {
                  titulo: 'Tasa de devolución',
                  valor: `${tasaDevolucion.toFixed(1)}%`,
                  icono: 'bi-arrow-return-left',
                  tono: tasaDevolucion > 5 ? 'danger' : 'success',
                },
              ]}
              className="mb-4"
            />

            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Fecha</th>
                    <th className="text-end">Total</th>
                    <th className="text-center">Devoluciones</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((o) => (
                    <tr key={o.id}>
                      <td className="font-monospace small">{o.codigo}</td>
                      <td className="small text-muted">{formatearFechaHora(o.fechaCreacion).split(' ')[0]}</td>
                      <td className="text-end small fw-medium">{formatearMoneda(o.totalEstimado)}</td>
                      <td className="text-center small">{o.devoluciones.length || '—'}</td>
                      <td className="text-center">
                        <StatusBadge estado={estadoOrdenCompraAEstado(o.estado)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
