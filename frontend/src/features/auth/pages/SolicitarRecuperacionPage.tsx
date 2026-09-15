import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/Button';
import {
  solicitarRecuperacionSchema,
  type SolicitarRecuperacionFormValues,
} from '../schemas/solicitarRecuperacion.schema';
import { useSolicitarRecuperacion } from '../hooks/useRecuperacion';

/**
 * RF-USR-015 — Solicitar recuperación de contraseña.
 * Al no existir un servicio de correo real en esta fase, el código se muestra directamente en
 * pantalla, marcado explícitamente como modo demostración — ver mocks/data/recuperacion.ts.
 */
export function SolicitarRecuperacionPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useSolicitarRecuperacion();
  const [codigoDemo, setCodigoDemo] = useState<string | null>(null);
  const [correoEnviado, setCorreoEnviado] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolicitarRecuperacionFormValues>({ resolver: zodResolver(solicitarRecuperacionSchema) });

  const onSubmit = (valores: SolicitarRecuperacionFormValues) => {
    mutate(valores, {
      onSuccess: (respuesta) => {
        setCorreoEnviado(valores.correo);
        setCodigoDemo(respuesta.codigoDemo ?? null);
      },
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-5">
          <div className="card border-0 shadow p-4">
            <div className="text-center mb-3">
              <i className="bi bi-shield-lock fs-1" style={{ color: 'var(--sm-ink)' }} />
              <h4 className="mt-2 fw-bold sm-font-display">Recuperar contraseña</h4>
              <p className="text-muted small">Te enviaremos un código de verificación a tu correo.</p>
            </div>

            {correoEnviado ? (
              <div>
                <div className="alert alert-success small">
                  <i className="bi bi-check-circle me-2" />
                  Si <strong>{correoEnviado}</strong> está registrado, recibirás un código de 6 dígitos.
                </div>

                {codigoDemo && (
                  <div className="alert alert-warning small">
                    <i className="bi bi-info-circle me-2" />
                    <strong>Modo demostración</strong> (no hay servicio de correo real conectado):
                    tu código es <span className="font-monospace fw-bold">{codigoDemo}</span>.
                  </div>
                )}

                <Button
                  className="w-100"
                  onClick={() => navigate('/restablecer-contrasena', { state: { correo: correoEnviado } })}
                >
                  Ya tengo mi código
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
                    Correo registrado
                  </label>
                  <input
                    id="correo"
                    type="email"
                    className={`form-control${errors.correo ? ' is-invalid' : ''}`}
                    placeholder="correo@ejemplo.com"
                    {...register('correo')}
                  />
                  {errors.correo && <div className="invalid-feedback">{errors.correo.message}</div>}
                </div>

                <Button type="submit" className="w-100" isLoading={isPending} loadingText="Enviando…">
                  Enviar código de recuperación
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
