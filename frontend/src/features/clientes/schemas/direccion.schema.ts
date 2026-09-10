import { z } from 'zod';

export const direccionSchema = z.object({
  alias: z
    .string()
    .min(2, 'El alias debe tener al menos 2 caracteres (ej. Casa, Oficina).')
    .max(40, 'Máximo 40 caracteres.'),
  departamento: z.string().min(2, 'El departamento es obligatorio.'),
  provincia: z.string().min(2, 'La provincia es obligatoria.'),
  distrito: z.string().min(2, 'El distrito es obligatorio.'),
  direccionPostal: z
    .string()
    .min(5, 'Ingresa la calle, avenida, número y departamento.')
    .max(150, 'Máximo 150 caracteres.'),
  referencia: z.string().max(120, 'Máximo 120 caracteres.').optional(),
  esPredeterminada: z.boolean(),
});

export type DireccionFormValues = z.infer<typeof direccionSchema>;
