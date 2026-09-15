import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { StockTab } from '../components/StockTab';
import { AlertasTab } from '../components/AlertasTab';
import { ReportesTab } from '../components/ReportesTab';
import { useAlertas } from '../hooks/useInventario';

type TabInventario = 'stock' | 'alertas' | 'reportes';

/**
 * Control de Inventario puro: Stock, Alertas y Kardex/Reportes (Modulo 1 - Inventario,
 * sección 8.1.1.2 — "cuánto hay"). Productos y Categorías ("qué existe") viven en
 * features/catalogo/pages/ProductosPage.tsx — ver docs/07-prompt-reorganizacion-final.md
 * sección 2 sobre por qué se separaron de nuevo.
 */
export function InventarioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabInventario | null;
  const [tab, setTab] = useState<TabInventario>(
    tabParam && ['stock', 'alertas', 'reportes'].includes(tabParam) ? tabParam : 'stock',
  );

  const { data: alertas } = useAlertas();

  const cambiarTab = (id: string) => {
    const t = id as TabInventario;
    setTab(t);
    setSearchParams(t === 'stock' ? {} : { tab: t });
  };

  return (
    <div>
      <PageHeader
        titulo="Inventario y Almacén"
        descripcion="Control de existencias físicas, reservas, alertas y valorización de stock."
      />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'stock', etiqueta: 'Control de Stock', icono: 'bi-boxes', contenido: <StockTab /> },
          {
            id: 'alertas',
            etiqueta: 'Alertas',
            icono: 'bi-bell',
            contador: alertas?.length ?? 0,
            contenido: <AlertasTab />,
          },
          { id: 'reportes', etiqueta: 'Kardex y Reportes', icono: 'bi-graph-up', contenido: <ReportesTab /> },
        ]}
      />
    </div>
  );
}
