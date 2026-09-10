import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Punto 14 de los 15 — Advertencia de sesión próxima a expirar.
 * Devuelve `alerta` (true cuando faltan ≤ umbralMin minutos) y `restanteMin`.
 * Se monta una sola vez desde App.tsx.
 */
export function useExpiracionSesion(umbralMin = 2) {
    const expiraEn = useAuthStore((s) => s.expiraEn);
    const usuario = useAuthStore((s) => s.usuario);
    const [alerta, setAlerta] = useState(false);
    const [restanteMin, setRestanteMin] = useState<number | null>(null);

    useEffect(() => {
        if (!usuario || !expiraEn) {
            setAlerta(false);
            setRestanteMin(null);
            return;
        }

        const tick = () => {
            const ms = expiraEn - Date.now();
            if (ms <= 0) {
                useAuthStore.getState().cerrarSesion();
                return;
            }
            const min = Math.floor(ms / 60000);
            setRestanteMin(min);
            setAlerta(min <= umbralMin);
        };

        tick();
        const id = window.setInterval(tick, 30_000);
        return () => window.clearInterval(id);
    }, [usuario, expiraEn, umbralMin]);

    return { alerta, restanteMin };
}