import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { solicitudArcoSchema, type SolicitudArcoFormValues } from '../schemas/arco.schema';
import { useSolicitudesArco, useCrearSolicitudArco } from '../hooks/useClientes';
import { formatearFechaHora } from '../../../lib/format';
import type { Cliente } from '../types';

interface PrivacidadTabProps {
  cliente: Cliente;
}

/** Pestaña "Privacidad y Derechos ARCO" (RF-CLI-012/013, Ley N° 29733). Autocontenida. */
export function PrivacidadTab({ cliente }: PrivacidadTabProps) {
  const { data: solicitudesArco } = useSolicitudesArco();
  const misSolicitudes = (solicitudesArco ?? []).filter((s) => s.clienteId === cliente.id);

  const { mutate: crearSolicitud, isPending: enviando } = useCrearSolicitudArco();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SolicitudArcoFormValues>({
    resolver: zodResolver(solicitudArcoSchema),
    defaultValues: { tipoDerecho: 'ACCESO', detalle: '' },
  });

  const onEnviar = (valores: SolicitudArcoFormValues) => {
    crearSolicitud(
      { clienteId: cliente.id, form: valores },
      {
        onSuccess: () => {
          setMensaje('Tu solicitud fue registrada conforme a la Ley N° 29733. Será atendida a la brevedad.');
          reset({ tipoDerecho: 'ACCESO', detalle: '' });
        },
      },
    );
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 'var(--sm-radius-md)' }}>
          <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-shield-check text-primary" />
            Consentimiento de Datos (Ley N° 29733)
          </h2>
          <p className="text-muted small mb-4">
            Tus datos son tratados bajo estricto cumplimiento de la Ley de Protección de Datos Personales del Perú.
          </p>

          <div className="p-3 bg-light rounded mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold small">Política de Privacidad</span>
              <span className="badge bg-success text-white">Consentimiento Otorgado</span>
            </div>
            <div className="small text-muted mb-2">
              Versión aceptada: <strong>v2.1 - 2025</strong>
            </div>
            <div className="small text-muted">
              Finalidad: Tratamiento de datos personales exclusivamente para gestión de compras,
              facturación electrónica y entrega física de pedidos.
            </div>
          </div>

          <h3 className="h6 fw-bold mb-3">Mis Solicitudes ARCO Radicadas</h3>
          {misSolicitudes.length === 0 ? (
            <div className="text-muted small p-3 border rounded bg-white">
              No has registrado ninguna solicitud de derechos ARCO.
            </div>
          ) : (
            <div className="list-group">
              {misSolicitudes.map((s) => (
                <div key={s.id} className="list-group-item small">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-primary">{s.tipoDerecho}</span>
                    <span className={`badge ${s.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                      {s.estado}
                    </span>
                  </div>
                  <div className="text-muted mb-1">&quot;{s.detalle}&quot;</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Fecha: {formatearFechaHora(s.fechaSolicitud)}
                  </div>
                  {s.respuestaAdmin && (
                    <div className="alert alert-light border small mt-2 mb-0">
                      <strong>Respuesta de San Miguel:</strong> {s.respuestaAdmin}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 'var(--sm-radius-md)' }}>
          <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-lock text-primary" />
            Ejercer Derechos ARCO
          </h2>
          <p className="text-muted small mb-3">
            Puedes solicitar formalmente el Acceso, Rectificación, Cancelación u Oposición
            respecto al tratamiento de tus datos personales.
          </p>

          {mensaje && (
            <div className="alert alert-success small mb-3">
              <i className="bi bi-check-circle me-2" />
              {mensaje}
            </div>
          )}

          <Form onSubmit={handleSubmit(onEnviar)} noValidate>
            <div className="mb-3">
              <Form.Label htmlFor="arco-tipo">
                Derecho a Ejercer <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select id="arco-tipo" {...register('tipoDerecho')}>
                <option value="ACCESO">Acceso: Conocer los datos personales almacenados</option>
                <option value="RECTIFICACION">Rectificación: Actualizar o corregir datos inexactos</option>
                <option value="CANCELACION">Cancelación: Solicitar supresión de mis datos</option>
                <option value="OPOSICION">Oposición: Oponerse al tratamiento por motivo legítimo</option>
              </Form.Select>
            </div>

            <div className="mb-3">
              <Form.Label htmlFor="arco-det">
                Detalle y Fundamentación de la Solicitud <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="arco-det"
                as="textarea"
                rows={4}
                placeholder="Describe con precisión los datos sobre los que deseas ejercer el derecho…"
                isInvalid={!!errors.detalle}
                {...register('detalle')}
              />
              <Form.Control.Feedback type="invalid">{errors.detalle?.message}</Form.Control.Feedback>
            </div>

            <div className="alert alert-warning small mb-3">
              <i className="bi bi-info-circle me-1" />
              <strong>Importante:</strong> Las solicitudes son evaluadas individualmente de acuerdo
              a la Ley N° 29733. La cancelación no puede vulnerar obligaciones tributarias legales.
            </div>

            <Button type="submit" className="w-100" isLoading={enviando} loadingText="Enviando solicitud…">
              Radicar solicitud ARCO
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
