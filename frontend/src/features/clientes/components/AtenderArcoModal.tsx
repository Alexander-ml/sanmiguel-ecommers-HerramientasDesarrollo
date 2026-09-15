import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { atenderArcoSchema, type AtenderArcoFormValues } from '../schemas/arco.schema';
import { useAtenderSolicitudArco } from '../hooks/useClientes';
import { formatearFechaHora } from '../../../lib/format';
import type { SolicitudARCO } from '../types';

interface AtenderArcoModalProps {
  show: boolean;
  solicitud: SolicitudARCO | null;
  onCerrar: () => void;
}

export function AtenderArcoModal({ show, solicitud, onCerrar }: AtenderArcoModalProps) {
  const { mutate: atender, isPending } = useAtenderSolicitudArco();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AtenderArcoFormValues>({
    resolver: zodResolver(atenderArcoSchema),
    defaultValues: {
      estado: 'ATENDIDA',
      respuestaAdmin: '',
    },
  });

  useEffect(() => {
    if (solicitud) {
      reset({
        estado: solicitud.estado === 'PENDIENTE' ? 'ATENDIDA' : solicitud.estado,
        respuestaAdmin: solicitud.respuestaAdmin ?? '',
      });
    }
  }, [solicitud, reset]);

  if (!solicitud) return null;

  const onSubmit = (valores: AtenderArcoFormValues) => {
    atender(
      { id: solicitud.id, form: valores },
      { onSuccess: onCerrar },
    );
  };

  const yaAtendida = solicitud.estado !== 'PENDIENTE';

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-bold" style={{ color: 'var(--sm-ink)' }}>
            Atención de Solicitud ARCO · {solicitud.tipoDerecho}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div
            className="p-3 rounded mb-3"
            style={{
              backgroundColor: 'var(--sm-bone, #f8fafc)',
              border: '1px solid var(--sm-border, #e2e8f0)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="row g-2 small">
              <div className="col-12 col-md-6">
                <strong>Titular de los datos:</strong> {solicitud.clienteNombre}
              </div>
              <div className="col-12 col-md-6">
                <strong>Correo registrado:</strong> {solicitud.clienteEmail}
              </div>
              <div className="col-12 col-md-6">
                <strong>Fecha de solicitud:</strong> {formatearFechaHora(solicitud.fechaSolicitud)}
              </div>
              <div className="col-12 col-md-6">
                <strong>Estado actual:</strong>{' '}
                <span className={`badge ${solicitud.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {solicitud.estado}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-top small">
              <strong>Motivo expuesto por el titular:</strong>
              <div className="mt-1 text-dark fst-italic">"{solicitud.detalle}"</div>
            </div>
          </div>

          <div className="alert alert-warning small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-shield-exclamation fs-5 flex-shrink-0" />
            <div>
              <strong>Evaluación de Cancelación de Datos:</strong> Si la solicitud involucra la supresión de datos asociados a comprobantes tributarios o ventas confirmadas, debe conservarse el respaldo contable y fiscal legalmente exigido en Perú.
            </div>
          </div>

          <div className="mb-3">
            <Form.Label htmlFor="arco-res" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
              Resolución Administrativa <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              id="arco-res"
              className="bg-white border"
              disabled={yaAtendida}
              isInvalid={!!errors.estado}
              {...register('estado')}
            >
              <option value="ATENDIDA">Atendida / Procedente</option>
              <option value="RECHAZADA">Rechazada / No procedente</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.estado?.message}</Form.Control.Feedback>
          </div>

          <div className="mb-3">
            <Form.Label htmlFor="arco-resp" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
              Fundamentación de la Respuesta al Titular <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="arco-resp"
              as="textarea"
              rows={4}
              className="bg-white border"
              placeholder="Explica las medidas adoptadas o los fundamentos legales de la decisión según la Ley N° 29733…"
              disabled={yaAtendida}
              isInvalid={!!errors.respuestaAdmin}
              {...register('respuestaAdmin')}
            />
            <Form.Control.Feedback type="invalid">{errors.respuestaAdmin?.message}</Form.Control.Feedback>
          </div>

          {yaAtendida && solicitud.usuarioAtendioNombre && (
            <div className="text-muted small">
              Atendida por: <strong>{solicitud.usuarioAtendioNombre}</strong> el {formatearFechaHora(solicitud.fechaRespuesta ?? '')}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top px-4 py-3 bg-light">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            {yaAtendida ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!yaAtendida && (
            <Button type="submit" disabled={isPending} isLoading={isPending} loadingText="Guardando…">
              Registrar resolución
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
