import { FiltersBar, type FiltroSelect } from '../../../components/ui/FiltersBar';

interface KardexFiltersProps {
  tipo: string;
  fechaDesde: string;
  fechaHasta: string;
  onTipoChange: (v: string) => void;
  onFechaDesdeChange: (v: string) => void;
  onFechaHastaChange: (v: string) => void;
}

export function KardexFilters({
  tipo,
  fechaDesde,
  fechaHasta,
  onTipoChange,
  onFechaDesdeChange,
  onFechaHastaChange,
}: KardexFiltersProps) {
  const filtros: FiltroSelect[] = [
    {
      nombre: 'Todos los tipos',
      etiqueta: 'Tipo de movimiento',
      opciones: [
        { valor: 'ENTRADA_COMPRA',           etiqueta: 'Entrada por compra' },
        { valor: 'ENTRADA_DEVOLUCION_VENTA',  etiqueta: 'Entrada por devolución' },
        { valor: 'SALIDA_VENTA',              etiqueta: 'Salida por venta' },
        { valor: 'SALIDA_DEVOLUCION_COMPRA',  etiqueta: 'Salida por devolución a prov.' },
        { valor: 'AJUSTE_POSITIVO',           etiqueta: 'Ajuste positivo' },
        { valor: 'AJUSTE_NEGATIVO',           etiqueta: 'Ajuste negativo' },
      ],
      valor: tipo,
      onChange: onTipoChange,
    },
  ];

  return (
    <FiltersBar filtros={filtros}>
      <div className="d-flex flex-column" style={{ minWidth: 140 }}>
        <label htmlFor="kardex-desde" className="text-muted fw-semibold mb-1" style={{ fontSize: 'var(--sm-text-xs)' }}>
          Fecha desde
        </label>
        <input
          id="kardex-desde"
          type="date"
          className="form-control"
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
        />
      </div>
      <div className="d-flex flex-column" style={{ minWidth: 140 }}>
        <label htmlFor="kardex-hasta" className="text-muted fw-semibold mb-1" style={{ fontSize: 'var(--sm-text-xs)' }}>
          Fecha hasta
        </label>
        <input
          id="kardex-hasta"
          type="date"
          className="form-control"
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
        />
      </div>
    </FiltersBar>
  );
}
