import { z } from 'zod';

export const proveedorSchema = z.object({
  razonSocial: z
    .string()
    .min(3, 'La razón social debe tener al menos 3 caracteres.')
    .max(120, 'Máximo 120 caracteres.'),
  ruc: z
    .string()
    .regex(/^(10|20)\d{9}$/, 'El RUC debe tener 11 dígitos y empezar con 10 o 20.'),
  contactoNombre: z
    .string()
    .min(2, 'El nombre de contacto es obligatorio.')
    .max(80),
  contactoTelefono: z
    .string()
    .min(6, 'El teléfono es obligatorio.')
    .max(20),
  contactoEmail: z
    .string()
    .email('Ingresa un correo electrónico válido.')
    .max(100),
  direccion: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres.')
    .max(150),
  condicionesComerciales: z
    .string()
    .min(3, 'Especifica las condiciones comerciales (ej. Crédito 30 días).')
    .max(200),
  estado: z.enum(['activo', 'inactivo'] as const),
});

export type ProveedorFormValues = z.infer<typeof proveedorSchema>;
