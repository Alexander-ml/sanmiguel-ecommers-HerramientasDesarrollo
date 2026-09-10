import { z } from 'zod';

export const clienteSchema = z.object({
  nombres: z
    .string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres.')
    .max(60, 'Máximo 60 caracteres.'),
  apellidos: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
    .max(60, 'Máximo 60 caracteres.'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido.')
    .max(100),
  telefono: z
    .string()
    .regex(/^9\d{8}$/, 'El teléfono debe ser un celular peruano de 9 dígitos (ej. 987654321).'),
  tipoDocumento: z.enum(['DNI', 'RUC', 'CE'] as const),
  numeroDocumento: z
    .string()
    .min(8, 'El documento debe tener al menos 8 dígitos.')
    .max(12, 'Máximo 12 dígitos.'),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;
