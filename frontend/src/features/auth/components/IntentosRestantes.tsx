import { useTranslation } from 'react-i18next';

interface IntentosRestantesProps {
    restantes: number;
    max: number;
}

/**
 * Punto 5 de los 15 — marcador de intentos fallidos.
 * Se muestra cuando el backend devuelve `intentosRestantes` en un 401.
 */
export function IntentosRestantes({ restantes, max }: IntentosRestantesProps) {
    const { t } = useTranslation();

    return (
        <div
            className="alert alert-warning small py-2 d-flex align-items-center gap-2 mb-3"
            role="alert"
        >
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>{t('auth.intentosRestantes', { n: restantes, max })}</span>
        </div>
    );
}