import { useAlertas } from '../hooks/useInventario';
import { formatearMoneda } from '../../../lib/format';
import { KpiCard, KpiCardGroup } from '../../../components/ui/KpiCard';

interface InventarioResumenCardsProps {
  totalVariantes: number;
  totalAlertas?: number;
  valorTotal: number;
  isLoading?: boolean;
  mostrarAlertas?: boolean;
}

/**
 * Resumen de métricas del módulo Inventario.
 * Por defecto muestra únicamente las métricas transversales de existencias y valorización,
 * evitando duplicar la métrica de alertas en pestañas no relacionadas como Kardex.
 */
export function InventarioResumenCards({
  totalVariantes,
  totalAlertas = 0,
  valorTotal,
  isLoading,
  mostrarAlertas = false,
}: InventarioResumenCardsProps) {
  const cards = [
    {
      icono: 'bi-boxes',
      label: 'Variantes con stock',
      valor: totalVariantes.toString(),
      tono: 'neutral' as const,
      mostrar: true,
    },
    {
      icono: 'bi-currency-dollar',
      label: 'Valor del inventario',
      valor: formatearMoneda(valorTotal),
      tono: 'primary' as const,
      mostrar: true,
    },
    {
      icono: 'bi-exclamation-triangle',
      label: 'Alertas activas',
      valor: totalAlertas.toString(),
      tono: totalAlertas > 0 ? ('warning' as const) : ('success' as const),
      mostrar: mostrarAlertas,
    },
  ].filter((c) => c.mostrar);

  const colClass = cards.length === 2 ? 'col-12 col-sm-6' : 'col-12 col-sm-4';

  return (
    <KpiCardGroup>
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          icono={card.icono}
          etiqueta={card.label}
          valor={card.valor}
          tono={card.tono}
          isLoading={isLoading}
          colClassName={colClass}
        />
      ))}
    </KpiCardGroup>
  );
}

/** Hook auxiliar que extrae solo el conteo de alertas — evita prop drilling */
export function useConteoAlertas() {
  const { data } = useAlertas();
  return data?.length ?? 0;
}
