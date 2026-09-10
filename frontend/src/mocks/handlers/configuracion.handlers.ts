import { http, HttpResponse } from 'msw';
import {
  CONFIGURACION_GENERAL,
  HISTORIAL_CAMBIOS,
  nextCambioId,
} from '../data/configuracion';
import type {
  EmpresaConfig,
  ParametroComercial,
  ParametroTienda,
  ParametroOperativo,
  ParametroSeguridad,
} from '../../features/configuracion/types';

export const configuracionHandlers = [
  // GET /api/configuracion (RN-CFG-01: Único valor vigente)
  http.get('/api/configuracion', () => {
    return HttpResponse.json(CONFIGURACION_GENERAL);
  }),

  // PUT /api/configuracion/empresa (RF-CFG-003, RN-CFG-02)
  http.put('/api/configuracion/empresa', async ({ request }) => {
    const body = (await request.json()) as EmpresaConfig;
    const anterior = { ...CONFIGURACION_GENERAL.empresa };

    CONFIGURACION_GENERAL.empresa = {
      ...CONFIGURACION_GENERAL.empresa,
      ...body,
    };

    // Registrar cambios en auditoría (RN-CFG-02)
    if (anterior.razonSocial !== body.razonSocial) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Empresa',
        parametro: 'razonSocial',
        valorAnterior: anterior.razonSocial,
        valorNuevo: body.razonSocial,
      });
    }

    if (anterior.direccionFiscal !== body.direccionFiscal) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Empresa',
        parametro: 'direccionFiscal',
        valorAnterior: anterior.direccionFiscal,
        valorNuevo: body.direccionFiscal,
      });
    }

    if (anterior.telefono !== body.telefono) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Empresa',
        parametro: 'telefono',
        valorAnterior: anterior.telefono,
        valorNuevo: body.telefono,
      });
    }

    return HttpResponse.json(CONFIGURACION_GENERAL.empresa);
  }),

  // PUT /api/configuracion/comercial (RF-CFG-005, RN-CFG-02)
  http.put('/api/configuracion/comercial', async ({ request }) => {
    const body = (await request.json()) as ParametroComercial;
    const anterior = { ...CONFIGURACION_GENERAL.comercial };

    CONFIGURACION_GENERAL.comercial = {
      ...CONFIGURACION_GENERAL.comercial,
      ...body,
    };

    if (anterior.tasaIgv !== body.tasaIgv) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Comercial',
        parametro: 'tasaIgv',
        valorAnterior: `${anterior.tasaIgv}%`,
        valorNuevo: `${body.tasaIgv}%`,
      });
    }

    if (anterior.monedaCodigo !== body.monedaCodigo) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Comercial',
        parametro: 'monedaCodigo',
        valorAnterior: anterior.monedaCodigo,
        valorNuevo: body.monedaCodigo,
      });
    }

    return HttpResponse.json(CONFIGURACION_GENERAL.comercial);
  }),

  // PUT /api/configuracion/tienda (RF-CFG-007, RN-CFG-02)
  http.put('/api/configuracion/tienda', async ({ request }) => {
    const body = (await request.json()) as ParametroTienda;
    const anterior = { ...CONFIGURACION_GENERAL.tienda };

    CONFIGURACION_GENERAL.tienda = {
      ...CONFIGURACION_GENERAL.tienda,
      ...body,
    };

    if (anterior.versionPolitica !== body.versionPolitica) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Tienda',
        parametro: 'versionPolitica',
        valorAnterior: anterior.versionPolitica,
        valorNuevo: body.versionPolitica,
      });
    }

    return HttpResponse.json(CONFIGURACION_GENERAL.tienda);
  }),

  // PUT /api/configuracion/operativo (RF-CFG-009, RN-CFG-02)
  http.put('/api/configuracion/operativo', async ({ request }) => {
    const body = (await request.json()) as ParametroOperativo;
    const anterior = { ...CONFIGURACION_GENERAL.operativo };

    CONFIGURACION_GENERAL.operativo = {
      ...CONFIGURACION_GENERAL.operativo,
      ...body,
    };

    if (anterior.umbralStockMinimoDefecto !== body.umbralStockMinimoDefecto) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Operativo',
        parametro: 'umbralStockMinimoDefecto',
        valorAnterior: String(anterior.umbralStockMinimoDefecto),
        valorNuevo: String(body.umbralStockMinimoDefecto),
      });
    }

    if (anterior.tiempoReservaMinutos !== body.tiempoReservaMinutos) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Operativo',
        parametro: 'tiempoReservaMinutos',
        valorAnterior: `${anterior.tiempoReservaMinutos} min`,
        valorNuevo: `${body.tiempoReservaMinutos} min`,
      });
    }

    return HttpResponse.json(CONFIGURACION_GENERAL.operativo);
  }),

  // PUT /api/configuracion/seguridad (RF-CFG-011, RN-CFG-02)
  http.put('/api/configuracion/seguridad', async ({ request }) => {
    const body = (await request.json()) as ParametroSeguridad;
    const anterior = { ...CONFIGURACION_GENERAL.seguridad };

    CONFIGURACION_GENERAL.seguridad = {
      ...CONFIGURACION_GENERAL.seguridad,
      ...body,
    };

    if (anterior.duracionSesionHoras !== body.duracionSesionHoras) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Seguridad',
        parametro: 'duracionSesionHoras',
        valorAnterior: `${anterior.duracionSesionHoras}h`,
        valorNuevo: `${body.duracionSesionHoras}h`,
      });
    }

    if (anterior.maxIntentosFallidos !== body.maxIntentosFallidos) {
      HISTORIAL_CAMBIOS.unshift({
        id: nextCambioId(),
        usuario: 'admin@sanmiguel.pe',
        fecha: new Date().toISOString(),
        seccion: 'Seguridad',
        parametro: 'maxIntentosFallidos',
        valorAnterior: String(anterior.maxIntentosFallidos),
        valorNuevo: String(body.maxIntentosFallidos),
      });
    }

    return HttpResponse.json(CONFIGURACION_GENERAL.seguridad);
  }),

  // GET /api/configuracion/historial (RF-CFG-013, REP-CFG-01)
  http.get('/api/configuracion/historial', () => {
    return HttpResponse.json(HISTORIAL_CAMBIOS);
  }),

  // Endpoints específicos para módulos consumidores (RF-CFG-014)
  http.get('/api/configuracion/comercial/igv', () => {
    return HttpResponse.json({
      tasaIgv: CONFIGURACION_GENERAL.comercial.tasaIgv,
      monedaCodigo: CONFIGURACION_GENERAL.comercial.monedaCodigo,
      monedaSimbolo: CONFIGURACION_GENERAL.comercial.monedaSimbolo,
    });
  }),

  http.get('/api/configuracion/operativo/stock-minimo', () => {
    return HttpResponse.json({
      umbralStockMinimoDefecto: CONFIGURACION_GENERAL.operativo.umbralStockMinimoDefecto,
    });
  }),
];
