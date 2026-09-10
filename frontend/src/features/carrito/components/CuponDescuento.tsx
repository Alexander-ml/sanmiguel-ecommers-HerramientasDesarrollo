import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';

interface CuponDescuentoProps {
  onAplicarCupon: (porcentaje: number) => void;
}

/**
 * Formulario de canje de cupones promocionales en el carrito.
 */
export function CuponDescuento({ onAplicarCupon }: CuponDescuentoProps) {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalizado = codigo.trim().toUpperCase();
    if (normalizado === 'SANMIGUEL10') {
      onAplicarCupon(0.1);
      setMensaje({ texto: '¡Cupón SANMIGUEL10 aplicado con éxito! 10% de descuento.', tipo: 'exito' });
    } else {
      setMensaje({ texto: 'Cupón no válido o vencido. Prueba con SANMIGUEL10.', tipo: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <label className="form-label small fw-semibold text-muted mb-1">
        ¿Tienes un cupón de descuento?
      </label>
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control text-uppercase font-monospace"
          placeholder="Ej. SANMIGUEL10"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="sm">
          Aplicar
        </Button>
      </div>
      {mensaje && (
        <div className={`small mt-1 ${mensaje.tipo === 'exito' ? 'text-success' : 'text-danger'}`}>
          {mensaje.texto}
        </div>
      )}
    </form>
  );
}
