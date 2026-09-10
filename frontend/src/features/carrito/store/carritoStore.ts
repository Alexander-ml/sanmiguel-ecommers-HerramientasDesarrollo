/**
 * Carrito store — Zustand.
 *
 * RN-TIE-01: el carrito NO reserva stock. Solo valida disponibilidad al vuelo.
 * RN-TIE-03: funciona sin cuenta de usuario (localStorage como persistencia simple).
 *
 * Diseño:
 * - El estado vive en memoria y en localStorage ('sm-carrito').
 * - Cada acción de modificación dispara una revalidación de disponibilidad
 *   contra Inventario (implementada fuera del store, en el hook useCarritoValidado).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemCarrito } from '../types';

interface CarritoState {
  items: ItemCarrito[];
  /** Agrega o incrementa cantidad si la variante ya está en el carrito */
  agregar: (item: Omit<ItemCarrito, 'cantidad'>, cantidad?: number) => void;
  /** Cambia la cantidad exacta de una variante */
  cambiarCantidad: (varianteId: number, cantidad: number) => void;
  /** Elimina una variante del carrito */
  quitar: (varianteId: number) => void;
  /** Vacía el carrito por completo (después de checkout exitoso) */
  vaciar: () => void;
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],

      agregar: (item, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find((i) => i.varianteId === item.varianteId);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.varianteId === item.varianteId
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad }] };
        }),

      cambiarCantidad: (varianteId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.varianteId !== varianteId)
              : state.items.map((i) =>
                  i.varianteId === varianteId ? { ...i, cantidad } : i,
                ),
        })),

      quitar: (varianteId) =>
        set((state) => ({
          items: state.items.filter((i) => i.varianteId !== varianteId),
        })),

      vaciar: () => set({ items: [] }),
    }),
    {
      name: 'sm-carrito',
      // Solo persiste los items, no las funciones
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** Selector helpers */
export const selectTotalItems = (state: CarritoState) =>
  state.items.reduce((acc, i) => acc + i.cantidad, 0);

export const selectSubtotal = (state: CarritoState) =>
  state.items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
