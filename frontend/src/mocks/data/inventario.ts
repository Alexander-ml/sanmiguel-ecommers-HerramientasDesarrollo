/**
 * Datos de demostración para el módulo Inventario.
 * Stock, movimientos de kardex y alertas de stock mínimo.
 * Los movimientos son inmutables por RN-INV-01 — nunca se editan ni eliminan.
 */

export type TipoMovimiento =
  | 'ENTRADA_COMPRA'
  | 'ENTRADA_DEVOLUCION_VENTA'
  | 'SALIDA_VENTA'
  | 'SALIDA_DEVOLUCION_COMPRA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO';

export interface Stock {
  id: number;
  varianteId: number;
  cantidadFisica: number;
  cantidadReservada: number;
  // cantidadDisponible = cantidadFisica - cantidadReservada (calculado, no almacenado)
}

export interface MovimientoInventario {
  id: number;
  varianteId: number;
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
  umbralMinimo: number;
  fechaUltimaAlerta: string | null;
  activo: boolean; // true = variante actualmente bajo umbral
}

// ── Stock ──────────────────────────────────────────────────────────────────────
// varianteId → stock (inicializamos para las 49 variantes del catálogo)
export let STOCK: Stock[] = [
  // Producto 1 — Camisa Oxford
  { id: 1,  varianteId: 1,  cantidadFisica: 12, cantidadReservada: 2 },
  { id: 2,  varianteId: 2,  cantidadFisica: 18, cantidadReservada: 3 },
  { id: 3,  varianteId: 3,  cantidadFisica: 15, cantidadReservada: 1 },
  { id: 4,  varianteId: 4,  cantidadFisica: 8,  cantidadReservada: 0 },
  { id: 5,  varianteId: 5,  cantidadFisica: 6,  cantidadReservada: 1 },  // stock bajo
  { id: 6,  varianteId: 6,  cantidadFisica: 10, cantidadReservada: 0 },
  // Producto 2 — Camisa Cuadros
  { id: 7,  varianteId: 7,  cantidadFisica: 20, cantidadReservada: 4 },
  { id: 8,  varianteId: 8,  cantidadFisica: 25, cantidadReservada: 2 },
  { id: 9,  varianteId: 9,  cantidadFisica: 0,  cantidadReservada: 0 },  // agotado
  { id: 10, varianteId: 10, cantidadFisica: 5,  cantidadReservada: 1 },  // stock bajo
  // Producto 3 — Jean Clásico
  { id: 11, varianteId: 11, cantidadFisica: 8,  cantidadReservada: 0 },
  { id: 12, varianteId: 12, cantidadFisica: 22, cantidadReservada: 3 },
  { id: 13, varianteId: 13, cantidadFisica: 30, cantidadReservada: 5 },
  { id: 14, varianteId: 14, cantidadFisica: 18, cantidadReservada: 2 },
  { id: 15, varianteId: 15, cantidadFisica: 4,  cantidadReservada: 0 },  // stock bajo
  // Producto 4 — Pantalón Gabardina
  { id: 16, varianteId: 16, cantidadFisica: 10, cantidadReservada: 1 },
  { id: 17, varianteId: 17, cantidadFisica: 15, cantidadReservada: 0 },
  { id: 18, varianteId: 18, cantidadFisica: 12, cantidadReservada: 2 },
  { id: 19, varianteId: 19, cantidadFisica: 8,  cantidadReservada: 0 },
  { id: 20, varianteId: 20, cantidadFisica: 6,  cantidadReservada: 1 },
  // Producto 5 — Polo Piqué
  { id: 21, varianteId: 21, cantidadFisica: 35, cantidadReservada: 5 },
  { id: 22, varianteId: 22, cantidadFisica: 42, cantidadReservada: 7 },
  { id: 23, varianteId: 23, cantidadFisica: 28, cantidadReservada: 3 },
  { id: 24, varianteId: 24, cantidadFisica: 0,  cantidadReservada: 0 },  // agotado
  { id: 25, varianteId: 25, cantidadFisica: 15, cantidadReservada: 2 },
  { id: 26, varianteId: 26, cantidadFisica: 20, cantidadReservada: 4 },
  // Producto 6 — Polo Cuello Redondo
  { id: 27, varianteId: 27, cantidadFisica: 50, cantidadReservada: 8 },
  { id: 28, varianteId: 28, cantidadFisica: 60, cantidadReservada: 10 },
  { id: 29, varianteId: 29, cantidadFisica: 45, cantidadReservada: 5 },
  { id: 30, varianteId: 30, cantidadFisica: 3,  cantidadReservada: 0 },  // stock bajo
  { id: 31, varianteId: 31, cantidadFisica: 40, cantidadReservada: 6 },
  { id: 32, varianteId: 32, cantidadFisica: 38, cantidadReservada: 4 },
  // Producto 7 — Traje Completo
  { id: 33, varianteId: 33, cantidadFisica: 3,  cantidadReservada: 1 },  // stock bajo
  { id: 34, varianteId: 34, cantidadFisica: 5,  cantidadReservada: 0 },
  { id: 35, varianteId: 35, cantidadFisica: 4,  cantidadReservada: 1 },
  { id: 36, varianteId: 36, cantidadFisica: 2,  cantidadReservada: 0 },  // stock bajo
  // Producto 8 — Cinturón
  { id: 37, varianteId: 37, cantidadFisica: 15, cantidadReservada: 0 },
  { id: 38, varianteId: 38, cantidadFisica: 20, cantidadReservada: 2 },
  { id: 39, varianteId: 39, cantidadFisica: 18, cantidadReservada: 1 },
  { id: 40, varianteId: 40, cantidadFisica: 12, cantidadReservada: 0 },
  // Producto 9 — Corbata
  { id: 41, varianteId: 41, cantidadFisica: 8,  cantidadReservada: 1 },
  { id: 42, varianteId: 42, cantidadFisica: 6,  cantidadReservada: 0 },
  // Producto 10 — Camisa Lino
  { id: 43, varianteId: 43, cantidadFisica: 12, cantidadReservada: 0 },
  { id: 44, varianteId: 44, cantidadFisica: 18, cantidadReservada: 2 },
  { id: 45, varianteId: 45, cantidadFisica: 14, cantidadReservada: 1 },
  { id: 46, varianteId: 46, cantidadFisica: 0,  cantidadReservada: 0 },  // agotado
  // Producto 11 — Blazer
  { id: 47, varianteId: 47, cantidadFisica: 4,  cantidadReservada: 1 },  // stock bajo
  { id: 48, varianteId: 48, cantidadFisica: 6,  cantidadReservada: 0 },
  { id: 49, varianteId: 49, cantidadFisica: 3,  cantidadReservada: 0 },  // stock bajo
  // Producto 12 — Pantalón Chino Beige
  { id: 50, varianteId: 50, cantidadFisica: 14, cantidadReservada: 2 },
  { id: 51, varianteId: 51, cantidadFisica: 20, cantidadReservada: 3 },
  { id: 52, varianteId: 52, cantidadFisica: 16, cantidadReservada: 1 },
  // Producto 13 — Casaca Bomber Urbana
  { id: 53, varianteId: 53, cantidadFisica: 10, cantidadReservada: 1 },
  { id: 54, varianteId: 54, cantidadFisica: 12, cantidadReservada: 2 },
  { id: 55, varianteId: 55, cantidadFisica: 6,  cantidadReservada: 0 },
  // Producto 14 — Guayabera Lino Manga Larga
  { id: 56, varianteId: 56, cantidadFisica: 8,  cantidadReservada: 0 },
  { id: 57, varianteId: 57, cantidadFisica: 15, cantidadReservada: 2 },
  { id: 58, varianteId: 58, cantidadFisica: 14, cantidadReservada: 1 },
  { id: 59, varianteId: 59, cantidadFisica: 7,  cantidadReservada: 0 },
  // Producto 15 — Polo Pima Cuello V
  { id: 60, varianteId: 60, cantidadFisica: 25, cantidadReservada: 3 },
  { id: 61, varianteId: 61, cantidadFisica: 35, cantidadReservada: 5 },
  { id: 62, varianteId: 62, cantidadFisica: 30, cantidadReservada: 2 },
  // Producto 16 — Pantalón Jogger Drill
  { id: 63, varianteId: 63, cantidadFisica: 12, cantidadReservada: 1 },
  { id: 64, varianteId: 64, cantidadFisica: 18, cantidadReservada: 2 },
  { id: 65, varianteId: 65, cantidadFisica: 10, cantidadReservada: 0 },
];

