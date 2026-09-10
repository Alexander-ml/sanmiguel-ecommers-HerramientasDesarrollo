import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductoDetalle, useStockInventario } from '../hooks/useTiendaCatalogo';
import { useCarritoStore, selectTotalItems } from '../../carrito/store/carritoStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { formatearMoneda } from '../../../lib/format';
import { GaleriaProducto } from '../components/GaleriaProducto';
import { SelectorVariante } from '../components/SelectorVariante';
import { AccionesCompra } from '../components/AccionesCompra';
import { PanelInspeccionStaff } from '../components/PanelInspeccionStaff';
import { ModalConfirmacionAgregado } from '../components/ModalConfirmacionAgregado';
import type { Variante } from '../../catalogo/types';

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
        color: '#ffffff',
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
 * Ficha de Detalle de Prenda (SRP / SOLID / Bloque A).
 * Orquesta la galería, selector de variante, acciones de compra y panel de personal interno.
 */
export function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const productoId = Number(id);

  const usuario = useAuthStore((state) => state.usuario);
  const esColaborador = !!usuario && ['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'].includes(usuario.rol);

  const { data, isLoading, isError } = useProductoDetalle(productoId);
  const { data: stockItems } = useStockInventario();
  const { agregar } = useCarritoStore();

  const [tallaSelec, setTallaSelec] = useState<string | null>(null);
  const [colorSelec, setColorSelec] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);

  // Auto-selección inicial de la primera variante disponible
  useEffect(() => {
    if (data?.variantes && data.variantes.length > 0) {
      const activas = data.variantes.filter((v) => v.estado === 'activo');
      if (activas.length > 0) {
        setTallaSelec((prev) => prev ?? activas[0].talla);
        setColorSelec((prev) => prev ?? activas[0].color);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted small mt-2">Cargando prenda…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle text-muted fs-1" />
        <h2 className="h4 fw-bold mt-3">Prenda no encontrada</h2>
        <p className="text-muted small">El producto solicitado no existe o fue retirado del catálogo activo.</p>
        <Link to="/colecciones" className="btn btn-outline-primary btn-sm mt-2">
          Volver a Colecciones
        </Link>
      </div>
    );
  }

  const { producto, variantes } = data;
  const rawActivas = variantes.filter((v) => v.estado === 'activo');
  const variantesActivas: Variante[] =
    rawActivas.length > 0
      ? rawActivas
      : [
          {
            id: -(producto.id),
            productoId: producto.id,
            talla: 'Estándar',
            color: 'Único',
            sku: `SKU-${producto.id}`,
            precioEspecifico: producto.precioBase,
            estado: 'activo' as const,
            fechaCreacion: new Date().toISOString(),
          },
        ];

  const tallas = [...new Set(variantesActivas.map((v) => v.talla))];
  const coloresDisponibles = variantesActivas.filter((v) => !tallaSelec || v.talla === tallaSelec);
  const coloresUnicos = [...new Set(coloresDisponibles.map((v) => v.color))];

  const varianteActual =
    variantesActivas.find((v) => v.talla === tallaSelec && v.color === colorSelec) ??
    variantesActivas.find((v) => v.talla === tallaSelec) ??
    variantesActivas[0];

  const precioMostrar = varianteActual?.precioEspecifico ?? producto.precioBase;

  // Cálculo de existencias disponibles
  const stockVariante = stockItems?.find((s) => s.varianteId === varianteActual?.id);
  const stockDisponible = stockVariante ? stockVariante.cantidadDisponible : 15;
  const estaAgotado = stockDisponible <= 0;

  const handleSeleccionarTalla = (t: string) => {
    setTallaSelec(t);
    const coloresParaTalla = variantesActivas.filter((v) => v.talla === t).map((v) => v.color);
    if (colorSelec && !coloresParaTalla.includes(colorSelec)) {
      setColorSelec(coloresParaTalla[0] ?? null);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!varianteActual || estaAgotado) return;
    agregar(
      {
        varianteId: varianteActual.id,
        productoId: producto.id,
        productoNombre: producto.nombre,
        marca: producto.marca,
        talla: varianteActual.talla,
        color: varianteActual.color,
        sku: varianteActual.sku,
        imagenUrl: producto.imagenes?.[0] ?? null,
        precioUnitario: precioMostrar,
      },
      cantidad,
    );
    setModalConfirmacion(true);
  };

  return (
    <>
      <div className="container py-4">
        {/* Breadcrumbs de navegación pública */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/colecciones" className="text-muted text-decoration-none">Colecciones</Link>
            </li>
            {producto.categoriaNombre && (
              <li className="breadcrumb-item">
                <Link
                  to={`/colecciones?categoriaId=${producto.categoriaId}`}
                  className="text-muted text-decoration-none"
                >
                  {producto.categoriaNombre}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">
              {producto.nombre}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Galería de Producto */}
          <div className="col-12 col-lg-6">
            <GaleriaProducto imagenes={producto.imagenes ?? []} nombre={producto.nombre} />
          </div>

          {/* Información y Compra */}
          <div className="col-12 col-lg-6">
            <span
              className="text-muted small fw-semibold text-uppercase d-block mb-1"
              style={{ letterSpacing: '0.06em' }}
            >
              {producto.marca}
            </span>

            <h1
              className="sm-font-display mb-2 text-dark"
              style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 700 }}
            >
              {producto.nombre}
            </h1>

            <div className="d-flex align-items-baseline gap-3 mb-3">
              <span
                className="fw-bold fs-3 text-primary"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatearMoneda(precioMostrar)}
              </span>
              <span className="badge bg-light text-muted border">I.G.V. 18% incluido</span>
            </div>

            {producto.descripcion && (
              <p className="text-muted mb-4" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                {producto.descripcion}
              </p>
            )}

            {/* Selector de variantes (Talla y Color) */}
            <SelectorVariante
              tallas={tallas}
              tallaSelec={tallaSelec}
              onSeleccionarTalla={handleSeleccionarTalla}
              colores={coloresUnicos}
              colorSelec={colorSelec}
              onSeleccionarColor={setColorSelec}
              stockDisponible={stockDisponible}
            />

            {/* Controles de compra y botones */}
            <AccionesCompra
              cantidad={cantidad}
              onCambiarCantidad={setCantidad}
              onAgregar={handleAgregarAlCarrito}
              estaAgotado={estaAgotado}
              sku={varianteActual?.sku}
            />
          </div>
        </div>

        {/* Panel exclusivo para colaboradores internos */}
        {esColaborador && (
          <PanelInspeccionStaff
            productoId={producto.id}
            productoNombre={producto.nombre}
            variantes={variantesActivas}
            stockItems={stockItems}
          />
        )}
      </div>

      {/* Modal interactivo de confirmación */}
      <ModalConfirmacionAgregado
        show={modalConfirmacion}
        onHide={() => setModalConfirmacion(false)}
        producto={producto}
        talla={tallaSelec}
        color={colorSelec}
        cantidad={cantidad}
        precioUnitario={precioMostrar}
      />

      <CarritoFlotante />
    </>
  );
}
