import { FiltersBar, type FiltroSelect } from '../../../components/ui/FiltersBar';

interface StockFiltersProps {
  busqueda: string;
  estado: string;
  onBusquedaChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
}

export function StockFilters({ busqueda, estado, onBusquedaChange, onEstadoChange }: StockFiltersProps) {
  const filtros: FiltroSelect[] = [
    {
      nombre: 'Todos los estados',
      etiqueta: 'Nivel de existencias',
      opciones: [
        { valor: 'normal', etiqueta: 'Normal' },
        { valor: 'bajo',   etiqueta: 'Stock bajo' },
        { valor: 'agotado', etiqueta: 'Agotado' },
      ],
      valor: estado,
      onChange: onEstadoChange,
    },
  ];

  return (
    <FiltersBar
      etiquetaBusqueda="Buscar prenda o código SKU"
      busqueda={busqueda}
      placeholderBusqueda="ej. Camisa, CAM-OXF-01…"
      onBusquedaChange={onBusquedaChange}
      filtros={filtros}
    />
  );
}
