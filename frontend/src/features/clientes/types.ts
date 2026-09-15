/**
 * Tipos de dominio para el módulo de Clientes.
 * Entidades: Cliente, Direccion, ConsentimientoDatos, SolicitudARCO, SegmentacionRFM.
 */

export type TipoDocumento = 'DNI' | 'RUC' | 'CE';

export type EstadoCliente = 'activo' | 'inactivo';

export type SegmentoRFM =
  | 'VIP'             // Alta recencia, alta frecuencia, alto monto
  | 'FRECUENTE'       // Compras regulares
  | 'EN_RIESGO'       // Comprador habitual que hace tiempo no compra
  | 'INACTIVO'        // Sin compras recientes
  | 'NUEVO';          // Primera compra reciente

export type TipoDerechoARCO = 'ACCESO' | 'RECTIFICACION' | 'CANCELACION' | 'OPOSICION';

export type EstadoSolicitudARCO = 'PENDIENTE' | 'ATENDIDA' | 'RECHAZADA';

export interface Direccion {
  id: number;
  clienteId: number;
  alias: string; // ej. "Casa", "Oficina"
  departamento: string;
  provincia: string;
  distrito: string;
  direccionPostal: string;
  referencia?: string;
  esPredeterminada: boolean;
}

export interface ConsentimientoDatos {
  id: number;
  clienteId: number | null;
  email: string;
  pedidoId: number | null;
  fecha: string;
  versionPolitica: string;
  finalidad: string;
  estado: 'OTORGADO' | 'REVOCADO';
}

export interface SolicitudARCO {
  id: number;
  clienteId: number;
  clienteNombre: string;
  clienteEmail: string;
  tipoDerecho: TipoDerechoARCO;
  detalle: string;
  estado: EstadoSolicitudARCO;
  fechaSolicitud: string;
  fechaRespuesta?: string;
  respuestaAdmin?: string;
  usuarioAtendioId?: number;
  usuarioAtendioNombre?: string;
}

export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  estado: EstadoCliente;
  fechaRegistro: string;
  // Métricas RFM calculadas desde Ventas
  totalGastado: number;
  cantidadPedidos: number;
  ultimaCompraFecha?: string;
  segmentoRFM: SegmentoRFM;
  // Relaciones
  direcciones: Direccion[];
  consentimientos: ConsentimientoDatos[];
}

export interface ResumenClientes {
  totalClientes: number;
  clientesActivos: number;
  clientesVip: number;
  clientesFrecuentes: number;
  clientesEnRiesgo: number;
  clientesInactivos: number;
  clientesNuevos: number;
  pedidosInvitadosSinVincular: number;
  pedidosInvitadosVinculados: number;
  solicitudesArcoPendientes: number;
}

export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
