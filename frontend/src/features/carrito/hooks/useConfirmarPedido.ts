import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useCarritoStore } from '../store/carritoStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type { Pedido } from '../../tienda/types';
import type { CheckoutFormValues } from '../schemas/checkout.schema';

/**
 * Hook para confirmar el pedido desde el checkout.
 * RF-TIE-013: revalida disponibilidad, crea el pedido, reserva el stock.
 * RN-TIE-01: el carrito no reserva; la reserva ocurre aquí.
 */
export function useConfirmarPedido() {
  const qc = useQueryClient();
  const { items, vaciar } = useCarritoStore();
  const usuario = useAuthStore((s) => s.usuario);

  return useMutation({
    mutationFn: async (form: CheckoutFormValues) => {
      const payload = {
        items: items.map((i) => ({
          varianteId: i.varianteId,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
        clienteId: usuario?.id ?? null,
        contacto: {
          nombres: form.nombres,
          apellidos: form.apellidos,
          email: form.email,
          telefono: form.telefono,
          direccion: form.direccion,
          ciudad: form.ciudad,
          referencia: form.referencia,
        },
        modalidadEntrega: form.modalidadEntrega,
        metodoPago: form.metodoPago,
        notas: form.notas,
      };

      const { data } = await apiClient.post<Pedido>('/pedidos', payload);
      return data;
    },
    onSuccess: () => {
      vaciar();                                               // Limpiar carrito post-pedido
      qc.invalidateQueries({ queryKey: ['pedidos'] });
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['mis-pedidos'] });
    },
  });
}
