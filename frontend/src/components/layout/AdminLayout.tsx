import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './AdminLayout.css';

/**
 * Fase 5 — App Shell administrativo. Toda pantalla bajo /admin se renderiza dentro de este
 * layout vía <Outlet />. Las páginas de cada feature no repiten Header/Sidebar.
 */
export function AdminLayout() {
  return (
    <div className="sm-admin-shell">
      <Header />
      <div className="sm-admin-shell__body">
        <Sidebar />
        <main className="sm-admin-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
