import { z } from 'zod';

export const devolucionProveedorSchema = z.object({
  recepcionId: z.number().positive('Selecciona la recepción de origen.'),
  varianteId: z.number().positive('Selecciona la variante a devolver.'),
  cantidad: z.number().int().min(1, 'La cantidad devuelta debe ser al menos 1.'),
  motivo: z
    .string()
    .min(5, 'El motivo de devolución debe tener al menos 5 caracteres.')
    .max(300, 'Máximo 300 caracteres.'),
});

export type DevolucionProveedorFormValues = z.infer<typeof devolucionProveedorSchema>;
