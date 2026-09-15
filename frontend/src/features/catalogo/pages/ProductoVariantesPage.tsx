import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_CATALOGO } from '../../../components/layout/breadcrumbsCons';
import { VarianteTable } from '../components/VarianteTable';
import { VarianteForm } from '../components/VarianteForm';
import { useVariantes, useBajaVariante } from '../hooks/useVariantes';
import { useProducto } from '../hooks/useProductos';
import { Button } from '../../../components/ui/Button';
import type { Variante } from '../types';

export function ProductoVariantesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productoId = Number(id);

  const { data: producto, isLoading: cargandoProducto } = useProducto(productoId);
  const { data: variantes, isLoading, isError, refetch } = useVariantes(productoId);
  const { mutate: darBaja, isPending: bajando } = useBajaVariante(productoId);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [varianteEditar, setVarianteEditar] = useState<Variante | null>(null);
  const [varianteABaja, setVarianteABaja] = useState<Variante | null>(null);

  const handleNueva = () => {
    setVarianteEditar(null);
    setMostrarForm(true);
  };

  const handleEditar = (variante: Variante) => {
    setVarianteEditar(variante);
    setMostrarForm(true);
  };

  const handleCerrarModal = () => {
    setMostrarForm(false);
    setVarianteEditar(null);
  };

  const handleConfirmarBaja = () => {
    if (!varianteABaja) return;
    darBaja(varianteABaja.id, { onSuccess: () => setVarianteABaja(null) });
  };

  const breadcrumbs = [
    ...BREADCRUMB_CATALOGO,
    {
      etiqueta: cargandoProducto ? '…' : (producto?.nombre ?? 'Producto'),
      ruta: `/admin/productos/${productoId}/editar`,
      esDato: true,
    },
    { etiqueta: 'Variantes' },
  ];

  return (
    <div>
      <Breadcrumbs migas={breadcrumbs} />

      <PageHeader
        titulo="Variantes del Producto"
        descripcion={
          producto
            ? `${producto.nombre} · ${producto.marca} — Precio base referencial: S/ ${producto.precioBase.toFixed(2)}`
            : 'Cargando datos del producto…'
        }
        accion={
          <Button
            variant="primary"
            size="sm"
            icon={<i className="bi bi-plus-lg" />}
            onClick={handleNueva}
          >
            Nueva variante
          </Button>
        }
      />

      {/* Contexto del producto en una tarjeta pequeña */}
      {producto && (
        <div
          className="d-flex align-items-center gap-3 mb-4 p-3 rounded shadow-sm"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--sm-border)',
            borderRadius: 'var(--sm-radius-md, 8px)',
          }}
        >
          <i className="bi bi-box-seam fs-4 text-primary" />
          <div>
            <div className="fw-semibold small">{producto.nombre}</div>
            <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {producto.categoriaNombre} · {producto.marca}
            </div>
          </div>
          <Button variant="secondary" size="sm" className="ms-auto" icon={<i className="bi bi-pencil" />} onClick={() => navigate(`/admin/productos/${productoId}/editar`)}>
            Editar producto
          </Button>
        </div>
      )}

      {isLoading && <LoadingState etiqueta="Cargando variantes…" />}

      {isError && (
        <ErrorState
          mensaje="No se pudieron cargar las variantes."
          onReintentar={refetch}
        />
      )}

      {!isLoading && !isError && variantes && (
        variantes.length === 0 ? (
          <EmptyState
            icono="bi-collection"
            titulo="Sin variantes registradas"
            descripcion="Este producto aún no tiene variantes. Agrega al menos una combinación de talla y color para que pueda venderse."
            accion={
              <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={handleNueva}>
                Agregar primera variante
              </Button>
            }
          />
        ) : (
          <VarianteTable
            variantes={variantes}
            precioBase={producto?.precioBase ?? 0}
            onEditar={handleEditar}
            onBaja={(v) => setVarianteABaja(v)}
          />
        )
      )}

      <VarianteForm
        show={mostrarForm}
        productoId={productoId}
        varianteEditar={varianteEditar}
        onCerrar={handleCerrarModal}
      />

      <ConfirmDialog
        show={varianteABaja !== null}
        titulo="Dar de baja variante"
        descripcion={`¿Dar de baja la variante ${varianteABaja?.talla} / ${varianteABaja?.color} (SKU: ${varianteABaja?.sku})? Quedará inactiva y su historial de movimientos se conserva.`}
        textoConfirmar="Dar de baja"
        tono="danger"
        cargando={bajando}
        onConfirmar={handleConfirmarBaja}
        onCancelar={() => setVarianteABaja(null)}
      />
    </div>
  );
}
