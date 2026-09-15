import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { proveedorSchema, type ProveedorFormValues } from '../schemas/proveedor.schema';
import { useCrearProveedor, useActualizarProveedor } from '../hooks/useCompras';
import type { Proveedor } from '../types';

interface ProveedorModalProps {
  show: boolean;
  proveedorEditar: Proveedor | null;
  onCerrar: () => void;
}

export function ProveedorModal({ show, proveedorEditar, onCerrar }: ProveedorModalProps) {
  const { mutate: crear, isPending: creando } = useCrearProveedor();
  const { mutate: actualizar, isPending: actualizando } = useActualizarProveedor();

  const isPending = creando || actualizando;
  const esEdicion = !!proveedorEditar;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      razonSocial: '',
      ruc: '',
      contactoNombre: '',
      contactoTelefono: '',
      contactoEmail: '',
      direccion: '',
      condicionesComerciales: 'Contado contra entrega',
      estado: 'activo',
    },
  });

  useEffect(() => {
    if (proveedorEditar) {
      reset({
        razonSocial: proveedorEditar.razonSocial,
        ruc: proveedorEditar.ruc,
        contactoNombre: proveedorEditar.contacto.nombre,
        contactoTelefono: proveedorEditar.contacto.telefono,
        contactoEmail: proveedorEditar.contacto.email,
        direccion: proveedorEditar.direccion,
        condicionesComerciales: proveedorEditar.condicionesComerciales,
        estado: proveedorEditar.estado,
      });
    } else {
      reset({
        razonSocial: '',
        ruc: '',
        contactoNombre: '',
        contactoTelefono: '',
        contactoEmail: '',
        direccion: '',
        condicionesComerciales: 'Contado contra entrega',
        estado: 'activo',
      });
    }
  }, [proveedorEditar, reset]);

  const onSubmit = (valores: ProveedorFormValues) => {
    if (esEdicion && proveedorEditar) {
      actualizar(
        { id: proveedorEditar.id, form: valores },
        { onSuccess: onCerrar },
      );
    } else {
      crear(valores, { onSuccess: onCerrar });
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
          <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
            <i className="bi bi-building text-primary" />
            <span>{esEdicion ? `Editar Proveedor: ${proveedorEditar.razonSocial}` : 'Nuevo Proveedor'}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {/* ── Tarjeta 1: Datos de la Empresa (Fondo Blanco) ── */}
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
                  Datos Legales e Identificación
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <Form.Label htmlFor="prov-razon" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Razón Social <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-razon"
                    className="bg-white border form-control-sm"
                    placeholder="ej. Confecciones San Cristóbal S.A.C."
                    isInvalid={!!errors.razonSocial}
                    {...register('razonSocial')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.razonSocial?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="prov-ruc" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    RUC <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-ruc"
                    className="bg-white border form-control-sm"
                    placeholder="20XXXXXXXXX"
                    maxLength={11}
                    isInvalid={!!errors.ruc}
                    {...register('ruc')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.ruc?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-8">
                  <Form.Label htmlFor="prov-dir" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Dirección Fiscal / Almacén <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-dir"
                    className="bg-white border form-control-sm"
                    placeholder="Av. Principal 123, Distrito, Ciudad"
                    isInvalid={!!errors.direccion}
                    {...register('direccion')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.direccion?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="prov-estado" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Estado del Proveedor
                  </Form.Label>
                  <Form.Select id="prov-estado" className="bg-white border form-select-sm" {...register('estado')}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tarjeta 2: Contacto Comercial y Condiciones (Fondo Blanco) ── */}
          <div
            className="card border mb-0 shadow-sm"
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
                  Contacto Comercial y Condiciones
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="prov-contacto" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Nombre de Contacto <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-contacto"
                    className="bg-white border form-control-sm"
                    placeholder="Nombre del ejecutivo comercial"
                    isInvalid={!!errors.contactoNombre}
                    {...register('contactoNombre')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.contactoNombre?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="prov-tel" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Teléfono / Celular <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-tel"
                    className="bg-white border form-control-sm"
                    placeholder="074-234567 / 987654321"
                    isInvalid={!!errors.contactoTelefono}
                    {...register('contactoTelefono')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.contactoTelefono?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12 col-md-4">
                  <Form.Label htmlFor="prov-email" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Correo Electrónico <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-email"
                    type="email"
                    className="bg-white border form-control-sm"
                    placeholder="ventas@proveedor.pe"
                    isInvalid={!!errors.contactoEmail}
                    {...register('contactoEmail')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.contactoEmail?.message}</Form.Control.Feedback>
                </div>

                <div className="col-12">
                  <Form.Label htmlFor="prov-condiciones" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                    Condiciones Comerciales <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="prov-condiciones"
                    className="bg-white border form-control-sm"
                    placeholder="ej. Crédito 30 días · Descuento 5% por volumen"
                    isInvalid={!!errors.condicionesComerciales}
                    {...register('condicionesComerciales')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.condicionesComerciales?.message}</Form.Control.Feedback>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending} loadingText="Guardando…">
            {esEdicion ? 'Guardar cambios' : 'Registrar proveedor'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
