import { useTranslation } from 'react-i18next';
import { useAuthPrefsStore } from '../store/useAuthPrefsStore';

/**
 * Selector de idioma ES / EN del login (punto 9 de los 15).
 * Sincroniza con useAuthPrefsStore para persistir la elección.
 */
export function IdiomaSelector() {
    const { i18n, t } = useTranslation();
    const setIdioma = useAuthPrefsStore((s) => s.setIdioma);

    const cambiar = (lang: 'es' | 'en') => {
        if (i18n.language === lang) return;
        i18n.changeLanguage(lang);
        setIdioma(lang);
    };

    return (
        <div className="d-flex justify-content-end align-items-center gap-1 small">
            <span className="text-muted me-1">{t('auth.idioma')}:</span>
            <button
                type="button"
                className={`btn btn-link btn-sm p-0 text-decoration-none ${i18n.language === 'es' ? 'fw-bold' : 'text-muted'
                    }`}
                onClick={() => cambiar('es')}
                aria-pressed={i18n.language === 'es'}
            >
                ES
            </button>
            <span className="text-muted">/</span>
            <button
                type="button"
                className={`btn btn-link btn-sm p-0 text-decoration-none ${i18n.language === 'en' ? 'fw-bold' : 'text-muted'
                    }`}
                onClick={() => cambiar('en')}
                aria-pressed={i18n.language === 'en'}
            >
                EN
            </button>
        </div>
    );
}