// ── Movimientos de Inventario (Kardex) ─────────────────────────────────────────
// Historia realista de los últimos 3 meses
export let MOVIMIENTOS: MovimientoInventario[] = [
  // Variante 1 (CAM-OXF-CEL-S)
  { id: 1,  varianteId: 1,  tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 20, fecha: '2025-02-01T11:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-001', saldoResultante: 20, motivo: 'Recepción orden de compra OC-001' },
  { id: 2,  varianteId: 1,  tipoMovimiento: 'SALIDA_VENTA',            cantidad: 5,  fecha: '2025-02-15T14:30:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0042', saldoResultante: 15, motivo: 'Venta confirmada V-0042' },
  { id: 3,  varianteId: 1,  tipoMovimiento: 'SALIDA_VENTA',            cantidad: 3,  fecha: '2025-03-01T10:15:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0068', saldoResultante: 12, motivo: 'Venta confirmada V-0068' },
  // Variante 2 (CAM-OXF-CEL-M)
  { id: 4,  varianteId: 2,  tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 25, fecha: '2025-02-01T11:05:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-001', saldoResultante: 25, motivo: 'Recepción orden de compra OC-001' },
  { id: 5,  varianteId: 2,  tipoMovimiento: 'SALIDA_VENTA',            cantidad: 4,  fecha: '2025-02-20T09:30:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0051', saldoResultante: 21, motivo: 'Venta confirmada V-0051' },
  { id: 6,  varianteId: 2,  tipoMovimiento: 'AJUSTE_NEGATIVO',         cantidad: 3,  fecha: '2025-03-05T08:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: null,     saldoResultante: 18, motivo: 'Corrección por diferencia en conteo físico' },
  // Variante 9 (CAM-CUA-AZB-L) — agotada
  { id: 7,  varianteId: 9,  tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 15, fecha: '2025-02-03T12:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-002', saldoResultante: 15, motivo: 'Recepción orden de compra OC-002' },
  { id: 8,  varianteId: 9,  tipoMovimiento: 'SALIDA_VENTA',            cantidad: 10, fecha: '2025-02-25T16:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0075', saldoResultante: 5,  motivo: 'Venta confirmada V-0075' },
  { id: 9,  varianteId: 9,  tipoMovimiento: 'SALIDA_VENTA',            cantidad: 5,  fecha: '2025-03-10T11:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0088', saldoResultante: 0,  motivo: 'Venta confirmada V-0088' },
  // Variante 22 (POL-PIQ-BLA-M) — alta rotación
  { id: 10, varianteId: 22, tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 60, fecha: '2025-02-10T09:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-003', saldoResultante: 60, motivo: 'Recepción orden de compra OC-003' },
  { id: 11, varianteId: 22, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 8,  fecha: '2025-02-14T15:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0037', saldoResultante: 52, motivo: 'Venta confirmada V-0037' },
  { id: 12, varianteId: 22, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 6,  fecha: '2025-02-28T11:30:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0082', saldoResultante: 46, motivo: 'Venta confirmada V-0082' },
  { id: 13, varianteId: 22, tipoMovimiento: 'ENTRADA_DEVOLUCION_VENTA',cantidad: 2,  fecha: '2025-03-02T10:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'DEV-012',saldoResultante: 48, motivo: 'Devolución de cliente por talla incorrecta' },
  { id: 14, varianteId: 22, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 6,  fecha: '2025-03-12T14:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0101', saldoResultante: 42, motivo: 'Venta confirmada V-0101' },
  // Variante 27 (POL-RED-NEG-S) — alta rotación
  { id: 15, varianteId: 27, tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 80, fecha: '2025-02-12T09:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-003', saldoResultante: 80, motivo: 'Recepción orden de compra OC-003' },
  { id: 16, varianteId: 27, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 15, fecha: '2025-02-20T16:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0055', saldoResultante: 65, motivo: 'Venta confirmada V-0055' },
  { id: 17, varianteId: 27, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 12, fecha: '2025-03-05T11:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0089', saldoResultante: 53, motivo: 'Venta confirmada V-0089' },
  { id: 18, varianteId: 27, tipoMovimiento: 'SALIDA_DEVOLUCION_COMPRA',cantidad: 3,  fecha: '2025-03-08T09:30:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'DP-001', saldoResultante: 50, motivo: 'Devolución a proveedor por defecto de fabricación' },
  // Variante 33 (TRA-GRI-ACE-38) — stock bajo, alta valor
  { id: 19, varianteId: 33, tipoMovimiento: 'ENTRADA_COMPRA',          cantidad: 10, fecha: '2025-02-15T10:00:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: 'OC-004', saldoResultante: 10, motivo: 'Recepción orden de compra OC-004' },
  { id: 20, varianteId: 33, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 4,  fecha: '2025-02-22T15:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0063', saldoResultante: 6,  motivo: 'Venta confirmada V-0063' },
  { id: 21, varianteId: 33, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 3,  fecha: '2025-03-10T14:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0096', saldoResultante: 3,  motivo: 'Venta confirmada V-0096' },
  { id: 22, varianteId: 33, tipoMovimiento: 'AJUSTE_POSITIVO',         cantidad: 1,  fecha: '2025-03-15T08:30:00', usuarioId: 2, usuarioNombre: 'Pedro Quispe',    documentoRef: null,     saldoResultante: 4,  motivo: 'Ajuste positivo por diferencia en inventario físico' },
  { id: 23, varianteId: 33, tipoMovimiento: 'SALIDA_VENTA',            cantidad: 1,  fecha: '2025-03-20T11:00:00', usuarioId: 1, usuarioNombre: 'Sistema',         documentoRef: 'V-0112', saldoResultante: 3,  motivo: 'Venta confirmada V-0112' },
];

// ── Alertas de Stock Mínimo ────────────────────────────────────────────────────
// Umbral configurado por variante (por defecto 5 unidades según configuración general)
export let ALERTAS_STOCK: AlertaStock[] = [
  // Activas (bajo umbral)
  { id: 1,  varianteId: 5,  umbralMinimo: 8,  fechaUltimaAlerta: '2025-03-18T07:00:00', activo: true  },
  { id: 2,  varianteId: 9,  umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-10T11:00:00', activo: true  },
  { id: 3,  varianteId: 10, umbralMinimo: 8,  fechaUltimaAlerta: '2025-03-16T07:00:00', activo: true  },
  { id: 4,  varianteId: 15, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-19T07:00:00', activo: true  },
  { id: 5,  varianteId: 24, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-11T07:00:00', activo: true  },
  { id: 6,  varianteId: 30, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-20T07:00:00', activo: true  },
  { id: 7,  varianteId: 33, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-20T11:00:00', activo: true  },
  { id: 8,  varianteId: 36, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-17T07:00:00', activo: true  },
  { id: 9,  varianteId: 46, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-14T07:00:00', activo: true  },
  { id: 10, varianteId: 47, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-18T07:00:00', activo: true  },
  { id: 11, varianteId: 49, umbralMinimo: 5,  fechaUltimaAlerta: '2025-03-18T07:00:00', activo: true  },
  // Configuradas pero no activas (sobre umbral)
  { id: 12, varianteId: 1,  umbralMinimo: 5,  fechaUltimaAlerta: null, activo: false },
  { id: 13, varianteId: 2,  umbralMinimo: 5,  fechaUltimaAlerta: null, activo: false },
  { id: 14, varianteId: 11, umbralMinimo: 5,  fechaUltimaAlerta: null, activo: false },
  { id: 15, varianteId: 22, umbralMinimo: 10, fechaUltimaAlerta: null, activo: false },
  { id: 16, varianteId: 27, umbralMinimo: 10, fechaUltimaAlerta: null, activo: false },
];

let _nextMovimientoId = MOVIMIENTOS.length + 1;
export function nextMovimientoId() { return _nextMovimientoId++; }
