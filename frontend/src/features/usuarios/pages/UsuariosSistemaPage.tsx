import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { UsuariosTab } from '../components/UsuariosTab';
import { RolesMatrizPermisos } from '../components/RolesMatrizPermisos';
import { SesionesAuditoriaTab } from '../components/SesionesAuditoriaTab';
import { useResumenSeguridad } from '../hooks/useUsuarios';

type TabUsuarios = 'usuarios' | 'roles' | 'sesiones';

const TITULOS: Record<TabUsuarios, { titulo: string; descripcion: string }> = {
  usuarios: {
    titulo: 'Usuarios y Seguridad',
    descripcion: 'Control de acceso seguro del personal interno (Administrador, Almacenero, Vendedor).',
  },
  roles: {
    titulo: 'Roles y Matriz de Permisos',
    descripcion: 'Definición granular de qué acciones puede ejecutar cada rol sobre cada módulo del sistema.',
  },
  sesiones: {
    titulo: 'Sesiones Activas y Auditoría',
    descripcion: 'Monitoreo de sesiones en tiempo real, revocación inmediata y log de auditoría de accesos.',
  },
};

export function UsuariosSistemaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabUsuarios | null;
  const [tab, setTab] = useState<TabUsuarios>(
    tabParam && ['usuarios', 'roles', 'sesiones'].includes(tabParam) ? tabParam : 'usuarios',
  );

  const cambiarTab = (id: string) => {
    const t = id as TabUsuarios;
    setTab(t);
    setSearchParams(t === 'usuarios' ? {} : { tab: t });
  };

  const { data: resumen } = useResumenSeguridad();

  return (
    <div>
      <PageHeader titulo={TITULOS[tab].titulo} descripcion={TITULOS[tab].descripcion} />

      <Tabs
        activo={tab}
        onCambiar={cambiarTab}
        items={[
          { id: 'usuarios', etiqueta: 'Personal Interno', icono: 'bi-people', contenido: <UsuariosTab /> },
          { id: 'roles', etiqueta: 'Roles y Permisos', icono: 'bi-shield-lock', contenido: <RolesMatrizPermisos /> },
          {
            id: 'sesiones',
            etiqueta: 'Sesiones y Auditoría',
            icono: 'bi-display',
            contador: resumen?.sesionesActivas ?? 0,
            contenido: <SesionesAuditoriaTab />,
          },
        ]}
      />
    </div>
  );
}
