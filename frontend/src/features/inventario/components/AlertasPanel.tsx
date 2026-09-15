import { Button } from '../../../components/ui/Button';
import type { AlertaStock } from '../types';

interface AlertasPanelProps {
  alertas: AlertaStock[];
  onVerKardex: (varianteId: number) => void;
}

export function AlertasPanel({ alertas, onVerKardex }: AlertasPanelProps) {
  if (alertas.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-check-circle" style={{ fontSize: '2rem', color: 'var(--sm-success)' }} />
        <p className="fw-semibold mt-3 mb-1">Sin alertas activas</p>
        <p className="text-muted small">Todas las variantes tienen stock por encima de su umbral mínimo.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">
      {alertas.map((alerta) => {
        const esAgotado = alerta.cantidadDisponible === 0;
        return (
          <div
            key={alerta.id}
            className="d-flex align-items-center gap-3 p-3 rounded"
            style={{
              background: 'var(--sm-surface)',
              border: `1px solid ${esAgotado ? 'var(--sm-danger-tint)' : 'var(--sm-warning-tint)'}`,
              borderLeft: `4px solid ${esAgotado ? 'var(--sm-danger)' : 'var(--sm-warning)'}`,
              borderRadius: 'var(--sm-radius-md)',
            }}
          >
            <i
              className={`bi ${esAgotado ? 'bi-x-circle-fill' : 'bi-exclamation-triangle-fill'} flex-shrink-0`}
              style={{ color: esAgotado ? 'var(--sm-danger)' : 'var(--sm-warning)', fontSize: '1.25rem' }}
            />
            <div className="flex-grow-1">
              <div className="fw-medium" style={{ fontSize: 'var(--sm-text-sm)' }}>
                {alerta.productoNombre}
              </div>
              <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                {alerta.talla} · {alerta.color} ·{' '}
                <code style={{ fontSize: 'inherit' }}>{alerta.sku}</code>
              </div>
            </div>
            <div className="text-end flex-shrink-0">
              <div
                className="fw-bold"
                style={{
                  fontSize: 'var(--sm-text-lg)',
                  color: esAgotado ? 'var(--sm-danger)' : 'var(--sm-warning)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {alerta.cantidadDisponible}
              </div>
              <div className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                disponible / mín. {alerta.umbralMinimo}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="flex-shrink-0"
              onClick={() => onVerKardex(alerta.varianteId)}
              title="Ver kardex"
              icon={<i className="bi bi-clock-history" />}
            />
          </div>
        );
      })}
    </div>
  );
}
