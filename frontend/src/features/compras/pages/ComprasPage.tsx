import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { OrdenesTab } from '../components/OrdenesTab';
import { ProveedoresTab } from '../components/ProveedoresTab';
import { ReportesComprasTab } from '../components/ReportesComprasTab';

type TabCompras = 'ordenes' | 'proveedores' | 'reportes';

export function ComprasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabCompras | null;
  const [tab, setTab] = useState<TabCompras>(
    tabParam && ['ordenes', 'proveedores', 'reportes'].includes(tabParam) ? tabParam : 'ordenes',
  );

  const cambiarTab = (id: string) => {
    const t = id as TabCompras;
    setTab(t);
    setSearchParams(t === 'ordenes' ? {} : { tab: t });
  };

  return (
    <div>
      <PageHeader
        titulo="Compras"
        descripcion="Abastecimiento: proveedores, órdenes de compra y su recepción en almacén."
      />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'ordenes', etiqueta: 'Órdenes de Compra', icono: 'bi-receipt-cutoff', contenido: <OrdenesTab /> },
          { id: 'proveedores', etiqueta: 'Proveedores', icono: 'bi-truck', contenido: <ProveedoresTab /> },
          { id: 'reportes', etiqueta: 'Reportes', icono: 'bi-bar-chart-line', contenido: <ReportesComprasTab /> },
        ]}
      />
    </div>
  );
}
