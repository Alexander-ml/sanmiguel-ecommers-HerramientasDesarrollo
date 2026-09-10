import { http, HttpResponse } from 'msw';
import {
  VENTAS, DEVOLUCIONES,
  nextVentaId, nextDetalleId, nextPagoId, nextComprobanteId, nextDevolucionId,
  nextNumBoleta, nextNumFactura,
} from '../data/ventas';
import { STOCK, MOVIMIENTOS } from '../data/inventario';
import { VARIANTES, PRODUCTOS } from '../data/catalogo';
import type { Venta, DetalleVenta, Pago, Comprobante, DevolucionVenta } from '../../features/ventas/types';

const PAGE_SIZE = 10;

function enriquecerVariante(varianteId: number) {
  const v = VARIANTES.find((v) => v.id === varianteId);
  const p = v ? PRODUCTOS.find((p) => p.id === v.productoId) : null;
  return { variante: v, producto: p };
}

// Calcular stock disponible para validación RF-VENT-005
function stockDisponible(varianteId: number): number {
  const s = STOCK.find((s) => s.varianteId === varianteId);
  return s ? s.cantidadFisica - s.cantidadReservada : 0;
}

// ── Listado y detalle ──────────────────────────────────────────────────────────
const consultaHandlers = [
  http.get('/api/ventas', ({ request }) => {
    const url = new URL(request.url);
    const estado = url.searchParams.get('estado');
    const clienteNombre = url.searchParams.get('cliente')?.toLowerCase() ?? '';
    const vendedorId = url.searchParams.get('vendedorId');
    const fechaDesde = url.searchParams.get('fechaDesde') ?? '';
    const fechaHasta = url.searchParams.get('fechaHasta') ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    let resultado = [...VENTAS];
    if (estado)       resultado = resultado.filter((v) => v.estado === estado);
    if (clienteNombre) resultado = resultado.filter((v) => v.clienteNombre.toLowerCase().includes(clienteNombre));
    if (vendedorId)   resultado = resultado.filter((v) => v.vendedorId === Number(vendedorId));
    if (fechaDesde)   resultado = resultado.filter((v) => v.fecha >= fechaDesde);
    if (fechaHasta)   resultado = resultado.filter((v) => v.fecha <= fechaHasta + 'T23:59:59');

    resultado.sort((a, b) => b.fecha.localeCompare(a.fecha));

    const total = resultado.length;
    const datos = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  http.get('/api/ventas/:id', ({ params }) => {
    const venta = VENTAS.find((v) => v.id === Number(params.id));
    if (!venta) return HttpResponse.json({ message: 'Venta no encontrada.' }, { status: 404 });
    const devoluciones = DEVOLUCIONES.filter((d) => d.ventaId === venta.id);
    return HttpResponse.json({ ...venta, devoluciones });
  }),
];

// ── Registro de venta ──────────────────────────────────────────────────────────
const registroHandlers = [
  http.post('/api/ventas', async ({ request }) => {
    const body = (await request.json()) as {
      detalles: { varianteId: number; cantidad: number; precioUnitario: number }[];
      clienteId: number | null;
      clienteNombre: string;
      clienteEmail: string;
      vendedorId: number;
      vendedorNombre: string;
      metodoPago: string;
      referencia: string | null;
      tipoComprobante: 'boleta' | 'factura';
    };

    // RF-VENT-003: al menos un detalle (RN-VEN-03)
    if (!body.detalles || body.detalles.length === 0) {
      return HttpResponse.json({ message: 'La venta debe contener al menos un producto (RN-VEN-03).' }, { status: 422 });
    }

    // RF-VENT-005: verificar disponibilidad (RN-VEN-01)
    for (const det of body.detalles) {
      const disponible = stockDisponible(det.varianteId);
      if (disponible < det.cantidad) {
        const { variante, producto } = enriquecerVariante(det.varianteId);
        return HttpResponse.json({
          message: `Stock insuficiente para "${producto?.nombre ?? ''} ${variante?.talla ?? ''} / ${variante?.color ?? ''}". Disponible: ${disponible}, solicitado: ${det.cantidad}.`,
        }, { status: 422 });
      }
    }

    // RF-VENT-006: calcular total (RN-VEN-04)
    const importeTotal = body.detalles.reduce((acc, d) => acc + d.precioUnitario * d.cantidad, 0);

    const ventaId = nextVentaId();

    const detalles: DetalleVenta[] = body.detalles.map((d) => {
      const { variante, producto } = enriquecerVariante(d.varianteId);
      return {
        id: nextDetalleId(),
        ventaId,
        varianteId: d.varianteId,
        productoNombre: producto?.nombre ?? '',
        talla: variante?.talla ?? '',
        color: variante?.color ?? '',
        sku: variante?.sku ?? '',
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: +(d.precioUnitario * d.cantidad).toFixed(2),
      };
    });

    const pago: Pago = {
      id: nextPagoId(),
      ventaId,
      monto: +importeTotal.toFixed(2),
      metodoPago: body.metodoPago as Pago['metodoPago'],
      estado: body.metodoPago === 'efectivo' || body.metodoPago === 'tarjeta' || body.metodoPago === 'pasarela'
        ? 'confirmado'
        : 'pendiente', // transferencia queda pendiente
      referencia: body.referencia ?? null,
      fecha: new Date().toISOString(),
    };

    const estadoVenta: Venta['estado'] = pago.estado === 'confirmado' ? 'confirmada' : 'pendiente';

    const comprobante: Comprobante | null = estadoVenta === 'confirmada'
      ? {
          id: nextComprobanteId(),
          ventaId,
          tipo: body.tipoComprobante,
          serie: body.tipoComprobante === 'boleta' ? 'B001' : 'F001',
          numero: body.tipoComprobante === 'boleta' ? nextNumBoleta() : nextNumFactura(),
          fechaEmision: new Date().toISOString(),
        }
      : null;

    const nuevaVenta: Venta = {
      id: ventaId,
      fecha: new Date().toISOString(),
      clienteId: body.clienteId ?? null,
      clienteNombre: body.clienteNombre,
      clienteEmail: body.clienteEmail,
      vendedorId: body.vendedorId,
      vendedorNombre: body.vendedorNombre,
      importeTotal: +importeTotal.toFixed(2),
      estado: estadoVenta,
      detalles,
      pago,
      comprobante,
    };

    VENTAS.push(nuevaVenta);

    // RF-VENT-011: comunicar salida a Inventario (RN-VEN-02 — Ventas no modifica stock directamente)
    // En el mock, simulamos que el handler de Inventario actualiza el stock al confirmar.
    if (estadoVenta === 'confirmada') {
      for (const det of detalles) {
        const idx = STOCK.findIndex((s) => s.varianteId === det.varianteId);
        if (idx !== -1) {
          STOCK[idx] = { ...STOCK[idx], cantidadFisica: STOCK[idx].cantidadFisica - det.cantidad };
          MOVIMIENTOS.push({
            id: MOVIMIENTOS.length + 1,
            varianteId: det.varianteId,
            tipoMovimiento: 'SALIDA_VENTA',
            cantidad: det.cantidad,
            fecha: nuevaVenta.fecha,
            usuarioId: body.vendedorId,
            usuarioNombre: body.vendedorNombre,
            documentoRef: comprobante ? `${comprobante.serie}-${comprobante.numero}` : `V-${String(ventaId).padStart(4, '0')}`,
            saldoResultante: STOCK[idx].cantidadFisica,
            motivo: `Venta confirmada V-${String(ventaId).padStart(4, '0')}`,
          });
        }
      }
    }

    return HttpResponse.json(nuevaVenta, { status: 201 });
  }),
];

// ── Cancelación (RF-VENT-016 / RN-VEN-07) ────────────────────────────────────
const cancelacionHandlers = [
  http.post('/api/ventas/:id/cancelar', ({ params }) => {
    const idx = VENTAS.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Venta no encontrada.' }, { status: 404 });
    const venta = VENTAS[idx];

    if (venta.estado === 'cancelada') {
      return HttpResponse.json({ message: 'La venta ya se encuentra cancelada.' }, { status: 409 });
    }

    VENTAS[idx] = { ...venta, estado: 'cancelada' };

    // Si la venta estaba confirmada, revertir el stock
    if (venta.estado === 'confirmada') {
      for (const det of venta.detalles) {
        const stockIdx = STOCK.findIndex((s) => s.varianteId === det.varianteId);
        if (stockIdx !== -1) {
          STOCK[stockIdx] = { ...STOCK[stockIdx], cantidadFisica: STOCK[stockIdx].cantidadFisica + det.cantidad };
          MOVIMIENTOS.push({
            id: MOVIMIENTOS.length + 1,
            varianteId: det.varianteId,
            tipoMovimiento: 'AJUSTE_POSITIVO',
            cantidad: det.cantidad,
            fecha: new Date().toISOString(),
            usuarioId: 1,
            usuarioNombre: 'Sistema',
            documentoRef: `CANCEL-V${venta.id}`,
            saldoResultante: STOCK[stockIdx].cantidadFisica,
            motivo: `Cancelación de venta V-${String(venta.id).padStart(4, '0')}`,
          });
        }
      }
    }

    return HttpResponse.json(VENTAS[idx]);
  }),
];

// ── Confirmación manual de pago (transferencia) ────────────────────────────────
const confirmacionPagoHandlers = [
  http.post('/api/ventas/:id/confirmar-pago', async ({ params, request }) => {
    const idx = VENTAS.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Venta no encontrada.' }, { status: 404 });
    const venta = VENTAS[idx];

    if (venta.pago.estado !== 'pendiente') {
      return HttpResponse.json({ message: 'El pago ya fue procesado.' }, { status: 409 });
    }

    const body = (await request.json()) as { referencia?: string };

    const nuevoPago: Pago = { ...venta.pago, estado: 'confirmado', referencia: body.referencia ?? venta.pago.referencia };

    const comprobante: Comprobante = {
      id: nextComprobanteId(),
      ventaId: venta.id,
      tipo: 'boleta',
      serie: 'B001',
      numero: nextNumBoleta(),
      fechaEmision: new Date().toISOString(),
    };

    VENTAS[idx] = { ...venta, estado: 'confirmada', pago: nuevoPago, comprobante };

    // Actualizar stock por confirmación tardía
    for (const det of venta.detalles) {
      const stockIdx = STOCK.findIndex((s) => s.varianteId === det.varianteId);
      if (stockIdx !== -1) {
        STOCK[stockIdx] = { ...STOCK[stockIdx], cantidadFisica: STOCK[stockIdx].cantidadFisica - det.cantidad };
        MOVIMIENTOS.push({
          id: MOVIMIENTOS.length + 1,
          varianteId: det.varianteId,
          tipoMovimiento: 'SALIDA_VENTA',
          cantidad: det.cantidad,
          fecha: new Date().toISOString(),
          usuarioId: 1,
          usuarioNombre: 'Sistema',
          documentoRef: `${comprobante.serie}-${comprobante.numero}`,
          saldoResultante: STOCK[stockIdx].cantidadFisica,
          motivo: `Confirmación de pago venta V-${String(venta.id).padStart(4, '0')}`,
        });
      }
    }

    return HttpResponse.json(VENTAS[idx]);
  }),
];

// ── Devoluciones (RF-VENT-017 / RN-VEN-11) ───────────────────────────────────
const devolucionHandlers = [
  http.post('/api/ventas/:id/devoluciones', async ({ params, request }) => {
    const ventaId = Number(params.id);
    const venta = VENTAS.find((v) => v.id === ventaId);
    if (!venta) return HttpResponse.json({ message: 'Venta no encontrada.' }, { status: 404 });
    if (venta.estado !== 'confirmada') {
      return HttpResponse.json({ message: 'Solo se pueden registrar devoluciones sobre ventas confirmadas (RN-VEN-11).' }, { status: 422 });
    }

    const body = (await request.json()) as {
      varianteId: number;
      cantidad: number;
      motivo: string;
      usuarioId: number;
      usuarioNombre: string;
    };

    // RN-VEN-11: no puede exceder lo vendido
    const detalle = venta.detalles.find((d) => d.varianteId === body.varianteId);
    if (!detalle) return HttpResponse.json({ message: 'La variante no pertenece a esta venta.' }, { status: 422 });

    const yaDevuelto = DEVOLUCIONES.filter((d) => d.ventaId === ventaId && d.varianteId === body.varianteId)
      .reduce((acc, d) => acc + d.cantidad, 0);
    if (yaDevuelto + body.cantidad > detalle.cantidad) {
      return HttpResponse.json({
        message: `Solo se pueden devolver ${detalle.cantidad - yaDevuelto} unidades más de esta variante (ya devueltas: ${yaDevuelto}).`,
      }, { status: 422 });
    }

    const montoReembolsado = +(detalle.precioUnitario * body.cantidad).toFixed(2);

    const devolucion: DevolucionVenta = {
      id: nextDevolucionId(),
      ventaId,
      varianteId: body.varianteId,
      productoNombre: detalle.productoNombre,
      talla: detalle.talla,
      color: detalle.color,
      sku: detalle.sku,
      cantidad: body.cantidad,
      motivo: body.motivo,
      montoReembolsado,
      fecha: new Date().toISOString(),
      usuarioId: body.usuarioId,
      usuarioNombre: body.usuarioNombre,
    };

    DEVOLUCIONES.push(devolucion);

    // Notificar a Inventario (ENTRADA_DEVOLUCION_VENTA)
    const stockIdx = STOCK.findIndex((s) => s.varianteId === body.varianteId);
    if (stockIdx !== -1) {
      STOCK[stockIdx] = { ...STOCK[stockIdx], cantidadFisica: STOCK[stockIdx].cantidadFisica + body.cantidad };
      MOVIMIENTOS.push({
        id: MOVIMIENTOS.length + 1,
        varianteId: body.varianteId,
        tipoMovimiento: 'ENTRADA_DEVOLUCION_VENTA',
        cantidad: body.cantidad,
        fecha: new Date().toISOString(),
        usuarioId: body.usuarioId,
        usuarioNombre: body.usuarioNombre,
        documentoRef: `DEV-V${ventaId}`,
        saldoResultante: STOCK[stockIdx].cantidadFisica,
        motivo: `Devolución de cliente: ${body.motivo}`,
      });
    }

    return HttpResponse.json(devolucion, { status: 201 });
  }),
];

// ── Reportes ───────────────────────────────────────────────────────────────────
const reportesHandlers = [
  http.get('/api/ventas/reportes/resumen', ({ request }) => {
    const url = new URL(request.url);
    const fechaDesde = url.searchParams.get('fechaDesde') ?? '';
    const fechaHasta = url.searchParams.get('fechaHasta') ?? '';

    let ventas = VENTAS;
    if (fechaDesde) ventas = ventas.filter((v) => v.fecha >= fechaDesde);
    if (fechaHasta) ventas = ventas.filter((v) => v.fecha <= fechaHasta + 'T23:59:59');

    const confirmadas = ventas.filter((v) => v.estado === 'confirmada');
    const importeTotal = confirmadas.reduce((acc, v) => acc + v.importeTotal, 0);

    return HttpResponse.json({
      totalVentas: ventas.length,
      totalConfirmadas: confirmadas.length,
      totalCanceladas: ventas.filter((v) => v.estado === 'cancelada').length,
      totalPendientes: ventas.filter((v) => v.estado === 'pendiente').length,
      importeTotal: +importeTotal.toFixed(2),
      ticketPromedio: confirmadas.length > 0 ? +(importeTotal / confirmadas.length).toFixed(2) : 0,
    });
  }),

  http.get('/api/ventas/reportes/por-metodo', () => {
    const metodos: Record<string, { cantidadVentas: number; importeTotal: number }> = {};
    VENTAS.filter((v) => v.estado === 'confirmada').forEach((v) => {
      const m = v.pago.metodoPago;
      if (!metodos[m]) metodos[m] = { cantidadVentas: 0, importeTotal: 0 };
      metodos[m].cantidadVentas++;
      metodos[m].importeTotal = +(metodos[m].importeTotal + v.importeTotal).toFixed(2);
    });
    const resultado = Object.entries(metodos).map(([metodoPago, datos]) => ({ metodoPago, ...datos }));
    return HttpResponse.json(resultado);
  }),

  http.get('/api/ventas/reportes/productos-vendidos', () => {
    const conteo: Record<number, { productoNombre: string; talla: string; color: string; sku: string; totalUnidades: number; importeTotal: number }> = {};
    VENTAS.filter((v) => v.estado === 'confirmada').forEach((v) => {
      v.detalles.forEach((d) => {
        if (!conteo[d.varianteId]) {
          conteo[d.varianteId] = { productoNombre: d.productoNombre, talla: d.talla, color: d.color, sku: d.sku, totalUnidades: 0, importeTotal: 0 };
        }
        conteo[d.varianteId].totalUnidades += d.cantidad;
        conteo[d.varianteId].importeTotal = +(conteo[d.varianteId].importeTotal + d.subtotal).toFixed(2);
      });
    });
    const resultado = Object.entries(conteo)
      .map(([varianteId, datos]) => ({ varianteId: Number(varianteId), ...datos }))
      .sort((a, b) => b.totalUnidades - a.totalUnidades);
    return HttpResponse.json(resultado);
  }),

  // REP-VEN-05 — Ventas por Vendedor
  http.get('/api/ventas/reportes/por-vendedor', () => {
    const vendedores: Record<number, { vendedorNombre: string; cantidadVentas: number; importeTotal: number }> = {};
    VENTAS.filter((v) => v.estado === 'confirmada').forEach((v) => {
      if (!vendedores[v.vendedorId]) {
        vendedores[v.vendedorId] = { vendedorNombre: v.vendedorNombre, cantidadVentas: 0, importeTotal: 0 };
      }
      vendedores[v.vendedorId].cantidadVentas++;
      vendedores[v.vendedorId].importeTotal = +(vendedores[v.vendedorId].importeTotal + v.importeTotal).toFixed(2);
    });
    const resultado = Object.entries(vendedores)
      .map(([vendedorId, datos]) => ({ vendedorId: Number(vendedorId), ...datos }))
      .sort((a, b) => b.importeTotal - a.importeTotal);
    return HttpResponse.json(resultado);
  }),

  // REP-VEN-07 — Ventas por Cliente
  http.get('/api/ventas/reportes/por-cliente', () => {
    const clientes: Record<string, { clienteNombre: string; cantidadVentas: number; importeTotal: number }> = {};
    VENTAS.filter((v) => v.estado === 'confirmada').forEach((v) => {
      const clave = String(v.clienteId ?? v.clienteNombre);
      if (!clientes[clave]) {
        clientes[clave] = { clienteNombre: v.clienteNombre, cantidadVentas: 0, importeTotal: 0 };
      }
      clientes[clave].cantidadVentas++;
      clientes[clave].importeTotal = +(clientes[clave].importeTotal + v.importeTotal).toFixed(2);
    });
    const resultado = Object.values(clientes).sort((a, b) => b.importeTotal - a.importeTotal).slice(0, 15);
    return HttpResponse.json(resultado);
  }),
];

export const ventasHandlers = [
  ...consultaHandlers,
  ...registroHandlers,
  ...cancelacionHandlers,
  ...confirmacionPagoHandlers,
  ...devolucionHandlers,
  ...reportesHandlers,
];
