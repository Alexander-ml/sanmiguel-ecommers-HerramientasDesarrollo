import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  useCategoriasFeatured,
  useProductosPublico,
} from '../hooks/useTiendaCatalogo';
import { useCarritoStore, selectTotalItems } from '../../carrito/store/carritoStore';
import { FiltrosTienda } from '../components/FiltrosTienda';
import { OrdenamientoSelector, type TipoOrden } from '../components/OrdenamientoSelector';
import { GrillaProductos } from '../components/GrillaProductos';
import { ModalSeleccionRapida } from '../components/ModalSeleccionRapida';
import type { Producto } from '../../catalogo/types';

function CarritoFlotante() {
  const total = useCarritoStore(selectTotalItems);
  if (total === 0) return null;
  return (
    <Link
      to="/carrito"
      className="btn btn-lg d-flex align-items-center gap-2 shadow-lg"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: 'var(--sm-primary)',
        borderColor: 'var(--sm-primary)',
        color: '#fff',
        borderRadius: 50,
        zIndex: 1030,
        padding: '0.75rem 1.5rem',
      }}
      aria-label={`Ver carrito con ${total} prendas`}
    >
      <i className="bi bi-bag-check-fill" />
      <span className="fw-semibold">{total} en carrito</span>
    </Link>
  );
}

/**
 * Página de Exploración de Colecciones y Catálogo (SRP / SOLID / Bloque A).
 * Orquesta filtros, ordenamiento, grilla de prendas y modal de compra rápida.
 */
export function ColeccionesPage() {
  const { categoriaId: paramUrlCatId } = useParams<{ categoriaId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryBusqueda = searchParams.get('busqueda') ?? '';
  const queryCatId = searchParams.get('categoriaId') ?? paramUrlCatId ?? '';

  const [catActiva, setCatActiva] = useState(queryCatId);
  const [busqueda, setBusqueda] = useState(queryBusqueda);
  const [orden, setOrden] = useState<TipoOrden>('recientes');
  const [pagina, setPagina] = useState(1);
  const [productoRapido, setProductoRapido] = useState<Producto | null>(null);

  useEffect(() => {
    if (queryBusqueda !== busqueda) setBusqueda(queryBusqueda);
  }, [queryBusqueda]);

  useEffect(() => {
    if (queryCatId !== catActiva) setCatActiva(queryCatId);
  }, [queryCatId]);

  const { data: categorias } = useCategoriasFeatured();
  const { data: productosData, isLoading } = useProductosPublico({
    categoriaId: catActiva,
    busqueda,
    page: pagina,
  });

  const handleCat = (id: string) => {
    setCatActiva(id);
    setPagina(1);
    const nuevoQuery = new URLSearchParams(searchParams);
    if (id) nuevoQuery.set('categoriaId', id);
    else nuevoQuery.delete('categoriaId');
    setSearchParams(nuevoQuery);
  };

  const handleBusqueda = (v: string) => {
    setBusqueda(v);
    setPagina(1);
    const nuevoQuery = new URLSearchParams(searchParams);
    if (v.trim()) nuevoQuery.set('busqueda', v.trim());
    else nuevoQuery.delete('busqueda');
    setSearchParams(nuevoQuery);
  };

  const limpiarFiltros = () => {
    setCatActiva('');
    setBusqueda('');
    setPagina(1);
    setSearchParams({});
  };

  const catNombre = (categorias ?? []).find((c) => String(c.id) === catActiva)?.nombre;

  // Ordenamiento local sobre los datos de la página actual
  const productosOrdenados = [...(productosData?.datos ?? [])].sort((a, b) => {
    if (orden === 'precio-asc') return a.precioBase - b.precioBase;
    if (orden === 'precio-desc') return b.precioBase - a.precioBase;
    return b.id - a.id;
  });

  return (
    <>
      {/* Encabezado con tokens institucionales */}
      <div
        className="py-4"
        style={{ backgroundColor: 'var(--sm-ink)', color: '#ffffff' }}
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white-50 text-decoration-none">Inicio</Link>
              </li>
              <li className="breadcrumb-item active text-white">Colecciones</li>
              {catNombre && <li className="breadcrumb-item active text-white fw-medium">{catNombre}</li>}
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mt-2">
            <div>
              <h1
                className="sm-font-display mb-1"
                style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', fontWeight: 700 }}
              >
                {catNombre ? catNombre : 'Todas las Colecciones'}
              </h1>
              <p className="small mb-0 text-white-50">
                Prendas masculinas seleccionadas con confección y acabados de calidad.
              </p>
            </div>
            {productosData && (
              <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-25 px-3 py-2">
                {productosData.total} prendas disponibles
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Barra de Filtros Activos y Ordenamiento */}
        <OrdenamientoSelector
          orden={orden}
          onChange={setOrden}
          catNombre={catNombre}
          busqueda={busqueda}
          onLimpiarCat={() => handleCat('')}
          onLimpiarBusqueda={() => handleBusqueda('')}
          onLimpiarTodos={limpiarFiltros}
        />

        <div className="row g-4">
          {/* Sidebar lateral de Categorías y Búsqueda */}
          <FiltrosTienda
            busqueda={busqueda}
            onBusquedaChange={handleBusqueda}
            catActiva={catActiva}
            onCatChange={handleCat}
            categorias={categorias ?? []}
          />

          {/* Cuadrícula de Productos */}
          <GrillaProductos
            isLoading={isLoading}
            productos={productosOrdenados}
            total={productosData?.total ?? 0}
            totalPaginas={productosData?.totalPaginas ?? 1}
            paginaActual={pagina}
            onCambiarPagina={setPagina}
            onLimpiarFiltros={limpiarFiltros}
            onComprarRapido={(p) => setProductoRapido(p)}
          />
        </div>
      </div>

      {/* Modal de Selección y Compra Rápida */}
      <ModalSeleccionRapida
        producto={productoRapido}
        onCerrar={() => setProductoRapido(null)}
      />

      <CarritoFlotante />
    </>
  );
}
