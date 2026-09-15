import { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { useRegistrarRecepcion } from '../hooks/useCompras';
import { formatearMoneda } from '../../../lib/format';
import type { OrdenCompra } from '../types';

interface RecepcionModalProps {
  show: boolean;
  orden: OrdenCompra | null;
  onCerrar: () => void;
}

export function RecepcionModal({ show, orden, onCerrar }: RecepcionModalProps) {
  const { mutate: registrar, isPending, error } = useRegistrarRecepcion();

  const [comprobanteRef, setComprobanteRef] = useState('');
  const [notas, setNotas] = useState('');
  const [cantidades, setCantidades] = useState<Record<number, number>>({});

  useEffect(() => {
    if (orden) {
      setComprobanteRef('');
      setNotas('');
      // Inicializar cantidades a recibir con lo pendiente
      const inicial: Record<number, number> = {};
      for (const linea of orden.lineas) {
        const pendiente = Math.max(0, linea.cantidadPedida - linea.cantidadRecibida);
        inicial[linea.varianteId] = pendiente;
      }
      setCantidades(inicial);
    }
  }, [orden]);

  if (!orden) return null;

  const handleCantidadChange = (varianteId: number, val: number, max: number) => {
    const seguro = Math.min(Math.max(0, val), max);
    setCantidades((prev) => ({ ...prev, [varianteId]: seguro }));
  };

  const handleRecibirTodo = () => {
    const todo: Record<number, number> = {};
    for (const linea of orden.lineas) {
      todo[linea.varianteId] = Math.max(0, linea.cantidadPedida - linea.cantidadRecibida);
    }
    setCantidades(todo);
  };

  const totalARecibir = Object.values(cantidades).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalARecibir <= 0) return;

    const lineasPayload = orden.lineas
      .map((l) => ({
        varianteId: l.varianteId,
        cantidadRecibida: cantidades[l.varianteId] ?? 0,
      }))
      .filter((l) => l.cantidadRecibida > 0);

    registrar(
      {
        id: orden.id,
        form: {
          comprobanteReferencia: comprobanteRef.trim() || undefined,
          notas: notas.trim() || undefined,
          lineas: lineasPayload,
        },
      },
      {
        onSuccess: onCerrar,
      },
    );
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
          <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
            <i className="bi bi-box-arrow-in-down text-primary" />
            <span>Registrar Recepción de Mercadería</span>
            <span className="font-monospace text-primary small ms-1">({orden.codigo})</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {error && (
            <div className="alert alert-danger small mb-3">
              <i className="bi bi-exclamation-triangle me-2" />
              {error.message}
            </div>
          )}

          {/* ── Contexto de la orden (Solo lectura) ── */}
          <div
            className="p-3 mb-3 rounded"
            style={{
              backgroundColor: 'var(--sm-bone, #f8fafc)',
              border: '1px solid var(--sm-border, #e2e8f0)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold small text-muted">
                <i className="bi bi-info-circle me-1" /> Datos de la orden asociada
              </span>
              <span className="badge bg-light text-muted border small">Solo lectura</span>
            </div>
            <div className="row g-2 small text-muted">
              <div className="col-12 col-md-6">
                <strong>Proveedor:</strong> {orden.proveedorNombre} ({orden.proveedorRuc})
              </div>
              <div className="col-12 col-md-6 text-md-end">
                <strong>Total estimado:</strong> {formatearMoneda(orden.totalEstimado)}
              </div>
            </div>
          </div>

          {/* ── Tarjeta 1: Comprobante y Observaciones (Fondo Blanco para Llenar) ── */}
          <div
            className="card border mb-3 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-2 px-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                <span className="fw-bold small" style={{ color: 'var(--sm-ink)' }}>
                  Comprobante y Observaciones de Llegada
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Label htmlFor="rec-ref" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Comprobante de Referencia
                  </Form.Label>
                  <Form.Control
                    id="rec-ref"
                    className="bg-white border form-control-sm"
                    placeholder="ej. Guía de Remisión GR-001-0456 o Factura"
                    value={comprobanteRef}
                    onChange={(e) => setComprobanteRef(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label htmlFor="rec-notas" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Notas u Observaciones
                  </Form.Label>
                  <Form.Control
                    id="rec-notas"
                    className="bg-white border form-control-sm"
                    placeholder="ej. Bultos en buen estado, precintos conformes"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Tarjeta 2: Prendas a Recepcionar (Fondo Blanco para Llenar) ── */}
          <div
            className="card border mb-3 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-2 px-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  2
                </span>
                <span className="fw-bold small" style={{ color: 'var(--sm-ink)' }}>
                  Prendas a Recepcionar
                </span>
              </div>
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none small fw-semibold"
                onClick={handleRecibirTodo}
                icon={<i className="bi bi-check2-all me-1" />}
              >
                Recibir todo lo pendiente
              </Button>
            </div>

            <div className="card-body p-3">
              <div
                className="d-flex align-items-center gap-2 p-2 mb-3 rounded small"
                style={{
                  backgroundColor: 'var(--sm-bone, #f8fafc)',
                  border: '1px solid var(--sm-border, #e2e8f0)',
                  color: 'var(--sm-ink-soft)',
                }}
              >
                <i className="bi bi-info-circle text-primary" />
                <span>
                  Ingresa las cantidades recibidas en las casillas con <strong>fondo blanco</strong>.
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Prenda / SKU</th>
                      <th className="text-center">Pedidas</th>
                      <th className="text-center">Ya recibidas</th>
                      <th className="text-center">Pendientes</th>
                      <th className="text-end" style={{ width: 140 }}>Cant. a recibir <span className="text-danger">*</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.lineas.map((linea) => {
                      const pendiente = Math.max(0, linea.cantidadPedida - linea.cantidadRecibida);
                      const valorActual = cantidades[linea.varianteId] ?? 0;
                      const completada = pendiente === 0;

                      return (
                        <tr key={linea.id} className={completada ? 'text-muted bg-light' : ''}>
                          <td>
                            <div className="fw-semibold small" style={{ color: 'var(--sm-ink)' }}>{linea.productoNombre}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {linea.talla} · {linea.color} · <code>{linea.sku}</code>
                            </div>
                          </td>
                          <td className="text-center small">{linea.cantidadPedida}</td>
                          <td className="text-center small text-success fw-semibold">
                            {linea.cantidadRecibida}
                          </td>
                          <td className="text-center small fw-bold">
                            {pendiente}
                          </td>
                          <td className="text-end">
                            <input
                              type="number"
                              className="form-control form-control-sm text-end bg-white border fw-bold"
                              style={{ borderColor: 'var(--sm-border)' }}
                              min={0}
                              max={pendiente}
                              value={valorActual}
                              disabled={completada}
                              onChange={(e) =>
                                handleCantidadChange(linea.varianteId, Number(e.target.value), pendiente)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Panel de resumen ── */}
          <div
            className="p-3 rounded d-flex align-items-center justify-content-between mb-3"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
              boxShadow: 'var(--sm-shadow-sm)',
            }}
          >
            <div>
              <span className="fw-bold text-dark small d-block">Resumen de Entrada a Almacén</span>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                {totalARecibir > 0 ? `${totalARecibir} unidades listas para ingresar al stock físico` : 'Ingresa cantidades a recibir'}
              </span>
            </div>
            <div className="text-end">
              <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Total a ingresar</span>
              <span className="fw-bold fs-5 text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {totalARecibir} <span className="small text-muted fw-normal">u.</span>
              </span>
            </div>
          </div>

          <div className="alert alert-info small mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-info-circle fs-5" />
            <div>
              Al confirmar, el sistema comunicará automáticamente esta entrada a <strong>Inventario</strong> incrementando el stock físico y registrando el movimiento de compra correspondiente.
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={totalARecibir <= 0}
            isLoading={isPending}
            loadingText="Procesando recepción…"
            icon={<i className="bi bi-box-arrow-in-down" />}
          >
            Confirmar recepción ({totalARecibir} u.)
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
