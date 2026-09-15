import { Link } from 'react-router-dom';

/**
 * Espejo de acceso-denegado.html (backend) — la pantalla mejor resuelta del sistema actual
 * según la auditoría; se conserva el mismo patrón: mensaje claro + acción de salida.
 */
export function AccesoDenegadoPage() {
  return (
    <div className="container my-5 text-center">
      <i className="bi bi-shield-exclamation" style={{ fontSize: '3rem', color: 'var(--sm-danger)' }} />
      <h1 className="h3 fw-bold mt-3">Acceso denegado</h1>
      <p className="text-muted mb-4">Tu rol no tiene permiso para ver esta sección.</p>
      <Link to="/admin/dashboard" className="btn btn-dark">
        Volver al dashboard
      </Link>
    </div>
  );
}
