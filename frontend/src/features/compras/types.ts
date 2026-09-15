/**
 * Tipos de dominio para el módulo de Compras.
 * Entidades: Proveedor, OrdenCompra, DetalleCompra, RecepcionCompra, DevolucionProveedor.
 */

export type EstadoOrdenCompra =
  | 'PENDIENTE'
  | 'PARCIALMENTE_RECIBIDA'
  | 'RECIBIDA'
  | 'CANCELADA'
  | 'DEVUELTA';

export type EstadoProveedor = 'activo' | 'inactivo';

export interface ContactoProveedor {
  nombre: string;
  telefono: string;
  email: string;
}

export interface Proveedor {
  id: number;
  razonSocial: string;
  ruc: string;
  contacto: ContactoProveedor;
  direccion: string;
  condicionesComerciales: string; // ej. "Crédito 30 días", "Contado contra entrega", "50% adelanto"
  estado: EstadoProveedor;
  fechaRegistro: string;
}

export interface DetalleCompra {
  id: number;
  compraId: number;
  varianteId: number;
  productoId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidadPedida: number;
  cantidadRecibida: number; // calculado a partir de recepciones menos devoluciones
  costoUnitario: number;    // RN-COM-07
  subtotal: number;
}

export interface LineaRecepcion {
  varianteId: number;
  cantidadRecibida: number;
}

export interface RecepcionCompra {
  id: number;
  compraId: number;
  codigoRecepcion: string; // REC-2025-0001
  fechaRecepcion: string;
  usuarioReceptorId: number;
  usuarioReceptorNombre: string;
  comprobanteReferencia?: string; // Guía de remisión o factura del proveedor
  notas?: string;
  lineas: LineaRecepcion[];
}

export interface DevolucionProveedor {
  id: number;
  compraId: number;
  recepcionId: number;
  codigoDevolucion: string; // DEV-2025-0001
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidad: number;
  motivo: string;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface OrdenCompra {
  id: number;
  codigo: string; // OC-2025-0001
  proveedorId: number;
  proveedorNombre: string;
  proveedorRuc: string;
  fechaCreacion: string;
  fechaEstimadaEntrega?: string;
  estado: EstadoOrdenCompra; // RN-COM-05: calculado
  totalEstimado: number;
  usuarioCreadorId: number;
  usuarioCreadorNombre: string;
  notas?: string;
  lineas: DetalleCompra[];
  recepciones: RecepcionCompra[];
  devoluciones: DevolucionProveedor[];
}

export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface ResumenCompras {
  totalOrdenes: number;
  pendientes: number;
  parcialmenteRecibidas: number;
  recibidas: number;
  canceladas: number;
  gastoTotal: number;
  totalProveedores: number;
}

export interface GastoProveedor {
  proveedorId: number;
  proveedorNombre: string;
  totalOrdenes: number;
  montoTotal: number;
}

export interface ComparativoCosto {
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  costoMinimo: number;
  costoMaximo: number;
  costoPromedio: number;
  vecesComprado: number;
}

export interface TiempoEntregaProveedor {
  proveedorId: number;
  proveedorNombre: string;
  diasPromedio: number;
  ordenesConsideradas: number;
}

export interface TasaDevolucionCompras {
  totalUnidadesRecibidas: number;
  totalUnidadesDevueltas: number;
  tasaDevolucion: number;
}
