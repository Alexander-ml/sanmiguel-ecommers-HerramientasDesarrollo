import { Button } from '../ui/Button';

interface ErrorStateProps {
  mensaje?: string;
  onReintentar?: () => void;
}

/**
 * Muestra el mensaje real devuelto por el backend (ya viene en español, ver api/client.ts).
 * No se reescribe ni se suaviza — regla de escritura: los errores no son vagos.
 */
export function ErrorState({ mensaje = 'No se pudo completar la solicitud.', onReintentar }: ErrorStateProps) {
  return (
    <div className="text-center py-5">
      <i className="bi bi-exclamation-triangle" style={{ fontSize: '2.5rem', color: 'var(--sm-danger)' }} />
      <p className="fw-semibold mt-3 mb-1">{mensaje}</p>
      {onReintentar && (
        <Button variant="secondary" size="sm" className="mt-2" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
