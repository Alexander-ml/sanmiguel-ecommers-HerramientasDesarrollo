import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { FiltersBar } from '../../../components/ui/FiltersBar';
import { Button } from '../../../components/ui/Button';
import { OrdenesTable } from './OrdenesTable';
import { RecepcionModal } from './RecepcionModal';
import { NuevaOrdenCompraModal } from './NuevaOrdenCompraModal';
import { useCompras, useCancelarCompra } from '../hooks/useCompras';
import type { OrdenCompra } from '../types';

/** Pestaña "Órdenes de Compra" (RF-COM-005 a 010, 013). Autocontenida. */
export function OrdenesTab() {
  const navigate = useNavigate();

  const [estado, setEstado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [pagina, setPagina] = useState(1);
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);

  const { data, isLoading, isError, refetch } = useCompras({ estado, codigo, page: pagina });
  const { mutate: cancelar, isPending: cancelando } = useCancelarCompra();

  const [ordenACancelar, setOrdenACancelar] = useState<OrdenCompra | null>(null);
  const [ordenARecepcionar, setOrdenARecepcionar] = useState<OrdenCompra | null>(null);

  const sinFiltros = !codigo && !estado;

  return (
    <div>
      <FiltersBar
        etiquetaBusqueda="Buscar orden de compra"
        busqueda={codigo}
        placeholderBusqueda="ej. OC-2026-001, Proveedor…"
        onBusquedaChange={(v) => { setCodigo(v); setPagina(1); }}
        filtros={[
          {
            nombre: 'Todos los estados',
            etiqueta: 'Estado de la orden',
            opciones: [
              { valor: 'PENDIENTE', etiqueta: 'Pendientes' },
              { valor: 'PARCIALMENTE_RECIBIDA', etiqueta: 'Parcialmente recibidas' },
              { valor: 'RECIBIDA', etiqueta: 'Recibidas' },
              { valor: 'CANCELADA', etiqueta: 'Canceladas' },
            ],
            valor: estado,
            onChange: (v) => { setEstado(v); setPagina(1); },
          },
        ]}
        acciones={
          <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => setMostrarModalNueva(true)}>
            Nueva orden de compra
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando órdenes de compra…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar las órdenes de compra." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-receipt-cutoff"
            titulo={sinFiltros ? 'Aún no hay órdenes de compra' : 'Sin resultados'}
            descripcion={
              sinFiltros
                ? 'Registra la primera orden para abastecer el almacén con mercadería.'
                : 'Ninguna orden de compra coincide con los filtros aplicados.'
            }
            accion={
              sinFiltros ? (
                <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => setMostrarModalNueva(true)}>
                  Crear primera orden de compra
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <OrdenesTable
              ordenes={data.datos}
              totalOrdenes={data.total}
              onVerDetalle={(o) => navigate(`/admin/compras/${o.id}`)}
              onEditar={(o) => navigate(`/admin/compras/${o.id}/editar`)}
              onRecepcionar={setOrdenARecepcionar}
              onCancelar={setOrdenACancelar}
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

      <NuevaOrdenCompraModal
        show={mostrarModalNueva}
        onCerrar={() => setMostrarModalNueva(false)}
        onGuardado={() => refetch()}
      />

      <RecepcionModal show={ordenARecepcionar !== null} orden={ordenARecepcionar} onCerrar={() => setOrdenARecepcionar(null)} />

      <ConfirmDialog
        show={ordenACancelar !== null}
        titulo="Cancelar orden de compra"
        descripcion={`¿Estás seguro de cancelar la orden ${ordenACancelar?.codigo} con el proveedor ${ordenACancelar?.proveedorNombre}? Esta acción no se puede deshacer.`}
        textoConfirmar="Cancelar orden"
        tono="danger"
        cargando={cancelando}
        onConfirmar={() => {
          if (!ordenACancelar) return;
          cancelar(ordenACancelar.id, { onSuccess: () => setOrdenACancelar(null) });
        }}
        onCancelar={() => setOrdenACancelar(null)}
      />
    </div>
  );
}
