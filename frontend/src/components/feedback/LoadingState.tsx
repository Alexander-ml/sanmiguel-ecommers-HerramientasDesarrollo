interface LoadingStateProps {
  etiqueta?: string;
}

export function LoadingState({ etiqueta = 'Cargando…' }: LoadingStateProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border" style={{ color: 'var(--sm-primary)' }} role="status">
        <span className="visually-hidden">{etiqueta}</span>
      </div>
      <p className="small mt-3 mb-0">{etiqueta}</p>
    </div>
  );
}
