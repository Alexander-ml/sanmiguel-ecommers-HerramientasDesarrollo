import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { direccionSchema, type DireccionFormValues } from '../schemas/direccion.schema';
import { useGuardarDireccion } from '../hooks/useClientes';
import type { Direccion } from '../types';

interface DireccionModalProps {
  show: boolean;
  clienteId?: number | 'me';
  direccionEditar: Direccion | null;
  onCerrar: () => void;
}

export function DireccionModal({
  show,
  clienteId = 'me',
  direccionEditar,
  onCerrar,
}: DireccionModalProps) {
  const { mutate: guardar, isPending } = useGuardarDireccion();
  const esEdicion = !!direccionEditar;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DireccionFormValues>({
    resolver: zodResolver(direccionSchema),
    defaultValues: {
      alias: 'Casa',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'San Miguel',
      direccionPostal: '',
      referencia: '',
      esPredeterminada: false,
    },
  });

  useEffect(() => {
    if (direccionEditar) {
      reset({
        alias: direccionEditar.alias,
        departamento: direccionEditar.departamento,
        provincia: direccionEditar.provincia,
        distrito: direccionEditar.distrito,
        direccionPostal: direccionEditar.direccionPostal,
        referencia: direccionEditar.referencia ?? '',
        esPredeterminada: direccionEditar.esPredeterminada,
      });
    } else {
      reset({
        alias: 'Casa',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'San Miguel',
        direccionPostal: '',
        referencia: '',
        esPredeterminada: false,
      });
    }
  }, [direccionEditar, reset]);

  const onSubmit = (valores: DireccionFormValues) => {
    guardar(
      {
        clienteId,
        id: direccionEditar ? direccionEditar.id : undefined,
        form: valores,
      },
      {
        onSuccess: onCerrar,
      },
    );
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-bold" style={{ color: 'var(--sm-ink)' }}>
            {esEdicion ? `Editar Dirección (${direccionEditar.alias})` : 'Nueva Dirección de Envío'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="row g-3">
            <div className="col-12">
              <Form.Label htmlFor="dir-alias" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Nombre o Alias de la Dirección <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="dir-alias"
                className="bg-white border"
                placeholder="ej. Casa, Oficina, Taller"
                isInvalid={!!errors.alias}
                {...register('alias')}
              />
              <Form.Control.Feedback type="invalid">{errors.alias?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="dir-dep" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Departamento <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="dir-dep"
                className="bg-white border"
                placeholder="Lima"
                isInvalid={!!errors.departamento}
                {...register('departamento')}
              />
              <Form.Control.Feedback type="invalid">{errors.departamento?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="dir-prov" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Provincia <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="dir-prov"
                className="bg-white border"
                placeholder="Lima"
                isInvalid={!!errors.provincia}
                {...register('provincia')}
              />
              <Form.Control.Feedback type="invalid">{errors.provincia?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="dir-dist" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Distrito <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="dir-dist"
                className="bg-white border"
                placeholder="San Miguel"
                isInvalid={!!errors.distrito}
                {...register('distrito')}
              />
              <Form.Control.Feedback type="invalid">{errors.distrito?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="dir-calle" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Dirección Postal (Calle, N°, Dpto.) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="dir-calle"
                className="bg-white border"
                placeholder="Av. La Marina 2305, Dpto. 402"
                isInvalid={!!errors.direccionPostal}
                {...register('direccionPostal')}
              />
              <Form.Control.Feedback type="invalid">{errors.direccionPostal?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="dir-ref" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Referencia de Llegada
              </Form.Label>
              <Form.Control
                id="dir-ref"
                className="bg-white border"
                placeholder="ej. Frente a Plaza San Miguel, portón blanco"
                isInvalid={!!errors.referencia}
                {...register('referencia')}
              />
              <Form.Control.Feedback type="invalid">{errors.referencia?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Check
                id="dir-pred"
                type="checkbox"
                label="Marcar como mi dirección predeterminada de envío"
                {...register('esPredeterminada')}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top px-4 py-3 bg-light">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} isLoading={isPending} loadingText="Guardando…">
            {esEdicion ? 'Guardar cambios' : 'Guardar dirección'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
