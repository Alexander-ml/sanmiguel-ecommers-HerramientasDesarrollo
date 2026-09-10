import { useState } from 'react';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Tabs } from '../../../components/ui/Tabs';
import { PerfilTab } from '../components/PerfilTab';
import { DireccionesTab } from '../components/DireccionesTab';
import { ComprasTab } from '../components/ComprasTab';
import { PrivacidadTab } from '../components/PrivacidadTab';
import { useMiPerfil } from '../hooks/useClientes';

type TabCuenta = 'perfil' | 'direcciones' | 'compras' | 'privacidad';

/**
 * Portal del cliente ("Mi Cuenta"). Distinto del panel administrativo — usa PublicLayout,
 * no AdminLayout (ver docs/02-arquitectura-frontend.md §4: no mezclar la experiencia de
 * Cliente con la de personal interno).
 */
export function MiCuentaPage() {
  const [tab, setTab] = useState<TabCuenta>('perfil');
  const { data: cliente, isLoading, isError, refetch } = useMiPerfil();

  if (isLoading) return <LoadingState etiqueta="Cargando información de tu cuenta…" />;
  if (isError || !cliente) return <ErrorState mensaje="No se pudo cargar tu perfil." onReintentar={refetch} />;

  return (
    <div className="container py-4" style={{ maxWidth: 1040 }}>
      <Breadcrumbs migas={[{ etiqueta: 'Inicio', ruta: '/' }, { etiqueta: 'Mi Cuenta' }]} />

      <div
        className="card border-0 shadow-sm p-4 mb-4 text-white"
        style={{
          borderRadius: 'var(--sm-radius-md)',
          background: 'linear-gradient(135deg, var(--sm-ink) 0%, var(--sm-ink-soft) 100%)',
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4"
              style={{ width: 56, height: 56, backgroundColor: 'var(--sm-primary)', color: '#fff' }}
            >
              {cliente.nombres.charAt(0)}
              {cliente.apellidos.charAt(0)}
            </div>
            <div>
              <h1 className="h4 fw-bold mb-1 text-white">
                {cliente.nombres} {cliente.apellidos}
              </h1>
              <div className="text-white-50 small">
                <i className="bi bi-envelope me-1" />
                {cliente.email} · <i className="bi bi-telephone me-1" />
                {cliente.telefono}
              </div>
            </div>
          </div>
          <span className="badge rounded-pill bg-primary px-3 py-2 text-white" style={{ fontSize: '0.8rem' }}>
            Cliente Registrado · {cliente.segmentoRFM}
          </span>
        </div>
      </div>

      <Tabs
        activo={tab}
        onCambiar={(id) => setTab(id as TabCuenta)}
        items={[
          {
            id: 'perfil',
            etiqueta: 'Mis Datos',
            icono: 'bi-person',
            contenido: <PerfilTab cliente={cliente} />,
          },
          { id: 'direcciones', etiqueta: 'Direcciones', icono: 'bi-geo-alt', contenido: <DireccionesTab /> },
          { id: 'compras', etiqueta: 'Historial de Compras', icono: 'bi-bag-check', contenido: <ComprasTab cliente={cliente} /> },
          { id: 'privacidad', etiqueta: 'Privacidad y ARCO', icono: 'bi-shield-check', contenido: <PrivacidadTab cliente={cliente} /> },
        ]}
      />
    </div>
  );
}
