/**
 * Datos de demostración para el módulo Ventas.
 */
import type { Venta, DevolucionVenta, Pago, Comprobante, DetalleVenta } from '../../features/ventas/types';

export type { Venta, DetalleVenta, Pago, Comprobante, DevolucionVenta };

export let VENTAS: Venta[] = [
  {
    id: 1,
    fecha: '2025-02-10T10:30:00',
    clienteId: 4,
    clienteNombre: 'Junior Llontop',
    clienteEmail: 'cliente@sanmiguel.pe',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 289.00,
    estado: 'confirmada',
    detalles: [
      { id: 1, ventaId: 1, varianteId: 1, productoNombre: 'Camisa Oxford Slim Fit', talla: 'S', color: 'Celeste', sku: 'CAM-OXF-CEL-S', cantidad: 2, precioUnitario: 89.50, subtotal: 179.00 },
      { id: 2, ventaId: 1, varianteId: 21, productoNombre: 'Polo Piqué Lacoste', talla: 'S', color: 'Blanco', sku: 'POL-PIQ-BLA-S', cantidad: 1, precioUnitario: 110.00, subtotal: 110.00 },
    ],
    pago: { id: 1, ventaId: 1, monto: 289.00, metodoPago: 'tarjeta', estado: 'confirmado', referencia: 'TXN-4521-A', fecha: '2025-02-10T10:32:00' },
    comprobante: { id: 1, ventaId: 1, tipo: 'boleta', serie: 'B001', numero: '00000001', fechaEmision: '2025-02-10T10:33:00' },
  },
  {
    id: 2,
    fecha: '2025-02-14T15:00:00',
    clienteId: null,
    clienteNombre: 'Lucia Fernández',
    clienteEmail: 'lfernandez@gmail.com',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 440.00,
    estado: 'confirmada',
    detalles: [
      { id: 3, ventaId: 2, varianteId: 33, productoNombre: 'Traje Completo Ejecutivo', talla: '38', color: 'Gris Acero', sku: 'TRA-GRI-ACE-38', cantidad: 1, precioUnitario: 440.00, subtotal: 440.00 },
    ],
    pago: { id: 2, ventaId: 2, monto: 440.00, metodoPago: 'transferencia', estado: 'confirmado', referencia: 'BCP-892341', fecha: '2025-02-14T15:05:00' },
    comprobante: { id: 2, ventaId: 2, tipo: 'factura', serie: 'F001', numero: '00000001', fechaEmision: '2025-02-14T15:06:00' },
  },
  {
    id: 3,
    fecha: '2025-02-20T11:30:00',
    clienteId: 4,
    clienteNombre: 'Junior Llontop',
    clienteEmail: 'cliente@sanmiguel.pe',
    vendedorId: 1,
    vendedorNombre: 'Ana Flores',
    importeTotal: 327.50,
    estado: 'confirmada',
    detalles: [
      { id: 4, ventaId: 3, varianteId: 12, productoNombre: "Jean Clásico Levi's 501", talla: '30', color: 'Azul Oscuro', sku: 'JEA-LEV-AOC-30', cantidad: 1, precioUnitario: 189.90, subtotal: 189.90 },
      { id: 5, ventaId: 3, varianteId: 22, productoNombre: 'Polo Piqué Lacoste', talla: 'M', color: 'Blanco', sku: 'POL-PIQ-BLA-M', cantidad: 1, precioUnitario: 110.00, subtotal: 110.00 },
      { id: 6, ventaId: 3, varianteId: 41, productoNombre: 'Corbata Seda Hermès', talla: 'Único', color: 'Azul Navy', sku: 'COR-HER-NAV-UNI', cantidad: 1, precioUnitario: 27.60, subtotal: 27.60 },
    ],
    pago: { id: 3, ventaId: 3, monto: 327.50, metodoPago: 'efectivo', estado: 'confirmado', referencia: null, fecha: '2025-02-20T11:32:00' },
    comprobante: { id: 3, ventaId: 3, tipo: 'boleta', serie: 'B001', numero: '00000002', fechaEmision: '2025-02-20T11:33:00' },
  },
  {
    id: 4,
    fecha: '2025-02-25T16:30:00',
    clienteId: null,
    clienteNombre: 'Roberto Saavedra',
    clienteEmail: 'rsaavedra@empresa.pe',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 660.00,
    estado: 'confirmada',
    detalles: [
      { id: 7, ventaId: 4, varianteId: 9, productoNombre: 'Camisa Cuadros Casual', talla: 'L', color: 'Azul/Blanco', sku: 'CAM-CUA-AZB-L', cantidad: 2, precioUnitario: 65.00, subtotal: 130.00 },
      { id: 8, ventaId: 4, varianteId: 34, productoNombre: 'Traje Completo Ejecutivo', talla: '40', color: 'Azul Marino', sku: 'TRA-AZM-MAR-40', cantidad: 1, precioUnitario: 440.00, subtotal: 440.00 },
      { id: 9, ventaId: 4, varianteId: 37, productoNombre: 'Cinturón Cuero Montblanc', talla: '90cm', color: 'Negro', sku: 'CIN-MON-NEG-90', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 },
    ],
    pago: { id: 4, ventaId: 4, monto: 660.00, metodoPago: 'tarjeta', estado: 'confirmado', referencia: 'TXN-8811-B', fecha: '2025-02-25T16:32:00' },
    comprobante: { id: 4, ventaId: 4, tipo: 'factura', serie: 'F001', numero: '00000002', fechaEmision: '2025-02-25T16:33:00' },
  },
  {
    id: 5,
    fecha: '2025-03-01T09:15:00',
    clienteId: 4,
    clienteNombre: 'Junior Llontop',
    clienteEmail: 'cliente@sanmiguel.pe',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 220.00,
    estado: 'pendiente',
    detalles: [
      { id: 10, ventaId: 5, varianteId: 27, productoNombre: 'Polo Cuello Redondo SM', talla: 'S', color: 'Negro', sku: 'POL-RED-NEG-S', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 },
      { id: 11, ventaId: 5, varianteId: 16, productoNombre: 'Pantalón Gabardina Hugo Boss', talla: '30', color: 'Negro', sku: 'PAN-GAB-NEG-30', cantidad: 1, precioUnitario: 130.00, subtotal: 130.00 },
    ],
    pago: { id: 5, ventaId: 5, monto: 220.00, metodoPago: 'transferencia', estado: 'pendiente', referencia: null, fecha: '2025-03-01T09:15:00' },
    comprobante: null,
  },
  {
    id: 6,
    fecha: '2025-03-05T14:00:00',
    clienteId: null,
    clienteNombre: 'María Castillo',
    clienteEmail: 'mcastillo@hotmail.com',
    vendedorId: 1,
    vendedorNombre: 'Ana Flores',
    importeTotal: 179.80,
    estado: 'cancelada',
    detalles: [
      { id: 12, ventaId: 6, varianteId: 2, productoNombre: 'Camisa Oxford Slim Fit', talla: 'M', color: 'Celeste', sku: 'CAM-OXF-CEL-M', cantidad: 2, precioUnitario: 89.90, subtotal: 179.80 },
    ],
    pago: { id: 6, ventaId: 6, monto: 179.80, metodoPago: 'tarjeta', estado: 'rechazado', referencia: null, fecha: '2025-03-05T14:01:00' },
    comprobante: null,
  },
  {
    id: 7,
    fecha: '2025-03-10T10:45:00',
    clienteId: 4,
    clienteNombre: 'Junior Llontop',
    clienteEmail: 'cliente@sanmiguel.pe',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 550.00,
    estado: 'confirmada',
    detalles: [
      { id: 13, ventaId: 7, varianteId: 33, productoNombre: 'Traje Completo Ejecutivo', talla: '38', color: 'Gris Acero', sku: 'TRA-GRI-ACE-38', cantidad: 1, precioUnitario: 440.00, subtotal: 440.00 },
      { id: 14, ventaId: 7, varianteId: 38, productoNombre: 'Cinturón Cuero Montblanc', talla: '95cm', color: 'Marrón', sku: 'CIN-MON-MAR-95', cantidad: 1, precioUnitario: 45.00, subtotal: 45.00 },
      { id: 15, ventaId: 7, varianteId: 42, productoNombre: 'Corbata Seda Hermès', talla: 'Único', color: 'Rojo Burdeos', sku: 'COR-HER-BUR-UNI', cantidad: 1, precioUnitario: 65.00, subtotal: 65.00 },
    ],
    pago: { id: 7, ventaId: 7, monto: 550.00, metodoPago: 'tarjeta', estado: 'confirmado', referencia: 'TXN-9932-C', fecha: '2025-03-10T10:47:00' },
    comprobante: { id: 7, ventaId: 7, tipo: 'boleta', serie: 'B001', numero: '00000003', fechaEmision: '2025-03-10T10:48:00' },
  },
  {
    id: 8,
    fecha: '2025-03-15T13:30:00',
    clienteId: null,
    clienteNombre: 'Edgar Pacora',
    clienteEmail: 'epacora@gmail.com',
    vendedorId: 3,
    vendedorNombre: 'Carlos Mendo',
    importeTotal: 135.00,
    estado: 'confirmada',
    detalles: [
      { id: 16, ventaId: 8, varianteId: 28, productoNombre: 'Polo Cuello Redondo SM', talla: 'M', color: 'Blanco', sku: 'POL-RED-BLA-M', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 },
      { id: 17, ventaId: 8, varianteId: 39, productoNombre: 'Cinturón Cuero Montblanc', talla: '100cm', color: 'Negro', sku: 'CIN-MON-NEG-100', cantidad: 1, precioUnitario: 45.00, subtotal: 45.00 },
    ],
    pago: { id: 8, ventaId: 8, monto: 135.00, metodoPago: 'pasarela', estado: 'confirmado', referencia: 'PAY-7791-D', fecha: '2025-03-15T13:32:00' },
    comprobante: { id: 8, ventaId: 8, tipo: 'boleta', serie: 'B001', numero: '00000004', fechaEmision: '2025-03-15T13:33:00' },
  },
];

