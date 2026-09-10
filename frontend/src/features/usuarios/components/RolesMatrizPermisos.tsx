import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { useRoles, usePermisos, useActualizarPermisosRol } from '../hooks/useUsuarios';

export function RolesMatrizPermisos() {
  const { data: roles, isLoading: cargandoRoles } = useRoles();
  const { data: permisos, isLoading: cargandoPermisos } = usePermisos();
  const { mutate: guardarPermisos, isPending: guardando } = useActualizarPermisosRol();

  const [rolSeleccionadoId, setRolSeleccionadoId] = useState<string>('ALMACENERO');
  const [permisosActivos, setPermisosActivos] = useState<string[]>([]);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const rolActual = roles?.find((r) => r.id === rolSeleccionadoId);

  useEffect(() => {
    if (rolActual) {
      setPermisosActivos(rolActual.permisos);
      setMensajeExito(null);
    }
  }, [rolActual]);

  if (cargandoRoles || cargandoPermisos) {
    return <div className="text-center py-4 text-muted">Cargando matriz de permisos…</div>;
  }

  // Agrupar permisos por módulo
  const modulos = Array.from(new Set(permisos?.map((p) => p.modulo) ?? []));

  const handleTogglePermiso = (permisoId: string) => {
    if (rolActual?.id === 'ADMINISTRADOR') return; // Administrador siempre tiene todos
    setPermisosActivos((prev) =>
      prev.includes(permisoId) ? prev.filter((id) => id !== permisoId) : [...prev, permisoId],
    );
  };

  const handleGuardar = () => {
    if (!rolActual) return;
    guardarPermisos(
      { rolId: rolActual.id, permisos: permisosActivos },
      {
        onSuccess: () => {
          setMensajeExito(`Permisos del rol "${rolActual.nombre}" actualizados exitosamente.`);
        },
      },
    );
  };

  return (
    <div>
      <div
        className="card border shadow-sm p-4"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 className="h5 fw-bold mb-1 text-dark">Matriz de Roles y Autorización Granular</h2>
            <p className="text-muted small mb-0">
              Habilita o deshabilita acciones específicas por módulo para cada rol interno.
            </p>
          </div>

          {/* Selector de Rol */}
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="rol-sel" className="small fw-medium text-dark">Rol:</label>
            <select
              id="rol-sel"
              className="form-select form-select-sm bg-white border"
              style={{ width: 220 }}
              value={rolSeleccionadoId}
              onChange={(e) => setRolSeleccionadoId(e.target.value)}
            >
              {roles?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {rolActual && (
          <div
            className="p-3 rounded mb-4 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: 'var(--sm-bone, #f8fafc)',
              border: '1px solid var(--sm-border, #e2e8f0)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div>
              <div className="fw-semibold small text-primary">{rolActual.nombre}</div>
              <div className="text-muted small">{rolActual.descripcion}</div>
            </div>
            <span className="badge bg-primary text-white" style={{ fontSize: '0.75rem' }}>
              {permisosActivos.length} permisos activos
            </span>
          </div>
        )}

        {mensajeExito && (
          <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle fs-5" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Matriz por Módulos */}
        <div className="row g-4">
          {modulos.map((modulo) => {
            const permisosModulo = permisos?.filter((p) => p.modulo === modulo) ?? [];
            return (
              <div key={modulo} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 p-3"
                  style={{
                    borderRadius: 'var(--sm-radius-md, 8px)',
                    border: '1px solid var(--sm-border)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <h3 className="h6 fw-bold mb-3 d-flex align-items-center justify-content-between text-dark">
                    <span>
                      <i className="bi bi-folder2-open me-2 text-primary" />
                      {modulo}
                    </span>
                    <span className="badge bg-light text-muted border" style={{ fontSize: '0.7rem' }}>
                      {permisosModulo.filter((p) => permisosActivos.includes(p.id)).length} / {permisosModulo.length}
                    </span>
                  </h3>

                  <div className="d-flex flex-column gap-2">
                    {permisosModulo.map((permiso) => {
                      const activo = permisosActivos.includes(permiso.id);
                      const disabled = rolActual?.id === 'ADMINISTRADOR';

                      return (
                        <label
                          key={permiso.id}
                          className={`d-flex align-items-start gap-2 p-2 rounded small border ${
                            activo ? 'bg-primary-subtle border-primary-subtle' : 'bg-light border-light'
                          }`}
                          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input mt-1 flex-shrink-0"
                            checked={activo}
                            disabled={disabled}
                            onChange={() => handleTogglePermiso(permiso.id)}
                          />
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.8rem' }}>
                              {permiso.accion}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                              {permiso.descripcion}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {rolActual?.id !== 'ADMINISTRADOR' && (
          <div className="mt-4 pt-3 border-top d-flex justify-content-end">
            <Button
              disabled={guardando}
              isLoading={guardando}
              loadingText="Guardando cambios…"
              icon={<i className="bi bi-check2-circle" />}
              onClick={handleGuardar}
            >
              Guardar matriz de permisos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
