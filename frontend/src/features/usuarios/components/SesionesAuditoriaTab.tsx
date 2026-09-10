import { useState } from 'react';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { SesionesActivasTable } from './SesionesActivasTable';
import { EventosSeguridadTable } from './EventosSeguridadTable';
import { useSesionesActivas, useRevocarSesion, useEventosSeguridad } from '../hooks/useUsuarios';
import type { SesionActiva } from '../types';

/** Pestaña "Sesiones Activas y Auditoría" (RF-USR-013, RF-USR-018). Autocontenida. */
export function SesionesAuditoriaTab() {
  const { data: sesiones } = useSesionesActivas();
  const { mutate: revocarSesion, isPending: revocando } = useRevocarSesion();
  const [sesionARevocar, setSesionARevocar] = useState<SesionActiva | null>(null);

  const [tipoEventoFiltro, setTipoEventoFiltro] = useState('');
  const { data: eventosSeguridad } = useEventosSeguridad(tipoEventoFiltro || undefined);

  const handleConfirmarRevocacion = () => {
    if (!sesionARevocar) return;
    revocarSesion(sesionARevocar.id, { onSuccess: () => setSesionARevocar(null) });
  };

  return (
    <div className="d-flex flex-column gap-4">

      <div
        className="card border shadow-sm p-4"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="mb-3">
          <h2 className="h6 fw-bold mb-1 text-dark">
            <i className="bi bi-broadcast me-2 text-primary" />
            Sesiones Conectadas en Tiempo Real
          </h2>
          <p className="text-muted small mb-0">
            Permite revocar el acceso de forma inmediata ante sospecha de compromiso o cierre forzado de sesión.
          </p>
        </div>

        {sesiones && <SesionesActivasTable sesiones={sesiones} onRevocar={(s) => setSesionARevocar(s)} />}
      </div>

      <div
        className="card border shadow-sm p-4"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 className="h6 fw-bold mb-1 text-dark">
              <i className="bi bi-journal-text me-2 text-primary" />
              Registro de Eventos de Seguridad y Auditoría
            </h2>
            <p className="text-muted small mb-0">
              Trazabilidad de autenticaciones, intentos fallidos y revocaciones de credenciales.
            </p>
          </div>

          <select
            className="form-select form-select-sm bg-white border"
            style={{ width: 220 }}
            value={tipoEventoFiltro}
            onChange={(e) => setTipoEventoFiltro(e.target.value)}
          >
            <option value="">Todos los eventos</option>
            <option value="LOGIN_EXITOSO">Login Exitoso</option>
            <option value="LOGIN_FALLIDO">Login Fallido</option>
            <option value="SESION_REVOCADA">Sesión Revocada</option>
            <option value="USUARIO_DESACTIVADO">Usuario Desactivado</option>
            <option value="CAMBIO_PASSWORD">Cambio de Contraseña</option>
          </select>
        </div>

        {eventosSeguridad && <EventosSeguridadTable eventos={eventosSeguridad} />}
      </div>

      <ConfirmDialog
        show={sesionARevocar !== null}
        titulo="Revocar sesión activa"
        descripcion={`¿Seguro de forzar el cierre inmediato de la sesión en "${sesionARevocar?.dispositivo}" (${sesionARevocar?.usuarioCorreo})? El usuario será desconectado del sistema de inmediato.`}
        textoConfirmar="Revocar sesión"
        tono="danger"
        cargando={revocando}
        onConfirmar={handleConfirmarRevocacion}
        onCancelar={() => setSesionARevocar(null)}
      />
    </div>
  );
}
