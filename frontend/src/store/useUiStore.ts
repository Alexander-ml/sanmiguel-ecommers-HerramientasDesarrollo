import { create } from 'zustand';

/**
 * Client state realmente transversal (no pertenece a ningún feature). Ver regla en
 * docs/02-arquitectura-frontend.md §3: no duplicar aquí nada que TanStack Query ya maneje.
 */
interface UiState {
  sidebarAbierto: boolean;
  alternarSidebar: () => void;
  cerrarSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarAbierto: false,
  alternarSidebar: () => set((state) => ({ sidebarAbierto: !state.sidebarAbierto })),
  cerrarSidebar: () => set({ sidebarAbierto: false }),
}));
