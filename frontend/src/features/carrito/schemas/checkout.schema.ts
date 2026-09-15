import { z } from 'zod';

export const checkoutSchema = z.object({
  // Paso 1: Identificación
  modalidad: z.enum(['invitado', 'autenticado'] as const),

  // Paso 2: Datos de contacto
  nombres: z.string().min(2, 'El nombre es requerido.').max(80),
  apellidos: z.string().min(2, 'Los apellidos son requeridos.').max(80),
  email: z.string().email('Ingresa un email válido.').max(150),
  telefono: z.string().min(7, 'El teléfono es requerido.').max(20),

  // Paso 3: Entrega
  modalidadEntrega: z.enum(['envio', 'recojo_tienda'] as const, {
    error: 'Selecciona la modalidad de entrega.',
  }),
  direccion: z.string().max(200),
  ciudad: z.string().max(80),
  referencia: z.string().max(200),

  // Paso 4: Pago
  metodoPago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'pasarela'] as const, {
    error: 'Selecciona el método de pago.',
  }),

  notas: z.string().max(500),
}).refine(
  (data) => data.modalidadEntrega === 'recojo_tienda' || (data.direccion.length >= 5 && data.ciudad.length >= 2),
  {
    message: 'Ingresa la dirección y ciudad de envío.',
    path: ['direccion'],
  },
);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
