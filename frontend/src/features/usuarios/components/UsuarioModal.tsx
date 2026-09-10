import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import {
  usuarioInternoSchema,
  type UsuarioInternoFormValues,
} from '../schemas/usuario.schema';
import { useCrearUsuario, useActualizarUsuario } from '../hooks/useUsuarios';
import type { UsuarioInterno } from '../types';

interface UsuarioModalProps {
  show: boolean;
  usuarioEditar: UsuarioInterno | null;
  onCerrar: () => void;
}

export function UsuarioModal({ show, usuarioEditar, onCerrar }: UsuarioModalProps) {
  const { mutate: crear, isPending: creando, error: errorCrear } = useCrearUsuario();
  const { mutate: actualizar, isPending: actualizando, error: errorActualizar } = useActualizarUsuario();

  const isPending = creando || actualizando;
  const esEdicion = !!usuarioEditar;
  const error = errorCrear || errorActualizar;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioInternoFormValues>({
    resolver: zodResolver(usuarioInternoSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      correo: '',
      rol: 'VENDEDOR',
      password: 'demo1234',
    },
  });

  useEffect(() => {
    if (usuarioEditar) {
      reset({
        nombres: usuarioEditar.nombres,
        apellidos: usuarioEditar.apellidos,
        correo: usuarioEditar.correo,
        rol: usuarioEditar.rol,
        password: '',
      });
    } else {
      reset({
        nombres: '',
        apellidos: '',
        correo: '',
        rol: 'VENDEDOR',
        password: 'demo1234',
      });
    }
  }, [usuarioEditar, reset]);

  const onSubmit = (valores: UsuarioInternoFormValues) => {
    if (esEdicion && usuarioEditar) {
      actualizar(
        { id: usuarioEditar.id, form: valores },
        { onSuccess: onCerrar },
      );
    } else {
      crear(valores, { onSuccess: onCerrar });
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-bold" style={{ color: 'var(--sm-ink)' }}>
            {esEdicion ? `Editar Usuario: ${usuarioEditar.nombres} ${usuarioEditar.apellidos}` : 'Nuevo Usuario Interno'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {error && (
            <div className="alert alert-danger small mb-3">
              <i className="bi bi-exclamation-triangle me-2" />
              {error.message}
            </div>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label htmlFor="usr-nom" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Nombres <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="usr-nom"
                className="bg-white border"
                placeholder="ej. Ana"
                isInvalid={!!errors.nombres}
                {...register('nombres')}
              />
              <Form.Control.Feedback type="invalid">{errors.nombres?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="usr-ape" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Apellidos <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="usr-ape"
                className="bg-white border"
                placeholder="ej. Flores"
                isInvalid={!!errors.apellidos}
                {...register('apellidos')}
              />
              <Form.Control.Feedback type="invalid">{errors.apellidos?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="usr-correo" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Correo Electrónico Corporativo <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="usr-correo"
                type="email"
                className="bg-white border"
                placeholder="usuario@sanmiguel.pe"
                disabled={esEdicion}
                isInvalid={!!errors.correo}
                {...register('correo')}
              />
              <Form.Control.Feedback type="invalid">{errors.correo?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="usr-rol" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Rol Asignado <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                id="usr-rol"
                className="bg-white border"
                isInvalid={!!errors.rol}
                {...register('rol')}
              >
                <option value="ADMINISTRADOR">Administrador (Acceso Total y Seguridad)</option>
                <option value="ALMACENERO">Almacenero (Catálogo, Stock y Compras)</option>
                <option value="VENDEDOR">Vendedor (Ventas, Pedidos y Mostrador)</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.rol?.message}</Form.Control.Feedback>
              <Form.Text className="text-muted small">
                Todo usuario interno debe tener un rol asignado para operar en el sistema.
              </Form.Text>
            </div>

            {!esEdicion && (
              <div className="col-12">
                <Form.Label htmlFor="usr-pass" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                  Contraseña Temporal <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="usr-pass"
                  type="password"
                  className="bg-white border"
                  placeholder="Mínimo 6 caracteres (ej. demo1234)"
                  isInvalid={!!errors.password}
                  {...register('password')}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                <Form.Text className="text-muted small">
                  Por seguridad, la contraseña se almacenará con cifrado seguro.
                </Form.Text>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top px-4 py-3 bg-light">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} isLoading={isPending} loadingText="Guardando…">
            {esEdicion ? 'Guardar cambios' : 'Registrar usuario'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
