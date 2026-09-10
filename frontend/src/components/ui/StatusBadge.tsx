import type { ReactNode } from 'react';
import './StatusBadge.css';

/**
 * Único componente para renderizar estados en toda la app.
 * Mapeo definido en docs/03-design-system.md §6.
 *
 * Variantes agregadas en el módulo Inventario y Catálogo:
 * - 'ajuste-positivo' / 'ajuste-negativo' → tipos de movimiento manual de stock
 * - 'entrada-compra' / 'salida-venta' / 'entrada-devolucion' / 'salida-devolucion' → tipos de movimiento automático
 */
export type EstadoVisual =
  // Estados de entidad
  | 'activo'
  | 'inactivo'
  | 'stock-bajo'
  | 'agotado'
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'entregada'
  | 'anulada'
  // Estados de pedido (Tienda)
  | 'pendiente-pago'
  | 'en-espera'
  | 'confirmado'
  | 'en-preparacion'
  | 'listo-entregado'
  | 'cancelado'
  // Estados de orden de compra (Compras)
  | 'parcialmente-recibida'
  | 'recibida'
  | 'devuelta'
  // Tipos de movimiento de inventario (agregados por módulo Inventario y Catálogo)
  | 'entrada-compra'
  | 'entrada-devolucion'
  | 'salida-venta'
  | 'salida-devolucion'
  | 'ajuste-positivo'
  | 'ajuste-negativo';

const CONFIG: Record<EstadoVisual, { label: string; tono: string }> = {
  // Estados de entidad
  activo:               { label: 'Activo',     tono: 'success' },
  inactivo:             { label: 'Inactivo',   tono: 'neutral' },
  'stock-bajo':         { label: 'Stock bajo', tono: 'warning' },
  agotado:              { label: 'Agotado',    tono: 'danger'  },
  pendiente:            { label: 'Pendiente',  tono: 'warning' },
  aprobada:             { label: 'Aprobada',   tono: 'success' },
  rechazada:            { label: 'Rechazada',  tono: 'danger'  },
  entregada:            { label: 'Entregada',  tono: 'info'    },
  anulada:              { label: 'Anulada',    tono: 'neutral' },
  // Estados de pedido (Tienda)
  'pendiente-pago':     { label: 'Pendiente de pago',         tono: 'warning' },
  'en-espera':          { label: 'En espera de confirmación', tono: 'warning' },
  confirmado:           { label: 'Confirmado',                tono: 'success' },
  'en-preparacion':     { label: 'En preparación',            tono: 'info' },
  'listo-entregado':    { label: 'Listo / entregado',         tono: 'success' },
  cancelado:            { label: 'Cancelado',                 tono: 'danger' },
  // Estados de orden de compra (Compras)
  'parcialmente-recibida': { label: 'Parcialmente recibida', tono: 'info' },
  recibida:                { label: 'Recibida',              tono: 'success' },
  devuelta:                { label: 'Devuelta',              tono: 'neutral' },
  // Tipos de movimiento de inventario
  'entrada-compra':     { label: 'Entrada compra',       tono: 'success' },
  'entrada-devolucion': { label: 'Entrada devolución',   tono: 'info'    },
  'salida-venta':       { label: 'Salida venta',         tono: 'warning' },
  'salida-devolucion':  { label: 'Salida devolución',    tono: 'neutral' },
  'ajuste-positivo':    { label: 'Ajuste positivo',      tono: 'info'    },
  'ajuste-negativo':    { label: 'Ajuste negativo',      tono: 'warning' },
};

interface StatusBadgeProps {
  estado: EstadoVisual;
  /** Sobrescribe el texto por defecto si hace falta (ej. mostrar el enum crudo del backend). */
  children?: ReactNode;
}

export function StatusBadge({ estado, children }: StatusBadgeProps) {
  const { label, tono } = CONFIG[estado];
  return <span className={`sm-badge sm-badge--${tono}`}>{children ?? label}</span>;
}

/** Convierte TipoMovimiento del backend/mock al EstadoVisual correcto para el badge. */
export function tipoMovimientoAEstado(tipo: string): EstadoVisual {
  const mapa: Record<string, EstadoVisual> = {
    ENTRADA_COMPRA:           'entrada-compra',
    ENTRADA_DEVOLUCION_VENTA: 'entrada-devolucion',
    SALIDA_VENTA:             'salida-venta',
    SALIDA_DEVOLUCION_COMPRA: 'salida-devolucion',
    AJUSTE_POSITIVO:          'ajuste-positivo',
    AJUSTE_NEGATIVO:          'ajuste-negativo',
  };
  return mapa[tipo] ?? 'neutral' as EstadoVisual;
}

/** Convierte EstadoPedido al EstadoVisual correcto para el badge. */
export function estadoPedidoAEstado(estado: string): EstadoVisual {
  const mapa: Record<string, EstadoVisual> = {
    pendiente_pago:         'pendiente-pago',
    en_espera_confirmacion: 'en-espera',
    confirmado:             'confirmado',
    en_preparacion:         'en-preparacion',
    listo_entregado:        'listo-entregado',
    cancelado:              'cancelado',
  };
  return mapa[estado] ?? 'pendiente-pago';
}

/** Convierte EstadoOrdenCompra al EstadoVisual correcto para el badge. */
export function estadoOrdenCompraAEstado(estado: string): EstadoVisual {
  const mapa: Record<string, EstadoVisual> = {
    PENDIENTE:            'pendiente',
    PARCIALMENTE_RECIBIDA: 'parcialmente-recibida',
    RECIBIDA:             'recibida',
    CANCELADA:            'cancelado',
    DEVUELTA:             'devuelta',
  };
  return mapa[estado] ?? 'pendiente';
}
