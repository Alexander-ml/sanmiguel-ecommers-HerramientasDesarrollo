import { http, HttpResponse } from 'msw';
import {
  PROVEEDORES,
  ORDENES_COMPRA,
  RECEPCIONES,
  DEVOLUCIONES_PROVEEDOR,
  nextProveedorId,
  nextOrdenId,
  nextDetalleCompraId,
  nextRecepcionId,
  nextDevolucionId,
  nextCodigoOC,
  nextCodigoRecepcion,
  nextCodigoDevolucion,
} from '../data/compras';
import { STOCK, MOVIMIENTOS, nextMovimientoId } from '../data/inventario';
import { VARIANTES, PRODUCTOS } from '../data/catalogo';
import type {
  Proveedor,
  OrdenCompra,
  DetalleCompra,
  RecepcionCompra,
  DevolucionProveedor,
  ResumenCompras,
  GastoProveedor,
  EstadoOrdenCompra,
} from '../../features/compras/types';

// Función para recalcular estado de la orden a partir de sus líneas (RN-COM-05)
function recalcularEstadoOrden(orden: OrdenCompra): EstadoOrdenCompra {
  if (orden.estado === 'CANCELADA') return 'CANCELADA';

  let totalPedidas = 0;
  let totalRecibidas = 0;

  for (const l of orden.lineas) {
    totalPedidas += l.cantidadPedida;
    totalRecibidas += l.cantidadRecibida;
  }

  if (totalRecibidas === 0) return 'PENDIENTE';
  if (totalRecibidas >= totalPedidas) return 'RECIBIDA';
  return 'PARCIALMENTE_RECIBIDA';
}

