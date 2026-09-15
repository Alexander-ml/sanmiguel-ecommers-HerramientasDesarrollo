import type { ReactNode } from 'react';
import { Tabs as BsTabs, Tab as BsTab } from 'react-bootstrap';
import './Tabs.css';

export interface TabItem {
  id: string;
  etiqueta: string;
  icono?: string; // clase bootstrap-icons, ej. "bi-boxes"
  contador?: number; // badge numérico opcional (ej. cantidad de alertas activas)
  contenido: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activo: string;
  onCambiar: (id: string) => void;
}

/**
 * Componente único de pestañas del sistema San Miguel (Design System / Bloque C, sección 3
 * del prompt de reorganización final). Reemplaza los selectores de pestañas hechos a mano con
 * <button> crudo que existían en Inventario, Compras, Clientes, Usuarios y Mi Cuenta.
 *
 * El contenido de cada pestaña vive en su propio componente (pasado en `contenido`) — este
 * componente solo se encarga de la navegación entre pestañas, nunca del estado de cada una.
 */
export function Tabs({ items, activo, onCambiar }: TabsProps) {
  return (
    <BsTabs
      activeKey={activo}
      onSelect={(k) => k && onCambiar(k)}
      className="sm-tabs mb-4"
    >
      {items.map((item) => (
        <BsTab
          key={item.id}
          eventKey={item.id}
          title={
            <span className="d-inline-flex align-items-center gap-2">
              {item.icono && <i className={`bi ${item.icono}`} />}
              <span>{item.etiqueta}</span>
              {typeof item.contador === 'number' && item.contador > 0 && (
                <span className="sm-tabs__badge">{item.contador}</span>
              )}
            </span>
          }
        >
          {activo === item.id && item.contenido}
        </BsTab>
      ))}
    </BsTabs>
  );
}
