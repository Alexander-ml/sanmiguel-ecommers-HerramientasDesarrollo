import type {
  ConfiguracionGeneral,
  RegistroCambioConfiguracion,
} from '../../features/configuracion/types';

export let CONFIGURACION_GENERAL: ConfiguracionGeneral = {
  empresa: {
    ruc: '20608912341',
    razonSocial: 'CONFECCIONES TEXTILES SAN MIGUEL S.A.C.',
    nombreComercial: 'SAN MIGUEL · Ropa Urbana & Estilo',
    direccionFiscal: 'Jr. Gamarra 1045, Galería San Miguel, Piso 2, Int. 204',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'La Victoria',
    telefono: '987654321',
    correo: 'contacto@sanmiguel.pe',
    logoUrl: '/logo.png',
    lema: 'Prendas urbanas de alta durabilidad confeccionadas en Perú.',
  },
  comercial: {
    monedaCodigo: 'PEN',
    monedaSimbolo: 'S/',
    tasaIgv: 18.0,
    incluirIgvEnPrecios: true,
  },
  tienda: {
    versionPolitica: 'v2.1 - 2025',
    politicaPrivacidad:
      'En cumplimiento de la Ley N° 29733 (Ley de Protección de Datos Personales del Perú), SAN MIGUEL garantiza que los datos personales recopilados durante el registro, compra en línea o checkout como invitado son tratados con estricta confidencialidad para la emisión de comprobantes, gestión de pagos y despacho logístico a domicilio.',
    terminosCondiciones:
      'Las compras realizadas en la plataforma de SAN MIGUEL están sujetas a disponibilidad de existencias en tiempo real. Los pedidos confirmados y pagados serán despachados en un plazo de 24 a 48 horas hábiles para Lima Metropolitana y de 3 a 5 días hábiles para provincias.',
    politicaEnvios:
      'Realizamos envíos a todo el Perú a través de operadores logísticos certificados. Las tarifas de envío se calculan en base al distrito de destino o recojo gratuito en nuestro local central de San Miguel.',
    politicaDevoluciones:
      'Se aceptan cambios de talla o devoluciones por defectos de fábrica dentro de los 7 días naturales posteriores a la recepción de la prenda, siempre que conserve su etiqueta original y no presente signos de uso.',
  },
  operativo: {
    umbralStockMinimoDefecto: 5,
    tiempoReservaMinutos: 60,
    diasGarantiaDevolucion: 7,
  },
  seguridad: {
    duracionSesionHoras: 8,
    maxIntentosFallidos: 5,
    bloqueoMinutos: 15,
  },
};

export let HISTORIAL_CAMBIOS: RegistroCambioConfiguracion[] = [
  {
    id: 1,
    usuario: 'admin@sanmiguel.pe',
    fecha: '2025-01-10T10:00:00',
    seccion: 'Comercial',
    parametro: 'tasaIgv',
    valorAnterior: '18.0%',
    valorNuevo: '18.0%',
  },
  {
    id: 2,
    usuario: 'admin@sanmiguel.pe',
    fecha: '2025-01-15T14:30:00',
    seccion: 'Operativo',
    parametro: 'umbralStockMinimoDefecto',
    valorAnterior: '3',
    valorNuevo: '5',
  },
  {
    id: 3,
    usuario: 'admin@sanmiguel.pe',
    fecha: '2025-02-01T09:15:00',
    seccion: 'Tienda',
    parametro: 'versionPolitica',
    valorAnterior: 'v2.0 - 2024',
    valorNuevo: 'v2.1 - 2025',
  },
  {
    id: 4,
    usuario: 'admin@sanmiguel.pe',
    fecha: '2025-02-20T16:45:00',
    seccion: 'Seguridad',
    parametro: 'maxIntentosFallidos',
    valorAnterior: '3',
    valorNuevo: '5',
  },
];

let _nextCambioId = 5;
export function nextCambioId() { return _nextCambioId++; }
