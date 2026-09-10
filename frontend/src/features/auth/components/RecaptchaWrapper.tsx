import ReCAPTCHA from 'react-google-recaptcha';

/**
 * Site key de PRUEBA de Google — siempre devuelve éxito en cualquier dominio.
 * Sirve para demo. Cuando el equipo tenga su clave real:
 *   1. Reemplazar SITE_KEY_PRUEBA
 *   2. Backend valida el token contra https://www.google.com/recaptcha/api/siteverify
 */
const SITE_KEY_PRUEBA = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

interface RecaptchaWrapperProps {
    /** Recibe el token cuando el usuario resuelve el challenge. null si expira. */
    onChange: (token: string | null) => void;
    /** Tema visual del widget. */
    theme?: 'light' | 'dark';
}

/**
 * Envoltorio de Google reCAPTCHA v2 checkbox (punto 10 de los 15).
 */
export function RecaptchaWrapper({ onChange, theme = 'light' }: RecaptchaWrapperProps) {
    return (
        <div className="d-flex justify-content-center">
            <ReCAPTCHA
                sitekey={SITE_KEY_PRUEBA}
                onChange={onChange}
                theme={theme}
                hl="es"
            />
        </div>
    );
}