import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { Button } from '../../../components/ui/Button';
import {
    verificacion2FASchema,
    type Verificacion2FAValues,
} from '../schemas/verificacion2FA.schema';
import { useVerificar2FA } from '../hooks/useLogin';
import type { UsuarioSesion } from '../types';

interface Verificacion2FAProps {
    tempToken: string;
    correo?: string;
    onExito: (usuario: UsuarioSesion) => void;
    /** Se usa solo para construir el QR — nunca se muestra en pantalla. */
    secretDemo: string;
}

/**
 * Punto 15 de los 15 — Verificación en dos pasos con Google Authenticator.
 * Muestra el QR (con el secret embebido) y valida el código de 6 dígitos.
 * El secret NUNCA se muestra como texto — solo va dentro del QR.
 */
export function Verificacion2FA({
    tempToken,
    correo = 'demo',
    onExito,
    secretDemo,
}: Verificacion2FAProps) {
    const { t } = useTranslation();
    const verificar = useVerificar2FA();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Verificacion2FAValues>({
        resolver: zodResolver(verificacion2FASchema),
        defaultValues: { codigo: '' },
    });

    const onSubmit = (valores: Verificacion2FAValues) => {
        verificar.mutate(
            { tempToken, codigo: valores.codigo },
            { onSuccess: (data) => onExito(data as UsuarioSesion) },
        );
    };

    const otpauth = `otpauth://totp/SanMiguel:${encodeURIComponent(
        correo,
    )}?secret=${secretDemo}&issuer=SanMiguel`;

    return (
        <div>
            <div className="text-center mb-3">
                <i className="bi bi-shield-lock fs-1" style={{ color: 'var(--sm-primary)' }} />
                <h5 className="fw-bold mt-2 mb-1">{t('auth.verificando2FA')}</h5>
                <p className="text-muted small mb-0">{t('auth.instruccion2FA')}</p>
            </div>

            <div className="d-flex justify-content-center mb-3 p-3 bg-light rounded">
                <QRCode value={otpauth} size={180} />
            </div>

            <div className="alert alert-info small">
                <i className="bi bi-info-circle me-1" aria-hidden="true" />
                Escaneá el código con <strong>Google Authenticator</strong> (o cualquier app
                TOTP compatible) y luego ingresá el código de 6 dígitos.
            </div>

            {verificar.isError && (
                <div className="alert alert-danger small py-2" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-1" aria-hidden="true" />
                    {verificar.error?.message ?? t('auth.error2FA')}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="codigo2fa">
                        {t('auth.codigo2FA')}
                    </label>
                    <input
                        id="codigo2fa"
                        className={`form-control text-center font-monospace sm-nums${errors.codigo ? ' is-invalid' : ''
                            }`}
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        placeholder="123456"
                        {...register('codigo')}
                    />
                    {errors.codigo && <div className="invalid-feedback">{errors.codigo.message}</div>}
                </div>

                <Button
                    type="submit"
                    className="w-100"
                    isLoading={verificar.isPending}
                    loadingText={t('auth.verificando')}
                >
                    {t('auth.verificar2FA')}
                </Button>
            </form>
        </div>
    );
}