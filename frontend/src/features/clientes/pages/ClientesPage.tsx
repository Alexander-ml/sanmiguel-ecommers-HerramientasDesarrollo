import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { DirectorioTab } from '../components/DirectorioTab';
import { RfmTab } from '../components/RfmTab';
import { ArcoTab } from '../components/ArcoTab';
import { useResumenClientes } from '../hooks/useClientes';

type TabClientes = 'directorio' | 'rfm' | 'arco';

const TITULOS: Record<TabClientes, { titulo: string; descripcion: string }> = {
  directorio: { titulo: 'Directorio de Clientes', descripcion: 'Perfil, contacto y estado de cuenta de cada comprador.' },
  rfm: { titulo: 'Segmentación RFM y Reportes', descripcion: 'Recencia, frecuencia y monto de compra por segmento.' },
  arco: { titulo: 'Derechos ARCO (Ley N° 29733)', descripcion: 'Solicitudes de acceso, rectificación, cancelación y oposición.' },
};

export function ClientesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabClientes | null;
  const [tab, setTab] = useState<TabClientes>(
    tabParam && ['directorio', 'rfm', 'arco'].includes(tabParam) ? tabParam : 'directorio',
  );

  const cambiarTab = (id: string) => {
    const t = id as TabClientes;
    setTab(t);
    setSearchParams(t === 'directorio' ? {} : { tab: t });
  };

  const { data: resumen } = useResumenClientes();

  return (
    <div>
      <PageHeader titulo={TITULOS[tab].titulo} descripcion={TITULOS[tab].descripcion} />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'directorio', etiqueta: 'Directorio', icono: 'bi-people', contenido: <DirectorioTab /> },
          { id: 'rfm', etiqueta: 'Segmentación RFM', icono: 'bi-graph-up-arrow', contenido: <RfmTab /> },
          {
            id: 'arco',
            etiqueta: 'Derechos ARCO',
            icono: 'bi-shield-check',
            contador: resumen?.solicitudesArcoPendientes ?? 0,
            contenido: <ArcoTab />,
          },
        ]}
      />
    </div>
  );
}
