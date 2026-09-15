import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    isInvalid?: boolean;
};

/**
 * Input de contraseña reutilizable con toggle mostrar/ocultar accesible.
 * Se integra con react-hook-form porque reenvía el ref al <input> real.
 *
 * Uso:
 *   <PasswordInput id="password" {...register('password')} isInvalid={!!errors.password} />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ isInvalid = false, className = '', ...rest }, ref) => {
        const { t } = useTranslation();
        const [visible, setVisible] = useState(false);

        return (
            <div className="input-group">
                <span className="input-group-text bg-white">
                    <i className="bi bi-lock text-muted" />
                </span>
                <input
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={`form-control${isInvalid ? ' is-invalid' : ''} ${className}`.trim()}
                    {...rest}
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-label={visible ? t('auth.ocultarPass') : t('auth.mostrarPass')}
                    onClick={() => setVisible((v) => !v)}
                    tabIndex={-1}
                    icon={<i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} />}
                />
            </div>
        );
    },
);

PasswordInput.displayName = 'PasswordInput';