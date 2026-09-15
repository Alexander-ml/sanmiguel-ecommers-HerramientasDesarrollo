/**
 * Mock data para el módulo de Usuarios y Seguridad.
 * Cuentas internas, roles, permisos granulares, sesiones y auditoría.
 */
import type {
  UsuarioInterno,
  RolSeguridad,
  Permiso,
  SesionActiva,
  EventoSeguridad,
} from '../../features/usuarios/types';

export let PERMISOS_SISTEMA: Permiso[] = [
  // Catálogo
  { id: 'catalogo:leer', modulo: 'Catálogo', accion: 'Consultar productos y categorías', descripcion: 'Ver prendas, variantes y categorías del catálogo' },
  { id: 'catalogo:crear', modulo: 'Catálogo', accion: 'Crear productos y variantes', descripcion: 'Registrar nuevas prendas y combinaciones de talla/color' },
  { id: 'catalogo:editar', modulo: 'Catálogo', accion: 'Modificar productos y precios', descripcion: 'Actualizar fichas técnicas y precios base' },
  { id: 'catalogo:baja', modulo: 'Catálogo', accion: 'Dar de baja productos', descripcion: 'Desactivar prendas del catálogo activo' },

  // Inventario
  { id: 'inventario:leer', modulo: 'Inventario', accion: 'Consultar stock físico y disponible', descripcion: 'Ver cantidades en almacén y reservadas' },
  { id: 'inventario:ajuste', modulo: 'Inventario', accion: 'Registrar ajustes de inventario', descripcion: 'Registrar aumentos o mermas con justificación inmutable' },
  { id: 'inventario:alertas', modulo: 'Inventario', accion: 'Configurar umbrales de stock mínimo', descripcion: 'Fijar alertas para reposición de mercadería' },
  { id: 'inventario:kardex', modulo: 'Inventario', accion: 'Consultar Kardex de movimientos', descripcion: 'Auditar historial inmutable de movimientos' },

  // Compras
  { id: 'compras:leer', modulo: 'Compras', accion: 'Consultar órdenes y proveedores', descripcion: 'Ver órdenes de compra y directorio de proveedores' },
  { id: 'compras:crear', modulo: 'Compras', accion: 'Emitir órdenes de compra', descripcion: 'Crear solicitudes de mercadería a proveedores' },
  { id: 'compras:recepcionar', modulo: 'Compras', accion: 'Confirmar recepción de mercadería', descripcion: 'Recepcionar total o parcialmente e ingresar a stock' },
  { id: 'compras:devolver', modulo: 'Compras', accion: 'Registrar devolución por defecto', descripcion: 'Devolver prendas defectuosas y dar de baja en inventario' },
  { id: 'compras:cancelar', modulo: 'Compras', accion: 'Cancelar órdenes pendientes', descripcion: 'Anular compras sin recepciones registradas' },

  // Ventas
  { id: 'ventas:leer', modulo: 'Ventas', accion: 'Consultar ventas y comprobantes', descripcion: 'Ver transacciones comerciales emitidas' },
  { id: 'ventas:crear', modulo: 'Ventas', accion: 'Registrar venta directa', descripcion: 'Emitir ventas en mostrador con deducción de stock' },
  { id: 'ventas:anular', modulo: 'Ventas', accion: 'Anular ventas', descripcion: 'Cancelar venta y reintegrar stock al inventario' },
  { id: 'ventas:devolucion', modulo: 'Ventas', accion: 'Registrar devoluciones de clientes', descripcion: 'Aceptar devoluciones por cambio o falla' },

  // Pedidos Web (Tienda)
  { id: 'pedidos:leer', modulo: 'Pedidos Web', accion: 'Consultar pedidos en línea', descripcion: 'Ver órdenes generadas en el e-commerce' },
  { id: 'pedidos:atender', modulo: 'Pedidos Web', accion: 'Actualizar estado de preparación', descripcion: 'Marcar pedidos en preparación y listos para entrega' },
  { id: 'pedidos:cancelar', modulo: 'Pedidos Web', accion: 'Cancelar pedidos no pagados', descripcion: 'Liberar stock de pedidos web anulados' },

  // Clientes
  { id: 'clientes:leer', modulo: 'Clientes', accion: 'Consultar directorio de clientes', descripcion: 'Ver lista de compradores y segmentos RFM' },
  { id: 'clientes:editar', modulo: 'Clientes', accion: 'Modificar estado de clientes', descripcion: 'Activar o desactivar cuentas de compradores' },
  { id: 'clientes:arco', modulo: 'Clientes', accion: 'Atender derechos ARCO (Ley 29733)', descripcion: 'Evaluar solicitudes de cancelación y rectificación' },

  // Seguridad
  { id: 'seguridad:usuarios', modulo: 'Seguridad', accion: 'Administrar usuarios internos', descripcion: 'Alta, edición y desactivación de personal' },
  { id: 'seguridad:roles', modulo: 'Seguridad', accion: 'Configurar roles y permisos', descripcion: 'Definir matriz de autorización del sistema' },
  { id: 'seguridad:sesiones', modulo: 'Seguridad', accion: 'Auditar y revocar sesiones', descripcion: 'Ver conexiones activas y forzar cierre de sesión' },
];

