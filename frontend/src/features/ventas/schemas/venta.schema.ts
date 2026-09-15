import { z } from 'zod';

export const detalleVentaSchema = z.object({
  varianteId: z.number().positive('Selecciona una variante.'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor a 0.'),
  precioUnitario: z
    .number()
    .positive('El precio debe ser mayor a 0.')
    .multipleOf(0.01),
});

export const ventaSchema = z.object({
  detalles: z
    .array(detalleVentaSchema)
    .min(1, 'La venta debe contener al menos un producto (RN-VEN-03).'),
  clienteId: z.number().nullable(),
  clienteNombre: z.string().min(2, 'El nombre del cliente es requerido.').max(100),
  clienteEmail: z.string().email('Ingresa un email válido.').max(150),
  metodoPago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'pasarela'] as const, {
    error: 'Selecciona el método de pago.',
  }),
  referencia: z.string().max(100).nullable(),
  tipoComprobante: z.enum(['boleta', 'factura'] as const, {
    error: 'Selecciona el tipo de comprobante.',
  }),
});

export type VentaFormValues = z.infer<typeof ventaSchema>;
export type DetalleVentaFormValues = z.infer<typeof detalleVentaSchema>;
