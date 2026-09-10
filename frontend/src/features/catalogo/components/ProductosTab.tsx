import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import { ProductoTable } from './ProductoTable';
import { ProductoFilters } from './ProductoFilters';
import { useProductos, useBajaProducto } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { ProductoModal } from './ProductoModal';
import type { Producto } from '../types';

/**
 * Pestaña "Productos" del módulo Catálogo (RF-INV-001 a 004).
 * Autocontenida: su propio estado de búsqueda/filtros/paginación/modal — no depende de la
 * página que la aloje. Se usa desde `ProductosPage` (ruta /admin/productos).
 */
export function ProductosTab() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const { data, isLoading, isError, refetch } = useProductos({ busqueda, categoriaId, estado, page: pagina });
  const { data: dataCategorias } = useCategorias({});

  const { mutate: darBaja, isPending: dandoBaja } = useBajaProducto();
  const [productoABaja, setProductoABaja] = useState<Producto | null>(null);

  const sinFiltros = !busqueda && !categoriaId && !estado;
  const totalProductos = data?.total ?? 0;

  return (
    <div>
      <ProductoFilters
        busqueda={busqueda}
        categoriaId={categoriaId}
        estado={estado}
        categorias={dataCategorias?.datos ?? []}
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        onCategoriaChange={(v) => { setCategoriaId(v); setPagina(1); }}
        onEstadoChange={(v) => { setEstado(v); setPagina(1); }}
        acciones={
          <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => setMostrarModalNuevo(true)}>
            Nuevo producto
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando productos…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar los productos." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-box-seam"
            titulo={sinFiltros ? 'Aún no hay productos' : 'Sin resultados'}
            descripcion={
              sinFiltros
                ? 'Empieza creando el primer producto del catálogo.'
                : 'Ningún producto coincide con los filtros aplicados.'
            }
            accion={
              sinFiltros ? (
                <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={() => navigate('/admin/productos/nuevo')}>
                  Crear primer producto
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <ProductoTable
              productos={data.datos}
              totalProductos={totalProductos}
              onEditar={(p) => navigate(`/admin/productos/${p.id}/editar`)}
              onVariantes={(p) => navigate(`/admin/productos/${p.id}/variantes`)}
              onBaja={(p) => setProductoABaja(p)}
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

      <ProductoModal
        show={mostrarModalNuevo}
        onCerrar={() => setMostrarModalNuevo(false)}
        onGuardado={(p) => {
          refetch();
          navigate(`/admin/productos/${p.id}/variantes`);
        }}
      />

      <ConfirmDialog
        show={productoABaja !== null}
        titulo="Dar de baja producto"
        descripcion={`¿Dar de baja "${productoABaja?.nombre}"? El producto quedará inactivo y no se mostrará en el catálogo ni en la tienda. El historial de movimientos y ventas se conserva.`}
        textoConfirmar="Dar de baja"
        tono="danger"
        cargando={dandoBaja}
        onConfirmar={() => {
          if (!productoABaja) return;
          darBaja(productoABaja.id, { onSuccess: () => setProductoABaja(null) });
        }}
        onCancelar={() => setProductoABaja(null)}
      />
    </div>
  );
}
