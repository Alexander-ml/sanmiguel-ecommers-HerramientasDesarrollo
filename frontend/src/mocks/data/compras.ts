/**
 * Mock data para el módulo de Compras.
 * Entidades: Proveedores, Órdenes de Compra, Recepciones y Devoluciones.
 */
import type {
  Proveedor,
  OrdenCompra,
  RecepcionCompra,
  DevolucionProveedor,
} from '../../features/compras/types';

export let PROVEEDORES: Proveedor[] = [
  {
    id: 1,
    razonSocial: 'Textiles del Norte S.A.C.',
    ruc: '20458923412',
    contacto: {
      nombre: 'Miguel Ángel Benites',
      telefono: '074-234567',
      email: 'ventas@textilesdelnorte.pe',
    },
    direccion: 'Av. El Sol 450, Chiclayo, Lambayeque',
    condicionesComerciales: 'Crédito a 30 días · Descuento 5% por pronto pago',
    estado: 'activo',
    fechaRegistro: '2024-01-15T09:00:00',
  },
  {
    id: 2,
    razonSocial: 'Confecciones San Cristóbal E.I.R.L.',
    ruc: '20567812903',
    contacto: {
      nombre: 'Rosa María Chávez',
      telefono: '978123456',
      email: 'pedidos@confeccionessancristobal.com',
    },
    direccion: 'Jr. Gamarra 820, La Victoria, Lima',
    condicionesComerciales: 'Contado contra entrega · Despacho a provincia',
    estado: 'activo',
    fechaRegistro: '2024-03-10T11:30:00',
  },
  {
    id: 3,
    razonSocial: 'Distribuidora Textil Gamarra S.A.',
    ruc: '20123456789',
    contacto: {
      nombre: 'Ernesto Prado Vega',
      telefono: '01-4567890',
      email: 'eprado@textilgamarra.pe',
    },
    direccion: 'Av. Aviación 1420, Of. 302, Lima',
    condicionesComerciales: 'Crédito a 15 días · Pedido mínimo 50 unidades',
    estado: 'activo',
    fechaRegistro: '2024-05-20T14:15:00',
  },
  {
    id: 4,
    razonSocial: 'Cueros & Accesorios Peruanos S.A.C.',
    ruc: '20601234567',
    contacto: {
      nombre: 'Víctor Manuel Quiroga',
      telefono: '944882211',
      email: 'vquiroga@cuerosaccesorios.pe',
    },
    direccion: 'Calle Los Artesanos 115, Trujillo, La Libertad',
    condicionesComerciales: '50% adelanto, 50% contra entrega',
    estado: 'activo',
    fechaRegistro: '2024-08-01T10:00:00',
  },
  {
    id: 5,
    razonSocial: 'Importadora y Comercializadora Chiclayo S.R.L.',
    ruc: '20334455667',
    contacto: {
      nombre: 'Felipe Mendoza Soto',
      telefono: '074-289900',
      email: 'fmendoza@importadorachiclayo.com',
    },
    direccion: 'Calle San José 740, Chiclayo',
    condicionesComerciales: 'Contado en efectivo',
    estado: 'inactivo',
    fechaRegistro: '2023-11-12T16:00:00',
  },
];

export let RECEPCIONES: RecepcionCompra[] = [
  {
    id: 1,
    compraId: 1,
    codigoRecepcion: 'REC-2025-0001',
    fechaRecepcion: '2025-01-20T11:00:00',
    usuarioReceptorId: 2,
    usuarioReceptorNombre: 'Juan Pérez (Almacenero)',
    comprobanteReferencia: 'GR-001-00892',
    notas: 'Recepción completa y conforme en almacén central.',
    lineas: [
      { varianteId: 1, cantidadRecibida: 25 },
      { varianteId: 2, cantidadRecibida: 25 },
      { varianteId: 21, cantidadRecibida: 20 },
    ],
  },
  {
    id: 2,
    compraId: 2,
    codigoRecepcion: 'REC-2025-0002',
    fechaRecepcion: '2025-02-12T15:30:00',
    usuarioReceptorId: 2,
    usuarioReceptorNombre: 'Juan Pérez (Almacenero)',
    comprobanteReferencia: 'F001-000452',
    notas: 'Entrega parcial de trajes ejecutivos. Faltan los pantalones de gabardina.',
    lineas: [
      { varianteId: 33, cantidadRecibida: 15 },
    ],
  },
];

