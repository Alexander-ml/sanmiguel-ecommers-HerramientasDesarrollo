import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { registroSchema, type RegistroFormValues } from '../schemas/registro.schema';
import { useRegistro } from '../hooks/useRegistro';

export function RegistroPage() {
  const navigate = useNavigate();
  const { mutate: registrar, isPending, error } = useRegistro();
  const [mostrarPass, setMostrarPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema) as any,
    defaultValues: {
      tipoDocumento: 'DNI',
      aceptaTerminos: false,
    },
  });

  const onSubmit = (datos: RegistroFormValues) => {
    registrar(datos, {
      onSuccess: () => {
        navigate('/mi-cuenta', { replace: true });
      },
    });
  };

  const mensajeError = (error as any)?.response?.data?.message ?? error?.message;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: 'var(--sm-radius-md)' }}>
            <div className="row g-0">
              {/* Columna Izquierda: Beneficios y Marca */}
              <div
                className="col-12 col-md-5 p-4 p-lg-5 text-white d-flex flex-column justify-content-between"
                style={{
                  background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 60%, #1e293b 100%)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <span className="h4 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--sm-font-display)', letterSpacing: '0.06em' }}>
                      SAN MIGUEL
                    </span>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--sm-primary)', display: 'inline-block' }} />
                  </div>

                  <h1 className="h4 fw-bold mb-3 text-white">
                    Crea tu cuenta de cliente
                  </h1>
                  <p className="text-white-50 small mb-4" style={{ lineHeight: 1.6 }}>
                    Únete para disfrutar de una experiencia de compra personalizada, rápida y segura en nuestra tienda de indumentaria masculina.
                  </p>

                  <ul className="list-unstyled d-flex flex-column gap-3 small text-white-50 mb-4">
                    <li className="d-flex align-items-start gap-2">
                      <i className="bi bi-truck text-primary fs-6 mt-1" />
                      <div>
                        <strong className="text-white">Seguimiento en Vivo:</strong> Consulta el despacho de tus pedidos en tiempo real.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <i className="bi bi-geo-alt text-primary fs-6 mt-1" />
                      <div>
                        <strong className="text-white">Libreta de Direcciones:</strong> Guarda tus lugares de entrega frecuentes.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <i className="bi bi-link-45deg text-primary fs-6 mt-1" />
                      <div>
                        <strong className="text-white">Vinculación de Pedidos:</strong> Asocia compras hechas como invitado con tu correo.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <i className="bi bi-shield-check text-primary fs-6 mt-1" />
                      <div>
                        <strong className="text-white">Privacidad Garantizada:</strong> Cumplimiento estricto de la Ley N° 29733.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-25 small text-white-50">
                  ¿Ya tienes cuenta en San Miguel?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Inicia sesión aquí
                  </Link>
                </div>
              </div>

              {/* Columna Derecha: Formulario */}
              <div className="col-12 col-md-7 p-4 p-lg-5 bg-white">
                <div className="mb-4">
                  <h2 className="h4 fw-bold text-dark mb-1">Registro de Nuevo Cliente</h2>
                  <p className="text-muted small mb-0">Completa tus datos para crear tu cuenta en minutos.</p>
                </div>

                {mensajeError && (
                  <Alert variant="danger" className="small py-2 mb-3">
                    <i className="bi bi-exclamation-circle me-2" />
                    {mensajeError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="row g-3">
                    {/* Nombres y Apellidos */}
                    <div className="col-12 col-sm-6">
                      <Form.Label htmlFor="reg-nombres" className="small fw-semibold">
                        Nombres <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-nombres"
                        type="text"
                        placeholder="Ej. Carlos"
                        isInvalid={!!errors.nombres}
                        {...register('nombres')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.nombres?.message}</Form.Control.Feedback>
                    </div>

                    <div className="col-12 col-sm-6">
                      <Form.Label htmlFor="reg-apellidos" className="small fw-semibold">
                        Apellidos <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-apellidos"
                        type="text"
                        placeholder="Ej. Mendoza Vega"
                        isInvalid={!!errors.apellidos}
                        {...register('apellidos')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.apellidos?.message}</Form.Control.Feedback>
                    </div>

                    {/* Documento */}
                    <div className="col-12 col-sm-4">
                      <Form.Label htmlFor="reg-tipodoc" className="small fw-semibold">Tipo Doc. <span className="text-danger">*</span></Form.Label>
                      <Form.Select id="reg-tipodoc" {...register('tipoDocumento')}>
                        <option value="DNI">DNI</option>
                        <option value="CE">C.E.</option>
                      </Form.Select>
                    </div>

                    <div className="col-12 col-sm-8">
                      <Form.Label htmlFor="reg-numdoc" className="small fw-semibold">
                        N° de Documento <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-numdoc"
                        type="text"
                        placeholder="8 dígitos"
                        isInvalid={!!errors.numeroDocumento}
                        {...register('numeroDocumento')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.numeroDocumento?.message}</Form.Control.Feedback>
                    </div>

                    {/* Correo y Celular */}
                    <div className="col-12 col-sm-7">
                      <Form.Label htmlFor="reg-correo" className="small fw-semibold">
                        Correo Electrónico <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-correo"
                        type="email"
                        placeholder="tunombre@correo.com"
                        isInvalid={!!errors.correo}
                        {...register('correo')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.correo?.message}</Form.Control.Feedback>
                    </div>

                    <div className="col-12 col-sm-5">
                      <Form.Label htmlFor="reg-tel" className="small fw-semibold">
                        Celular <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-tel"
                        type="tel"
                        placeholder="974 000 000"
                        isInvalid={!!errors.telefono}
                        {...register('telefono')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
                    </div>

                    {/* Contraseñas */}
                    <div className="col-12 col-sm-6">
                      <Form.Label htmlFor="reg-pass" className="small fw-semibold">
                        Contraseña <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-group">
                        <Form.Control
                          id="reg-pass"
                          type={mostrarPass ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          isInvalid={!!errors.password}
                          {...register('password')}
                        />
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={() => setMostrarPass(!mostrarPass)}
                          tabIndex={-1}
                        >
                          <i className={`bi ${mostrarPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                        </Button>
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <Form.Label htmlFor="reg-confpass" className="small fw-semibold">
                        Confirmar Contraseña <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="reg-confpass"
                        type={mostrarPass ? 'text' : 'password'}
                        placeholder="Repite la contraseña"
                        isInvalid={!!errors.confirmarPassword}
                        {...register('confirmarPassword')}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirmarPassword?.message}</Form.Control.Feedback>
                    </div>

                    {/* Checkbox de consentimiento y términos */}
                    <div className="col-12 mt-3">
                      <Form.Check
                        id="reg-term"
                        type="checkbox"
                        isInvalid={!!errors.aceptaTerminos}
                        {...register('aceptaTerminos')}
                        label={
                          <span className="small text-muted">
                            Declaro que he leído y acepto las políticas de compra y el tratamiento de mis datos personales conforme a la <strong>Ley N° 29733</strong>.
                          </span>
                        }
                      />
                      {errors.aceptaTerminos && (
                        <div className="text-danger small mt-1">{errors.aceptaTerminos.message}</div>
                      )}
                    </div>

                    {/* Botón de Enviar */}
                    <div className="col-12 mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100 py-2 fw-semibold"
                        style={{ borderRadius: 8 }}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creando tu cuenta…
                          </>
                        ) : (
                          'Registrar mi cuenta'
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
