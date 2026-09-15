import { formatearMoneda } from '../../../lib/format';

interface EnvioGratisBarProps {
  subtotal: number;
  umbral?: number;
}

/**
 * Barra de progreso interactiva hacia el Envío Gratis nacional.
 */
export function EnvioGratisBar({ subtotal, umbral = 250 }: EnvioGratisBarProps) {
  const faltaParaGratis = Math.max(0, umbral - subtotal);
  const porcentajeProgreso = Math.min(100, Math.round((subtotal / umbral) * 100));

  return (
    <div
      className="card border-0 shadow-sm p-3 mb-4"
      style={{ borderRadius: 'var(--sm-radius-md)', background: '#f8fafc' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small fw-semibold text-dark d-flex align-items-center gap-2">
          <i className="bi bi-truck text-primary fs-5" />
          {faltaParaGratis > 0 ? (
            <span>
              Agrega <strong>{formatearMoneda(faltaParaGratis)}</strong> más para obtener{' '}
              <strong className="text-primary">Envío Gratis</strong> a todo el Perú
            </span>
          ) : (
            <span className="text-success fw-bold">
              <i className="bi bi-patch-check-fill me-1" />
              ¡Felicidades! Calificas para Envío Gratis a nivel nacional
            </span>
          )}
        </span>
        <span className="small text-muted fw-bold">{porcentajeProgreso}%</span>
      </div>
      <div className="progress" style={{ height: 7, borderRadius: 10 }}>
        <div
          className={`progress-bar ${faltaParaGratis === 0 ? 'bg-success' : 'bg-primary'}`}
          role="progressbar"
          style={{ width: `${porcentajeProgreso}%`, borderRadius: 10, transition: 'width 0.4s ease' }}
          aria-valuenow={porcentajeProgreso}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
