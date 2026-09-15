import { z } from 'zod';

export const empresaSchema = z.object({
  ruc: z
    .string()
    .regex(/^20\d{9}$/, 'El RUC debe tener 11 dígitos e iniciar con 20 (Persona Jurídica).'),
  razonSocial: z
    .string()
    .min(3, 'Mínimo 3 caracteres.')
    .max(120, 'Máximo 120 caracteres.'),
  nombreComercial: z
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(80, 'Máximo 80 caracteres.'),
  direccionFiscal: z
    .string()
    .min(5, 'Mínimo 5 caracteres.')
    .max(150, 'Máximo 150 caracteres.'),
  departamento: z.string().min(2, 'El departamento es obligatorio.'),
  provincia: z.string().min(2, 'La provincia es obligatoria.'),
  distrito: z.string().min(2, 'El distrito es obligatorio.'),
  telefono: z
    .string()
    .regex(/^9\d{8}$/, 'El teléfono corporativo debe ser un celular de 9 dígitos.'),
  correo: z.string().email('Ingresa un correo institucional válido.'),
  logoUrl: z.string().min(1, 'La ruta del logotipo es obligatoria.'),
  lema: z.string().max(120, 'Máximo 120 caracteres.'),
});

export const comercialSchema = z.object({
  monedaCodigo: z.string().min(2).max(5),
  monedaSimbolo: z.string().min(1).max(5),
  tasaIgv: z
    .number()
    .min(0, 'La tasa no puede ser negativa.')
    .max(50, 'Tasa máxima permitida 50%.'),
  incluirIgvEnPrecios: z.boolean(),
});

export const tiendaSchema = z.object({
  versionPolitica: z.string().min(3, 'Indica la versión de la política (ej. v2.1 - 2025).'),
  politicaPrivacidad: z
    .string()
    .min(20, 'El texto de la política de privacidad debe tener al menos 20 caracteres.'),
  terminosCondiciones: z
    .string()
    .min(20, 'Los términos y condiciones deben tener al menos 20 caracteres.'),
  politicaEnvios: z
    .string()
    .min(20, 'La política de envíos debe tener al menos 20 caracteres.'),
  politicaDevoluciones: z
    .string()
    .min(20, 'La política de devoluciones debe tener al menos 20 caracteres.'),
});

export const operativoSchema = z.object({
  umbralStockMinimoDefecto: z
    .number()
    .int()
    .min(1, 'El umbral mínimo debe ser al menos 1 unidad.')
    .max(200, 'Máximo 200 unidades.'),
  tiempoReservaMinutos: z
    .number()
    .int()
    .min(5, 'El tiempo mínimo de reserva es 5 minutos.')
    .max(1440, 'Máximo 24 horas (1440 min).'),
  diasGarantiaDevolucion: z
    .number()
    .int()
    .min(1, 'Mínimo 1 día de garantía.')
    .max(90, 'Máximo 90 días.'),
});

export const seguridadConfigSchema = z.object({
  duracionSesionHoras: z
    .number()
    .int()
    .min(1, 'Mínimo 1 hora de sesión.')
    .max(72, 'Máximo 72 horas.'),
  maxIntentosFallidos: z
    .number()
    .int()
    .min(3, 'Mínimo 3 intentos fallidos permitidos.')
    .max(10, 'Máximo 10 intentos.'),
  bloqueoMinutos: z
    .number()
    .int()
    .min(5, 'El bloqueo debe ser de al menos 5 minutos.')
    .max(120, 'Máximo 120 minutos.'),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
export type ComercialFormValues = z.infer<typeof comercialSchema>;
export type TiendaFormValues = z.infer<typeof tiendaSchema>;
export type OperativoFormValues = z.infer<typeof operativoSchema>;
export type SeguridadConfigFormValues = z.infer<typeof seguridadConfigSchema>;
