import { z } from 'zod';

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(120, 'El nombre no puede superar 120 caracteres.'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede superar 1000 caracteres.'),
  categoriaId: z
    .number()
    .positive('Selecciona una categoría válida.'),
  marca: z
    .string()
    .min(1, 'La marca es requerida.')
    .max(80, 'La marca no puede superar 80 caracteres.'),
  precioBase: z
    .number()
    .positive('El precio base debe ser mayor a 0.')
    .multipleOf(0.01),
  imagenes: z
    .array(z.string().url('Ingresa una URL de imagen válida.')),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;
