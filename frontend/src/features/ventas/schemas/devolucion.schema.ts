import { z } from 'zod';

export const devolucionVentaSchema = z.object({
  varianteId: z.number().positive('Selecciona la variante a devolver.'),
  cantidad: z
    .number()
    .int()
    .positive('La cantidad debe ser mayor a 0.'),
  motivo: z
    .string()
    .min(10, 'El motivo debe tener al menos 10 caracteres.')
    .max(500, 'El motivo no puede superar 500 caracteres.'),
});

export type DevolucionVentaFormValues = z.infer<typeof devolucionVentaSchema>;
