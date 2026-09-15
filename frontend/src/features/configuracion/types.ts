export interface EmpresaConfig {
  ruc: string; // 11 dígitos
  razonSocial: string;
  nombreComercial: string;
  direccionFiscal: string;
  departamento: string;
  provincia: string;
  distrito: string;
  telefono: string;
  correo: string;
  logoUrl: string;
  lema: string;
}

export interface ParametroComercial {
  monedaCodigo: string; // "PEN"
  monedaSimbolo: string; // "S/"
  tasaIgv: number; // 18
  incluirIgvEnPrecios: boolean; // true
}

export interface ParametroTienda {
  versionPolitica: string; // "v2.1 - 2025"
  politicaPrivacidad: string;
  terminosCondiciones: string;
  politicaEnvios: string;
  politicaDevoluciones: string;
}

export interface ParametroOperativo {
  umbralStockMinimoDefecto: number; // ej. 5
  tiempoReservaMinutos: number; // ej. 60
  diasGarantiaDevolucion: number; // ej. 7
}

export interface ParametroSeguridad {
  duracionSesionHoras: number; // ej. 8
  maxIntentosFallidos: number; // ej. 5
  bloqueoMinutos: number; // ej. 15
}

export interface RegistroCambioConfiguracion {
  id: number;
  usuario: string;
  fecha: string;
  seccion: 'Empresa' | 'Comercial' | 'Tienda' | 'Operativo' | 'Seguridad';
  parametro: string;
  valorAnterior: string;
  valorNuevo: string;
}

export interface ConfiguracionGeneral {
  empresa: EmpresaConfig;
  comercial: ParametroComercial;
  tienda: ParametroTienda;
  operativo: ParametroOperativo;
  seguridad: ParametroSeguridad;
}