export let ROLES_SEGURIDAD: RolSeguridad[] = [
  {
    id: 'ADMINISTRADOR',
    nombre: 'Administrador del Sistema',
    descripcion: 'Control total de todos los módulos, auditoría, configuración y seguridad.',
    permisos: PERMISOS_SISTEMA.map((p) => p.id),
    esSistema: true,
  },
  {
    id: 'ALMACENERO',
    nombre: 'Almacenero / Encargado de Almacén',
    descripcion: 'Gestión completa de stock, catálogo, recepción de compras y devoluciones de proveedores.',
    permisos: [
      'catalogo:leer', 'catalogo:crear', 'catalogo:editar', 'catalogo:baja',
      'inventario:leer', 'inventario:ajuste', 'inventario:alertas', 'inventario:kardex',
      'compras:leer', 'compras:crear', 'compras:recepcionar', 'compras:devolver', 'compras:cancelar',
    ],
    esSistema: true,
  },
  {
    id: 'VENDEDOR',
    nombre: 'Vendedor / Asesor Comercial',
    descripcion: 'Atención de ventas, gestión de pedidos web y consulta de catálogo y existencias.',
    permisos: [
      'catalogo:leer',
      'inventario:leer',
      'ventas:leer', 'ventas:crear', 'ventas:anular', 'ventas:devolucion',
      'pedidos:leer', 'pedidos:atender', 'pedidos:cancelar',
    ],
    esSistema: true,
  },
];

export let USUARIOS_INTERNOS: UsuarioInterno[] = [
  {
    id: 1,
    nombres: 'Ana',
    apellidos: 'Flores Silva',
    correo: 'admin@sanmiguel.pe',
    rol: 'ADMINISTRADOR',
    estado: 'activo',
    fechaCreacion: '2024-01-01T08:00:00',
    ultimoAcceso: '2025-03-02T16:45:00',
    intentosFallidos: 0,
  },
  {
    id: 2,
    nombres: 'Pedro',
    apellidos: 'Quispe Mamani',
    correo: 'almacenero@sanmiguel.pe',
    rol: 'ALMACENERO',
    estado: 'activo',
    fechaCreacion: '2024-01-15T09:30:00',
    ultimoAcceso: '2025-03-02T14:10:00',
    intentosFallidos: 0,
  },
  {
    id: 3,
    nombres: 'Carlos',
    apellidos: 'Mendo Vargas',
    correo: 'vendedor@sanmiguel.pe',
    rol: 'VENDEDOR',
    estado: 'activo',
    fechaCreacion: '2024-02-01T11:00:00',
    ultimoAcceso: '2025-03-01T18:30:00',
    intentosFallidos: 0,
  },
  {
    id: 4,
    nombres: 'Laura',
    apellidos: 'Pacheco Dávila',
    correo: 'lpacheco@sanmiguel.pe',
    rol: 'ALMACENERO',
    estado: 'inactivo', // Cuenta desactivada para probar RN-USR-05
    fechaCreacion: '2024-03-10T10:00:00',
    ultimoAcceso: '2024-11-20T17:00:00',
    intentosFallidos: 0,
  },
  {
    id: 5,
    nombres: 'Fernando',
    apellidos: 'Ruiz Morales',
    correo: 'fruiz@sanmiguel.pe',
    rol: 'VENDEDOR',
    estado: 'activo',
    fechaCreacion: '2024-06-15T15:00:00',
    ultimoAcceso: '2025-02-27T12:20:00',
    intentosFallidos: 1,
  },
];

