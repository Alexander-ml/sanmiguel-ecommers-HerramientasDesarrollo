import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container my-5 text-center">
      <h1 className="display-4 fw-bold sm-font-display">404</h1>
      <p className="text-muted mb-4">La página que buscas no existe.</p>
      <Link to="/" className="btn btn-dark">
        Volver al inicio
      </Link>
    </div>
  );
}
