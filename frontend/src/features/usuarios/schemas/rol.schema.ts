import { z } from 'zod';

export const rolSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre del rol debe tener al menos 3 caracteres.')
    .max(50, 'Máximo 50 caracteres.'),
  descripcion: z
    .string()
    .min(5, 'La descripción del rol debe tener al menos 5 caracteres.')
    .max(200, 'Máximo 200 caracteres.'),
  permisos: z.array(z.string()).min(1, 'Debes habilitar al menos un permiso para el rol.'),
});

export type RolFormValues = z.infer<typeof rolSchema>;