export let SESIONES_ACTIVAS: SesionActiva[] = [
  {
    id: 'ses-101',
    usuarioId: 1,
    usuarioNombre: 'Ana Flores',
    usuarioCorreo: 'admin@sanmiguel.pe',
    rol: 'ADMINISTRADOR',
    dispositivo: 'Chrome 122 en Windows 11',
    ip: '190.237.45.12',
    fechaInicio: '2025-03-02T15:30:00',
    fechaExpiracion: '2025-03-02T23:30:00',
    estado: 'vigente',
  },
  {
    id: 'ses-102',
    usuarioId: 2,
    usuarioNombre: 'Pedro Quispe',
    usuarioCorreo: 'almacenero@sanmiguel.pe',
    rol: 'ALMACENERO',
    dispositivo: 'Firefox 123 en Linux Ubuntu',
    ip: '190.237.45.18',
    fechaInicio: '2025-03-02T08:15:00',
    fechaExpiracion: '2025-03-02T18:15:00',
    estado: 'vigente',
  },
  {
    id: 'ses-103',
    usuarioId: 3,
    usuarioNombre: 'Carlos Mendo',
    usuarioCorreo: 'vendedor@sanmiguel.pe',
    rol: 'VENDEDOR',
    dispositivo: 'Safari 17 en macOS Sonoma',
    ip: '200.48.112.55',
    fechaInicio: '2025-03-01T14:00:00',
    fechaExpiracion: '2025-03-02T22:00:00',
    estado: 'vigente',
  },
];

export let EVENTOS_SEGURIDAD: EventoSeguridad[] = [
  {
    id: 1,
    tipoEvento: 'LOGIN_EXITOSO',
    usuarioCorreo: 'admin@sanmiguel.pe',
    ip: '190.237.45.12',
    fecha: '2025-03-02T15:30:00',
    detalle: 'Autenticación correcta con credenciales válidas y rol ADMINISTRADOR.',
  },
  {
    id: 2,
    tipoEvento: 'LOGIN_EXITOSO',
    usuarioCorreo: 'almacenero@sanmiguel.pe',
    ip: '190.237.45.18',
    fecha: '2025-03-02T08:15:00',
    detalle: 'Inicio de sesión exitoso desde estación de almacén.',
  },
  {
    id: 3,
    tipoEvento: 'LOGIN_FALLIDO',
    usuarioCorreo: 'fruiz@sanmiguel.pe',
    ip: '179.6.14.92',
    fecha: '2025-03-02T03:12:00',
    detalle: 'Contraseña errónea ingresada en intento de acceso nocturno.',
  },
  {
    id: 4,
    tipoEvento: 'SESION_REVOCADA',
    usuarioCorreo: 'lpacheco@sanmiguel.pe',
    ip: '190.237.45.12',
    fecha: '2024-11-20T17:00:00',
    detalle: 'Sesión invalidada de inmediato tras desactivación de cuenta de personal (RN-USR-03).',
  },
];

let _nextUsuarioId = 6;
let _nextEventoId = 5;

export function nextUsuarioId() { return _nextUsuarioId++; }
export function nextEventoId() { return _nextEventoId++; }
export function nextSesionId() { return `ses-${Date.now().toString(36)}`; }