export const comprasHandlers = [
  // ── PROVEEDORES ─────────────────────────────────────────────────────────────
  // GET /api/proveedores
  http.get('/api/proveedores', ({ request }) => {
    const url = new URL(request.url);
    const busqueda = (url.searchParams.get('busqueda') ?? '').toLowerCase();
    const estado = url.searchParams.get('estado');
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? '10'));

    let resultado = [...PROVEEDORES];

    if (busqueda) {
      resultado = resultado.filter(
        (p) =>
          p.razonSocial.toLowerCase().includes(busqueda) ||
          p.ruc.includes(busqueda) ||
          p.contacto.nombre.toLowerCase().includes(busqueda) ||
          p.contacto.email.toLowerCase().includes(busqueda),
      );
    }

    if (estado) {
      resultado = resultado.filter((p) => p.estado === estado);
    }

    const total = resultado.length;
    const totalPaginas = Math.ceil(total / limit);
    const desde = (page - 1) * limit;
    const datos = resultado.slice(desde, desde + limit);

    return HttpResponse.json({ datos, total, pagina: page, totalPaginas });
  }),

  // GET /api/proveedores/:id
  http.get('/api/proveedores/:id', ({ params }) => {
    const id = Number(params.id);
    const prov = PROVEEDORES.find((p) => p.id === id);
    if (!prov) {
      return HttpResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }
    return HttpResponse.json(prov);
  }),

  // POST /api/proveedores (RF-COM-001)
  http.post('/api/proveedores', async ({ request }) => {
    const body = (await request.json()) as Omit<Proveedor, 'id' | 'fechaRegistro'>;

    // Validar RUC único
    const existe = PROVEEDORES.find((p) => p.ruc === body.ruc);
    if (existe) {
      return HttpResponse.json({ message: `Ya existe un proveedor con el RUC ${body.ruc}` }, { status: 400 });
    }

    const nuevo: Proveedor = {
      ...body,
      id: nextProveedorId(),
      fechaRegistro: new Date().toISOString(),
    };

    PROVEEDORES.unshift(nuevo);
    return HttpResponse.json(nuevo, { status: 201 });
  }),

  // PUT /api/proveedores/:id (RF-COM-003)
  http.put('/api/proveedores/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Proveedor>;
    const idx = PROVEEDORES.findIndex((p) => p.id === id);

    if (idx === -1) {
      return HttpResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }

    PROVEEDORES[idx] = {
      ...PROVEEDORES[idx],
      ...body,
      id, // inmutable
    };

    return HttpResponse.json(PROVEEDORES[idx]);
  }),

  // DELETE /api/proveedores/:id (RF-COM-004: baja lógica)
  http.delete('/api/proveedores/:id', ({ params }) => {
    const id = Number(params.id);
    const prov = PROVEEDORES.find((p) => p.id === id);

    if (!prov) {
      return HttpResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }

    prov.estado = 'inactivo';
    return HttpResponse.json({ message: 'Proveedor dado de baja exitosamente' });
  }),

  // ── ÓRDENES DE COMPRA ───────────────────────────────────────────────────────
  // GET /api/compras (RF-COM-006)
  http.get('/api/compras', ({ request }) => {
    const url = new URL(request.url);
    const estado = url.searchParams.get('estado');
    const proveedorId = url.searchParams.get('proveedorId');
    const codigo = (url.searchParams.get('codigo') ?? '').toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? '10'));

    let resultado = [...ORDENES_COMPRA];

    if (estado) {
      resultado = resultado.filter((o) => o.estado === estado);
    }

    if (proveedorId) {
      resultado = resultado.filter((o) => String(o.proveedorId) === proveedorId);
    }

    if (codigo) {
      resultado = resultado.filter(
        (o) =>
          o.codigo.toLowerCase().includes(codigo) ||
          o.proveedorNombre.toLowerCase().includes(codigo),
      );
    }

    // Ordenar de más reciente a más antigua
    resultado.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

    const total = resultado.length;
    const totalPaginas = Math.ceil(total / limit);
    const desde = (page - 1) * limit;
    const datos = resultado.slice(desde, desde + limit);

    return HttpResponse.json({ datos, total, pagina: page, totalPaginas });
  }),

  // GET /api/compras/:id
  http.get('/api/compras/:id', ({ params }) => {
    const id = Number(params.id);
    const orden = ORDENES_COMPRA.find((o) => o.id === id);

    if (!orden) {
      return HttpResponse.json({ message: 'Orden de compra no encontrada' }, { status: 404 });
    }

    return HttpResponse.json(orden);
  }),

  // POST /api/compras (RF-COM-005)
  http.post('/api/compras', async ({ request }) => {
    const body = (await request.json()) as {
      proveedorId: number;
      fechaEstimadaEntrega?: string;
      notas?: string;
      lineas: { varianteId: number; cantidadPedida: number; costoUnitario: number }[];
      usuarioCreadorId?: number;
      usuarioCreadorNombre?: string;
    };

    const prov = PROVEEDORES.find((p) => p.id === body.proveedorId);
    if (!prov) {
      return HttpResponse.json({ message: 'El proveedor seleccionado no existe.' }, { status: 400 });
    }
    if (prov.estado !== 'activo') {
      return HttpResponse.json({ message: 'El proveedor se encuentra inactivo.' }, { status: 400 });
    }

    if (!body.lineas || body.lineas.length === 0) {
      return HttpResponse.json({ message: 'Debe incluir al menos una línea en la orden.' }, { status: 400 });
    }

    // Validar existencia de cada variante (RN-COM-01)
    const lineasCreadas: DetalleCompra[] = [];
    let totalEstimado = 0;
    const compraId = nextOrdenId();

    for (const item of body.lineas) {
      const variante = VARIANTES.find((v) => v.id === item.varianteId);
      if (!variante) {
        return HttpResponse.json({ message: `La variante con ID ${item.varianteId} no existe en catálogo.` }, { status: 400 });
      }

      const producto = PRODUCTOS.find((p) => p.id === variante.productoId);
      const subtotal = item.cantidadPedida * item.costoUnitario;
      totalEstimado += subtotal;

      lineasCreadas.push({
        id: nextDetalleCompraId(),
        compraId,
        varianteId: variante.id,
        productoId: variante.productoId,
        productoNombre: producto?.nombre ?? 'Prenda',
        talla: variante.talla,
        color: variante.color,
        sku: variante.sku,
        cantidadPedida: item.cantidadPedida,
        cantidadRecibida: 0,
        costoUnitario: item.costoUnitario,
        subtotal,
      });
    }

    const nuevaOrden: OrdenCompra = {
      id: compraId,
      codigo: nextCodigoOC(),
      proveedorId: prov.id,
      proveedorNombre: prov.razonSocial,
      proveedorRuc: prov.ruc,
      fechaCreacion: new Date().toISOString(),
      fechaEstimadaEntrega: body.fechaEstimadaEntrega,
      estado: 'PENDIENTE', // RN-COM-05
      totalEstimado,
      usuarioCreadorId: body.usuarioCreadorId ?? 0,
      usuarioCreadorNombre: body.usuarioCreadorNombre ?? 'Sistema',
      notas: body.notas,
      lineas: lineasCreadas,
      recepciones: [],
      devoluciones: [],
    };

    ORDENES_COMPRA.unshift(nuevaOrden);
    return HttpResponse.json(nuevaOrden, { status: 201 });
  }),

  // PUT /api/compras/:id (RF-COM-007): editar mientras la orden esté PENDIENTE (RN-COM-03).
  http.put('/api/compras/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const orden = ORDENES_COMPRA.find((o) => o.id === id);

    if (!orden) {
      return HttpResponse.json({ message: 'Orden de compra no encontrada' }, { status: 404 });
    }
    if (orden.estado !== 'PENDIENTE') {
      return HttpResponse.json(
        { message: 'Solo se pueden modificar órdenes de compra en estado Pendiente, sin recepciones registradas.' },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      proveedorId: number;
      fechaEstimadaEntrega?: string;
      notas?: string;
      lineas: { varianteId: number; cantidadPedida: number; costoUnitario: number }[];
      usuarioModificadorId?: number;
      usuarioModificadorNombre?: string;
    };

    const prov = PROVEEDORES.find((p) => p.id === body.proveedorId);
    if (!prov) {
      return HttpResponse.json({ message: 'El proveedor seleccionado no existe.' }, { status: 400 });
    }
    if (!body.lineas || body.lineas.length === 0) {
      return HttpResponse.json({ message: 'Debe incluir al menos una línea en la orden.' }, { status: 400 });
    }

    const lineasActualizadas: DetalleCompra[] = [];
    let totalEstimado = 0;

    for (const item of body.lineas) {
      const variante = VARIANTES.find((v) => v.id === item.varianteId);
      if (!variante) {
        return HttpResponse.json({ message: `La variante con ID ${item.varianteId} no existe en catálogo.` }, { status: 400 });
      }

      const producto = PRODUCTOS.find((p) => p.id === variante.productoId);
      const subtotal = item.cantidadPedida * item.costoUnitario;
      totalEstimado += subtotal;

      lineasActualizadas.push({
        id: nextDetalleCompraId(),
        compraId: orden.id,
        varianteId: variante.id,
        productoId: variante.productoId,
        productoNombre: producto?.nombre ?? 'Prenda',
        talla: variante.talla,
        color: variante.color,
        sku: variante.sku,
        cantidadPedida: item.cantidadPedida,
        cantidadRecibida: 0,
        costoUnitario: item.costoUnitario,
        subtotal,
      });
    }

    orden.proveedorId = prov.id;
    orden.proveedorNombre = prov.razonSocial;
    orden.proveedorRuc = prov.ruc;
    orden.fechaEstimadaEntrega = body.fechaEstimadaEntrega;
    orden.notas = body.notas;
    orden.lineas = lineasActualizadas;
    orden.totalEstimado = totalEstimado;

    return HttpResponse.json(orden);
  }),

  // PATCH /api/compras/:id/cancelar (RF-COM-008, RN-COM-03)
  http.patch('/api/compras/:id/cancelar', ({ params }) => {
    const id = Number(params.id);
    const orden = ORDENES_COMPRA.find((o) => o.id === id);

    if (!orden) {
      return HttpResponse.json({ message: 'Orden de compra no encontrada' }, { status: 404 });
    }

    // RN-COM-03: Solo se cancelan órdenes sin recepciones
    if (orden.recepciones.length > 0) {
      return HttpResponse.json(
        { message: 'No se puede cancelar una orden que ya tiene recepciones registradas. Gestione una devolución si aplica.' },
        { status: 400 },
      );
    }

    if (orden.estado === 'CANCELADA') {
      return HttpResponse.json({ message: 'La orden ya está cancelada.' }, { status: 400 });
    }

    orden.estado = 'CANCELADA';
    return HttpResponse.json(orden);
  }),

  // ── RECEPCIÓN DE MERCADERÍA ─────────────────────────────────────────────────
  // POST /api/compras/:id/recepciones (RF-COM-009, RF-COM-010, RN-COM-02, RN-COM-06)
  http.post('/api/compras/:id/recepciones', async ({ params, request }) => {
    const compraId = Number(params.id);
    const orden = ORDENES_COMPRA.find((o) => o.id === compraId);

    if (!orden) {
      return HttpResponse.json({ message: 'Orden de compra no encontrada' }, { status: 404 });
    }

    if (orden.estado === 'CANCELADA') {
      return HttpResponse.json({ message: 'No se puede recibir mercadería de una orden cancelada.' }, { status: 400 });
    }

    if (orden.estado === 'RECIBIDA') {
      return HttpResponse.json({ message: 'Esta orden ya fue recibida en su totalidad.' }, { status: 400 });
    }

    const body = (await request.json()) as {
      comprobanteReferencia?: string;
      notas?: string;
      lineas: { varianteId: number; cantidadRecibida: number }[];
      usuarioReceptorId?: number;
      usuarioReceptorNombre?: string;
    };

    if (!body.lineas || body.lineas.length === 0) {
      return HttpResponse.json({ message: 'Debe ingresar al menos una línea con cantidad recibida.' }, { status: 400 });
    }

    // Validar que no exceda lo pendiente por línea (RN-COM-02)
    for (const recLine of body.lineas) {
      const detalle = orden.lineas.find((l) => l.varianteId === recLine.varianteId);
      if (!detalle) {
        return HttpResponse.json(
          { message: `La variante con ID ${recLine.varianteId} no forma parte de esta orden de compra.` },
          { status: 400 },
        );
      }

      const pendiente = detalle.cantidadPedida - detalle.cantidadRecibida;
      if (recLine.cantidadRecibida > pendiente) {
        return HttpResponse.json(
          {
            message: `Para ${detalle.productoNombre} (${detalle.talla}/${detalle.color}), la cantidad recibida (${recLine.cantidadRecibida}) excede lo pendiente (${pendiente}).`,
          },
          { status: 400 },
        );
      }
    }

    // Registrar el evento de recepción
    const recepcion: RecepcionCompra = {
      id: nextRecepcionId(),
      compraId: orden.id,
      codigoRecepcion: nextCodigoRecepcion(),
      fechaRecepcion: new Date().toISOString(),
      usuarioReceptorId: body.usuarioReceptorId ?? 0,
      usuarioReceptorNombre: body.usuarioReceptorNombre ?? 'Sistema',
      comprobanteReferencia: body.comprobanteReferencia,
      notas: body.notas,
      lineas: body.lineas.filter((l) => l.cantidadRecibida > 0),
    };

    // Actualizar cantidades recibidas en las líneas de la orden
    for (const recLine of body.lineas) {
      if (recLine.cantidadRecibida <= 0) continue;
      const detalle = orden.lineas.find((l) => l.varianteId === recLine.varianteId);
      if (detalle) {
        detalle.cantidadRecibida += recLine.cantidadRecibida;
      }

      // COMUNICAR A INVENTARIO (RF-COM-010, RN-COM-06): Actualizar stock físico y generar ENTRADA_COMPRA
      let stockItem = STOCK.find((s) => s.varianteId === recLine.varianteId);
      if (!stockItem) {
        stockItem = {
          id: STOCK.length + 1,
          varianteId: recLine.varianteId,
          cantidadFisica: 0,
          cantidadReservada: 0,
        };
        STOCK.push(stockItem);
      }

      stockItem.cantidadFisica += recLine.cantidadRecibida;

      MOVIMIENTOS.push({
        id: nextMovimientoId(),
        varianteId: recLine.varianteId,
        tipoMovimiento: 'ENTRADA_COMPRA',
        cantidad: recLine.cantidadRecibida,
        fecha: new Date().toISOString(),
        usuarioId: body.usuarioReceptorId ?? 0,
        usuarioNombre: body.usuarioReceptorNombre ?? 'Sistema',
        documentoRef: `${orden.codigo} / ${recepcion.codigoRecepcion}`,
        saldoResultante: stockItem.cantidadFisica,
        motivo: `Recepción de orden ${orden.codigo} (${orden.proveedorNombre})`,
      });
    }

    orden.recepciones.unshift(recepcion);
    orden.estado = recalcularEstadoOrden(orden); // RN-COM-05

    RECEPCIONES.unshift(recepcion);

    return HttpResponse.json({ orden, recepcion }, { status: 201 });
  }),

  // ── DEVOLUCIÓN A PROVEEDOR ──────────────────────────────────────────────────
  // POST /api/compras/:id/devoluciones (RF-COM-011, RF-COM-012, RN-COM-04)
  http.post('/api/compras/:id/devoluciones', async ({ params, request }) => {
    const compraId = Number(params.id);
    const orden = ORDENES_COMPRA.find((o) => o.id === compraId);

    if (!orden) {
      return HttpResponse.json({ message: 'Orden de compra no encontrada' }, { status: 404 });
    }

    const body = (await request.json()) as {
      recepcionId: number;
      varianteId: number;
      cantidad: number;
      motivo: string;
      usuarioId?: number;
      usuarioNombre?: string;
    };

    const detalle = orden.lineas.find((l) => l.varianteId === body.varianteId);
    if (!detalle) {
      return HttpResponse.json({ message: 'La variante no pertenece a esta orden.' }, { status: 400 });
    }

    // RN-COM-04: Devolución <= recibida
    if (body.cantidad > detalle.cantidadRecibida) {
      return HttpResponse.json(
        { message: `No se puede devolver ${body.cantidad} unidades. Solo se han recibido ${detalle.cantidadRecibida}.` },
        { status: 400 },
      );
    }

    const devolucion: DevolucionProveedor = {
      id: nextDevolucionId(),
      compraId: orden.id,
      recepcionId: body.recepcionId,
      codigoDevolucion: nextCodigoDevolucion(),
      varianteId: body.varianteId,
      productoNombre: detalle.productoNombre,
      talla: detalle.talla,
      color: detalle.color,
      sku: detalle.sku,
      cantidad: body.cantidad,
      motivo: body.motivo,
      fecha: new Date().toISOString(),
      usuarioId: body.usuarioId ?? 0,
      usuarioNombre: body.usuarioNombre ?? 'Sistema',
    };

    // Disminuir cantidad recibida neta
    detalle.cantidadRecibida -= body.cantidad;

    // COMUNICAR A INVENTARIO (RF-COM-012): Disminuir stock físico y registrar SALIDA_DEVOLUCION_COMPRA
    const stockItem = STOCK.find((s) => s.varianteId === body.varianteId);
    if (stockItem) {
      stockItem.cantidadFisica = Math.max(0, stockItem.cantidadFisica - body.cantidad);

      MOVIMIENTOS.push({
        id: nextMovimientoId(),
        varianteId: body.varianteId,
        tipoMovimiento: 'SALIDA_DEVOLUCION_COMPRA',
        cantidad: body.cantidad,
        fecha: new Date().toISOString(),
        usuarioId: body.usuarioId ?? 0,
        usuarioNombre: body.usuarioNombre ?? 'Sistema',
        documentoRef: devolucion.codigoDevolucion,
        saldoResultante: stockItem.cantidadFisica,
        motivo: `Devolución a proveedor ${orden.proveedorNombre}: ${body.motivo}`,
      });
    }

    orden.devoluciones.unshift(devolucion);
    orden.estado = recalcularEstadoOrden(orden);

    DEVOLUCIONES_PROVEEDOR.unshift(devolucion);

    return HttpResponse.json({ orden, devolucion }, { status: 201 });
  }),

  // ── REPORTES DE COMPRAS ─────────────────────────────────────────────────────
  // GET /api/compras/reportes/resumen (RF-COM-015)
  http.get('/api/compras/reportes/resumen', () => {
    const pendientes = ORDENES_COMPRA.filter((o) => o.estado === 'PENDIENTE').length;
    const parcialmenteRecibidas = ORDENES_COMPRA.filter((o) => o.estado === 'PARCIALMENTE_RECIBIDA').length;
    const recibidas = ORDENES_COMPRA.filter((o) => o.estado === 'RECIBIDA').length;
    const canceladas = ORDENES_COMPRA.filter((o) => o.estado === 'CANCELADA').length;
    const gastoTotal = ORDENES_COMPRA
      .filter((o) => o.estado !== 'CANCELADA')
      .reduce((sum, o) => sum + o.totalEstimado, 0);

    const proveedoresActivos = PROVEEDORES.filter((p) => p.estado === 'activo').length;

    const resumen: ResumenCompras = {
      totalOrdenes: ORDENES_COMPRA.length,
      pendientes,
      parcialmenteRecibidas,
      recibidas,
      canceladas,
      gastoTotal,
      totalProveedores: proveedoresActivos,
    };

    return HttpResponse.json(resumen);
  }),

  // GET /api/compras/reportes/gasto-proveedor (REP-COM-01)
  http.get('/api/compras/reportes/gasto-proveedor', () => {
    const mapa: Record<number, { proveedorNombre: string; totalOrdenes: number; montoTotal: number }> = {};

    for (const o of ORDENES_COMPRA) {
      if (o.estado === 'CANCELADA') continue;
      if (!mapa[o.proveedorId]) {
        mapa[o.proveedorId] = {
          proveedorNombre: o.proveedorNombre,
          totalOrdenes: 0,
          montoTotal: 0,
        };
      }
      mapa[o.proveedorId].totalOrdenes += 1;
      mapa[o.proveedorId].montoTotal += o.totalEstimado;
    }

    const resultado: GastoProveedor[] = Object.entries(mapa).map(([id, val]) => ({
      proveedorId: Number(id),
      proveedorNombre: val.proveedorNombre,
      totalOrdenes: val.totalOrdenes,
      montoTotal: val.montoTotal,
    }));

    resultado.sort((a, b) => b.montoTotal - a.montoTotal);

    return HttpResponse.json(resultado);
  }),

  // GET /api/compras/reportes/comparativo-costos (REP-COM-02)
  http.get('/api/compras/reportes/comparativo-costos', () => {
    const porVariante: Record<number, { productoNombre: string; talla: string; color: string; costos: number[] }> = {};

    for (const o of ORDENES_COMPRA) {
      if (o.estado === 'CANCELADA') continue;
      for (const linea of o.lineas) {
        if (!porVariante[linea.varianteId]) {
          porVariante[linea.varianteId] = {
            productoNombre: linea.productoNombre,
            talla: linea.talla,
            color: linea.color,
            costos: [],
          };
        }
        porVariante[linea.varianteId].costos.push(linea.costoUnitario);
      }
    }

    const resultado = Object.entries(porVariante)
      .filter(([, v]) => v.costos.length > 0)
      .map(([varianteId, v]) => ({
        varianteId: Number(varianteId),
        productoNombre: v.productoNombre,
        talla: v.talla,
        color: v.color,
        costoMinimo: Math.min(...v.costos),
        costoMaximo: Math.max(...v.costos),
        costoPromedio: +(v.costos.reduce((s, c) => s + c, 0) / v.costos.length).toFixed(2),
        vecesComprado: v.costos.length,
      }))
      .sort((a, b) => b.vecesComprado - a.vecesComprado);

    return HttpResponse.json(resultado);
  }),

  // GET /api/compras/reportes/tiempos-entrega (REP-COM-03)
  http.get('/api/compras/reportes/tiempos-entrega', () => {
    const porProveedor: Record<number, { proveedorNombre: string; dias: number[] }> = {};

    for (const o of ORDENES_COMPRA) {
      if (o.recepciones.length === 0) continue;
      const primeraRecepcion = o.recepciones[0];
      const dias = Math.max(
        0,
        Math.round(
          (new Date(primeraRecepcion.fechaRecepcion).getTime() - new Date(o.fechaCreacion).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      if (!porProveedor[o.proveedorId]) {
        porProveedor[o.proveedorId] = { proveedorNombre: o.proveedorNombre, dias: [] };
      }
      porProveedor[o.proveedorId].dias.push(dias);
    }

    const resultado = Object.entries(porProveedor).map(([proveedorId, v]) => ({
      proveedorId: Number(proveedorId),
      proveedorNombre: v.proveedorNombre,
      diasPromedio: +(v.dias.reduce((s, d) => s + d, 0) / v.dias.length).toFixed(1),
      ordenesConsideradas: v.dias.length,
    }));

    resultado.sort((a, b) => a.diasPromedio - b.diasPromedio);

    return HttpResponse.json(resultado);
  }),

  // GET /api/compras/reportes/tasa-devoluciones (REP-COM-04)
  http.get('/api/compras/reportes/tasa-devoluciones', () => {
    const totalRecibido = ORDENES_COMPRA.reduce(
      (s, o) => s + o.lineas.reduce((s2, l) => s2 + l.cantidadRecibida, 0),
      0,
    );
    const totalDevuelto = ORDENES_COMPRA.reduce((s, o) => s + o.devoluciones.reduce((s2, d) => s2 + d.cantidad, 0), 0);

    return HttpResponse.json({
      totalUnidadesRecibidas: totalRecibido,
      totalUnidadesDevueltas: totalDevuelto,
      tasaDevolucion: totalRecibido > 0 ? +((totalDevuelto / totalRecibido) * 100).toFixed(2) : 0,
    });
  }),
];
