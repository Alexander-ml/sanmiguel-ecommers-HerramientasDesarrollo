import { useState } from 'react';
import { SolicitudesArcoTable } from './SolicitudesArcoTable';
import { AtenderArcoModal } from './AtenderArcoModal';
import { useSolicitudesArco } from '../hooks/useClientes';
import type { SolicitudARCO } from '../types';

/** Pestaña "Derechos ARCO" (RF-CLI-013/014, Ley N° 29733). Autocontenida. */
export function ArcoTab() {
  const { data: solicitudesArco } = useSolicitudesArco();
  const [solicitudAAtender, setSolicitudAAtender] = useState<SolicitudARCO | null>(null);

  return (
    <div>
      <div className="alert alert-info small d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-shield-check fs-4 text-primary flex-shrink-0" />
        <div>
          <strong>Cumplimiento Normativo de la Ley N° 29733 (Perú):</strong> Esta bandeja permite
          atender los derechos de Acceso, Rectificación, Cancelación y Oposición solicitados por
          los titulares de datos personales. Cada solicitud debe ser evaluada individualmente
          conforme a la legislación aplicable.
        </div>
      </div>

      {solicitudesArco && (
        <SolicitudesArcoTable solicitudes={solicitudesArco} onAtender={(s) => setSolicitudAAtender(s)} />
      )}

      <AtenderArcoModal show={solicitudAAtender !== null} solicitud={solicitudAAtender} onCerrar={() => setSolicitudAAtender(null)} />
    </div>
  );
}
