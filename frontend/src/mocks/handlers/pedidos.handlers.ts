import { http, HttpResponse } from 'msw';
import { PEDIDOS, nextPedidoId, nextDetalleId, nextCodigoPedido } from '../data/pedidos';
import { STOCK, MOVIMIENTOS } from '../data/inventario';
import { VARIANTES, PRODUCTOS } from '../data/catalogo';
import type { Pedido, DetallePedido, EstadoPedido } from '../../features/tienda/types';

const PAGE_SIZE = 10;

// ── Listado de pedidos (admin/vendedor) ────────────────────────────────────────
const consultaHandlers = [
  http.get('/api/pedidos', ({ request }) => {
    const url = new URL(request.url);
    const estado = url.searchParams.get('estado');
    const cliente = url.searchParams.get('cliente')?.toLowerCase() ?? '';
    const codigo = url.searchParams.get('codigo')?.toLowerCase() ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    let resultado = [...PEDIDOS];
    if (estado)  resultado = resultado.filter((p) => p.estado === estado);
    if (cliente) resultado = resultado.filter((p) =>
      p.contacto.nombres.toLowerCase().includes(cliente) ||
      p.contacto.apellidos.toLowerCase().includes(cliente) ||
      p.contacto.email.toLowerCase().includes(cliente));
    if (codigo)  resultado = resultado.filter((p) => p.codigo.toLowerCase().includes(codigo));

    resultado.sort((a, b) => b.fecha.localeCompare(a.fecha));
    const total = resultado.length;
    const datos = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  http.get('/api/pedidos/:id', ({ params }) => {
    const pedido = PEDIDOS.find((p) => p.id === Number(params.id));
    if (!pedido) return HttpResponse.json({ message: 'Pedido no encontrado.' }, { status: 404 });
    return HttpResponse.json(pedido);
  }),

  // Seguimiento por código (vista cliente — RF-TIE-018)
  http.get('/api/pedidos/seguimiento/:codigo', ({ params }) => {
    const pedido = PEDIDOS.find((p) => p.codigo === String(params.codigo));
    if (!pedido) return HttpResponse.json({ message: 'No se encontró ningún pedido con ese código.' }, { status: 404 });
    // Vista pública — devuelve solo los campos necesarios para el seguimiento
    return HttpResponse.json({
      codigo: pedido.codigo,
      fecha: pedido.fecha,
      estado: pedido.estado,
      modalidadEntrega: pedido.modalidadEntrega,
      importeTotal: pedido.importeTotal,
      detalles: pedido.detalles,
    });
  }),

  // Pedidos del cliente autenticado
  http.get('/api/pedidos/mis-pedidos', ({ request }) => {
    const url = new URL(request.url);
    const clienteId = url.searchParams.get('clienteId');
    if (!clienteId) return HttpResponse.json({ datos: [], total: 0, pagina: 1, totalPaginas: 0 });
    const datos = PEDIDOS.filter((p) => p.clienteId === Number(clienteId))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    return HttpResponse.json({ datos, total: datos.length, pagina: 1, totalPaginas: 1 });
  }),
];

// ── Crear pedido (RF-TIE-013 + RN-TIE-05) ────────────────────────────────────
const creacionHandlers = [
  http.post('/api/pedidos', async ({ request }) => {
    const body = (await request.json()) as {
      items: { varianteId: number; cantidad: number; precioUnitario: number }[];
      clienteId: number | null;
      contacto: Pedido['contacto'];
      modalidadEntrega: Pedido['modalidadEntrega'];
      metodoPago: Pedido['metodoPago'];
      notas?: string;
    };

    if (!body.items || body.items.length === 0) {
      return HttpResponse.json({ message: 'El pedido debe tener al menos un producto.' }, { status: 422 });
    }

    // RN-TIE-05: revalidar disponibilidad antes de confirmar
    for (const item of body.items) {
      const stock = STOCK.find((s) => s.varianteId === item.varianteId);
      const disponible = stock ? stock.cantidadFisica - stock.cantidadReservada : 0;
      if (disponible < item.cantidad) {
        const variante = VARIANTES.find((v) => v.id === item.varianteId);
        const producto = variante ? PRODUCTOS.find((p) => p.id === variante.productoId) : null;
        return HttpResponse.json({
          message: `Sin stock suficiente para "${producto?.nombre ?? ''} ${variante?.talla ?? ''} / ${variante?.color ?? ''}". Disponible: ${disponible}.`,
        }, { status: 422 });
      }
    }

    const pedidoId = nextPedidoId();
    const importeTotal = body.items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

    const detalles: DetallePedido[] = body.items.map((item) => {
      const variante = VARIANTES.find((v) => v.id === item.varianteId);
      const producto = variante ? PRODUCTOS.find((p) => p.id === variante.productoId) : null;
      return {
        id: nextDetalleId(),
        pedidoId,
        varianteId: item.varianteId,
        productoNombre: producto?.nombre ?? '',
        talla: variante?.talla ?? '',
        color: variante?.color ?? '',
        sku: variante?.sku ?? '',
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: +(item.precioUnitario * item.cantidad).toFixed(2),
      };
    });

    // Estado inicial según método de pago
    const estado: EstadoPedido =
      body.metodoPago === 'transferencia' ? 'en_espera_confirmacion' : 'pendiente_pago';

    const nuevoPedido: Pedido = {
      id: pedidoId,
      codigo: nextCodigoPedido(),
      fecha: new Date().toISOString(),
      estado,
      modalidadEntrega: body.modalidadEntrega,
      clienteId: body.clienteId ?? null,
      contacto: body.contacto,
      metodoPago: body.metodoPago,
      importeTotal: +importeTotal.toFixed(2),
      notas: body.notas ?? '',
      detalles,
    };

    PEDIDOS.push(nuevoPedido);

    // Reserva temporal (simulada) — RN-TIE-02
    for (const item of body.items) {
      const idx = STOCK.findIndex((s) => s.varianteId === item.varianteId);
      if (idx !== -1) {
        STOCK[idx] = { ...STOCK[idx], cantidadReservada: STOCK[idx].cantidadReservada + item.cantidad };
      }
    }

    return HttpResponse.json(nuevoPedido, { status: 201 });
  }),
];

// ── Actualizar estado (RF-TIE-015 / RF-TIE-016) ───────────────────────────────
const estadoHandlers = [
  http.patch('/api/pedidos/:id/estado', async ({ params, request }) => {
    const idx = PEDIDOS.findIndex((p) => p.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Pedido no encontrado.' }, { status: 404 });

    const { estado } = (await request.json()) as { estado: EstadoPedido };

    const pedido = PEDIDOS[idx];

    // Si se cancela: liberar la reserva y devolver stock si ya estaba confirmado
    if (estado === 'cancelado') {
      for (const det of pedido.detalles) {
        const stockIdx = STOCK.findIndex((s) => s.varianteId === det.varianteId);
        if (stockIdx !== -1) {
          const s = STOCK[stockIdx];
          STOCK[stockIdx] = {
            ...s,
            cantidadReservada: Math.max(0, s.cantidadReservada - det.cantidad),
          };
          // Si el pedido ya era confirmado/preparación, devolver al físico también
          if (['confirmado', 'en_preparacion'].includes(pedido.estado)) {
            STOCK[stockIdx] = { ...STOCK[stockIdx], cantidadFisica: STOCK[stockIdx].cantidadFisica + det.cantidad };
            MOVIMIENTOS.push({
              id: MOVIMIENTOS.length + 1,
              varianteId: det.varianteId,
              tipoMovimiento: 'AJUSTE_POSITIVO',
              cantidad: det.cantidad,
              fecha: new Date().toISOString(),
              usuarioId: 1,
              usuarioNombre: 'Sistema',
              documentoRef: `CANCEL-PED-${pedido.codigo}`,
              saldoResultante: STOCK[stockIdx].cantidadFisica,
              motivo: `Cancelación de pedido ${pedido.codigo}`,
            });
          }
        }
      }
    }

    // Al confirmar: convertir la reserva en salida real
    if (estado === 'confirmado' && pedido.estado !== 'confirmado') {
      for (const det of pedido.detalles) {
        const stockIdx = STOCK.findIndex((s) => s.varianteId === det.varianteId);
        if (stockIdx !== -1) {
          const s = STOCK[stockIdx];
          STOCK[stockIdx] = {
            ...s,
            cantidadFisica: s.cantidadFisica - det.cantidad,
            cantidadReservada: Math.max(0, s.cantidadReservada - det.cantidad),
          };
          MOVIMIENTOS.push({
            id: MOVIMIENTOS.length + 1,
            varianteId: det.varianteId,
            tipoMovimiento: 'SALIDA_VENTA',
            cantidad: det.cantidad,
            fecha: new Date().toISOString(),
            usuarioId: 1,
            usuarioNombre: 'Sistema',
            documentoRef: pedido.codigo,
            saldoResultante: STOCK[stockIdx].cantidadFisica,
            motivo: `Pedido confirmado ${pedido.codigo}`,
          });
        }
      }
    }

    PEDIDOS[idx] = { ...pedido, estado };
    return HttpResponse.json(PEDIDOS[idx]);
  }),
];

// ── Reportes (RF-TIE-019) ─────────────────────────────────────────────────────
const reportesHandlers = [
  http.get('/api/pedidos/reportes/resumen', () => {
    const resumen = {
      pendientePago:          PEDIDOS.filter((p) => p.estado === 'pendiente_pago').length,
      enEsperaConfirmacion:   PEDIDOS.filter((p) => p.estado === 'en_espera_confirmacion').length,
      confirmados:            PEDIDOS.filter((p) => p.estado === 'confirmado').length,
      enPreparacion:          PEDIDOS.filter((p) => p.estado === 'en_preparacion').length,
      listos:                 PEDIDOS.filter((p) => p.estado === 'listo_entregado').length,
      cancelados:             PEDIDOS.filter((p) => p.estado === 'cancelado').length,
      total:                  PEDIDOS.length,
    };
    return HttpResponse.json(resumen);
  }),

  http.get('/api/pedidos/reportes/productos-pedidos', () => {
    const conteo: Record<number, { productoNombre: string; talla: string; color: string; sku: string; totalUnidades: number }> = {};
    PEDIDOS.filter((p) => p.estado !== 'cancelado').forEach((p) =>
      p.detalles.forEach((d) => {
        if (!conteo[d.varianteId]) {
          conteo[d.varianteId] = { productoNombre: d.productoNombre, talla: d.talla, color: d.color, sku: d.sku, totalUnidades: 0 };
        }
        conteo[d.varianteId].totalUnidades += d.cantidad;
      }),
    );
    const resultado = Object.entries(conteo)
      .map(([varianteId, datos]) => ({ varianteId: Number(varianteId), ...datos }))
      .sort((a, b) => b.totalUnidades - a.totalUnidades);
    return HttpResponse.json(resultado);
  }),
];

export const pedidosHandlers = [
  ...consultaHandlers,
  ...creacionHandlers,
  ...estadoHandlers,
  ...reportesHandlers,
];
