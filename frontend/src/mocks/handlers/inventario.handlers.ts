import { http, HttpResponse } from 'msw';
import { STOCK, MOVIMIENTOS, ALERTAS_STOCK, nextMovimientoId, type TipoMovimiento } from '../data/inventario';
import { VARIANTES, PRODUCTOS } from '../data/catalogo';
import { CONFIGURACION_GENERAL } from '../data/configuracion';

const PAGE_SIZE = 15;

// Umbral por defecto (RF-INV-019): viene de Configuración General, no de un número fijo en
// el código — así "Parámetros Operativos" queda realmente conectado con Inventario
// (ver docs/07-prompt-reorganizacion-final.md sección 6.1).
function umbralPorDefecto() {
  return CONFIGURACION_GENERAL.operativo.umbralStockMinimoDefecto;
}

// Calcula stock disponible (RN-INV-03): físico - reservado
function calcularDisponible(varianteId: number) {
  const s = STOCK.find((s) => s.varianteId === varianteId);
  if (!s) return 0;
  return s.cantidadFisica - s.cantidadReservada;
}

// Obtener contexto de variante para el kardex y alertas
function contextoVariante(varianteId: number) {
  const v = VARIANTES.find((v) => v.id === varianteId);
  const p = v ? PRODUCTOS.find((p) => p.id === v.productoId) : null;
  return { variante: v, producto: p };
}

