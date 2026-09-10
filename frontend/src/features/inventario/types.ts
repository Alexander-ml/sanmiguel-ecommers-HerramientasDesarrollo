/**
 * Tipos del dominio Inventario.
 * Reflejan las entidades definidas en el documento fuente (sección 3.1).
 */

export type TipoMovimiento =
  | 'ENTRADA_COMPRA'
  | 'ENTRADA_DEVOLUCION_VENTA'
  | 'SALIDA_VENTA'
  | 'SALIDA_DEVOLUCION_COMPRA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO';

export type EstadoStock = 'normal' | 'bajo' | 'agotado';

export interface Stock {
  stockId: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidadFisica: number;
  cantidadReservada: number;
  /** Calculado: cantidadFisica - cantidadReservada. No se almacena (RN-INV-03). */
  cantidadDisponible: number;
  umbralMinimo: number;
  estadoStock: EstadoStock;
}

export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface MovimientoInventario {
  id: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
  documentoRef: string | null;
  saldoResultante: number;
  motivo: string;
}

export interface AlertaStock {
  id: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  umbralMinimo: number;
  cantidadDisponible: number;
  fechaUltimaAlerta: string | null;
  activo: boolean;
}

export interface ItemRotacion {
  productoId: number;
  productoNombre: string;
  marca: string;
  totalSalidas: number;
  stockActual: number;
  indiceRotacion: number;
}

export interface ItemValorizado {
  productoId: number;
  productoNombre: string;
  marca: string;
  unidadesTotales: number;
  precioUnitario: number;
  valorTotal: number;
}

export interface ReporteValorizado {
  items: ItemValorizado[];
  totalGeneral: number;
}
