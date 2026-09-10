import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { clienteSchema, type ClienteFormValues } from '../schemas/cliente.schema';
import { useActualizarPerfil } from '../hooks/useClientes';
import type { Cliente } from '../types';

interface PerfilTabProps {
  cliente: Cliente;
}

/** Pestaña "Mis Datos Personales" (RF-CLI-004/005). Autocontenida. */
export function PerfilTab({ cliente }: PerfilTabProps) {
  const { mutate: actualizarPerfil, isPending: guardando } = useActualizarPerfil();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClienteFormValues>({ resolver: zodResolver(clienteSchema) });

  useEffect(() => {
    reset({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      tipoDocumento: cliente.tipoDocumento,
      numeroDocumento: cliente.numeroDocumento,
    });
  }, [cliente, reset]);

  const onGuardar = (valores: ClienteFormValues) => {
    actualizarPerfil({ id: 'me', form: valores });
  };

  return (
    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--sm-radius-md)' }}>
      <h2 className="h5 fw-bold mb-3">Información de Perfil y Contacto</h2>
      <p className="text-muted small mb-4">
        Mantén tus datos actualizados para agilizar el proceso de compra y entrega en futuros pedidos.
      </p>

      <Form onSubmit={handleSubmit(onGuardar)} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <Form.Label htmlFor="cli-nom">Nombres <span className="text-danger">*</span></Form.Label>
            <Form.Control id="cli-nom" isInvalid={!!errors.nombres} {...register('nombres')} />
            <Form.Control.Feedback type="invalid">{errors.nombres?.message}</Form.Control.Feedback>
          </div>

          <div className="col-md-6">
            <Form.Label htmlFor="cli-ape">Apellidos <span className="text-danger">*</span></Form.Label>
            <Form.Control id="cli-ape" isInvalid={!!errors.apellidos} {...register('apellidos')} />
            <Form.Control.Feedback type="invalid">{errors.apellidos?.message}</Form.Control.Feedback>
          </div>

          <div className="col-md-6">
            <Form.Label htmlFor="cli-email">Correo Electrónico <span className="text-danger">*</span></Form.Label>
            <Form.Control id="cli-email" type="email" isInvalid={!!errors.email} {...register('email')} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </div>

          <div className="col-md-6">
            <Form.Label htmlFor="cli-tel">Teléfono Celular <span className="text-danger">*</span></Form.Label>
            <Form.Control id="cli-tel" placeholder="987654321" isInvalid={!!errors.telefono} {...register('telefono')} />
            <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
          </div>

          <div className="col-md-4">
            <Form.Label htmlFor="cli-tipodoc">Tipo de Documento <span className="text-danger">*</span></Form.Label>
            <Form.Select id="cli-tipodoc" {...register('tipoDocumento')}>
              <option value="DNI">DNI (Documento Nacional de Identidad)</option>
              <option value="RUC">RUC (Registro Único de Contribuyentes)</option>
              <option value="CE">Carné de Extranjería</option>
            </Form.Select>
          </div>

          <div className="col-md-8">
            <Form.Label htmlFor="cli-numdoc">Número de Documento <span className="text-danger">*</span></Form.Label>
            <Form.Control id="cli-numdoc" isInvalid={!!errors.numeroDocumento} {...register('numeroDocumento')} />
            <Form.Control.Feedback type="invalid">{errors.numeroDocumento?.message}</Form.Control.Feedback>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex justify-content-end">
          <Button type="submit" disabled={!isDirty} isLoading={guardando} loadingText="Guardando…">
            Guardar cambios
          </Button>
        </div>
      </Form>
    </div>
  );
}
