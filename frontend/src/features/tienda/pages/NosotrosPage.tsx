import { LoadingState } from '../../../components/feedback/LoadingState';
import { useConfiguracion } from '../../configuracion/hooks/useConfiguracion';

/** Página pública "Nosotros" — reemplaza el placeholder pendiente (Sección 6.5 del plan). */
export function NosotrosPage() {
  const { data: config, isLoading } = useConfiguracion();

  if (isLoading || !config) return <LoadingState etiqueta="Cargando…" />;

  return (
    <div className="container py-5" style={{ maxWidth: 860 }}>
      <p className="text-uppercase small fw-semibold text-primary mb-2">Nuestra historia</p>
      <h1 className="sm-font-display mb-4" style={{ fontSize: 'var(--sm-text-2xl)' }}>
        {config.empresa.nombreComercial}
      </h1>

      <p className="text-muted mb-4" style={{ fontSize: 'var(--sm-text-lg)', lineHeight: 1.6 }}>
        {config.empresa.lema}
      </p>

      <p className="mb-4" style={{ lineHeight: 1.8 }}>
        En {config.empresa.nombreComercial} creemos que vestir bien no debería ser complicado.
        Seleccionamos cada prenda de nuestro catálogo pensando en calidad, durabilidad y un estilo
        que se adapte tanto al trabajo como al día a día. Operamos desde{' '}
        {config.empresa.distrito}, {config.empresa.provincia}, atendiendo tanto en tienda física
        como a través de nuestro canal en línea.
      </p>

      <p className="mb-5" style={{ lineHeight: 1.8 }}>
        Nuestro compromiso es simple: stock real y verificado en todo momento — lo que ves
        disponible en la tienda es exactamente lo que hay en nuestro almacén, sin sorpresas al
        momento de confirmar tu pedido.
      </p>

      <div className="row g-4 text-center">
        <div className="col-4">
          <i className="bi bi-truck fs-2 text-primary" />
          <p className="small fw-semibold mt-2 mb-0">Envíos a todo el país</p>
        </div>
        <div className="col-4">
          <i className="bi bi-arrow-repeat fs-2 text-primary" />
          <p className="small fw-semibold mt-2 mb-0">Cambios y devoluciones</p>
        </div>
        <div className="col-4">
          <i className="bi bi-shield-check fs-2 text-primary" />
          <p className="small fw-semibold mt-2 mb-0">Pago seguro</p>
        </div>
      </div>
    </div>
  );
}
