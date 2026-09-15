import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_COMPRAS } from '../../../components/layout/breadcrumbsCons';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { OrdenCompraForm } from '../components/OrdenCompraForm';
import { useCompra } from '../hooks/useCompras';

export function OrdenCompraFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const modoEdicion = !!id;
  const ordenId = id ? Number(id) : null;

  const { data: ordenExistente, isLoading: cargandoOrden } = useCompra(ordenId);

  if (modoEdicion && cargandoOrden) {
    return <LoadingState etiqueta="Cargando orden de compra…" />;
  }

  if (modoEdicion && ordenExistente && ordenExistente.estado !== 'PENDIENTE') {
    return (
      <div>
        <Breadcrumbs
          migas={[
            ...BREADCRUMB_COMPRAS,
            { etiqueta: ordenExistente.codigo, ruta: `/admin/compras/${ordenExistente.id}`, esDato: true },
            { etiqueta: 'Editar' },
          ]}
        />
        <div className="alert alert-warning mt-3">
          <i className="bi bi-exclamation-triangle me-2" />
          Esta orden ya no está en estado <strong>Pendiente</strong> (tiene recepciones registradas) y no puede modificarse.
          Solo se pueden editar órdenes que aún no han recibido mercadería — ver RN-COM-03.
        </div>
      </div>
    );
  }

  const migas = modoEdicion && ordenExistente
    ? [
        ...BREADCRUMB_COMPRAS,
        { etiqueta: ordenExistente.codigo, ruta: `/admin/compras/${ordenExistente.id}`, esDato: true },
        { etiqueta: 'Editar' },
      ]
    : [
        ...BREADCRUMB_COMPRAS,
        { etiqueta: 'Nueva orden' },
      ];

  return (
    <div>
      <Breadcrumbs migas={migas} />

      <PageHeader
        titulo={modoEdicion ? `Editar Orden de Compra ${ordenExistente?.codigo ?? ''}` : 'Nueva Orden de Compra'}
        descripcion={
          modoEdicion
            ? 'Modifica los datos de la orden de compra pendiente. Los campos con fondo blanco son interactivos.'
            : 'Formaliza la adquisición de prendas a proveedores para el reabastecimiento del almacén.'
        }
      />

      <OrdenCompraForm
        ordenExistente={ordenExistente}
        onGuardado={(compra) => {
          if (modoEdicion) {
            navigate(`/admin/compras/${compra.id}`);
          } else {
            navigate('/admin/compras');
          }
        }}
        onCancelar={() => {
          if (modoEdicion && ordenExistente) {
            navigate(`/admin/compras/${ordenExistente.id}`);
          } else {
            navigate('/admin/compras');
          }
        }}
      />
    </div>
  );
}
