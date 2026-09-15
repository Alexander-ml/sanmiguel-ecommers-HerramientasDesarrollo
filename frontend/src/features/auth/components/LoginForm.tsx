import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { useLogin } from '../hooks/useLogin';
import { useAuthPrefsStore } from '../store/useAuthPrefsStore';
import { Button } from '../../../components/ui/Button';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { AyudaTooltip } from '../../../components/ui/AyudaTooltip';
import { CaptchaCanvas, type CaptchaHandle } from './CaptchaCanvas';
import { RecaptchaWrapper } from './RecaptchaWrapper';
import { DeclaratoriaModal } from './DeclaratoriaModal';
import { IntentosRestantes } from './IntentosRestantes';
import { CronometroBloqueo } from './CronometroBloqueo';
import { Verificacion2FA } from './Verificacion2FA';
import { USUARIOS_DEMO, MAX_INTENTOS } from '../../../mocks/data/usuarios';
import type { UsuarioSesion } from '../types';

interface LoginFormProps {
  onExito: (usuario: UsuarioSesion) => void;
}

export function LoginForm({ onExito }: LoginFormProps) {
  const { t } = useTranslation();
  const login = useLogin();
  const correoRecordado = useAuthPrefsStore((s) => s.correoRecordado);
  const setCorreoRecordado = useAuthPrefsStore((s) => s.setCorreoRecordado);

  const captchaRef = useRef<CaptchaHandle>(null);
  const [captchaValor, setCaptchaValor] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [pendiente2FA, setPendiente2FA] = useState<{
    tempToken: string;
    secret: string;
    correo: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      correo: correoRecordado ?? '',
      password: '',
      recordar: !!correoRecordado,
      declaratoria: false,
      captcha: '',
      recaptchaToken: null,
    },
  });

  const onSubmit = (valores: LoginFormValues) => {
    // Validación del captcha propio (en cliente)
    if (captchaInput.trim().toUpperCase() !== captchaValor.toUpperCase()) {
      setCaptchaError(true);
      captchaRef.current?.refrescar();
      setCaptchaInput('');
      return;
    }
    setCaptchaError(false);

    login.mutate(
      { ...valores, captcha: captchaInput, recaptchaToken },
      {
        onSuccess: (data) => {
          // Guardar o limpiar el correo recordado
          if (valores.recordar) setCorreoRecordado(valores.correo);
          else setCorreoRecordado(null);

          // Si el backend pide 2FA, cambiamos a la pantalla de verificación
          if (data.requiere2FA && data.tempToken) {
            const secret =
              USUARIOS_DEMO.find(
                (u) => u.correo.toLowerCase() === valores.correo.toLowerCase(),
              )?.secret2FA ?? '';
            setPendiente2FA({
              tempToken: data.tempToken,
              secret,
              correo: valores.correo,
            });
            return;
          }

          onExito(data as UsuarioSesion);
        },
      },
    );
  };

  // ── Pantalla de 2FA (reemplaza al formulario de login) ────────────────
  if (pendiente2FA) {
    return (
      <Verificacion2FA
        tempToken={pendiente2FA.tempToken}
        secretDemo={pendiente2FA.secret}
        correo={pendiente2FA.correo}
        onExito={onExito}
      />
    );
  }

  // ── Estados de error de la mutación ───────────────────────────────────
  const apiError = login.error as any;
  const intentosRestantes = apiError?.data?.intentosRestantes as number | undefined;
  const bloqueadoHasta = apiError?.data?.bloqueadoHasta as number | undefined;
  const mostrarErrorGenerico = login.isError && !intentosRestantes && !bloqueadoHasta;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Bloqueo activo */}
      {bloqueadoHasta && <CronometroBloqueo bloqueadoHasta={bloqueadoHasta} />}

      {/* Intentos restantes */}
      {!bloqueadoHasta && typeof intentosRestantes === 'number' && intentosRestantes > 0 && (
        <IntentosRestantes restantes={intentosRestantes} max={MAX_INTENTOS} />
      )}

      {/* Error genérico (credenciales malas sin contador) */}
      {mostrarErrorGenerico && (
        <div
          className="alert alert-danger small py-2 d-flex align-items-center gap-2"
          role="alert"
        >
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
          <span>{apiError?.message ?? t('auth.credencialesInvalidas')}</span>
        </div>
      )}

      {/* Correo */}
      <div className="mb-3">
        <label
          className="form-label small fw-semibold d-flex align-items-center"
          htmlFor="correo"
        >
          {t('auth.correo')}
          <AyudaTooltip texto={t('auth.correoAyuda')} />
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-envelope text-muted" />
          </span>
          <input
            id="correo"
            type="email"
            className={`form-control${errors.correo ? ' is-invalid' : ''}`}
            placeholder="tunombre@correo.com"
            autoComplete="username"
            {...register('correo')}
          />
        </div>
        {errors.correo && (
          <div className="text-danger small mt-1">{errors.correo.message}</div>
        )}
      </div>

      {/* Contraseña */}
      <div className="mb-3">
        <label
          className="form-label small fw-semibold d-flex align-items-center"
          htmlFor="password"
        >
          {t('auth.password')}
          <AyudaTooltip texto={t('auth.passwordAyuda')} />
        </label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          isInvalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <div className="text-danger small mt-1">{errors.password.message}</div>
        )}
      </div>

      {/* Recordar correo */}
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="recordar"
          {...register('recordar')}
        />
        <label className="form-check-label small text-muted" htmlFor="recordar">
          {t('auth.recordarCorreo')}
        </label>
      </div>

      {/* Captcha propio */}
      <div className="mb-3">
        <label className="form-label small fw-semibold">{t('auth.captchaLabel')}</label>
        <div className="d-flex align-items-center gap-2 mb-2">
          <CaptchaCanvas ref={captchaRef} onChange={setCaptchaValor} />
          <input
            className={`form-control text-uppercase${captchaError ? ' is-invalid' : ''}`}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            maxLength={5}
            placeholder="XXXXX"
            autoComplete="off"
            aria-label={t('auth.captchaLabel')}
          />
        </div>
        {captchaError && (
          <div className="text-danger small mb-2">{t('auth.captchaInvalido')}</div>
        )}

        {/* reCAPTCHA de Google */}
        <RecaptchaWrapper onChange={setRecaptchaToken} />
      </div>

      {/* Declaratoria de privacidad */}
      <div className="form-check mb-4">
        <input
          className={`form-check-input${errors.declaratoria ? ' is-invalid' : ''}`}
          type="checkbox"
          id="declaratoria"
          {...register('declaratoria')}
        />
        <label className="form-check-label small text-muted" htmlFor="declaratoria">
          {t('auth.declaratoria')} <DeclaratoriaModal />
        </label>
        {errors.declaratoria && (
          <div className="text-danger small mt-1">{errors.declaratoria.message}</div>
        )}
      </div>

      {/* Botón principal */}
      <Button
        type="submit"
        variant="primary"
        className="w-100 py-2 mb-3"
        isLoading={login.isPending}
        loadingText={t('auth.validando')}
      >
        {t('auth.ingresar')}
      </Button>

      {/* Acceso rápido demo — data-driven */}
      <div className="p-3 bg-light rounded border">
        <p className="text-muted small fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-lightning-charge-fill text-warning me-1" aria-hidden="true" />
          {t('auth.demo')}
        </p>
        <div className="d-flex flex-wrap gap-2">
          {USUARIOS_DEMO.filter((u) => !u.tiene2FA).map((u) => (
            <Button
              key={u.correo}
              type="button"
              variant={u.rol === 'CLIENTE' ? 'outline-primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setValue('correo', u.correo, { shouldValidate: true });
                setValue('password', 'demo1234', { shouldValidate: true });
                setValue('declaratoria', true, { shouldValidate: true });
                setValue('recordar', false);
              }}
            >
              {u.rol.charAt(0) + u.rol.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
        <p className="text-muted small mt-2 mb-0" style={{ fontSize: '0.7rem' }}>
          <i className="bi bi-info-circle me-1" aria-hidden="true" />
          El usuario <code>2fa@sanmiguel.pe</code> requiere código 2FA.
        </p>
      </div>
    </form>
  );
}