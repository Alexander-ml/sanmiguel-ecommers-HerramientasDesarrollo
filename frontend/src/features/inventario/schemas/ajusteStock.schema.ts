import { z } from 'zod';

export const ajusteStockSchema = z.object({
  varianteId: z.number().positive('Selecciona una variante válida.'),
  tipo: z.enum(['AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'], {
    error: 'Selecciona el tipo de ajuste.',
  }),
  cantidad: z
    .number()
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor a 0.'),
  motivo: z
    .string()
    .min(10, 'El motivo debe tener al menos 10 caracteres.')
    .max(500, 'El motivo no puede superar 500 caracteres.'),
});

export type AjusteStockFormValues = z.infer<typeof ajusteStockSchema>;
