import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_VENTAS } from '../../../components/layout/breadcrumbsCons';
import { VentaForm } from '../components/VentaForm';
import type { Venta } from '../types';

export function VentaFormPage() {
  const navigate = useNavigate();

  const handleGuardada = (v: Venta) => {
    navigate(`/admin/ventas/${v.id}`);
  };

  return (
    <div>
      <Breadcrumbs migas={[
        ...BREADCRUMB_VENTAS,
        { etiqueta: 'Nueva venta' },
      ]} />
      <PageHeader
        titulo="Registrar nueva venta"
        descripcion="Completa los datos del cliente, agrega los productos y selecciona el método de pago."
      />
      <VentaForm
        onGuardada={handleGuardada}
        onCancelar={() => navigate('/admin/ventas')}
      />
    </div>
  );
}