const stockHandlers = [
  // Listado de stock con info de variante y producto
  http.get('/api/inventario/stock', ({ request }) => {
    const url = new URL(request.url);
    const busqueda = url.searchParams.get('q')?.toLowerCase() ?? '';
    const estado = url.searchParams.get('estado') ?? ''; // 'normal' | 'bajo' | 'agotado'
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    const resultado = STOCK
      .map((s) => {
        const { variante, producto } = contextoVariante(s.varianteId);
        const disponible = s.cantidadFisica - s.cantidadReservada;
        const alerta = ALERTAS_STOCK.find((a) => a.varianteId === s.varianteId);
        const umbral = alerta?.umbralMinimo ?? umbralPorDefecto();

        let estadoStock: 'normal' | 'bajo' | 'agotado' = 'normal';
        if (disponible === 0) estadoStock = 'agotado';
        else if (disponible < umbral) estadoStock = 'bajo';

        return {
          stockId: s.id,
          varianteId: s.varianteId,
          productoNombre: producto?.nombre ?? '',
          talla: variante?.talla ?? '',
          color: variante?.color ?? '',
          sku: variante?.sku ?? '',
          cantidadFisica: s.cantidadFisica,
          cantidadReservada: s.cantidadReservada,
          cantidadDisponible: disponible,
          umbralMinimo: umbral,
          estadoStock,
        };
      })
      .filter((s) => {
        if (busqueda && !s.productoNombre.toLowerCase().includes(busqueda) &&
            !s.sku.toLowerCase().includes(busqueda)) return false;
        if (estado && s.estadoStock !== estado) return false;
        return true;
      });

    const total = resultado.length;
    const datos = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  http.get('/api/inventario/stock/:varianteId', ({ params }) => {
    const varianteId = Number(params.varianteId);
    const s = STOCK.find((s) => s.varianteId === varianteId);
    if (!s) return HttpResponse.json({ message: 'Stock no encontrado.' }, { status: 404 });

    const { variante, producto } = contextoVariante(varianteId);
    const alerta = ALERTAS_STOCK.find((a) => a.varianteId === varianteId);

    return HttpResponse.json({
      ...s,
      cantidadDisponible: s.cantidadFisica - s.cantidadReservada,
      variante,
      producto,
      umbralMinimo: alerta?.umbralMinimo ?? umbralPorDefecto(),
    });
  }),
];

const movimientosHandlers = [
  http.get('/api/inventario/movimientos', ({ request }) => {
    const url = new URL(request.url);
    const varianteId = url.searchParams.get('varianteId');
    const tipo = url.searchParams.get('tipo');
    const fechaDesde = url.searchParams.get('fechaDesde');
    const fechaHasta = url.searchParams.get('fechaHasta');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    let resultado = [...MOVIMIENTOS];
    if (varianteId) resultado = resultado.filter((m) => m.varianteId === Number(varianteId));
    if (tipo)       resultado = resultado.filter((m) => m.tipoMovimiento === tipo);
    if (fechaDesde) resultado = resultado.filter((m) => m.fecha >= fechaDesde);
    if (fechaHasta) resultado = resultado.filter((m) => m.fecha <= fechaHasta + 'T23:59:59');

    // Ordenar cronológico descendente (más reciente primero)
    resultado.sort((a, b) => b.fecha.localeCompare(a.fecha));

    // Enriquecer con contexto de variante
    const enriquecido = resultado.map((m) => {
      const { variante, producto } = contextoVariante(m.varianteId);
      return { ...m, productoNombre: producto?.nombre ?? '', talla: variante?.talla ?? '', color: variante?.color ?? '', sku: variante?.sku ?? '' };
    });

    const total = enriquecido.length;
    const datos = enriquecido.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  // Ajuste manual de stock (solo AJUSTE_POSITIVO o AJUSTE_NEGATIVO)
  http.post('/api/inventario/ajuste', async ({ request }) => {
    const body = (await request.json()) as {
      varianteId: number;
      tipo: 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO';
      cantidad: number;
      motivo: string;
      usuarioId: number;
      usuarioNombre: string;
    };

    const stockIdx = STOCK.findIndex((s) => s.varianteId === body.varianteId);
    if (stockIdx === -1)
      return HttpResponse.json({ message: 'Variante no encontrada en stock.' }, { status: 404 });

    const stockActual = STOCK[stockIdx].cantidadFisica;
    const nuevoFisico =
      body.tipo === 'AJUSTE_POSITIVO'
        ? stockActual + body.cantidad
        : stockActual - body.cantidad;

    // RNF-INV-002: no stock físico negativo
    if (nuevoFisico < 0)
      return HttpResponse.json(
        { message: `El ajuste resultaría en stock negativo (${nuevoFisico}). Verifique la cantidad.` },
        { status: 422 },
      );

    STOCK[stockIdx] = { ...STOCK[stockIdx], cantidadFisica: nuevoFisico };

    const movimiento = {
      id: nextMovimientoId(),
      varianteId: body.varianteId,
      tipoMovimiento: body.tipo as TipoMovimiento,
      cantidad: body.cantidad,
      fecha: new Date().toISOString(),
      usuarioId: body.usuarioId,
      usuarioNombre: body.usuarioNombre,
      documentoRef: null,
      saldoResultante: nuevoFisico,
      motivo: body.motivo,
    };
    MOVIMIENTOS.push(movimiento);

    // Actualizar estado de alerta
    const alertaIdx = ALERTAS_STOCK.findIndex((a) => a.varianteId === body.varianteId);
    if (alertaIdx !== -1) {
      const umbral = ALERTAS_STOCK[alertaIdx].umbralMinimo;
      const disponible = calcularDisponible(body.varianteId);
      ALERTAS_STOCK[alertaIdx] = {
        ...ALERTAS_STOCK[alertaIdx],
        activo: disponible < umbral,
        fechaUltimaAlerta: disponible < umbral ? new Date().toISOString() : ALERTAS_STOCK[alertaIdx].fechaUltimaAlerta,
      };
    }

    return HttpResponse.json(movimiento, { status: 201 });
  }),
];

const alertasHandlers = [
  http.get('/api/inventario/alertas', () => {
    const alertasActivas = ALERTAS_STOCK
      .filter((a) => a.activo)
      .map((a) => {
        const { variante, producto } = contextoVariante(a.varianteId);
        const stock = STOCK.find((s) => s.varianteId === a.varianteId);
        const disponible = stock ? stock.cantidadFisica - stock.cantidadReservada : 0;
        return {
          ...a,
          productoNombre: producto?.nombre ?? '',
          talla: variante?.talla ?? '',
          color: variante?.color ?? '',
          sku: variante?.sku ?? '',
          cantidadDisponible: disponible,
        };
      })
      .sort((a, b) => a.cantidadDisponible - b.cantidadDisponible);

    return HttpResponse.json(alertasActivas);
  }),

  http.put('/api/inventario/alertas/:varianteId', async ({ params, request }) => {
    const varianteId = Number(params.varianteId);
    const body = (await request.json()) as { umbralMinimo: number };
    const idx = ALERTAS_STOCK.findIndex((a) => a.varianteId === varianteId);

    const disponible = calcularDisponible(varianteId);
    const alertaActiva = disponible < body.umbralMinimo;

    if (idx === -1) {
      const nueva = {
        id: ALERTAS_STOCK.length + 1,
        varianteId,
        umbralMinimo: body.umbralMinimo,
        fechaUltimaAlerta: alertaActiva ? new Date().toISOString() : null,
        activo: alertaActiva,
      };
      ALERTAS_STOCK.push(nueva);
      return HttpResponse.json(nueva, { status: 201 });
    }

    ALERTAS_STOCK[idx] = {
      ...ALERTAS_STOCK[idx],
      umbralMinimo: body.umbralMinimo,
      activo: alertaActiva,
      fechaUltimaAlerta: alertaActiva ? new Date().toISOString() : ALERTAS_STOCK[idx].fechaUltimaAlerta,
    };
    return HttpResponse.json(ALERTAS_STOCK[idx]);
  }),
];

const reportesHandlers = [
  http.get('/api/inventario/reportes/rotacion', () => {
    // Simula rotación: productos con más movimientos de salida = mayor rotación
    const rotacion = PRODUCTOS.map((p) => {
      const variantesProducto = VARIANTES.filter((v) => v.productoId === p.id);
      const totalSalidas = MOVIMIENTOS.filter(
        (m) => variantesProducto.some((v) => v.id === m.varianteId) &&
               (m.tipoMovimiento === 'SALIDA_VENTA' || m.tipoMovimiento === 'SALIDA_DEVOLUCION_COMPRA'),
      ).reduce((acc, m) => acc + m.cantidad, 0);
      const stockTotal = STOCK.filter((s) => variantesProducto.some((v) => v.id === s.varianteId))
        .reduce((acc, s) => acc + s.cantidadFisica, 0);

      return {
        productoId: p.id,
        productoNombre: p.nombre,
        marca: p.marca,
        totalSalidas,
        stockActual: stockTotal,
        indiceRotacion: stockTotal > 0 ? +(totalSalidas / stockTotal).toFixed(2) : 0,
      };
    }).sort((a, b) => b.indiceRotacion - a.indiceRotacion);

    return HttpResponse.json(rotacion);
  }),

  http.get('/api/inventario/reportes/valorizado', () => {
    const valorizado = PRODUCTOS.map((p) => {
      const variantesProducto = VARIANTES.filter((v) => v.productoId === p.id);
      const stockTotal = STOCK.filter((s) => variantesProducto.some((v) => v.id === s.varianteId))
        .reduce((acc, s) => acc + s.cantidadFisica, 0);
      const precioUnitario = p.precioBase;
      return {
        productoId: p.id,
        productoNombre: p.nombre,
        marca: p.marca,
        unidadesTotales: stockTotal,
        precioUnitario,
        valorTotal: +(stockTotal * precioUnitario).toFixed(2),
      };
    });

    const totalGeneral = valorizado.reduce((acc, v) => acc + v.valorTotal, 0);
    return HttpResponse.json({ items: valorizado, totalGeneral: +totalGeneral.toFixed(2) });
  }),
];

export const inventarioHandlers = [
  ...stockHandlers,
  ...movimientosHandlers,
  ...alertasHandlers,
  ...reportesHandlers,
];
