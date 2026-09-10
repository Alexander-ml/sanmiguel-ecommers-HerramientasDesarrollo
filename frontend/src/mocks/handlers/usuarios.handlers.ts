import { http, HttpResponse } from 'msw';
import {
  USUARIOS_INTERNOS,
  ROLES_SEGURIDAD,
  PERMISOS_SISTEMA,
  SESIONES_ACTIVAS,
  EVENTOS_SEGURIDAD,
  nextUsuarioId,
  nextEventoId,
} from '../data/seguridad';
import type {
  UsuarioInterno,
  RolSeguridad,
  ResumenSeguridad,
} from '../../features/usuarios/types';

export const usuariosHandlers = [
  // ── RESUMEN DE SEGURIDAD ───────────────────────────────────────────────────
  // GET /api/seguridad/resumen (REP-USR-01, REP-USR-03)
  http.get('/api/seguridad/resumen', () => {
    const totalUsuarios = USUARIOS_INTERNOS.length;
    const usuariosActivos = USUARIOS_INTERNOS.filter((u) => u.estado === 'activo').length;
    const totalRoles = ROLES_SEGURIDAD.length;
    const sesionesActivas = SESIONES_ACTIVAS.filter((s) => s.estado === 'vigente').length;
    const intentosFallidos24h = EVENTOS_SEGURIDAD.filter((e) => e.tipoEvento === 'LOGIN_FALLIDO').length;

    const resumen: ResumenSeguridad = {
      totalUsuarios,
      usuariosActivos,
      totalRoles,
      sesionesActivas,
      intentosFallidos24h,
    };

    return HttpResponse.json(resumen);
  }),

  // ── USUARIOS INTERNOS ───────────────────────────────────────────────────────
  // GET /api/usuarios-internos (RF-USR-002)
  http.get('/api/usuarios-internos', ({ request }) => {
    const url = new URL(request.url);
    const busqueda = (url.searchParams.get('busqueda') ?? '').toLowerCase();
    const rol = url.searchParams.get('rol');
    const estado = url.searchParams.get('estado');
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? '10'));

    let resultado = [...USUARIOS_INTERNOS];

    if (busqueda) {
      resultado = resultado.filter(
        (u) =>
          `${u.nombres} ${u.apellidos}`.toLowerCase().includes(busqueda) ||
          u.correo.toLowerCase().includes(busqueda),
      );
    }

    if (rol) {
      resultado = resultado.filter((u) => u.rol === rol);
    }

    if (estado) {
      resultado = resultado.filter((u) => u.estado === estado);
    }

    const total = resultado.length;
    const totalPaginas = Math.ceil(total / limit);
    const desde = (page - 1) * limit;
    const datos = resultado.slice(desde, desde + limit);

    return HttpResponse.json({ datos, total, pagina: page, totalPaginas });
  }),

  // POST /api/usuarios-internos (RF-USR-001, RN-USR-01, RN-USR-02)
  http.post('/api/usuarios-internos', async ({ request }) => {
    const body = (await request.json()) as {
      nombres: string;
      apellidos: string;
      correo: string;
      rol: 'ADMINISTRADOR' | 'ALMACENERO' | 'VENDEDOR';
      password?: string;
    };

    // Validar correo único
    const existe = USUARIOS_INTERNOS.find((u) => u.correo.toLowerCase() === body.correo.toLowerCase());
    if (existe) {
      return HttpResponse.json({ message: 'Ya existe una cuenta con ese correo electrónico.' }, { status: 400 });
    }

    const nuevo: UsuarioInterno = {
      id: nextUsuarioId(),
      nombres: body.nombres,
      apellidos: body.apellidos,
      correo: body.correo,
      rol: body.rol, // RN-USR-01: Rol obligatorio
      estado: 'activo',
      fechaCreacion: new Date().toISOString(),
      ultimoAcceso: null,
      intentosFallidos: 0,
    };

    USUARIOS_INTERNOS.unshift(nuevo);

    // Auditoría
    EVENTOS_SEGURIDAD.unshift({
      id: nextEventoId(),
      tipoEvento: 'LOGIN_EXITOSO',
      usuarioCorreo: nuevo.correo,
      ip: '190.237.45.12',
      fecha: new Date().toISOString(),
      detalle: `Alta de cuenta interna con rol ${nuevo.rol}.`,
    });

    return HttpResponse.json(nuevo, { status: 201 });
  }),

  // PUT /api/usuarios-internos/:id (RF-USR-003)
  http.put('/api/usuarios-internos/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<UsuarioInterno>;
    const idx = USUARIOS_INTERNOS.findIndex((u) => u.id === id);

    if (idx === -1) {
      return HttpResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    USUARIOS_INTERNOS[idx] = {
      ...USUARIOS_INTERNOS[idx],
      ...body,
      id,
    };

    return HttpResponse.json(USUARIOS_INTERNOS[idx]);
  }),

  // PATCH /api/usuarios-internos/:id/estado (RF-USR-004, RN-USR-03, RN-USR-05)
  http.patch('/api/usuarios-internos/:id/estado', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { estado: 'activo' | 'inactivo' };
    const usuario = USUARIOS_INTERNOS.find((u) => u.id === id);

    if (!usuario) {
      return HttpResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    usuario.estado = body.estado;

    // RN-USR-03 & RN-USR-05: Si se desactiva, revocar inmediatamente cualquier sesión vigente
    if (body.estado === 'inactivo') {
      for (const ses of SESIONES_ACTIVAS) {
        if (ses.usuarioId === usuario.id && ses.estado === 'vigente') {
          ses.estado = 'revocada';
        }
      }

      EVENTOS_SEGURIDAD.unshift({
        id: nextEventoId(),
        tipoEvento: 'USUARIO_DESACTIVADO',
        usuarioCorreo: usuario.correo,
        ip: '190.237.45.12',
        fecha: new Date().toISOString(),
        detalle: `Cuenta desactivada. Se revocaron todas las sesiones activas asociadas (RN-USR-03).`,
      });
    }

    return HttpResponse.json(usuario);
  }),

  // POST /api/usuarios-internos/:id/reset-password (RN-USR-03)
  http.post('/api/usuarios-internos/:id/reset-password', ({ params }) => {
    const id = Number(params.id);
    const usuario = USUARIOS_INTERNOS.find((u) => u.id === id);

    if (!usuario) {
      return HttpResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Revocar sesiones por seguridad
    for (const ses of SESIONES_ACTIVAS) {
      if (ses.usuarioId === usuario.id && ses.estado === 'vigente') {
        ses.estado = 'revocada';
      }
    }

    EVENTOS_SEGURIDAD.unshift({
      id: nextEventoId(),
      tipoEvento: 'CAMBIO_PASSWORD',
      usuarioCorreo: usuario.correo,
      ip: '190.237.45.12',
      fecha: new Date().toISOString(),
      detalle: `Restablecimiento de contraseña solicitado por el administrador. Sesiones anteriores invalidadas.`,
    });

    return HttpResponse.json({ message: 'Contraseña restablecida exitosamente a "demo1234". Sesiones previas revocadas.' });
  }),

  // ── ROLES Y MATRIZ DE PERMISOS (RF-USR-005 a RF-USR-008) ────────────────────
  // GET /api/roles
  http.get('/api/roles', () => {
    return HttpResponse.json(ROLES_SEGURIDAD);
  }),

  // GET /api/permisos
  http.get('/api/permisos', () => {
    return HttpResponse.json(PERMISOS_SISTEMA);
  }),

  // POST /api/roles (RF-USR-005)
  http.post('/api/roles', async ({ request }) => {
    const body = (await request.json()) as { nombre: string; descripcion: string; permisos: string[] };

    const nuevo: RolSeguridad = {
      id: body.nombre.toUpperCase().replace(/\s+/g, '_'),
      nombre: body.nombre,
      descripcion: body.descripcion,
      permisos: body.permisos || [],
      esSistema: false,
    };

    ROLES_SEGURIDAD.push(nuevo);
    return HttpResponse.json(nuevo, { status: 201 });
  }),

  // PUT /api/roles/:id/permisos (RF-USR-007)
  http.put('/api/roles/:id/permisos', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as { permisos: string[] };
    const rol = ROLES_SEGURIDAD.find((r) => r.id === id);

    if (!rol) {
      return HttpResponse.json({ message: 'Rol no encontrado' }, { status: 404 });
    }

    rol.permisos = body.permisos;
    return HttpResponse.json(rol);
  }),

  // ── SESIONES ACTIVAS Y REVOCACIÓN (RF-USR-013, RF-USR-014, RN-USR-03) ───────
  // GET /api/seguridad/sesiones
  http.get('/api/seguridad/sesiones', () => {
    return HttpResponse.json(SESIONES_ACTIVAS);
  }),

  // DELETE /api/seguridad/sesiones/:id (RF-USR-013)
  http.delete('/api/seguridad/sesiones/:id', ({ params }) => {
    const id = params.id as string;
    const ses = SESIONES_ACTIVAS.find((s) => s.id === id);

    if (!ses) {
      return HttpResponse.json({ message: 'Sesión no encontrada' }, { status: 404 });
    }

    ses.estado = 'revocada';

    EVENTOS_SEGURIDAD.unshift({
      id: nextEventoId(),
      tipoEvento: 'SESION_REVOCADA',
      usuarioCorreo: ses.usuarioCorreo,
      ip: ses.ip,
      fecha: new Date().toISOString(),
      detalle: `Sesión (${ses.dispositivo}) revocada manualmente por el Administrador (RN-USR-03).`,
    });

    return HttpResponse.json({ message: 'Sesión invalidada de inmediato.' });
  }),

  // ── AUDITORÍA Y EVENTOS DE SEGURIDAD (RF-USR-018, REP-USR-02) ───────────────
  // GET /api/seguridad/eventos
  http.get('/api/seguridad/eventos', ({ request }) => {
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo');

    let resultado = [...EVENTOS_SEGURIDAD];
    if (tipo) {
      resultado = resultado.filter((e) => e.tipoEvento === tipo);
    }
    resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return HttpResponse.json(resultado);
  }),
];
