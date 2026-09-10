/**
 * Mock data de Pedidos para el módulo Tienda.
 * Cubre los 6 estados del ciclo de vida del pedido.
 */
import type { Pedido } from '../../features/tienda/types';

export let PEDIDOS: Pedido[] = [
  {
    id: 1,
    codigo: 'P-2025-0001',
    fecha: '2025-02-10T10:35:00',
    estado: 'confirmado',
    modalidadEntrega: 'envio',
    clienteId: 4,
    contacto: {
      nombres: 'Junior',
      apellidos: 'Llontop',
      email: 'cliente@sanmiguel.pe',
      telefono: '987654321',
      direccion: 'Av. La Marina 2305',
      ciudad: 'Lima',
      referencia: 'Cerca al Larcomar',
    },
    metodoPago: 'tarjeta',
    importeTotal: 289.00,
    notas: '',
    detalles: [
      { id: 1, pedidoId: 1, varianteId: 1, productoNombre: 'Camisa Oxford Slim Fit', talla: 'S', color: 'Celeste', sku: 'CAM-OXF-CEL-S', cantidad: 2, precioUnitario: 89.50, subtotal: 179.00 },
      { id: 2, pedidoId: 1, varianteId: 21, productoNombre: 'Polo Piqué Lacoste', talla: 'S', color: 'Blanco', sku: 'POL-PIQ-BLA-S', cantidad: 1, precioUnitario: 110.00, subtotal: 110.00 },
    ],
  },
  {
    id: 2,
    codigo: 'P-2025-0002',
    fecha: '2025-02-14T15:05:00',
    estado: 'en_preparacion',
    modalidadEntrega: 'recojo_tienda',
    clienteId: null,
    contacto: {
      nombres: 'Lucia',
      apellidos: 'Fernández',
      email: 'lfernandez@gmail.com',
      telefono: '912345678',
      direccion: '',
      ciudad: '',
      referencia: 'Recoge en tienda',
    },
    metodoPago: 'transferencia',
    importeTotal: 440.00,
    notas: 'Llamar antes de ir a recoger',
    detalles: [
      { id: 3, pedidoId: 2, varianteId: 33, productoNombre: 'Traje Completo Ejecutivo', talla: '38', color: 'Gris Acero', sku: 'TRA-GRI-ACE-38', cantidad: 1, precioUnitario: 440.00, subtotal: 440.00 },
    ],
  },
  {
    id: 3,
    codigo: 'P-2025-0003',
    fecha: '2025-03-01T09:20:00',
    estado: 'pendiente_pago',
    modalidadEntrega: 'envio',
    clienteId: 4,
    contacto: {
      nombres: 'Junior',
      apellidos: 'Llontop',
      email: 'cliente@sanmiguel.pe',
      telefono: '987654321',
      direccion: 'Av. La Marina 2305',
      ciudad: 'Lima',
      referencia: '',
    },
    metodoPago: 'transferencia',
    importeTotal: 220.00,
    notas: '',
    detalles: [
      { id: 4, pedidoId: 3, varianteId: 27, productoNombre: 'Polo Cuello Redondo SM', talla: 'S', color: 'Negro', sku: 'POL-RED-NEG-S', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 },
      { id: 5, pedidoId: 3, varianteId: 16, productoNombre: 'Pantalón Gabardina Hugo Boss', talla: '30', color: 'Negro', sku: 'PAN-GAB-NEG-30', cantidad: 1, precioUnitario: 130.00, subtotal: 130.00 },
    ],
  },
  {
    id: 4,
    codigo: 'P-2025-0004',
    fecha: '2025-03-05T14:00:00',
    estado: 'cancelado',
    modalidadEntrega: 'envio',
    clienteId: null,
    contacto: {
      nombres: 'María',
      apellidos: 'Castillo',
      email: 'mcastillo@hotmail.com',
      telefono: '923456789',
      direccion: 'Jr. Ucayali 220',
      ciudad: 'Lima',
      referencia: '',
    },
    metodoPago: 'tarjeta',
    importeTotal: 179.80,
    notas: '',
    detalles: [
      { id: 6, pedidoId: 4, varianteId: 2, productoNombre: 'Camisa Oxford Slim Fit', talla: 'M', color: 'Celeste', sku: 'CAM-OXF-CEL-M', cantidad: 2, precioUnitario: 89.90, subtotal: 179.80 },
    ],
  },
  {
    id: 5,
    codigo: 'P-2025-0005',
    fecha: '2025-03-10T11:00:00',
    estado: 'listo_entregado',
    modalidadEntrega: 'envio',
    clienteId: 4,
    contacto: {
      nombres: 'Junior',
      apellidos: 'Llontop',
      email: 'cliente@sanmiguel.pe',
      telefono: '987654321',
      direccion: 'Av. La Marina 2305',
      ciudad: 'Lima',
      referencia: '',
    },
    metodoPago: 'tarjeta',
    importeTotal: 550.00,
    notas: '',
    detalles: [
      { id: 7, pedidoId: 5, varianteId: 33, productoNombre: 'Traje Completo Ejecutivo', talla: '38', color: 'Gris Acero', sku: 'TRA-GRI-ACE-38', cantidad: 1, precioUnitario: 440.00, subtotal: 440.00 },
      { id: 8, pedidoId: 5, varianteId: 38, productoNombre: 'Cinturón Cuero Montblanc', talla: '95cm', color: 'Marrón', sku: 'CIN-MON-MAR-95', cantidad: 1, precioUnitario: 45.00, subtotal: 45.00 },
      { id: 9, pedidoId: 5, varianteId: 42, productoNombre: 'Corbata Seda Hermès', talla: 'Único', color: 'Rojo Burdeos', sku: 'COR-HER-BUR-UNI', cantidad: 1, precioUnitario: 65.00, subtotal: 65.00 },
    ],
  },
  {
    id: 6,
    codigo: 'P-2025-0006',
    fecha: '2025-03-15T14:30:00',
    estado: 'en_espera_confirmacion',
    modalidadEntrega: 'recojo_tienda',
    clienteId: null,
    contacto: {
      nombres: 'Edgar',
      apellidos: 'Pacora',
      email: 'epacora@gmail.com',
      telefono: '934567890',
      direccion: '',
      ciudad: '',
      referencia: 'Recoge en tienda',
    },
    metodoPago: 'transferencia',
    importeTotal: 135.00,
    notas: 'Puede pagar en 2 días',
    detalles: [
      { id: 10, pedidoId: 6, varianteId: 28, productoNombre: 'Polo Cuello Redondo SM', talla: 'M', color: 'Blanco', sku: 'POL-RED-BLA-M', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 },
      { id: 11, pedidoId: 6, varianteId: 39, productoNombre: 'Cinturón Cuero Montblanc', talla: '100cm', color: 'Negro', sku: 'CIN-MON-NEG-100', cantidad: 1, precioUnitario: 45.00, subtotal: 45.00 },
    ],
  },
];

let _nextPedidoId = PEDIDOS.length + 1;
let _nextDetalleId = 12;
let _anio = new Date().getFullYear();
let _contador = PEDIDOS.length + 1;

export function nextPedidoId() { return _nextPedidoId++; }
export function nextDetalleId() { return _nextDetalleId++; }
export function nextCodigoPedido() {
  const n = String(_contador++).padStart(4, '0');
  return `P-${_anio}-${n}`;
}
