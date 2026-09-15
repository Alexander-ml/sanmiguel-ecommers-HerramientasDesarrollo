import { z } from 'zod';

export const registroSchema = z
  .object({
    nombres: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres.'),
    apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres.'),
    correo: z.string().email('Ingresa un correo electrónico válido.'),
    telefono: z.string().regex(/^9\d{8}$/, 'El teléfono debe ser un celular válido de 9 dígitos (ej. 974123456).'),
    tipoDocumento: z.enum(['DNI', 'CE']),
    numeroDocumento: z.string().min(8, 'El documento debe tener al menos 8 caracteres.').max(12, 'Máximo 12 caracteres.'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmarPassword: z.string(),
    aceptaTerminos: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y políticas de privacidad.',
    }),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmarPassword'],
  });

export type RegistroFormValues = z.infer<typeof registroSchema>;
