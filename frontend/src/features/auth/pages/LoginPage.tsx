import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { IdiomaSelector } from '../components/IdiomaSelector';
import { useAuthStore } from '../store/useAuthStore';
import type { UsuarioSesion } from '../types';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useAuthStore((s) => s.usuario);
  const stateRedirect = (location.state as { redirectTo?: string } | null)?.redirectTo;

  // Guard inverso: usuario logueado no ve el login
  if (usuario) {
    return (
      <Navigate to={usuario.rol === 'CLIENTE' ? '/mi-cuenta' : '/admin/dashboard'} replace />
    );
  }

  const irTrasLogin = (user: UsuarioSesion) => {
    if (stateRedirect) {
      const esAdmin = stateRedirect.startsWith('/admin');
      // Un CLIENTE nunca aterriza en /admin/*
      if (!esAdmin || user.rol !== 'CLIENTE') {
        navigate(stateRedirect, { replace: true });
        return;
      }
    }
    navigate(user.rol === 'CLIENTE' ? '/mi-cuenta' : '/admin/dashboard', { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div
            className="card border-0 shadow-lg overflow-hidden"
            style={{ borderRadius: 'var(--sm-radius-md)' }}
          >
            <div className="row g-0">
              {/* Columna de marca */}
              <div
                className="col-12 col-md-5 p-4 p-lg-5 text-white d-flex flex-column justify-content-between"
                style={{
                  background:
                    'linear-gradient(135deg, var(--sm-ink) 0%, var(--sm-primary-dark) 100%)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center gap-1 mb-4">
                    <span
                      className="h4 fw-bold mb-0 text-white sm-font-display"
                      style={{ letterSpacing: '0.06em' }}
                    >
                      SAN MIGUEL
                    </span>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: 'var(--sm-primary-subtle)',
                        display: 'inline-block',
                      }}
                    />
                  </div>
                  <h1 className="h4 fw-bold mb-2 text-white">{t('auth.marcaTitulo')}</h1>
                  <p className="text-white-50 small mb-4" style={{ lineHeight: 1.6 }}>
                    {t('auth.marcaDesc')}
                  </p>
                </div>
                <div className="pt-3 border-top border-secondary border-opacity-25 small text-white-50">
                  {t('auth.sinCuenta')}{' '}
                  <Link
                    to="/registro"
                    className="text-white fw-semibold text-decoration-underline"
                  >
                    {t('auth.registrate')}
                  </Link>
                </div>
              </div>

              {/* Columna del formulario */}
              <div className="col-12 col-md-7 p-4 p-lg-5 bg-white">
                <IdiomaSelector />
                <div className="mb-4 mt-2">
                  <h2 className="h4 fw-bold text-dark mb-1">{t('auth.titulo')}</h2>
                  <p className="text-muted small mb-0">{t('auth.subtitulo')}</p>
                </div>

                <LoginForm onExito={irTrasLogin} />

                <div className="text-end mt-3">
                  <Link
                    to="/recuperar-contrasena"
                    className="small text-muted text-decoration-none"
                  >
                    {t('auth.olvide')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}