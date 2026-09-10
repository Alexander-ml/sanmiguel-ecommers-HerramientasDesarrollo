import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { VentasListadoTab } from '../components/VentasListadoTab';
import { ReportesVentasTab } from '../components/ReportesVentasTab';
import { useAuthStore } from '../../auth/store/useAuthStore';

type TabVentas = 'listado' | 'reportes';

export function VentasPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const esAdmin = usuario?.rol === 'ADMINISTRADOR';

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabVentas | null;
  const [tab, setTab] = useState<TabVentas>(tabParam === 'reportes' ? 'reportes' : 'listado');

  const cambiarTab = (id: string) => {
    const t = id as TabVentas;
    setTab(t);
    setSearchParams(t === 'listado' ? {} : { tab: t });
  };

  return (
    <div>
      <PageHeader
        titulo="Ventas"
        descripcion={esAdmin ? 'Historial completo de ventas del negocio.' : 'Tus ventas registradas.'}
      />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'listado', etiqueta: 'Listado', icono: 'bi-receipt', contenido: <VentasListadoTab /> },
          ...(esAdmin
            ? [{ id: 'reportes', etiqueta: 'Reportes', icono: 'bi-bar-chart-line', contenido: <ReportesVentasTab /> }]
            : []),
        ]}
      />
    </div>
  );
}
