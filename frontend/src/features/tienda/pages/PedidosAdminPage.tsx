import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { Pagination } from '../../../components/ui/Pagination';
import { StatusBadge, estadoPedidoAEstado } from '../../../components/ui/StatusBadge';
import { usePedidos, useActualizarEstadoPedido } from '../hooks/usePedidos';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { formatearMoneda, formatearFechaHora } from '../../../lib/format';
import { PedidosAdminFilters } from '../components/PedidosAdminFilters';
import { PedidoDetalleModal } from '../components/PedidoDetalleModal';
import type { Pedido, EstadoPedido } from '../types';

/**
 * Gestión Administrativa de Pedidos de E-commerce (SRP / SOLID / Bloque A).
 * Permite a Vendedores y Administradores aprobar pagos, monitorear almacén y auditar entregas.
 */
export function PedidosAdminPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const esAdminOVendedor = !!usuario && ['ADMINISTRADOR', 'VENDEDOR'].includes(usuario.rol);

  const [pagina, setPagina] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaCodigo, setBusquedaCodigo] = useState('');

  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);
  const [accionConfirmacion, setAccionConfirmacion] = useState<{
    pedido: Pedido;
    nuevoEstado: EstadoPedido;
    titulo: string;
    descripcion: string;
    tono?: 'danger' | 'primary';
  } | null>(null);

  const { data, isLoading, isError, refetch } = usePedidos({
    estado: estadoFiltro,
    cliente: busquedaCliente,
    codigo: busquedaCodigo,
    page: pagina,
  });

  const { mutate: actualizarEstado, isPending: actualizando } = useActualizarEstadoPedido();

  const handleConfirmarCambio = () => {
    if (!accionConfirmacion) return;
    const { pedido, nuevoEstado } = accionConfirmacion;
    actualizarEstado(
      { id: pedido.id, estado: nuevoEstado },
      {
        onSuccess: (pedidoActualizado) => {
          setAccionConfirmacion(null);
          if (pedidoDetalle?.id === pedido.id) {
            setPedidoDetalle(pedidoActualizado);
          }
        },
      },
    );
  };

  const columnas: ColumnaTabla<Pedido>[] = [
    {
      encabezado: (
        <span className="d-inline-flex align-items-center">
          Código
          {data?.total !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal">
              {data.total} {data.total === 1 ? 'pedido' : 'pedidos'}
            </span>
          )}
        </span>
      ),
      celda: (p) => <span className="font-monospace fw-bold text-primary">{p.codigo}</span>,
    },
    {
      encabezado: 'Fecha',
      celda: (p) => <span className="small text-muted">{formatearFechaHora(p.fecha)}</span>,
    },
    {
      encabezado: 'Cliente',
      celda: (p) => (
        <div>
          <div className="fw-medium text-dark small">{p.contacto.nombres} {p.contacto.apellidos}</div>
          <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{p.contacto.email}</div>
        </div>
      ),
    },
    {
      encabezado: 'Modalidad',
      celda: (p) => (
        <span className="small">
          {p.modalidadEntrega === 'envio' ? (
            <span><i className="bi bi-truck me-1 text-muted" />Envío</span>
          ) : (
            <span><i className="bi bi-shop me-1 text-muted" />Recojo</span>
          )}
        </span>
      ),
    },
    {
      encabezado: 'Total',
      className: 'text-end',
      celda: (p) => (
        <span className="fw-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatearMoneda(p.importeTotal)}
        </span>
      ),
    },
    {
      encabezado: 'Estado',
      className: 'text-center',
      celda: (p) => <StatusBadge estado={estadoPedidoAEstado(p.estado)} />,
    },
  ];

  const acciones: AccionFila<Pedido>[] = [
    {
      etiqueta: 'Ver detalle',
      icono: 'bi-eye',
      variante: 'normal',
      onClick: (p) => setPedidoDetalle(p),
    },
  ];

  const limpiarFiltros = () => {
    setEstadoFiltro('');
    setBusquedaCliente('');
    setBusquedaCodigo('');
    setPagina(1);
  };

  return (
    <div>
      <PageHeader
        titulo="Gestión de Pedidos de Tienda"
        descripcion="Seguimiento comercial, aprobación de pagos y sincronización con almacén e inventario."
      />

      <PedidosAdminFilters
        estadoFiltro={estadoFiltro}
        onEstadoChange={(v) => { setEstadoFiltro(v); setPagina(1); }}
        busquedaCliente={busquedaCliente}
        onBusquedaClienteChange={(v) => { setBusquedaCliente(v); setPagina(1); }}
        busquedaCodigo={busquedaCodigo}
        onBusquedaCodigoChange={(v) => { setBusquedaCodigo(v); setPagina(1); }}
        onLimpiar={limpiarFiltros}
      />

      {isLoading ? (
        <LoadingState etiqueta="Cargando pedidos…" />
      ) : isError ? (
        <ErrorState mensaje="No se pudieron cargar los pedidos." onReintentar={refetch} />
      ) : (data?.datos.length ?? 0) === 0 ? (
        <EmptyState
          icono="bi-receipt"
          titulo="No se encontraron pedidos"
          descripcion="No hay pedidos con los criterios especificados. Prueba con otros filtros."
        />
      ) : (
        <div
          className="card border shadow-sm"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--sm-border)',
            borderRadius: 'var(--sm-radius-md, 8px)',
            overflow: 'hidden',
          }}
        >
          <DataTable
            columnas={columnas}
            datos={data?.datos ?? []}
            keyExtractor={(p) => p.id}
            acciones={acciones}
          />
          {data && data.totalPaginas > 1 && (
            <div className="p-3 border-top">
              <Pagination
                paginaActual={pagina}
                totalPaginas={data.totalPaginas}
                totalItems={data.total}
                itemsPorPagina={10}
                onCambiarPagina={setPagina}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalle */}
      <PedidoDetalleModal
        pedido={pedidoDetalle}
        onCerrar={() => setPedidoDetalle(null)}
        onSolicitarCambioEstado={(pedido, nuevoEstado, titulo, descripcion, tono) =>
          setAccionConfirmacion({ pedido, nuevoEstado, titulo, descripcion, tono })
        }
        esAdminOVendedor={esAdminOVendedor}
      />

      {/* Diálogo de Confirmación */}
      {accionConfirmacion && (
        <ConfirmDialog
          show={!!accionConfirmacion}
          titulo={accionConfirmacion.titulo}
          descripcion={accionConfirmacion.descripcion}
          textoConfirmar="Confirmar"
          tono={accionConfirmacion.tono === 'danger' ? 'danger' : 'primary'}
          onConfirmar={handleConfirmarCambio}
          onCancelar={() => setAccionConfirmacion(null)}
          cargando={actualizando}
        />
      )}
    </div>
  );
}
