interface Props {
  titulo: string;
  nota?: string;
}

/**
 * Placeholder temporal para páginas de features que aún no se construyen en esta fase
 * (App Shell). Se reemplaza módulo por módulo siguiendo el patrón del módulo piloto.
 */
export function PaginaEnConstruccion({ titulo, nota }: Props) {
  return (
    <div>
      <h1 className="h3 fw-semibold mb-1">{titulo}</h1>
      <p className="text-muted">Esta pantalla se construye en la siguiente fase.</p>
      {nota && (
        <div className="alert alert-warning small mt-3" role="alert">
          {nota}
        </div>
      )}
    </div>
  );
}