export let DEVOLUCIONES_PROVEEDOR: DevolucionProveedor[] = [
  {
    id: 1,
    compraId: 1,
    recepcionId: 1,
    codigoDevolucion: 'DEV-2025-0001',
    varianteId: 1,
    productoNombre: 'Camisa Oxford Slim Fit',
    talla: 'S',
    color: 'Celeste',
    sku: 'CAM-OXF-CEL-S',
    cantidad: 2,
    motivo: 'Costura defectuosa en cuello y puños de 2 prendas.',
    fecha: '2025-01-22T10:00:00',
    usuarioId: 2,
    usuarioNombre: 'Juan Pérez',
  },
];

export let ORDENES_COMPRA: OrdenCompra[] = [
  {
    id: 1,
    codigo: 'OC-2025-0001',
    proveedorId: 1,
    proveedorNombre: 'Textiles del Norte S.A.C.',
    proveedorRuc: '20458923412',
    fechaCreacion: '2025-01-15T10:00:00',
    fechaEstimadaEntrega: '2025-01-20T00:00:00',
    estado: 'RECIBIDA',
    totalEstimado: 3425.00,
    usuarioCreadorId: 2,
    usuarioCreadorNombre: 'Juan Pérez',
    notas: 'Pedido para reabastecimiento de camisas de temporada.',
    lineas: [
      {
        id: 1,
        compraId: 1,
        varianteId: 1,
        productoId: 1,
        productoNombre: 'Camisa Oxford Slim Fit',
        talla: 'S',
        color: 'Celeste',
        sku: 'CAM-OXF-CEL-S',
        cantidadPedida: 25,
        cantidadRecibida: 25,
        costoUnitario: 45.00,
        subtotal: 1125.00,
      },
      {
        id: 2,
        compraId: 1,
        varianteId: 2,
        productoId: 1,
        productoNombre: 'Camisa Oxford Slim Fit',
        talla: 'M',
        color: 'Celeste',
        sku: 'CAM-OXF-CEL-M',
        cantidadPedida: 25,
        cantidadRecibida: 25,
        costoUnitario: 45.00,
        subtotal: 1125.00,
      },
      {
        id: 3,
        compraId: 1,
        varianteId: 21,
        productoId: 4,
        productoNombre: 'Polo Piqué Lacoste',
        talla: 'S',
        color: 'Blanco',
        sku: 'POL-PIQ-BLA-S',
        cantidadPedida: 20,
        cantidadRecibida: 20,
        costoUnitario: 58.75,
        subtotal: 1175.00,
      },
    ],
    recepciones: [RECEPCIONES[0]],
    devoluciones: [DEVOLUCIONES_PROVEEDOR[0]],
  },
  {
    id: 2,
    codigo: 'OC-2025-0002',
    proveedorId: 2,
    proveedorNombre: 'Confecciones San Cristóbal E.I.R.L.',
    proveedorRuc: '20567812903',
    fechaCreacion: '2025-02-05T09:30:00',
    fechaEstimadaEntrega: '2025-02-15T00:00:00',
    estado: 'PARCIALMENTE_RECIBIDA',
    totalEstimado: 5100.00,
    usuarioCreadorId: 2,
    usuarioCreadorNombre: 'Juan Pérez',
    notas: 'Trajes de oficina y pantalones de gabardina.',
    lineas: [
      {
        id: 4,
        compraId: 2,
        varianteId: 33,
        productoId: 6,
        productoNombre: 'Traje Completo Ejecutivo',
        talla: '38',
        color: 'Gris Acero',
        sku: 'TRA-GRI-ACE-38',
        cantidadPedida: 15,
        cantidadRecibida: 15,
        costoUnitario: 240.00,
        subtotal: 3600.00,
      },
      {
        id: 5,
        compraId: 2,
        varianteId: 16,
        productoId: 3,
        productoNombre: 'Pantalón Gabardina Hugo Boss',
        talla: '30',
        color: 'Negro',
        sku: 'PAN-GAB-NEG-30',
        cantidadPedida: 20,
        cantidadRecibida: 0,
        costoUnitario: 75.00,
        subtotal: 1500.00,
      },
    ],
    recepciones: [RECEPCIONES[1]],
    devoluciones: [],
  },
  {
    id: 3,
    codigo: 'OC-2025-0003',
    proveedorId: 3,
    proveedorNombre: 'Distribuidora Textil Gamarra S.A.',
    proveedorRuc: '20123456789',
    fechaCreacion: '2025-03-01T14:20:00',
    fechaEstimadaEntrega: '2025-03-10T00:00:00',
    estado: 'PENDIENTE',
    totalEstimado: 1800.00,
    usuarioCreadorId: 2,
    usuarioCreadorNombre: 'Juan Pérez',
    notas: 'Lote de polos cuello redondo para reposición de stock mínimo.',
    lineas: [
      {
        id: 6,
        compraId: 3,
        varianteId: 27,
        productoId: 5,
        productoNombre: 'Polo Cuello Redondo SM',
        talla: 'S',
        color: 'Negro',
        sku: 'POL-RED-NEG-S',
        cantidadPedida: 40,
        cantidadRecibida: 0,
        costoUnitario: 22.50,
        subtotal: 900.00,
      },
      {
        id: 7,
        compraId: 3,
        varianteId: 28,
        productoId: 5,
        productoNombre: 'Polo Cuello Redondo SM',
        talla: 'M',
        color: 'Blanco',
        sku: 'POL-RED-BLA-M',
        cantidadPedida: 40,
        cantidadRecibida: 0,
        costoUnitario: 22.50,
        subtotal: 900.00,
      },
    ],
    recepciones: [],
    devoluciones: [],
  },
  {
    id: 4,
    codigo: 'OC-2025-0004',
    proveedorId: 4,
    proveedorNombre: 'Cueros & Accesorios Peruanos S.A.C.',
    proveedorRuc: '20601234567',
    fechaCreacion: '2025-02-18T16:00:00',
    fechaEstimadaEntrega: '2025-02-25T00:00:00',
    estado: 'CANCELADA',
    totalEstimado: 750.00,
    usuarioCreadorId: 2,
    usuarioCreadorNombre: 'Juan Pérez',
    notas: 'Orden cancelada por demora del proveedor en despachar materias primas.',
    lineas: [
      {
        id: 8,
        compraId: 4,
        varianteId: 37,
        productoId: 7,
        productoNombre: 'Cinturón Cuero Montblanc',
        talla: '90cm',
        color: 'Negro',
        sku: 'CIN-MON-NEG-90',
        cantidadPedida: 30,
        cantidadRecibida: 0,
        costoUnitario: 25.00,
        subtotal: 750.00,
      },
    ],
    recepciones: [],
    devoluciones: [],
  },
];

