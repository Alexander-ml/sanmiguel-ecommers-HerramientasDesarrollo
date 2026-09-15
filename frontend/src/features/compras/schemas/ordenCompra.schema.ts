import { z } from 'zod';

export const lineaOrdenCompraSchema = z.object({
  varianteId: z.number().positive('Selecciona una variante de prenda.'),
  cantidadPedida: z.number().int().min(1, 'La cantidad debe ser al menos 1.'),
  costoUnitario: z.number().min(0.1, 'El costo unitario debe ser mayor a 0.'),
});

export const ordenCompraSchema = z.object({
  proveedorId: z.number().positive('Selecciona un proveedor.'),
  fechaEstimadaEntrega: z.string().optional(),
  notas: z.string().max(500, 'Máximo 500 caracteres.').optional(),
  lineas: z
    .array(lineaOrdenCompraSchema)
    .min(1, 'Debes agregar al menos una prenda a la orden de compra.'),
});

export type OrdenCompraFormValues = z.infer<typeof ordenCompraSchema>;
export type LineaOrdenCompraFormValues = z.infer<typeof lineaOrdenCompraSchema>;
