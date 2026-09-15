import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(80, 'El nombre no puede superar 80 caracteres.'),
  descripcion: z
    .string()
    .max(300, 'La descripción no puede superar 300 caracteres.'),
  categoriaPadreId: z.number().nullable(),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
