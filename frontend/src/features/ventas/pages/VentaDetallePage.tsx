import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_VENTAS } from '../../../components/layout/breadcrumbsCons';
import { VentaDetalleCard } from '../components/VentaDetalleCard';
import { useVenta } from '../hooks/useVentas';

export function VentaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: venta, isLoading, isError, refetch } = useVenta(Number(id));

  const migas = [
    ...BREADCRUMB_VENTAS,
    { etiqueta: venta ? `V-${String(venta.id).padStart(4, '0')}` : '…', esDato: true },
  ];

  if (isLoading) return <LoadingState etiqueta="Cargando venta…" />;

  if (isError) return (
    <ErrorState
      mensaje="No se pudo cargar la venta."
      onReintentar={refetch}
    />
  );

  if (!venta) return null;

  return (
    <div>
      <Breadcrumbs migas={migas} />
      <PageHeader
        titulo={`Detalle de venta V-${String(venta.id).padStart(4, '0')}`}
        descripcion={`${venta.clienteNombre} · ${venta.clienteEmail}`}
        accion={
          <Button variant="secondary" size="sm" icon={<i className="bi bi-arrow-left" />} onClick={() => navigate('/admin/ventas')}>
            Volver a ventas
          </Button>
        }
      />
      <VentaDetalleCard venta={venta} />
    </div>
  );
}
