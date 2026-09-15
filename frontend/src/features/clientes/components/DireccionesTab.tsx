import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { DireccionModal } from './DireccionModal';
import { useDirecciones, useEliminarDireccion, usePredeterminarDireccion } from '../hooks/useClientes';
import type { Direccion } from '../types';

/** Pestaña "Mis Direcciones" (RF-CLI-006 a 010). Autocontenida. */
export function DireccionesTab() {
  const { data: direcciones } = useDirecciones('me');
  const { mutate: eliminarDir } = useEliminarDireccion();
  const { mutate: predeterminarDir } = usePredeterminarDireccion();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [dirAEditar, setDirAEditar] = useState<Direccion | null>(null);

  const abrirNueva = () => {
    setDirAEditar(null);
    setModalAbierto(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 fw-bold mb-0">Mis Direcciones de Envío</h2>
          <p className="text-muted small mb-0">
            Guarda tus domicilios u oficinas para que tus compras en línea lleguen sin demoras.
          </p>
        </div>
        <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={abrirNueva}>
          Nueva dirección
        </Button>
      </div>

      <div className="row g-3">
        {direcciones?.map((dir) => (
          <div key={dir.id} className="col-12 col-md-6">
            <div
              className="card h-100 p-3 position-relative"
              style={{
                borderRadius: 'var(--sm-radius-md)',
                border: dir.esPredeterminada ? '2px solid var(--sm-primary)' : '1px solid var(--sm-border)',
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-house-door text-primary" />
                  {dir.alias}
                </h3>
                {dir.esPredeterminada ? (
                  <span className="badge bg-primary text-white" style={{ fontSize: '0.7rem' }}>
                    Predeterminada
                  </span>
                ) : (
                  <Button variant="link" size="sm" className="p-0 small" onClick={() => predeterminarDir(dir.id)}>
                    Hacer predeterminada
                  </Button>
                )}
              </div>

              <p className="small mb-1 text-dark">
                <strong>Dirección:</strong> {dir.direccionPostal}
              </p>
              <p className="small mb-1 text-muted">
                {dir.distrito}, {dir.provincia}, {dir.departamento}
              </p>
              {dir.referencia && <p className="small mb-2 text-muted fst-italic">Ref: {dir.referencia}</p>}

              <div className="mt-auto pt-2 border-top d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<i className="bi bi-pencil" />}
                  onClick={() => { setDirAEditar(dir); setModalAbierto(true); }}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  icon={<i className="bi bi-trash" />}
                  onClick={() => eliminarDir(dir.id)}
                  aria-label={`Eliminar dirección ${dir.alias}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <DireccionModal
        show={modalAbierto}
        clienteId="me"
        direccionEditar={dirAEditar}
        onCerrar={() => { setModalAbierto(false); setDirAEditar(null); }}
      />
    </div>
  );
}
