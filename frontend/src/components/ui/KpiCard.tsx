import type { ReactNode } from 'react';

export type KpiTono = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONO_COLOR_MAP: Record<KpiTono, string> = {
  primary: 'var(--sm-primary)',
  success: 'var(--sm-success)',
  warning: 'var(--sm-warning)',
  danger: 'var(--sm-danger)',
  info: 'var(--sm-info)',
  neutral: 'var(--sm-ink)',
};

export interface KpiCardProps {
  /** Ícono a mostrar (nombre de clase Bootstrap Icons, ej. 'bi-receipt', o nodo React) */
  icono: string | ReactNode;
  /** Etiqueta descriptiva superior/inferior */
  etiqueta: string;
  /** Valor numérico o texto principal */
  valor: ReactNode;
  /** Tono semántico (reutiliza los mismos tonos de StatusBadge) */
  tono?: KpiTono;
  /** Subtítulo o texto secundario opcional debajo de la etiqueta */
  subetiqueta?: ReactNode;
  /** Estado de carga (muestra indicador mientras se obtienen los datos) */
  isLoading?: boolean;
  /** Clase opcional para la columna si se usa dentro de una cuadrícula */
  colClassName?: string;
  /** Clase personalizada para el contenedor de la tarjeta */
  className?: string;
}

/**
 * Componente unificado para tarjetas de métricas y resumen operativo (KPIs).
 * Cumple con el estándar visual del Design System (caja circular de 38px con fondo --sm-bone,
 * valor destacado en --sm-text-lg con números tabulares y etiqueta en --sm-text-xs).
 */
export function KpiCard({
  icono,
  etiqueta,
  valor,
  tono = 'neutral',
  subetiqueta,
  isLoading = false,
  colClassName,
  className = '',
}: KpiCardProps) {
  const color = TONO_COLOR_MAP[tono] ?? TONO_COLOR_MAP.neutral;

  const cardContent = (
    <div
      className={`d-flex align-items-center gap-3 p-3 rounded h-100 ${className}`}
      style={{
        background: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius-md)',
        boxShadow: 'var(--sm-shadow-sm)',
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          backgroundColor: 'var(--sm-bone)',
          color,
          fontSize: '1.2rem',
        }}
      >
        {typeof icono === 'string' ? (
          <i className={icono.startsWith('bi-') ? `bi ${icono}` : `bi bi-${icono}`} />
        ) : (
          icono
        )}
      </div>

      <div className="min-w-0 flex-grow-1">
        <div
          className="fw-bold text-truncate"
          style={{
            fontSize: 'var(--sm-text-lg)',
            color,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.25,
          }}
        >
          {isLoading ? '…' : valor}
        </div>
        <div
          className="text-muted text-truncate"
          style={{
            fontSize: 'var(--sm-text-xs)',
            lineHeight: 1.2,
            marginTop: '2px',
          }}
          title={typeof etiqueta === 'string' ? etiqueta : undefined}
        >
          {etiqueta}
        </div>
        {subetiqueta && (
          <div
            className="text-muted text-truncate"
            style={{ fontSize: '0.72rem', marginTop: '2px' }}
          >
            {subetiqueta}
          </div>
        )}
      </div>
    </div>
  );

  if (colClassName) {
    return <div className={colClassName}>{cardContent}</div>;
  }

  return cardContent;
}

export interface KpiItem {
  icono: string | ReactNode;
  etiqueta?: string;
  titulo?: string;
  valor: ReactNode;
  tono?: KpiTono;
  subetiqueta?: ReactNode;
  isLoading?: boolean;
  colClassName?: string;
  className?: string;
}

export interface KpiCardGroupProps {
  children?: ReactNode;
  items?: KpiItem[];
  colClassName?: string;
  className?: string;
}

/**
 * Fila de cuadrícula estándar para agrupar múltiples KpiCard.
 * Permite usarse como contenedor directo de children o mediante la propiedad `items`.
 */
export function KpiCardGroup({ children, items, colClassName, className = '' }: KpiCardGroupProps) {
  if (items && items.length > 0) {
    const defaultColClass =
      colClassName ??
      (items.length === 2
        ? 'col-12 col-sm-6'
        : items.length === 3
        ? 'col-12 col-sm-4'
        : items.length === 4
        ? 'col-12 col-sm-6 col-lg-3'
        : 'col-12 col-sm-6 col-md-4');

    return (
      <div className={`row g-3 mb-4 ${className}`}>
        {items.map((item, idx) => (
          <KpiCard
            key={idx}
            icono={item.icono}
            etiqueta={item.etiqueta ?? item.titulo ?? ''}
            valor={item.valor}
            tono={item.tono}
            subetiqueta={item.subetiqueta}
            isLoading={item.isLoading}
            colClassName={item.colClassName ?? defaultColClass}
            className={item.className}
          />
        ))}
      </div>
    );
  }

  return <div className={`row g-3 mb-4 ${className}`}>{children}</div>;
}
