import { DataTable, type ColumnaTabla, type AccionFila } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Stock } from '../types';

interface StockTableProps {
  stocks: Stock[];
  totalVariantes?: number;
  onAjustar: (s: Stock) => void;
  onConfigurarUmbral: (s: Stock) => void;
  onVerKardex: (s: Stock) => void;
}

export function StockTable({ stocks, totalVariantes, onAjustar, onConfigurarUmbral, onVerKardex }: StockTableProps) {
  function estadoBadge(s: Stock) {
    if (s.estadoStock === 'agotado') return <StatusBadge estado="agotado" />;
    if (s.estadoStock === 'bajo')    return <StatusBadge estado="stock-bajo" />;
    return <StatusBadge estado="activo">Normal</StatusBadge>;
  }

  const columnas: ColumnaTabla<Stock>[] = [
    {
      encabezado: (
        <span>
          Producto / Variante
          {totalVariantes !== undefined && (
            <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: 'var(--sm-text-xs)' }}>
              {totalVariantes} {totalVariantes === 1 ? 'variante' : 'variantes'}
            </span>
          )}
        </span>
      ),
      celda: (s) => (
        <div>
          <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>{s.productoNombre}</div>
          <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
            {s.talla} · {s.color}
          </div>
        </div>
      ),
    },
    {
      encabezado: 'SKU',
      celda: (s) => (
        <code style={{ fontSize: 'var(--sm-text-xs)', color: 'var(--sm-ink-soft)' }}>{s.sku}</code>
      ),
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Físico',
      celda: (s) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--sm-text-sm)' }}>
          {s.cantidadFisica}
        </span>
      ),
      className: 'text-end',
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Reservado',
      celda: (s) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--sm-text-sm)', color: 'var(--sm-ink-soft)' }}>
          {s.cantidadReservada}
        </span>
      ),
      className: 'text-end',
      ocultarEnMovil: true,
    },
    {
      encabezado: 'Disponible',
      celda: (s) => (
        <span
          className="fw-semibold"
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'var(--sm-text-sm)',
            color: s.cantidadDisponible === 0
              ? 'var(--sm-danger)'
              : s.estadoStock === 'bajo'
              ? 'var(--sm-warning)'
              : 'var(--sm-success)',
          }}
        >
          {s.cantidadDisponible}
        </span>
      ),
      className: 'text-end',
    },
    {
      encabezado: 'Estado',
      celda: estadoBadge,
    },
  ];

  const acciones: AccionFila<Stock>[] = [
    {
      etiqueta: 'Ver kardex',
      icono: 'bi-clock-history',
      onClick: onVerKardex,
    },
    {
      etiqueta: 'Ajustar stock',
      icono: 'bi-pencil-square',
      onClick: onAjustar,
    },
    {
      etiqueta: 'Configurar umbral',
      icono: 'bi-bell',
      onClick: onConfigurarUmbral,
    },
  ];

  return (
    <DataTable
      columnas={columnas}
      datos={stocks}
      acciones={acciones}
      keyExtractor={(s) => s.varianteId}
    />
  );
}
