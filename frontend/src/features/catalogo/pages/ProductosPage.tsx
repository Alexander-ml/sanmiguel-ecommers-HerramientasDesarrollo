import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { ProductosTab } from '../components/ProductosTab';
import { CategoriasTab } from '../components/CategoriasTab';

type TabCatalogo = 'productos' | 'categorias';

interface ProductosPageProps {
  defaultTab?: TabCatalogo;
}

/**
 * Página del clúster Catálogo (Modulo 1 - Inventario, sección 8.1.1.2): "qué existe" —
 * productos y categorías. Deliberadamente separada de Control de Inventario ("cuánto hay"),
 * que vive en su propia feature (`features/inventario`). No fusionar de nuevo — ver
 * docs/07-prompt-reorganizacion-final.md sección 2.
 */
export function ProductosPage({ defaultTab = 'productos' }: ProductosPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState<TabCatalogo>(tabParam === 'categorias' ? 'categorias' : defaultTab);

  const cambiarTab = (id: string) => {
    const t = id as TabCatalogo;
    setTab(t);
    setSearchParams(t === 'categorias' ? { tab: 'categorias' } : {});
  };

  return (
    <div>
      <PageHeader
        titulo="Catálogo"
        descripcion="Gestión de productos, modelos y su clasificación por categorías."
      />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'productos', etiqueta: 'Productos', icono: 'bi-box-seam', contenido: <ProductosTab /> },
          { id: 'categorias', etiqueta: 'Categorías', icono: 'bi-tags', contenido: <CategoriasTab /> },
        ]}
      />
    </div>
  );
}
