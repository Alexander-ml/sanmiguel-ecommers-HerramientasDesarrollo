import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { VentasTable } from './VentasTable';
import { VentasFilters } from './VentasFilters';
import { useVentas, useCancelarVenta, useConfirmarPago } from '../hooks/useVentas';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type { Venta } from '../types';

/** Pestaña "Listado de Ventas" (RF-VENT-013 a 017). Autocontenida. */
export function VentasListadoTab() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const esAdmin = usuario?.rol === 'ADMINISTRADOR';

  const [cliente, setCliente] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [pagina, setPagina] = useState(1);

  // Vendedor: filtra solo sus propias ventas (admin ve todas)
  const vendedorId = esAdmin ? '' : String(usuario?.id ?? '');

  const { data, isLoading, isError, refetch } = useVentas({
    cliente,
    estado,
    fechaDesde,
    fechaHasta,
    vendedorId,
    page: pagina,
  });

  const { mutate: cancelar, isPending: cancelando } = useCancelarVenta();
  const { mutate: confirmarPago, isPending: confirmando } = useConfirmarPago();

  const [ventaACancelar, setVentaACancelar] = useState<Venta | null>(null);
  const [ventaAConfirmar, setVentaAConfirmar] = useState<Venta | null>(null);

  return (
    <div>
      <VentasFilters
        cliente={cliente}
        estado={estado}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onClienteChange={(v) => { setCliente(v); setPagina(1); }}
        onEstadoChange={(v) => { setEstado(v); setPagina(1); }}
        onFechaDesdeChange={(v) => { setFechaDesde(v); setPagina(1); }}
        onFechaHastaChange={(v) => { setFechaHasta(v); setPagina(1); }}
        acciones={
          <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => navigate('/admin/ventas/nueva')}>
            Nueva venta
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando ventas…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar las ventas." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-receipt"
            titulo={cliente || estado || fechaDesde ? 'Sin resultados' : 'Aún no hay ventas registradas'}
            descripcion={
              cliente || estado || fechaDesde
                ? 'Ninguna venta coincide con los filtros aplicados.'
                : 'Registra la primera venta del negocio.'
            }
            accion={
              !cliente && !estado && !fechaDesde ? (
                <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => navigate('/admin/ventas/nueva')}>
                  Nueva venta
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <VentasTable
              ventas={data.datos}
              totalVentas={data.total}
              onVerDetalle={(v) => navigate(`/admin/ventas/${v.id}`)}
              onCancelar={(v) => setVentaACancelar(v)}
              onConfirmarPago={(v) => setVentaAConfirmar(v)}
            />
            <Pagination
              paginaActual={pagina}
              totalPaginas={data.totalPaginas}
              totalItems={data.total}
              itemsPorPagina={10}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <ConfirmDialog
        show={ventaACancelar !== null}
        titulo="Cancelar venta"
        descripcion={`¿Cancelar la venta V-${String(ventaACancelar?.id ?? '').padStart(4, '0')} de ${ventaACancelar?.clienteNombre}? Si estaba confirmada, el stock se revertirá automáticamente.`}
        textoConfirmar="Cancelar venta"
        tono="danger"
        cargando={cancelando}
        onConfirmar={() => {
          if (!ventaACancelar) return;
          cancelar(ventaACancelar.id, { onSuccess: () => setVentaACancelar(null) });
        }}
        onCancelar={() => setVentaACancelar(null)}
      />

      <ConfirmDialog
        show={ventaAConfirmar !== null}
        titulo="Confirmar pago"
        descripcion={`¿Confirmar el pago de la venta V-${String(ventaAConfirmar?.id ?? '').padStart(4, '0')} (${ventaAConfirmar?.clienteNombre})? Esta acción generará el comprobante y actualizará el stock.`}
        textoConfirmar="Confirmar pago"
        tono="primary"
        cargando={confirmando}
        onConfirmar={() => {
          if (!ventaAConfirmar) return;
          confirmarPago({ id: ventaAConfirmar.id }, { onSuccess: () => setVentaAConfirmar(null) });
        }}
        onCancelar={() => setVentaAConfirmar(null)}
      />
    </div>
  );
}
