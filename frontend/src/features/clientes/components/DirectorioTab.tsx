import { useState } from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { FiltersBar } from '../../../components/ui/FiltersBar';
import { ClientesTable } from './ClientesTable';
import { ClienteDetalleModal } from './ClienteDetalleModal';
import { useClientes, useCambiarEstadoCliente } from '../hooks/useClientes';
import type { Cliente } from '../types';

/** Pestaña "Directorio de Clientes" (RF-CLI-011, RN-CLI-03). Autocontenida. */
export function DirectorioTab() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [segmento, setSegmento] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data: dataClientes, isLoading, isError, refetch } = useClientes({ busqueda, estado, segmento, page: pagina });
  const { mutate: cambiarEstado, isPending: cambiandoEstado } = useCambiarEstadoCliente();

  const [clienteACambiar, setClienteACambiar] = useState<Cliente | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const handleConfirmarCambioEstado = () => {
    if (!clienteACambiar) return;
    const nuevoEstado = clienteACambiar.estado === 'activo' ? 'inactivo' : 'activo';
    cambiarEstado({ id: clienteACambiar.id, estado: nuevoEstado }, { onSuccess: () => setClienteACambiar(null) });
  };

  return (
    <div>
      <FiltersBar
        busqueda={busqueda}
        placeholderBusqueda="Buscar por nombre, correo o documento…"
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        filtros={[
          {
            nombre: 'Todos los estados',
            opciones: [
              { valor: 'activo', etiqueta: 'Activos' },
              { valor: 'inactivo', etiqueta: 'Inactivos' },
            ],
            valor: estado,
            onChange: (v) => { setEstado(v); setPagina(1); },
          },
          {
            nombre: 'Todos los segmentos',
            opciones: [
              { valor: 'VIP', etiqueta: 'VIP / Leal' },
              { valor: 'FRECUENTE', etiqueta: 'Frecuente' },
              { valor: 'EN_RIESGO', etiqueta: 'En riesgo' },
              { valor: 'INACTIVO', etiqueta: 'Inactivo' },
              { valor: 'NUEVO', etiqueta: 'Nuevo comprador' },
            ],
            valor: segmento,
            onChange: (v) => { setSegmento(v); setPagina(1); },
          },
        ]}
      />

      {isLoading && <LoadingState etiqueta="Cargando compradores…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar los datos de clientes." onReintentar={refetch} />}

      {!isLoading && !isError && dataClientes && (
        dataClientes.datos.length === 0 ? (
          <EmptyState
            icono="bi-people"
            titulo="Sin clientes encontrados"
            descripcion="Ningún comprador coincide con los criterios de búsqueda seleccionados."
          />
        ) : (
          <>
            <ClientesTable
              clientes={dataClientes.datos}
              totalClientes={dataClientes.total}
              onVerDetalle={(c) => setClienteSeleccionado(c)}
              onCambiarEstado={(c) => setClienteACambiar(c)}
            />
            <Pagination
              paginaActual={pagina}
              totalPaginas={dataClientes.totalPaginas}
              totalItems={dataClientes.total}
              itemsPorPagina={10}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <ClienteDetalleModal show={clienteSeleccionado !== null} cliente={clienteSeleccionado} onCerrar={() => setClienteSeleccionado(null)} />

      <ConfirmDialog
        show={clienteACambiar !== null}
        titulo={clienteACambiar?.estado === 'activo' ? 'Desactivar cuenta de cliente' : 'Activar cuenta de cliente'}
        descripcion={`¿Estás seguro de cambiar el estado de "${clienteACambiar?.nombres} ${clienteACambiar?.apellidos}" a ${clienteACambiar?.estado === 'activo' ? 'inactivo' : 'activo'}?`}
        textoConfirmar="Confirmar cambio"
        tono={clienteACambiar?.estado === 'activo' ? 'danger' : 'primary'}
        cargando={cambiandoEstado}
        onConfirmar={handleConfirmarCambioEstado}
        onCancelar={() => setClienteACambiar(null)}
      />
    </div>
  );
}
