import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/Button';
import {
  restablecerContrasenaSchema,
  type RestablecerContrasenaFormValues,
} from '../schemas/restablecerContrasena.schema';
import { useRestablecerContrasena } from '../hooks/useRecuperacion';

/** RF-USR-016 — Restablecer contraseña una vez verificado el código de la RNF-USR-002 (revocación). */
export function RestablecerContrasenaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const correoPrevio = (location.state as { correo?: string } | null)?.correo ?? '';

  const { mutate, isPending, error } = useRestablecerContrasena();
  const [listo, setListo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestablecerContrasenaFormValues>({
    resolver: zodResolver(restablecerContrasenaSchema),
    defaultValues: { correo: correoPrevio, codigo: '', nuevaPassword: '', confirmarPassword: '' },
  });

  const onSubmit = (valores: RestablecerContrasenaFormValues) => {
    mutate(valores, { onSuccess: () => setListo(true) });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-5">
          <div className="card border-0 shadow p-4">
            <div className="text-center mb-3">
              <i className="bi bi-key fs-1" style={{ color: 'var(--sm-ink)' }} />
              <h4 className="mt-2 fw-bold sm-font-display">Restablecer contraseña</h4>
              <p className="text-muted small">Ingresa el código recibido y define tu nueva contraseña.</p>
            </div>

            {listo ? (
              <div>
                <div className="alert alert-success small">
                  <i className="bi bi-check-circle me-2" />
                  Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión.
                </div>
                <Button className="w-100" onClick={() => navigate('/login')}>
                  Ir a iniciar sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {error && (
                  <div className="alert alert-danger small" role="alert">
                    {error.message}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="correo">
                    Correo
                  </label>
                  <input
                    id="correo"
                    type="email"
                    className={`form-control${errors.correo ? ' is-invalid' : ''}`}
                    {...register('correo')}
                  />
                  {errors.correo && <div className="invalid-feedback">{errors.correo.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="codigo">
                    Código de verificación
                  </label>
                  <input
                    id="codigo"
                    className={`form-control font-monospace${errors.codigo ? ' is-invalid' : ''}`}
                    placeholder="123456"
                    maxLength={6}
                    {...register('codigo')}
                  />
                  {errors.codigo && <div className="invalid-feedback">{errors.codigo.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="nuevaPassword">
                    Nueva contraseña
                  </label>
                  <input
                    id="nuevaPassword"
                    type="password"
                    className={`form-control${errors.nuevaPassword ? ' is-invalid' : ''}`}
                    {...register('nuevaPassword')}
                  />
                  {errors.nuevaPassword && <div className="invalid-feedback">{errors.nuevaPassword.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="confirmarPassword">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirmarPassword"
                    type="password"
                    className={`form-control${errors.confirmarPassword ? ' is-invalid' : ''}`}
                    {...register('confirmarPassword')}
                  />
                  {errors.confirmarPassword && (
                    <div className="invalid-feedback">{errors.confirmarPassword.message}</div>
                  )}
                </div>

                <Button type="submit" className="w-100" isLoading={isPending} loadingText="Restableciendo…">
                  Restablecer contraseña
                </Button>
              </form>
            )}

            <p className="text-center mt-3 small mb-0">
              <Link to="/login">Volver a iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
