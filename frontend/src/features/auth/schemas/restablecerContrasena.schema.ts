import { z } from 'zod';

export const restablecerContrasenaSchema = z
  .object({
    correo: z.string().email('Ingresa un correo válido.'),
    codigo: z.string().length(6, 'El código tiene 6 dígitos.'),
    nuevaPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmarPassword: z.string().min(1, 'Confirma tu nueva contraseña.'),
  })
  .refine((valores) => valores.nuevaPassword === valores.confirmarPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmarPassword'],
  });

export type RestablecerContrasenaFormValues = z.infer<typeof restablecerContrasenaSchema>;
