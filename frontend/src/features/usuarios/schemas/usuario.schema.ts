import { z } from 'zod';

export const usuarioInternoSchema = z.object({
  nombres: z
    .string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres.')
    .max(50, 'Máximo 50 caracteres.'),
  apellidos: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
    .max(50, 'Máximo 50 caracteres.'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico corporativo válido.')
    .max(100),
  rol: z.enum(['ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR'] as const, {
    message: 'Debes asignar un rol de acceso obligatorio (RN-USR-01).',
  }),
  password: z
    .string()
    .min(6, 'La contraseña temporal debe tener al menos 6 caracteres.')
    .optional(),
});

export type UsuarioInternoFormValues = z.infer<typeof usuarioInternoSchema>;
