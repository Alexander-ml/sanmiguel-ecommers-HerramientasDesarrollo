import { useState } from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { FiltersBar } from '../../../components/ui/FiltersBar';
import { Button } from '../../../components/ui/Button';
import { UsuariosTable } from './UsuariosTable';
import { UsuarioModal } from './UsuarioModal';
import { useUsuarios, useCambiarEstadoUsuario, useResetPassword } from '../hooks/useUsuarios';
import type { UsuarioInterno } from '../types';

/** Pestaña "Personal Interno" (RF-USR-001 a 004). Autocontenida. */
export function UsuariosTab() {
  const [busqueda, setBusqueda] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data: dataUsuarios, isLoading, isError, refetch } = useUsuarios({
    busqueda,
    rol: rolFiltro,
    estado: estadoFiltro,
    page: pagina,
  });

  const [usuarioEditar, setUsuarioEditar] = useState<UsuarioInterno | null>(null);
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [usuarioACambiar, setUsuarioACambiar] = useState<UsuarioInterno | null>(null);
  const [usuarioAReset, setUsuarioAReset] = useState<UsuarioInterno | null>(null);

  const { mutate: cambiarEstado, isPending: cambiandoEstado } = useCambiarEstadoUsuario();
  const { mutate: resetPassword, isPending: reseteando } = useResetPassword();

  const abrirNuevo = () => {
    setUsuarioEditar(null);
    setMostrarModalUsuario(true);
  };

  const handleConfirmarCambioEstado = () => {
    if (!usuarioACambiar) return;
    const nuevo = usuarioACambiar.estado === 'activo' ? 'inactivo' : 'activo';
    cambiarEstado({ id: usuarioACambiar.id, estado: nuevo }, { onSuccess: () => setUsuarioACambiar(null) });
  };

  const handleConfirmarReset = () => {
    if (!usuarioAReset) return;
    resetPassword(usuarioAReset.id, { onSuccess: () => setUsuarioAReset(null) });
  };

  return (
    <div>
      <FiltersBar
        busqueda={busqueda}
        placeholderBusqueda="Buscar por nombres, apellidos o correo corporativo…"
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        filtros={[
          {
            nombre: 'Todos los roles',
            opciones: [
              { valor: 'ADMINISTRADOR', etiqueta: 'Administrador' },
              { valor: 'ALMACENERO', etiqueta: 'Almacenero' },
              { valor: 'VENDEDOR', etiqueta: 'Vendedor' },
            ],
            valor: rolFiltro,
            onChange: (v) => { setRolFiltro(v); setPagina(1); },
          },
          {
            nombre: 'Todos los estados',
            opciones: [
              { valor: 'activo', etiqueta: 'Activos' },
              { valor: 'inactivo', etiqueta: 'Inactivos' },
            ],
            valor: estadoFiltro,
            onChange: (v) => { setEstadoFiltro(v); setPagina(1); },
          },
        ]}
        acciones={
          <Button size="sm" icon={<i className="bi bi-person-plus" />} onClick={abrirNuevo}>
            Nuevo usuario interno
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando personal interno…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar los usuarios del sistema." onReintentar={refetch} />}

      {!isLoading && !isError && dataUsuarios && (
        dataUsuarios.datos.length === 0 ? (
          <EmptyState
            icono="bi-people"
            titulo="Sin usuarios encontrados"
            descripcion="Ningún usuario interno coincide con los filtros aplicados."
          />
        ) : (
          <>
            <UsuariosTable
              usuarios={dataUsuarios.datos}
              totalUsuarios={dataUsuarios.total}
              onEditar={(u) => { setUsuarioEditar(u); setMostrarModalUsuario(true); }}
              onCambiarEstado={(u) => setUsuarioACambiar(u)}
              onResetPassword={(u) => setUsuarioAReset(u)}
            />
            <Pagination
              paginaActual={pagina}
              totalPaginas={dataUsuarios.totalPaginas}
              totalItems={dataUsuarios.total}
              itemsPorPagina={10}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <UsuarioModal
        show={mostrarModalUsuario}
        usuarioEditar={usuarioEditar}
        onCerrar={() => { setMostrarModalUsuario(false); setUsuarioEditar(null); }}
      />

      <ConfirmDialog
        show={usuarioACambiar !== null}
        titulo={usuarioACambiar?.estado === 'activo' ? 'Desactivar usuario interno' : 'Activar usuario interno'}
        descripcion={
          usuarioACambiar?.estado === 'activo'
            ? `¿Estás seguro de desactivar a "${usuarioACambiar?.nombres} ${usuarioACambiar?.apellidos}"? El usuario no podrá volver a autenticarse y todas sus sesiones activas quedarán revocadas de inmediato.`
            : `¿Activar la cuenta de "${usuarioACambiar?.nombres} ${usuarioACambiar?.apellidos}"? Podrá volver a iniciar sesión con su rol asignado.`
        }
        textoConfirmar="Confirmar"
        tono={usuarioACambiar?.estado === 'activo' ? 'danger' : 'primary'}
        cargando={cambiandoEstado}
        onConfirmar={handleConfirmarCambioEstado}
        onCancelar={() => setUsuarioACambiar(null)}
      />

      <ConfirmDialog
        show={usuarioAReset !== null}
        titulo="Restablecer contraseña"
        descripcion={`¿Deseas restablecer la contraseña de "${usuarioAReset?.correo}" a la clave temporal por defecto ("demo1234")? Se revocarán todas sus sesiones activas previas.`}
        textoConfirmar="Restablecer contraseña"
        tono="primary"
        cargando={reseteando}
        onConfirmar={handleConfirmarReset}
        onCancelar={() => setUsuarioAReset(null)}
      />
    </div>
  );
}
