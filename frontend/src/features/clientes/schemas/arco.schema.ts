import { z } from 'zod';

export const solicitudArcoSchema = z.object({
  tipoDerecho: z.enum(['ACCESO', 'RECTIFICACION', 'CANCELACION', 'OPOSICION'] as const),
  detalle: z
    .string()
    .min(10, 'Describe con precisión el motivo y alcance de tu solicitud (mínimo 10 caracteres).')
    .max(500, 'Máximo 500 caracteres.'),
});

export const atenderArcoSchema = z.object({
  estado: z.enum(['ATENDIDA', 'RECHAZADA'] as const),
  respuestaAdmin: z
    .string()
    .min(10, 'Debes fundamentar la resolución conforme a Ley N° 29733 (mínimo 10 caracteres).')
    .max(600, 'Máximo 600 caracteres.'),
});

export type SolicitudArcoFormValues = z.infer<typeof solicitudArcoSchema>;
export type AtenderArcoFormValues = z.infer<typeof atenderArcoSchema>;
