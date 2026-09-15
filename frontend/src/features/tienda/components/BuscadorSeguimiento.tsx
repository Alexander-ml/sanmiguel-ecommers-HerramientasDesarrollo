import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';

interface BuscadorSeguimientoProps {
  codigoInput: string;
  onCodigoChange: (val: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

/**
 * Formulario de consulta de pedidos por código único (Design System §3).
 */
export function BuscadorSeguimiento({
  codigoInput,
  onCodigoChange,
  onSubmit,
  isLoading,
}: BuscadorSeguimientoProps) {
  return (
    <div
      className="card border-0 shadow-sm p-4 mb-4 mx-auto"
      style={{ borderRadius: 'var(--sm-radius-md)', maxWidth: 640 }}
    >
      <h2 className="h6 fw-bold mb-2 text-dark">
        <i className="bi bi-search text-primary me-2" />
        Ingresa tu código de pedido
      </h2>
      <p className="text-muted small mb-3">
        El código fue generado al confirmar tu compra (ejemplo: <code>PED-2026-0001</code>) y enviado
        a tu correo.
      </p>

      <form onSubmit={onSubmit} className="d-flex gap-2">
        <input
          type="text"
          className="form-control text-uppercase font-monospace"
          placeholder="Ej: PED-2026-0001"
          value={codigoInput}
          onChange={(e) => onCodigoChange(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={<i className="bi bi-geo-alt" />}
        >
          Consultar
        </Button>
      </form>
    </div>
  );
}
