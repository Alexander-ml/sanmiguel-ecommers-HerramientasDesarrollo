import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

/**
 * A diferencia del sistema actual (donde `detalle.html` olvida incluir navbar/footer — ver
 * hallazgo de auditoría, docs/01-analisis-y-auditoria.md §5), TODA página pública pasa por
 * este layout: es estructuralmente imposible que una pantalla de tienda quede sin navegación.
 */
export function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
