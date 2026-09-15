import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_COMPRAS } from '../../../components/layout/breadcrumbsCons';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { StatusBadge, estadoOrdenCompraAEstado } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { RecepcionModal } from '../components/RecepcionModal';
import { DevolucionProveedorModal } from '../components/DevolucionProveedorModal';
import { useCompra, useCancelarCompra } from '../hooks/useCompras';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';

export function OrdenCompraDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const compraId = Number(id);

  const { data: orden, isLoading, isError, refetch } = useCompra(compraId);
  const { mutate: cancelar, isPending: cancelando } = useCancelarCompra();

  const [mostrarRecepcionModal, setMostrarRecepcionModal] = useState(false);
  const [mostrarDevolucionModal, setMostrarDevolucionModal] = useState(false);
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);

  if (isLoading) return <LoadingState etiqueta="Cargando detalle de la orden de compra…" />;

  if (isError || !orden) {
    return (
      <ErrorState
        mensaje="No se encontró la orden de compra solicitada."
        onReintentar={refetch}
      />
    );
  }

  const totalPedidas = orden.lineas.reduce((s, l) => s + l.cantidadPedida, 0);
  const totalRecibidas = orden.lineas.reduce((s, l) => s + l.cantidadRecibida, 0);
  const porcentajeRecibido = totalPedidas > 0 ? (totalRecibidas / totalPedidas) * 100 : 0;

  const puedeRecepcionar =
    orden.estado === 'PENDIENTE' || orden.estado === 'PARCIALMENTE_RECIBIDA';
  const puedeCancelar = orden.estado === 'PENDIENTE' && orden.recepciones.length === 0;
  const puedeEditar = orden.estado === 'PENDIENTE' && orden.recepciones.length === 0;
  const puedeDevolver = orden.recepciones.length > 0 && totalRecibidas > 0;

  const handleCancelar = () => {
    cancelar(orden.id, {
      onSuccess: () => setConfirmarCancelar(false),
    });
  };

  return (
    <div>
      <Breadcrumbs
        migas={[
          ...BREADCRUMB_COMPRAS,
          { etiqueta: orden.codigo, esDato: true },
        ]}
      />

      <PageHeader
        titulo={`Orden de Compra ${orden.codigo}`}
        descripcion={`Emitida el ${formatearFechaHora(orden.fechaCreacion)} por ${orden.usuarioCreadorNombre}`}
        accion={
          <div className="d-flex align-items-center gap-2">
            {puedeEditar && (
              <Button
                variant="secondary"
                size="sm"
                icon={<i className="bi bi-pencil" />}
                onClick={() => navigate(`/admin/compras/${orden.id}/editar`)}
              >
                Editar
              </Button>
            )}

            {puedeRecepcionar && (
              <Button
                variant="primary"
                size="sm"
                icon={<i className="bi bi-box-arrow-in-down" />}
                onClick={() => setMostrarRecepcionModal(true)}
              >
                Registrar recepción
              </Button>
            )}

            {puedeDevolver && (
              <Button
                variant="outline-danger"
                size="sm"
                icon={<i className="bi bi-arrow-return-left" />}
                onClick={() => setMostrarDevolucionModal(true)}
              >
                Devolver mercadería
              </Button>
            )}

            {puedeCancelar && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmarCancelar(true)}
              >
                Cancelar orden
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/compras')}
            >
              Volver
            </Button>
          </div>
        }
      />

      {/* Tarjeta de Resumen y Progreso */}
      <div
        className="card border mb-4 shadow-sm p-4"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-4 border-end-md">
            <span className="text-muted small">Proveedor asignado</span>
            <h2 className="h5 fw-bold mb-1">{orden.proveedorNombre}</h2>
            <div className="text-muted small">
              RUC: <span className="font-monospace">{orden.proveedorRuc}</span>
            </div>
            {orden.fechaEstimadaEntrega && (
              <div className="text-muted small mt-1">
                <i className="bi bi-calendar-event me-1" />
                Entrega estimada: {orden.fechaEstimadaEntrega.split('T')[0]}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4 border-end-md">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small">Progreso de recepción</span>
              <StatusBadge estado={estadoOrdenCompraAEstado(orden.estado)} />
            </div>
            <div className="fw-bold fs-5 mb-1">
              {totalRecibidas} de {totalPedidas} prendas ({porcentajeRecibido.toFixed(0)}%)
            </div>
            <div className="progress" style={{ height: 8, backgroundColor: 'var(--sm-border)' }}>
              <div
                className={`progress-bar ${
                  porcentajeRecibido === 100
                    ? 'bg-success'
                    : porcentajeRecibido > 0
                    ? 'bg-primary'
                    : 'bg-secondary'
                }`}
                style={{ width: `${porcentajeRecibido}%` }}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 text-md-end">
            <span className="text-muted small">Total estimado de la orden</span>
            <div className="fw-bold fs-3 text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatearMoneda(orden.totalEstimado)}
            </div>
            <span className="text-muted small">
              {orden.lineas.length} modelos / variantes solicitadas
            </span>
          </div>
        </div>

        {orden.notas && (
          <div className="alert alert-light border small mt-3 mb-0">
            <i className="bi bi-chat-left-text me-2 text-primary" />
            <strong>Notas del pedido:</strong> {orden.notas}
          </div>
        )}
      </div>

      {/* Tabla de Prendas Solicitadas */}
      <div
        className="card border mb-4 shadow-sm p-4"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <h3 className="h6 fw-bold mb-3">Prendas y Modelos Solicitados</h3>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Prenda / Talla / Color</th>
                <th className="text-center">Pedidas</th>
                <th className="text-center">Recibidas</th>
                <th className="text-center">Pendientes</th>
                <th className="text-end">Costo Unit.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.lineas.map((linea) => {
                const pendiente = Math.max(0, linea.cantidadPedida - linea.cantidadRecibida);
                const completada = pendiente === 0;

                return (
                  <tr key={linea.id}>
                    <td>
                      <div className="fw-medium small">{linea.productoNombre}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Talla: <strong>{linea.talla}</strong> · Color: <strong>{linea.color}</strong> · SKU: <code>{linea.sku}</code>
                      </div>
                    </td>
                    <td className="text-center small">{linea.cantidadPedida}</td>
                    <td className="text-center small">
                      <span className={`fw-semibold ${completada ? 'text-success' : linea.cantidadRecibida > 0 ? 'text-primary' : 'text-muted'}`}>
                        {linea.cantidadRecibida}
                      </span>
                    </td>
                    <td className="text-center small">
                      <span className={pendiente > 0 ? 'fw-bold text-danger' : 'text-muted'}>
                        {pendiente}
                      </span>
                    </td>
                    <td className="text-end small" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatearMoneda(linea.costoUnitario)}
                    </td>
                    <td className="text-end fw-semibold small" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatearMoneda(linea.subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-end fw-bold">Total Estimado</td>
                <td className="text-end fw-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatearMoneda(orden.totalEstimado)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="row g-4">
        {/* Historial de Recepciones (RF-COM-013) */}
        <div className="col-12 col-lg-6">
          <div
            className="card border shadow-sm p-4 h-100"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <h3 className="h6 fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>
                <i className="bi bi-box-arrow-in-down me-2 text-primary" />
                Historial de Recepciones ({orden.recepciones.length})
              </span>
              {puedeRecepcionar && (
                <Button variant="link" size="sm" className="p-0" onClick={() => setMostrarRecepcionModal(true)}>
                  + Nueva recepción
                </Button>
              )}
            </h3>

            {orden.recepciones.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-inbox fs-3 d-block mb-2 opacity-50" />
                Aún no se han registrado entregas de mercadería para esta orden.
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {orden.recepciones.map((rec) => (
                  <div key={rec.id} className="list-group-item px-0 py-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-semibold font-monospace small text-primary">
                        {rec.codigoRecepcion}
                      </span>
                      <span className="text-muted small">
                        {formatearFechaHora(rec.fechaRecepcion)}
                      </span>
                    </div>
                    <div className="text-muted small mb-2">
                      Recibido por: <strong>{rec.usuarioReceptorNombre}</strong>
                      {rec.comprobanteReferencia && (
                        <span> · Ref: <code>{rec.comprobanteReferencia}</code></span>
                      )}
                    </div>
                    {rec.notas && (
                      <div className="small text-muted fst-italic mb-2">"{rec.notas}"</div>
                    )}
                    <div className="bg-light p-2 rounded small">
                      {rec.lineas.map((l) => {
                        const dl = orden.lineas.find((linea) => linea.varianteId === l.varianteId);
                        return (
                          <div key={l.varianteId} className="d-flex justify-content-between">
                            <span>{dl?.productoNombre ?? 'Prenda'} ({dl?.talla}/{dl?.color})</span>
                            <span className="fw-bold text-success">+{l.cantidadRecibida} u.</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Devoluciones a Proveedor (RF-COM-013) */}
        <div className="col-12 col-lg-6">
          <div
            className="card border shadow-sm p-4 h-100"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <h3 className="h6 fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>
                <i className="bi bi-arrow-return-left me-2 text-danger" />
                Devoluciones por Defecto ({orden.devoluciones.length})
              </span>
              {puedeDevolver && (
                <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => setMostrarDevolucionModal(true)}>
                  + Registrar devolución
                </Button>
              )}
            </h3>

            {orden.devoluciones.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-shield-check fs-3 d-block mb-2 text-success opacity-75" />
                Sin devoluciones registradas. Todas las prendas recibidas cumplen los estándares.
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {orden.devoluciones.map((dev) => (
                  <div key={dev.id} className="list-group-item px-0 py-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-semibold font-monospace small text-danger">
                        {dev.codigoDevolucion}
                      </span>
                      <span className="text-muted small">
                        {formatearFechaHora(dev.fecha)}
                      </span>
                    </div>
                    <div className="fw-medium small">
                      {dev.productoNombre} ({dev.talla}/{dev.color}) · <span className="text-danger fw-bold">-{dev.cantidad} u.</span>
                    </div>
                    <div className="text-muted small mt-1">
                      <strong>Motivo:</strong> {dev.motivo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Recepción */}
      <RecepcionModal
        show={mostrarRecepcionModal}
        orden={orden}
        onCerrar={() => setMostrarRecepcionModal(false)}
      />

      {/* Modal de Devolución */}
      <DevolucionProveedorModal
        show={mostrarDevolucionModal}
        orden={orden}
        onCerrar={() => setMostrarDevolucionModal(false)}
      />

      {/* Confirmación Cancelación */}
      <ConfirmDialog
        show={confirmarCancelar}
        titulo="Cancelar orden de compra"
        descripcion={`¿Seguro que deseas cancelar la orden ${orden.codigo}? Esta acción liberará la solicitud.`}
        textoConfirmar="Cancelar orden"
        tono="danger"
        cargando={cancelando}
        onConfirmar={handleCancelar}
        onCancelar={() => setConfirmarCancelar(false)}
      />
    </div>
  );
}
