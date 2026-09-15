import type { Rol } from '../auth/types';

export type EstadoUsuario = 'activo' | 'inactivo';

export type TipoEventoSeguridad =
  | 'LOGIN_EXITOSO'
  | 'LOGIN_FALLIDO'
  | 'LOGOUT'
  | 'SESION_REVOCADA'
  | 'CAMBIO_PASSWORD'
  | 'BLOQUEO_TEMPORAL'
  | 'USUARIO_DESACTIVADO';

export interface Permiso {
  id: string; // ej. "catalogo:leer", "inventario:ajustar", "ventas:anular"
  modulo: string; // "Catálogo", "Inventario", "Compras", "Ventas", "Pedidos", "Clientes", "Seguridad"
  accion: string; // "Ver / Consultar", "Crear / Registrar", "Modificar / Editar", "Eliminar / Anular", "Aprobar / Recepcionar"
  descripcion: string;
}

export interface RolSeguridad {
  id: string; // "ADMINISTRADOR", "ALMACENERO", "VENDEDOR", o id personalizado
  nombre: string;
  descripcion: string;
  permisos: string[]; // array de IDs de permisos
  esSistema: boolean; // roles del sistema no se pueden eliminar
}

export interface UsuarioInterno {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'ALMACENERO' | 'VENDEDOR';
  estado: EstadoUsuario;
  fechaCreacion: string;
  ultimoAcceso?: string | null;
  intentosFallidos: number;
}

export interface SesionActiva {
  id: string;
  usuarioId: number;
  usuarioNombre: string;
  usuarioCorreo: string;
  rol: Rol;
  dispositivo: string;
  ip: string;
  fechaInicio: string;
  fechaExpiracion: string;
  estado: 'vigente' | 'revocada';
}

export interface EventoSeguridad {
  id: number;
  tipoEvento: TipoEventoSeguridad;
  usuarioCorreo: string;
  ip: string;
  fecha: string;
  detalle: string;
}

export interface ResumenSeguridad {
  totalUsuarios: number;
  usuariosActivos: number;
  totalRoles: number;
  sesionesActivas: number;
  intentosFallidos24h: number;
}

export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
