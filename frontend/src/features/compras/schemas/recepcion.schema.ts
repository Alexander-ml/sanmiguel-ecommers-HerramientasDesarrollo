import { z } from 'zod';

export const lineaRecepcionSchema = z.object({
  varianteId: z.number().positive(),
  cantidadRecibida: z.number().int().min(0, 'La cantidad no puede ser negativa.'),
});

export const recepcionSchema = z.object({
  comprobanteReferencia: z.string().max(60, 'Máximo 60 caracteres.').optional(),
  notas: z.string().max(500, 'Máximo 500 caracteres.').optional(),
  lineas: z.array(lineaRecepcionSchema),
}).refine(
  (data) => data.lineas.some((l) => l.cantidadRecibida > 0),
  {
    message: 'Debes ingresar una cantidad recibida mayor a 0 en al menos una línea.',
    path: ['lineas'],
  },
);

export type RecepcionFormValues = z.infer<typeof recepcionSchema>;
