import { Modal } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { renderBadgeSegmento } from './ClientesTable';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import type { Cliente } from '../types';

interface ClienteDetalleModalProps {
  show: boolean;
  cliente: Cliente | null;
  onCerrar: () => void;
}

export function ClienteDetalleModal({ show, cliente, onCerrar }: ClienteDetalleModalProps) {
  if (!cliente) return null;

  return (
    <Modal show={show} onHide={onCerrar} size="lg" centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title as="h5" className="mb-1 fw-bold" style={{ color: 'var(--sm-ink)' }}>
            Expediente de Cliente · {cliente.nombres} {cliente.apellidos}
          </Modal.Title>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted small">
              {cliente.tipoDocumento}: <code>{cliente.numeroDocumento}</code>
            </span>
            <span className="text-muted">·</span>
            <StatusBadge estado={cliente.estado} />
            {renderBadgeSegmento(cliente.segmentoRFM)}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Resumen Comercial */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded text-center"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <span className="text-muted small d-block mb-1">Total acumulado</span>
              <span className="fw-bold fs-5 text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatearMoneda(cliente.totalGastado)}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded text-center"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <span className="text-muted small d-block mb-1">Pedidos completados</span>
              <span className="fw-bold fs-5 text-dark">
                {cliente.cantidadPedidos} pedidos
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded text-center"
              style={{
                backgroundColor: 'var(--sm-bone, #f8fafc)',
                border: '1px solid var(--sm-border, #e2e8f0)',
                borderRadius: 'var(--sm-radius-md, 8px)',
              }}
            >
              <span className="text-muted small d-block mb-1">Última compra</span>
              <span className="fw-medium small text-dark d-block">
                {cliente.ultimaCompraFecha ? formatearFechaHora(cliente.ultimaCompraFecha).split(' ')[0] : 'Sin compras'}
              </span>
            </div>
          </div>
        </div>

        {/* Datos de Contacto */}
        <div
          className="card border mb-4 shadow-sm"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--sm-border)',
            borderRadius: 'var(--sm-radius-md, 8px)',
          }}
        >
          <div className="card-header bg-white py-3 px-4 border-bottom" style={{ borderColor: 'var(--sm-border)' }}>
            <h6 className="fw-bold mb-0 text-dark">
              <i className="bi bi-person-lines-fill me-2 text-primary" />
              Información de Contacto y Cuenta
            </h6>
          </div>
          <div className="card-body p-4">
            <div className="row g-3 small">
              <div className="col-12 col-md-6">
                <span className="text-muted d-block">Correo Electrónico:</span>
                <span className="fw-medium text-dark">{cliente.email}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted d-block">Teléfono Celular:</span>
                <span className="fw-medium text-dark">{cliente.telefono}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted d-block">Documento de Identidad:</span>
                <span className="fw-medium text-dark">{cliente.tipoDocumento} {cliente.numeroDocumento}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted d-block">Fecha de Registro:</span>
                <span className="fw-medium text-dark">{formatearFechaHora(cliente.fechaRegistro)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direcciones de Envío */}
        <div className="mb-4">
          <h6 className="fw-bold mb-2">
            <i className="bi bi-geo-alt me-2 text-primary" />
            Direcciones de Envío Registradas ({cliente.direcciones.length})
          </h6>
          {cliente.direcciones.length === 0 ? (
            <div className="text-muted small p-3 bg-white border rounded">
              El cliente aún no ha registrado direcciones postales de entrega.
            </div>
          ) : (
            <div className="list-group">
              {cliente.direcciones.map((d) => (
                <div key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold small">
                      {d.alias} {d.esPredeterminada && <span className="badge bg-primary ms-1" style={{ fontSize: '0.65rem' }}>Predeterminada</span>}
                    </div>
                    <div className="text-muted small">
                      {d.direccionPostal} — {d.distrito}, {d.provincia}, {d.departamento}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consentimientos ARCO */}
        <div>
          <h6 className="fw-bold mb-2">
            <i className="bi bi-shield-check me-2 text-primary" />
            Consentimientos de Tratamiento de Datos ({cliente.consentimientos.length})
          </h6>
          {cliente.consentimientos.length === 0 ? (
            <div className="text-muted small p-3 bg-white border rounded">
              No hay registros de consentimientos expresos asociados.
            </div>
          ) : (
            <div className="list-group small">
              {cliente.consentimientos.map((cs) => (
                <div key={cs.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{cs.finalidad}</span>
                    <span className={`badge ${cs.estado === 'OTORGADO' ? 'bg-success' : 'bg-secondary'}`}>
                      {cs.estado}
                    </span>
                  </div>
                  <div className="text-muted mb-1">Versión política: {cs.versionPolitica}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Registrado el {formatearFechaHora(cs.fecha)} para {cs.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top px-4 py-3 bg-light">
        <Button variant="secondary" onClick={onCerrar}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
