import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AlertasPanel } from './AlertasPanel';
import { useAlertas } from '../hooks/useInventario';
import { KpiCard, KpiCardGroup } from '../../../components/ui/KpiCard';

/**
 * Pestaña "Alertas de Stock" (RF-INV-020/021). Autocontenida.
 * Muestra sus métricas específicas de alertas en este nivel, manteniendo el resumen
 * general del módulo limpio de datos no aplicables a otras pestañas (§3.4).
 */
export function AlertasTab() {
  const navigate = useNavigate();
  const { data: alertas, isLoading } = useAlertas();

  if (isLoading) return <LoadingState etiqueta="Cargando alertas…" />;

  const listaAlertas = alertas ?? [];
  const agotadas = listaAlertas.filter((a) => a.cantidadDisponible === 0).length;
  const stockBajo = listaAlertas.length - agotadas;

  return (
    <div>
      <KpiCardGroup>
        <KpiCard
          icono="bi-exclamation-triangle"
          etiqueta="Total alertas activas"
          valor={listaAlertas.length}
          tono={listaAlertas.length > 0 ? 'warning' : 'success'}
          colClassName="col-12 col-md-4"
        />
        <KpiCard
          icono="bi-x-circle"
          etiqueta="Variantes agotadas (stock 0)"
          valor={agotadas}
          tono={agotadas > 0 ? 'danger' : 'neutral'}
          colClassName="col-6 col-md-4"
        />
        <KpiCard
          icono="bi-battery-low"
          etiqueta="Bajo umbral mínimo"
          valor={stockBajo}
          tono={stockBajo > 0 ? 'warning' : 'neutral'}
          colClassName="col-6 col-md-4"
        />
      </KpiCardGroup>

      <AlertasPanel
        alertas={listaAlertas}
        onVerKardex={(id) => navigate(`/admin/inventario/kardex/${id}`)}
      />
    </div>
  );
}
