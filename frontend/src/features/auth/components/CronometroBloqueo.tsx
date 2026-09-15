import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CronometroBloqueoProps {
    /** Timestamp (ms) hasta el cual la cuenta está bloqueada. */
    bloqueadoHasta: number;
}

function formatear(ms: number): string {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

/**
 * Punto 4 de los 15 — cronómetro de bloqueo.
 * Se auto-actualiza cada segundo y desaparece cuando el tiempo llega a 0.
 */
export function CronometroBloqueo({ bloqueadoHasta }: CronometroBloqueoProps) {
    const { t } = useTranslation();
    const [restante, setRestante] = useState(() => bloqueadoHasta - Date.now());

    useEffect(() => {
        setRestante(bloqueadoHasta - Date.now());
        const id = window.setInterval(() => {
            setRestante(bloqueadoHasta - Date.now());
        }, 1000);
        return () => window.clearInterval(id);
    }, [bloqueadoHasta]);

    if (restante <= 0) return null;

    return (
        <div
            className="alert alert-danger small py-2 d-flex align-items-center gap-2 mb-3"
            role="alert"
        >
            <i className="bi bi-lock-fill" aria-hidden="true" />
            <span className="sm-nums">
                {t('auth.cuentaBloqueada', { tiempo: formatear(restante) })}
            </span>
        </div>
    );
}