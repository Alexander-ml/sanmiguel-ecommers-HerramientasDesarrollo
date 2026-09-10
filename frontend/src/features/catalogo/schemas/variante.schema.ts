import { z } from 'zod';

export const varianteSchema = z.object({
  talla: z
    .string()
    .min(1, 'La talla es requerida.')
    .max(10, 'La talla no puede superar 10 caracteres.'),
  color: z
    .string()
    .min(1, 'El color es requerido.')
    .max(40, 'El color no puede superar 40 caracteres.'),
  /** Solo editable en creación — el formulario deshabilita este campo en edición (RN-INV-02) */
  sku: z
    .string()
    .min(3, 'El SKU debe tener al menos 3 caracteres.')
    .max(40, 'El SKU no puede superar 40 caracteres.')
    .regex(/^[A-Z0-9-]+$/, 'El SKU solo puede contener letras mayúsculas, números y guiones.'),
  precioEspecifico: z.number().positive('El precio específico debe ser mayor a 0.').nullable(),
});

export type VarianteFormValues = z.infer<typeof varianteSchema>;
