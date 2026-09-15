import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_CATALOGO } from '../../../components/layout/breadcrumbsCons';
import { ProductoForm } from '../components/ProductoForm';
import { useProducto } from '../hooks/useProductos';
import type { Producto } from '../types';

export function ProductoFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const productoId = id ? Number(id) : null;
  const esEdicion = productoId !== null;

  const { data: producto, isLoading, isError } = useProducto(productoId);

  const breadcrumbs = [
    ...BREADCRUMB_CATALOGO,
    { etiqueta: esEdicion ? (producto?.nombre ?? 'Editar producto') : 'Nuevo producto', esDato: esEdicion },
  ];

  const handleGuardado = (p: Producto) => {
    navigate(`/admin/productos/${p.id}/variantes`);
  };

  if (esEdicion && isLoading) return <LoadingState etiqueta="Cargando producto…" />;
  if (esEdicion && (isError || !producto)) return (
    <ErrorState
      mensaje="No se pudo cargar el producto."
      onReintentar={() => navigate('/admin/productos')}
    />
  );

  return (
    <div>
      <Breadcrumbs migas={breadcrumbs} />
      <PageHeader
        titulo={esEdicion ? `Editar: ${producto?.nombre ?? '…'}` : 'Nuevo producto'}
        descripcion={
          esEdicion
            ? 'Modifica los datos del producto. El historial de movimientos de sus variantes no se ve afectado.'
            : 'Completa la información del nuevo producto. Luego podrás agregarle variantes.'
        }
      />
      <div style={{ maxWidth: 860 }}>
        <ProductoForm
          productoEditar={esEdicion ? producto : null}
          onGuardado={handleGuardado}
          onCancelar={() => navigate('/admin/productos')}
        />
      </div>
    </div>
  );
}
