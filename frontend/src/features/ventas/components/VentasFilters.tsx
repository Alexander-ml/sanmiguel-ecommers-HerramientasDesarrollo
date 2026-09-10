import type { ReactNode } from 'react';
import { FiltersBar, type FiltroSelect } from '../../../components/ui/FiltersBar';

interface VentasFiltersProps {
  cliente: string;
  estado: string;
  fechaDesde: string;
  fechaHasta: string;
  acciones?: ReactNode;
  onClienteChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
  onFechaDesdeChange: (v: string) => void;
  onFechaHastaChange: (v: string) => void;
}

export function VentasFilters({
  cliente,
  estado,
  fechaDesde,
  fechaHasta,
  acciones,
  onClienteChange,
  onEstadoChange,
  onFechaDesdeChange,
  onFechaHastaChange,
}: VentasFiltersProps) {
  const filtros: FiltroSelect[] = [
    {
      nombre: 'Todos los estados',
      etiqueta: 'Estado de venta',
      opciones: [
        { valor: 'confirmada', etiqueta: 'Confirmada' },
        { valor: 'pendiente',  etiqueta: 'Pendiente' },
        { valor: 'cancelada',  etiqueta: 'Cancelada' },
      ],
      valor: estado,
      onChange: onEstadoChange,
    },
  ];

  return (
    <FiltersBar
      etiquetaBusqueda="Buscar por cliente"
      busqueda={cliente}
      placeholderBusqueda="ej. Juan Pérez, cliente@email.com…"
      onBusquedaChange={onClienteChange}
      filtros={filtros}
      acciones={acciones}
    >
      <div className="d-flex align-items-center gap-1 ms-md-2">
        <label htmlFor="ven-desde" className="text-muted small">Desde</label>
        <input
          id="ven-desde"
          type="date"
          className="form-control form-control-sm"
          style={{ width: 'auto' }}
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
        />
      </div>
      <div className="d-flex align-items-center gap-1">
        <label htmlFor="ven-hasta" className="text-muted small">Hasta</label>
        <input
          id="ven-hasta"
          type="date"
          className="form-control form-control-sm"
          style={{ width: 'auto' }}
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
        />
      </div>
    </FiltersBar>
  );
}
