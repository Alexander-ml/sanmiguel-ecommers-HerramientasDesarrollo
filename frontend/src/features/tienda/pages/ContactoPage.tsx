import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useConfiguracion } from '../../configuracion/hooks/useConfiguracion';

/**
 * Página pública "Contacto" — reemplaza el placeholder pendiente (Sección 6.5 del plan).
 * El formulario es de demostración (no hay backend de mensajería en esta fase): confirma el
 * envío en pantalla, sin persistir el mensaje en ningún lado — igual criterio que el resto
 * del proyecto de "cero conexión real" fuera de lo ya definido por módulo.
 */
export function ContactoPage() {
  const { data: config, isLoading } = useConfiguracion();
  const [enviado, setEnviado] = useState(false);

  if (isLoading || !config) return <LoadingState etiqueta="Cargando…" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-12 col-md-5">
          <p className="text-uppercase small fw-semibold text-primary mb-2">Contáctanos</p>
          <h1 className="sm-font-display mb-4" style={{ fontSize: 'var(--sm-text-2xl)' }}>
            ¿En qué podemos ayudarte?
          </h1>

          <ul className="list-unstyled">
            <li className="mb-3 d-flex gap-3">
              <i className="bi bi-geo-alt fs-5 text-primary" />
              <span>
                {config.empresa.direccionFiscal}
                <br />
                {config.empresa.distrito}, {config.empresa.provincia}, {config.empresa.departamento}
              </span>
            </li>
            <li className="mb-3 d-flex gap-3">
              <i className="bi bi-telephone fs-5 text-primary" />
              <span>{config.empresa.telefono}</span>
            </li>
            <li className="mb-3 d-flex gap-3">
              <i className="bi bi-envelope fs-5 text-primary" />
              <span>{config.empresa.correo}</span>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm p-4">
            {enviado ? (
              <div className="alert alert-success mb-0">
                <i className="bi bi-check-circle me-2" />
                Gracias por escribirnos. Te responderemos a la brevedad.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="nombre">
                    Nombre
                  </label>
                  <input id="nombre" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="correo-contacto">
                    Correo
                  </label>
                  <input id="correo-contacto" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold" htmlFor="mensaje">
                    Mensaje
                  </label>
                  <textarea id="mensaje" className="form-control" rows={4} required />
                </div>
                <Button type="submit" className="w-100">
                  Enviar mensaje
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
