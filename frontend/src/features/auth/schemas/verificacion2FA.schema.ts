import { z } from 'zod';

/**
 * Schema del paso 2 de autenticación (verificación TOTP con Google Authenticator).
 * El código siempre son 6 dígitos numéricos (RFC 6238).
 */
export const verificacion2FASchema = z.object({
    codigo: z
        .string()
        .length(6, 'El código tiene 6 dígitos.')
        .regex(/^\d+$/, 'Solo se permiten números.'),
});

export type Verificacion2FAValues = z.infer<typeof verificacion2FASchema>;