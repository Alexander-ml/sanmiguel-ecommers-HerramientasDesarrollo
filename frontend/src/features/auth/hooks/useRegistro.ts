import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../store/useAuthStore';
import type { UsuarioSesion } from '../types';
import type { RegistroFormValues } from '../schemas/registro.schema';

export function useRegistro() {
  const iniciarSesion = useAuthStore((state) => state.iniciarSesion);

  return useMutation({
    mutationFn: async (valores: RegistroFormValues) => {
      const { data } = await apiClient.post<UsuarioSesion>('/auth/registro', valores);
      return data;
    },
    onSuccess: (usuario) => iniciarSesion(usuario),
  });
}