let _nextProveedorId = PROVEEDORES.length + 1;
let _nextOrdenId = ORDENES_COMPRA.length + 1;
let _nextDetalleCompraId = 9;
let _nextRecepcionId = RECEPCIONES.length + 1;
let _nextDevolucionId = DEVOLUCIONES_PROVEEDOR.length + 1;
let _contadorOC = ORDENES_COMPRA.length + 1;
let _contadorRec = RECEPCIONES.length + 1;
let _contadorDev = DEVOLUCIONES_PROVEEDOR.length + 1;

export function nextProveedorId() { return _nextProveedorId++; }
export function nextOrdenId() { return _nextOrdenId++; }
export function nextDetalleCompraId() { return _nextDetalleCompraId++; }
export function nextRecepcionId() { return _nextRecepcionId++; }
export function nextDevolucionId() { return _nextDevolucionId++; }

export function nextCodigoOC() {
  const anio = new Date().getFullYear();
  const n = String(_contadorOC++).padStart(4, '0');
  return `OC-${anio}-${n}`;
}

export function nextCodigoRecepcion() {
  const anio = new Date().getFullYear();
  const n = String(_contadorRec++).padStart(4, '0');
  return `REC-${anio}-${n}`;
}

export function nextCodigoDevolucion() {
  const anio = new Date().getFullYear();
  const n = String(_contadorDev++).padStart(4, '0');
  return `DEV-${anio}-${n}`;
}
