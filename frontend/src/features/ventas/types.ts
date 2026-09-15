/**
 * Tipos del dominio Ventas.
 * Entidades definidas en el documento fuente (sección 3.1).
 */

export type EstadoVenta = 'pendiente' | 'confirmada' | 'cancelada';
export type EstadoPago = 'pendiente' | 'confirmado' | 'rechazado';
export type TipoComprobante = 'boleta' | 'factura';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'pasarela';

export interface DetalleVenta {
  id: number;
  ventaId: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidad: number;
  /** Precio histórico al momento de la venta (RN-VEN-10). No varía si cambia el catálogo. */
  precioUnitario: number;
  subtotal: number;
}

export interface Pago {
  id: number;
  ventaId: number;
  monto: number;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  referencia: string | null; // código de transacción, nro. de operación, etc.
  fecha: string;
}

export interface Comprobante {
  id: number;
  ventaId: number;
  tipo: TipoComprobante;
  serie: string;
  numero: string;
  fechaEmision: string;
}

export interface DevolucionVenta {
  id: number;
  ventaId: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidad: number;
  motivo: string;
  montoReembolsado: number;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface Venta {
  id: number;
  fecha: string;
  /** null = comprador sin cuenta (invitado) */
  clienteId: number | null;
  clienteNombre: string;
  clienteEmail: string;
  /** Usuario interno responsable (RN-VEN-08) */
  vendedorId: number;
  vendedorNombre: string;
  importeTotal: number;
  estado: EstadoVenta;
  detalles: DetalleVenta[];
  pago: Pago;
  comprobante: Comprobante | null;
}

// ── Tipos de respuesta paginada ────────────────────────────────────────────────
export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

// ── Tipos para reportes de Ventas ──────────────────────────────────────────────
export interface ResumenVentas {
  totalVentas: number;
  totalConfirmadas: number;
  totalCanceladas: number;
  totalPendientes: number;
  importeTotal: number;
  ticketPromedio: number;
}

export interface VentaPorPeriodo {
  fecha: string;
  cantidadVentas: number;
  importeTotal: number;
}

export interface ProductoMasVendido {
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  totalUnidades: number;
  importeTotal: number;
}

export interface VentaPorMetodo {
  metodoPago: MetodoPago;
  cantidadVentas: number;
  importeTotal: number;
}

export interface VentaPorVendedor {
  vendedorId: number;
  vendedorNombre: string;
  cantidadVentas: number;
  importeTotal: number;
}

export interface VentaPorCliente {
  clienteNombre: string;
  cantidadVentas: number;
  importeTotal: number;
}
