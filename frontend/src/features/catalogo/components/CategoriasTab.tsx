import { useState } from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { FiltersBar } from '../../../components/ui/FiltersBar';
import { Pagination } from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import { CategoriaTable } from './CategoriaTable';
import { CategoriaForm } from './CategoriaForm';
import { useCategorias, useBajaCategoria } from '../hooks/useCategorias';
import type { Categoria } from '../types';

/**
 * Pestaña "Categorías" del módulo Catálogo (RF-INV-009 a 012).
 * Autocontenida — mismo criterio que ProductosTab.
 */
export function CategoriasTab() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data, isLoading, isError, refetch } = useCategorias({ busqueda, activo: estado, page: pagina });
  const { mutate: darBaja, isPending: dandoBaja } = useBajaCategoria();

  const [categoriaABaja, setCategoriaABaja] = useState<Categoria | null>(null);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const totalCategorias = data?.total ?? 0;

  const abrirNueva = () => {
    setCategoriaEditar(null);
    setMostrarModal(true);
  };

  return (
    <div>
      <FiltersBar
        etiquetaBusqueda="Buscar categoría por nombre"
        busqueda={busqueda}
        placeholderBusqueda="ej. Camisas, Pantalones, Formal…"
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        filtros={[
          {
            nombre: 'Todos los estados',
            etiqueta: 'Estado de categoría',
            opciones: [
              { valor: 'true', etiqueta: 'Activas' },
              { valor: 'false', etiqueta: 'Inactivas' },
            ],
            valor: estado,
            onChange: (v) => { setEstado(v); setPagina(1); },
          },
        ]}
        acciones={
          <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={abrirNueva}>
            Nueva categoría
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando categorías…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar las categorías." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-tags"
            titulo={busqueda || estado ? 'Sin resultados' : 'Aún no hay categorías'}
            descripcion={
              busqueda || estado
                ? 'Ninguna categoría coincide con la búsqueda.'
                : 'Crea la primera categoría para organizar el catálogo de prendas.'
            }
            accion={
              !busqueda && !estado ? (
                <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={abrirNueva}>
                  Crear primera categoría
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <CategoriaTable
              categorias={data.datos}
              totalCategorias={totalCategorias}
              onEditar={(c) => { setCategoriaEditar(c); setMostrarModal(true); }}
              onBaja={(c) => setCategoriaABaja(c)}
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

      <CategoriaForm
        show={mostrarModal}
        categoriaEditar={categoriaEditar}
        onCerrar={() => { setMostrarModal(false); setCategoriaEditar(null); }}
      />

      <ConfirmDialog
        show={categoriaABaja !== null}
        titulo="Dar de baja categoría"
        descripcion={`¿Dar de baja la categoría "${categoriaABaja?.nombre}"? No estará disponible para nuevos productos. Solo es posible si no tiene productos activos.`}
        textoConfirmar="Dar de baja"
        tono="danger"
        cargando={dandoBaja}
        onConfirmar={() => {
          if (!categoriaABaja) return;
          darBaja(categoriaABaja.id, { onSuccess: () => setCategoriaABaja(null) });
        }}
        onCancelar={() => setCategoriaABaja(null)}
      />
    </div>
  );
}
