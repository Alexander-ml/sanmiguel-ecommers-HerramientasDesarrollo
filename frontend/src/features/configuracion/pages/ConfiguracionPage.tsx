import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Tabs } from '../../../components/ui/Tabs';
import { EmpresaForm } from '../components/EmpresaForm';
import { ComercialForm } from '../components/ComercialForm';
import { TiendaForm } from '../components/TiendaForm';
import { OperativoForm } from '../components/OperativoForm';
import { SeguridadForm } from '../components/SeguridadForm';
import { HistorialCambiosTable } from '../components/HistorialCambiosTable';
import { useConfiguracion, useHistorialConfiguracion } from '../hooks/useConfiguracion';

type TabConfig = 'empresa' | 'comercial' | 'tienda' | 'operativo' | 'seguridad' | 'historial';
const TABS_VALIDOS: TabConfig[] = ['empresa', 'comercial', 'tienda', 'operativo', 'seguridad', 'historial'];

export function ConfiguracionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabConfig | null;
  const [tab, setTab] = useState<TabConfig>(tabParam && TABS_VALIDOS.includes(tabParam) ? tabParam : 'empresa');

  const cambiarTab = (id: string) => {
    const t = id as TabConfig;
    setTab(t);
    setSearchParams(t === 'empresa' ? {} : { tab: t });
  };

  const { data: config, isLoading, isError, refetch } = useConfiguracion();
  const { data: historial } = useHistorialConfiguracion();

  return (
    <div>
      <PageHeader
        titulo="Configuración General"
        descripcion="Centralización de parámetros fiscales, comerciales, operativos y políticas vigentes de SAN MIGUEL."
      />

      {isLoading && <LoadingState etiqueta="Cargando configuración vigente…" />}
      {isError && <ErrorState mensaje="No se pudo cargar la configuración." onReintentar={refetch} />}

      {!isLoading && !isError && config && (
        <Tabs
          activo={tab}
          onCambiar={cambiarTab}
          items={[
            { id: 'empresa', etiqueta: 'Empresa', icono: 'bi-building', contenido: <EmpresaForm datos={config.empresa} /> },
            { id: 'comercial', etiqueta: 'Comercial e Impuestos', icono: 'bi-cash-stack', contenido: <ComercialForm datos={config.comercial} /> },
            { id: 'tienda', etiqueta: 'Políticas y Tienda', icono: 'bi-file-earmark-text', contenido: <TiendaForm datos={config.tienda} /> },
            { id: 'operativo', etiqueta: 'Operativo', icono: 'bi-sliders', contenido: <OperativoForm datos={config.operativo} /> },
            { id: 'seguridad', etiqueta: 'Seguridad', icono: 'bi-shield-check', contenido: <SeguridadForm datos={config.seguridad} /> },
            {
              id: 'historial',
              etiqueta: 'Historial de Cambios',
              icono: 'bi-clock-history',
              contador: historial?.length ?? 0,
              contenido: historial ? <HistorialCambiosTable cambios={historial} /> : null,
            },
          ]}
        />
      )}
    </div>
  );
}
