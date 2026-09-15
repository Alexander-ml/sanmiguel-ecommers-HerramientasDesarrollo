import { z } from 'zod';

export const solicitarRecuperacionSchema = z.object({
  correo: z.string().email('Ingresa un correo válido.'),
});

export type SolicitarRecuperacionFormValues = z.infer<typeof solicitarRecuperacionSchema>;
