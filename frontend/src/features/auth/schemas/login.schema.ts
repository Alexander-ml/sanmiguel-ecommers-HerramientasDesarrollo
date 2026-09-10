import { z } from 'zod';

/**
 * Schema del formulario de login con los 15 puntos:
 * - correo / password: credenciales básicas
 * - recordar: checkbox para guardar el correo en localStorage
 * - declaratoria: aceptación explícita de la Ley 29733
 * - captcha / recaptchaToken: campos opcionales (los valida el backend real)
 */
export const loginSchema = z.object({
  correo: z.string().email('Ingresa un correo válido.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
  recordar: z.boolean().optional(),
  declaratoria: z.boolean().refine((v) => v === true, {
    message: 'Debes aceptar la declaratoria de privacidad.',
  }),
  captcha: z.string().optional(),
  recaptchaToken: z.string().nullable().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;