export let DEVOLUCIONES: DevolucionVenta[] = [
  {
    id: 1,
    ventaId: 1,
    varianteId: 21,
    productoNombre: 'Polo Piqué Lacoste',
    talla: 'S',
    color: 'Blanco',
    sku: 'POL-PIQ-BLA-S',
    cantidad: 1,
    motivo: 'Talla incorrecta — cliente solicita talla M',
    montoReembolsado: 110.00,
    fecha: '2025-02-20T10:00:00',
    usuarioId: 3,
    usuarioNombre: 'Carlos Mendo',
  },
];

let _nextVentaId = VENTAS.length + 1;
let _nextDetalleId = 18;
let _nextPagoId = VENTAS.length + 1;
let _nextComprobanteId = VENTAS.length + 1;
let _nextDevolucionId = DEVOLUCIONES.length + 1;
let _contadorBoleta = 5;
let _contadorFactura = 3;

export function nextVentaId() { return _nextVentaId++; }
export function nextDetalleId() { return _nextDetalleId++; }
export function nextPagoId() { return _nextPagoId++; }
export function nextComprobanteId() { return _nextComprobanteId++; }
export function nextDevolucionId() { return _nextDevolucionId++; }
export function nextNumBoleta() { return String(_contadorBoleta++).padStart(8, '0'); }
export function nextNumFactura() { return String(_contadorFactura++).padStart(8, '0'); }
