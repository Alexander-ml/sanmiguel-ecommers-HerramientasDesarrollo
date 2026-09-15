import { http, HttpResponse } from 'msw';
import { verify } from 'otplib';
import { crypto } from '@otplib/plugin-crypto-noble';

import {
  USUARIOS_DEMO,
  INTENTOS_LOGIN,
  TOKENS_2FA_PENDIENTES,
  MAX_INTENTOS,
  BLOQUEO_MS,
} from '../data/usuarios';
import { CODIGOS_RECUPERACION, generarCodigoRecuperacion } from '../data/recuperacion';

/** Quita password, tiene2FA y secret2FA antes de devolver al cliente. */
function limpiar(usuario: (typeof USUARIOS_DEMO)[number]) {
  const { password: _p, tiene2FA: _t, secret2FA: _s, ...sesion } = usuario;
  return sesion;
}

export const authHandlers = [
  // ── Login ─────────────────────────────────────────────────────────────
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      correo: string;
      password: string;
      captcha?: string;
      recaptchaToken?: string | null;
    };

    const correo = body.correo.trim().toLowerCase();
    const registro = INTENTOS_LOGIN[correo] ?? { intentos: 0, bloqueadoHasta: null };

    if (registro.bloqueadoHasta && Date.now() < registro.bloqueadoHasta) {
      return HttpResponse.json(
        {
          message: 'Cuenta bloqueada temporalmente por seguridad.',
          bloqueadoHasta: registro.bloqueadoHasta,
        },
        { status: 429 },
      );
    }

    if (registro.bloqueadoHasta && Date.now() >= registro.bloqueadoHasta) {
      INTENTOS_LOGIN[correo] = { intentos: 0, bloqueadoHasta: null };
    }

    const usuario = USUARIOS_DEMO.find(
      (u) => u.correo.toLowerCase() === correo && u.password === body.password,
    );

    if (!usuario) {
      const intentos = (INTENTOS_LOGIN[correo]?.intentos ?? 0) + 1;
      const restantes = Math.max(0, MAX_INTENTOS - intentos);

      if (restantes === 0) {
        const bloqueadoHasta = Date.now() + BLOQUEO_MS;
        INTENTOS_LOGIN[correo] = { intentos, bloqueadoHasta };
        return HttpResponse.json(
          {
            message: 'Cuenta bloqueada por exceso de intentos fallidos.',
            intentosRestantes: 0,
            bloqueadoHasta,
          },
          { status: 429 },
        );
      }

      INTENTOS_LOGIN[correo] = { intentos, bloqueadoHasta: null };
      return HttpResponse.json(
        {
          message: 'Correo o contraseña incorrectos.',
          intentosRestantes: restantes,
        },
        { status: 401 },
      );
    }

    INTENTOS_LOGIN[correo] = { intentos: 0, bloqueadoHasta: null };

    if (usuario.tiene2FA) {
      const tempToken = `tmp_${Math.random().toString(36).slice(2, 12)}`;
      TOKENS_2FA_PENDIENTES[tempToken] = correo;
      return HttpResponse.json({ requiere2FA: true, tempToken });
    }

    return HttpResponse.json({ ...limpiar(usuario), expiraEn: 1800 });
  }),

  // ── Verificación 2FA ──────────────────────────────────────────────────
  http.post('/api/auth/2fa/verify', async ({ request }) => {
    const { tempToken, codigo } = (await request.json()) as {
      tempToken: string;
      codigo: string;
    };

    const correo = TOKENS_2FA_PENDIENTES[tempToken];
    if (!correo) {
      return HttpResponse.json(
        { message: 'Token inválido o expirado. Vuelve a iniciar sesión.' },
        { status: 400 },
      );
    }

    const usuario = USUARIOS_DEMO.find((u) => u.correo.toLowerCase() === correo);
    if (!usuario?.secret2FA) {
      return HttpResponse.json({ message: 'Usuario sin 2FA configurado.' }, { status: 400 });
    }

    // Verificación con tolerancia ±60s para absorber desfase de reloj
    let valido = false;
    try {
      const result = await verify({
        secret: usuario.secret2FA,
        token: codigo.trim(),
        crypto,
        epochTolerance: 60,
      });
      valido = result.valid;
    } catch {
      valido = false;
    }

    if (!valido) {
      return HttpResponse.json(
        { message: 'El código es incorrecto o ha expirado.' },
        { status: 401 },
      );
    }

    delete TOKENS_2FA_PENDIENTES[tempToken];
    return HttpResponse.json({ ...limpiar(usuario), expiraEn: 1800 });
  }),

  // ── Registro de cliente ───────────────────────────────────────────────
  http.post('/api/auth/registro', async ({ request }) => {
    const body = (await request.json()) as any;

    const existe = USUARIOS_DEMO.find(
      (u) => u.correo.toLowerCase() === body.correo.trim().toLowerCase(),
    );
    if (existe) {
      return HttpResponse.json(
        { message: 'Ya existe una cuenta registrada con este correo electrónico.' },
        { status: 400 },
      );
    }

    const nuevoUsuario = {
      id: USUARIOS_DEMO.length + 100,
      nombres: body.nombres.trim(),
      apellidos: body.apellidos.trim(),
      correo: body.correo.trim().toLowerCase(),
      password: body.password,
      rol: 'CLIENTE' as const,
    };
    USUARIOS_DEMO.push(nuevoUsuario);

    return HttpResponse.json({ ...limpiar(nuevoUsuario), expiraEn: 1800 }, { status: 201 });
  }),

  // ── RF-USR-015 — Solicitar recuperación ───────────────────────────────
  http.post('/api/auth/recuperar', async ({ request }) => {
    const { correo } = (await request.json()) as { correo: string };
    const c = correo.trim().toLowerCase();
    const usuario = USUARIOS_DEMO.find((u) => u.correo.toLowerCase() === c);

    if (usuario) {
      const codigo = generarCodigoRecuperacion();
      CODIGOS_RECUPERACION[c] = codigo;
      return HttpResponse.json({
        message: 'Si el correo está registrado, recibirás un código de verificación.',
        codigoDemo: codigo,
      });
    }

    return HttpResponse.json({
      message: 'Si el correo está registrado, recibirás un código de verificación.',
    });
  }),

  // ── RF-USR-016 — Restablecer contraseña ───────────────────────────────
  http.post('/api/auth/restablecer', async ({ request }) => {
    const { correo, codigo, nuevaPassword } = (await request.json()) as any;
    const c = correo.trim().toLowerCase();

    if (!CODIGOS_RECUPERACION[c] || CODIGOS_RECUPERACION[c] !== codigo.trim()) {
      return HttpResponse.json(
        { message: 'El código ingresado es incorrecto o ha expirado.' },
        { status: 400 },
      );
    }

    const usuario = USUARIOS_DEMO.find((u) => u.correo.toLowerCase() === c);
    if (!usuario) {
      return HttpResponse.json(
        { message: 'No se encontró la cuenta asociada a este correo.' },
        { status: 404 },
      );
    }

    usuario.password = nuevaPassword;
    delete CODIGOS_RECUPERACION[c];

    return HttpResponse.json({ message: 'Tu contraseña fue restablecida correctamente.' });
  }),
];