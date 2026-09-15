import { http, HttpResponse } from 'msw';
import {
  CLIENTES,
  DIRECCIONES,
  CONSENTIMIENTOS,
  SOLICITUDES_ARCO,
  nextDireccionId,
  nextConsentimientoId,
  nextArcoId,
} from '../data/clientes';
import { PEDIDOS } from '../data/pedidos';
import type {
  Cliente,
  Direccion,
  ConsentimientoDatos,
  SolicitudARCO,
  ResumenClientes,
} from '../../features/clientes/types';

export const clientesHandlers = [
  // ── RESUMEN & REPORTES ──────────────────────────────────────────────────────
  // GET /api/clientes/reportes/resumen (RF-CLI-016, REP-CLI-01 a REP-CLI-04)
  http.get('/api/clientes/reportes/resumen', () => {
    const totalClientes = CLIENTES.length;
    const clientesActivos = CLIENTES.filter((c) => c.estado === 'activo').length;
    const clientesVip = CLIENTES.filter((c) => c.segmentoRFM === 'VIP').length;
    const clientesFrecuentes = CLIENTES.filter((c) => c.segmentoRFM === 'FRECUENTE').length;
    const clientesEnRiesgo = CLIENTES.filter((c) => c.segmentoRFM === 'EN_RIESGO').length;
    const clientesInactivos = CLIENTES.filter((c) => c.segmentoRFM === 'INACTIVO').length;
    const clientesNuevos = CLIENTES.filter((c) => c.segmentoRFM === 'NUEVO').length;

    // Pedidos de invitado
    const pedidosInvitadosSinVincular = PEDIDOS.filter((p) => p.clienteId === null).length;
    const pedidosInvitadosVinculados = PEDIDOS.filter((p) => p.clienteId !== null).length;

    const solicitudesArcoPendientes = SOLICITUDES_ARCO.filter((s) => s.estado === 'PENDIENTE').length;

    const resumen: ResumenClientes = {
      totalClientes,
      clientesActivos,
      clientesVip,
      clientesFrecuentes,
      clientesEnRiesgo,
      clientesInactivos,
      clientesNuevos,
      pedidosInvitadosSinVincular,
      pedidosInvitadosVinculados,
      solicitudesArcoPendientes,
    };

    return HttpResponse.json(resumen);
  }),

  // ── CLIENTES (DIRECTORIO & PERFIL) ──────────────────────────────────────────
  // GET /api/clientes (RF-CLI-016)
  http.get('/api/clientes', ({ request }) => {
    const url = new URL(request.url);
    const busqueda = (url.searchParams.get('busqueda') ?? '').toLowerCase();
    const estado = url.searchParams.get('estado');
    const segmento = url.searchParams.get('segmento');
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? '10'));

    let resultado = [...CLIENTES];

    if (busqueda) {
      resultado = resultado.filter(
        (c) =>
          `${c.nombres} ${c.apellidos}`.toLowerCase().includes(busqueda) ||
          c.email.toLowerCase().includes(busqueda) ||
          c.numeroDocumento.includes(busqueda) ||
          c.telefono.includes(busqueda),
      );
    }

    if (estado) {
      resultado = resultado.filter((c) => c.estado === estado);
    }

    if (segmento) {
      resultado = resultado.filter((c) => c.segmentoRFM === segmento);
    }

    // Attach fresh direcciones y consentimientos
    resultado = resultado.map((c) => ({
      ...c,
      direcciones: DIRECCIONES.filter((d) => d.clienteId === c.id),
      consentimientos: CONSENTIMIENTOS.filter((cs) => cs.clienteId === c.id),
    }));

    const total = resultado.length;
    const totalPaginas = Math.ceil(total / limit);
    const desde = (page - 1) * limit;
    const datos = resultado.slice(desde, desde + limit);

    return HttpResponse.json({ datos, total, pagina: page, totalPaginas });
  }),

  // GET /api/clientes/me (RF-CLI-004: autogestión cliente demo ID 4)
  http.get('/api/clientes/me', () => {
    const cliente = CLIENTES.find((c) => c.id === 4) ?? CLIENTES[0];
    const direcciones = DIRECCIONES.filter((d) => d.clienteId === cliente.id);
    const consentimientos = CONSENTIMIENTOS.filter((cs) => cs.clienteId === cliente.id);
    return HttpResponse.json({ ...cliente, direcciones, consentimientos });
  }),

  // GET /api/clientes/:id (RF-CLI-004)
  http.get('/api/clientes/:id', ({ params }) => {
    const id = Number(params.id);
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) {
      return HttpResponse.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }
    const direcciones = DIRECCIONES.filter((d) => d.clienteId === cliente.id);
    const consentimientos = CONSENTIMIENTOS.filter((cs) => cs.clienteId === cliente.id);
    return HttpResponse.json({ ...cliente, direcciones, consentimientos });
  }),

  // PUT /api/clientes/me & PUT /api/clientes/:id (RF-CLI-005)
  http.put('/api/clientes/:id', async ({ params, request }) => {
    const id = params.id === 'me' ? 4 : Number(params.id);
    const body = (await request.json()) as Partial<Cliente>;
    const idx = CLIENTES.findIndex((c) => c.id === id);

    if (idx === -1) {
      return HttpResponse.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }

    CLIENTES[idx] = {
      ...CLIENTES[idx],
      ...body,
      id, // inmutable
    };

    const direcciones = DIRECCIONES.filter((d) => d.clienteId === id);
    const consentimientos = CONSENTIMIENTOS.filter((cs) => cs.clienteId === id);

    return HttpResponse.json({ ...CLIENTES[idx], direcciones, consentimientos });
  }),

  // PATCH /api/clientes/:id/estado
  http.patch('/api/clientes/:id/estado', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { estado: 'activo' | 'inactivo' };
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) {
      return HttpResponse.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }
    cliente.estado = body.estado;
    return HttpResponse.json(cliente);
  }),

  // ── GESTIÓN DE DIRECCIONES (RF-CLI-006 a RF-CLI-010) ───────────────────────
  // GET /api/clientes/:id/direcciones (o /api/direcciones)
  http.get('/api/clientes/:id/direcciones', ({ params }) => {
    const clienteId = params.id === 'me' ? 4 : Number(params.id);
    const dirs = DIRECCIONES.filter((d) => d.clienteId === clienteId);
    return HttpResponse.json(dirs);
  }),

  // POST /api/clientes/:id/direcciones (RF-CLI-006)
  http.post('/api/clientes/:id/direcciones', async ({ params, request }) => {
    const clienteId = params.id === 'me' ? 4 : Number(params.id);
    const body = (await request.json()) as Omit<Direccion, 'id' | 'clienteId'>;

    // Si se marca como predeterminada, quitar predeterminada de las demás
    if (body.esPredeterminada) {
      for (const d of DIRECCIONES) {
        if (d.clienteId === clienteId) d.esPredeterminada = false;
      }
    }

    const nueva: Direccion = {
      ...body,
      id: nextDireccionId(),
      clienteId,
    };

    // Si es la primera dirección, marcarla como predeterminada por defecto
    const tieneDirs = DIRECCIONES.some((d) => d.clienteId === clienteId);
    if (!tieneDirs) {
      nueva.esPredeterminada = true;
    }

    DIRECCIONES.push(nueva);
    return HttpResponse.json(nueva, { status: 201 });
  }),

  // PUT /api/direcciones/:id (RF-CLI-008)
  http.put('/api/direcciones/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Direccion>;
    const idx = DIRECCIONES.findIndex((d) => d.id === id);

    if (idx === -1) {
      return HttpResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }

    if (body.esPredeterminada) {
      const cid = DIRECCIONES[idx].clienteId;
      for (const d of DIRECCIONES) {
        if (d.clienteId === cid) d.esPredeterminada = false;
      }
    }

    DIRECCIONES[idx] = {
      ...DIRECCIONES[idx],
      ...body,
      id,
    };

    return HttpResponse.json(DIRECCIONES[idx]);
  }),

  // DELETE /api/direcciones/:id (RF-CLI-009)
  http.delete('/api/direcciones/:id', ({ params }) => {
    const id = Number(params.id);
    const idx = DIRECCIONES.findIndex((d) => d.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }
    DIRECCIONES.splice(idx, 1);
    return HttpResponse.json({ message: 'Dirección eliminada correctamente' });
  }),

  // PATCH /api/direcciones/:id/predeterminada (RF-CLI-010)
  http.patch('/api/direcciones/:id/predeterminada', ({ params }) => {
    const id = Number(params.id);
    const dir = DIRECCIONES.find((d) => d.id === id);
    if (!dir) {
      return HttpResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }

    for (const d of DIRECCIONES) {
      if (d.clienteId === dir.clienteId) {
        d.esPredeterminada = d.id === id;
      }
    }

    return HttpResponse.json(dir);
  }),

  // ── VINCULACIÓN DE PEDIDOS DE INVITADO (RF-CLI-003, RN-CLI-02) ──────────────
  // GET /api/clientes/:id/pedidos-invitado-pendientes
  http.get('/api/clientes/:id/pedidos-invitado-pendientes', ({ params }) => {
    const clienteId = params.id === 'me' ? 4 : Number(params.id);
    const cliente = CLIENTES.find((c) => c.id === clienteId);
    if (!cliente) {
      return HttpResponse.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }

    // Buscar pedidos de invitado con el mismo correo
    const pedidosInvitado = PEDIDOS.filter(
      (p) => p.clienteId === null && p.contacto.email.toLowerCase() === cliente.email.toLowerCase(),
    );

    return HttpResponse.json(pedidosInvitado);
  }),

  // POST /api/clientes/:id/vincular-pedidos-invitado (RF-CLI-003, RN-CLI-02)
  http.post('/api/clientes/:id/vincular-pedidos-invitado', ({ params }) => {
    const clienteId = params.id === 'me' ? 4 : Number(params.id);
    const cliente = CLIENTES.find((c) => c.id === clienteId);
    if (!cliente) {
      return HttpResponse.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }

    let vinculados = 0;
    for (const p of PEDIDOS) {
      if (p.clienteId === null && p.contacto.email.toLowerCase() === cliente.email.toLowerCase()) {
        p.clienteId = cliente.id;
        vinculados++;
      }
    }

    return HttpResponse.json({
      message: `Se han vinculado ${vinculados} pedido(s) de invitado a tu cuenta con éxito.`,
      vinculados,
    });
  }),

  // ── DERECHOS ARCO (RF-CLI-013, RF-CLI-014, RN-CLI-05) ──────────────────────
  // GET /api/arco/solicitudes
  http.get('/api/arco/solicitudes', ({ request }) => {
    const url = new URL(request.url);
    const estado = url.searchParams.get('estado');

    let resultado = [...SOLICITUDES_ARCO];
    if (estado) {
      resultado = resultado.filter((s) => s.estado === estado);
    }
    resultado.sort((a, b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime());
    return HttpResponse.json(resultado);
  }),

  // POST /api/arco/solicitudes (RF-CLI-013)
  http.post('/api/arco/solicitudes', async ({ request }) => {
    const body = (await request.json()) as {
      clienteId: number;
      tipoDerecho: 'ACCESO' | 'RECTIFICACION' | 'CANCELACION' | 'OPOSICION';
      detalle: string;
    };

    const cliente = CLIENTES.find((c) => c.id === body.clienteId) ?? CLIENTES[0];

    const nueva: SolicitudARCO = {
      id: nextArcoId(),
      clienteId: cliente.id,
      clienteNombre: `${cliente.nombres} ${cliente.apellidos}`,
      clienteEmail: cliente.email,
      tipoDerecho: body.tipoDerecho,
      detalle: body.detalle,
      estado: 'PENDIENTE',
      fechaSolicitud: new Date().toISOString(),
    };

    SOLICITUDES_ARCO.unshift(nueva);
    return HttpResponse.json(nueva, { status: 201 });
  }),

  // PATCH /api/arco/solicitudes/:id/atender (RF-CLI-014, RN-CLI-05)
  http.patch('/api/arco/solicitudes/:id/atender', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as {
      estado: 'ATENDIDA' | 'RECHAZADA';
      respuestaAdmin: string;
    };

    const solicitud = SOLICITUDES_ARCO.find((s) => s.id === id);
    if (!solicitud) {
      return HttpResponse.json({ message: 'Solicitud ARCO no encontrada' }, { status: 404 });
    }

    solicitud.estado = body.estado;
    solicitud.respuestaAdmin = body.respuestaAdmin;
    solicitud.fechaRespuesta = new Date().toISOString();
    solicitud.usuarioAtendioId = 1;
    solicitud.usuarioAtendioNombre = 'Ana Flores (Administrador)';

    return HttpResponse.json(solicitud);
  }),

  // ── CONSENTIMIENTO DE DATOS PERSONALES (RF-CLI-012, RN-CLI-01) ──────────────
  // POST /api/clientes/:id/consentimiento
  http.post('/api/clientes/:id/consentimiento', async ({ params, request }) => {
    const clienteId = params.id === 'me' ? 4 : Number(params.id);
    const cliente = CLIENTES.find((c) => c.id === clienteId);
    const body = (await request.json()) as { estado: 'OTORGADO' | 'REVOCADO' };

    const nuevo: ConsentimientoDatos = {
      id: nextConsentimientoId(),
      clienteId,
      email: cliente ? cliente.email : 'cliente@sanmiguel.pe',
      pedidoId: null,
      fecha: new Date().toISOString(),
      versionPolitica: 'v2.1 - 2025',
      finalidad: 'Tratamiento de datos personales conforme a Ley N° 29733.',
      estado: body.estado,
    };

    CONSENTIMIENTOS.unshift(nuevo);
    return HttpResponse.json(nuevo, { status: 201 });
  }),
];
