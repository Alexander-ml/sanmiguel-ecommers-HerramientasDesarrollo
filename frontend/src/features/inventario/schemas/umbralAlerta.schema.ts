import { z } from 'zod';

export const umbralAlertaSchema = z.object({
  umbralMinimo: z
    .number()
    .int('El umbral debe ser un número entero.')
    .min(0, 'El umbral mínimo no puede ser negativo.')
    .max(9999, 'El umbral no puede superar 9999 unidades.'),
});

export type UmbralAlertaFormValues = z.infer<typeof umbralAlertaSchema>;
