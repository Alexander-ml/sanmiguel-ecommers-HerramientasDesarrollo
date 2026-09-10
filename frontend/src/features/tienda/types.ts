/**
 * Tipos del dominio Tienda.
 * Entidades: Carrito (local), Pedido, DetallePedido.
 */

export type EstadoPedido =
  | 'pendiente_pago'
  | 'en_espera_confirmacion'
  | 'confirmado'
  | 'en_preparacion'
  | 'listo_entregado'
  | 'cancelado';

export type ModalidadEntrega = 'envio' | 'recojo_tienda';

export interface ItemCarrito {
  varianteId: number;
  productoId: number;
  productoNombre: string;
  marca: string;
  talla: string;
  color: string;
  sku: string;
  imagenUrl: string | null;
  precioUnitario: number;
  cantidad: number;
}

export interface DireccionEnvio {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  referencia: string;
}

export interface DetallePedido {
  id: number;
  pedidoId: number;
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  sku: string;
  cantidad: number;
  /** Precio congelado al momento del pedido (no cambia si el catálogo cambia) */
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  codigo: string; // P-YYYY-NNNN
  fecha: string;
  estado: EstadoPedido;
  modalidadEntrega: ModalidadEntrega;
  /** null = invitado (RN-TIE-03) */
  clienteId: number | null;
  contacto: DireccionEnvio;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'pasarela';
  importeTotal: number;
  detalles: DetallePedido[];
  notas: string;
}

export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

/**
 * Vista pública de seguimiento por código (RF-TIE-018): expone solo lo necesario para que
 * cualquiera con el código vea el avance, sin exponer contacto/cliente de otra persona.
 */
export type PedidoSeguimientoPublico = Pick<
  Pedido,
  'codigo' | 'fecha' | 'estado' | 'modalidadEntrega' | 'importeTotal' | 'detalles'
>;

export interface ResumenPedidos {
  pendientePago: number;
  enEsperaConfirmacion: number;
  confirmados: number;
  enPreparacion: number;
  listos: number;
  cancelados: number;
  total: number;
}
