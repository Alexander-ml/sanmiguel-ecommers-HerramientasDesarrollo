import type { ReactNode } from 'react';

interface FormSectionProps {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  /** Si true, la sección no renderiza el separador superior (para la primera sección de un form) */
  primera?: boolean;
}

/**
 * Agrupador visual de campos de formulario con título y descripción opcional.
 * Corrige el hallazgo de auditoría de `admin/producto-form`:
 * "formulario plano sin secciones" → aquí cada grupo de campos tiene contexto visual claro.
 *
 * REGLA DE ARQUITECTURA VISUAL: ¿MODAL O PÁGINA COMPLETA? (§3.5)
 * ─────────────────────────────────────────────────────────────────────────────
 * - Modal: Formulario de 6 campos o menos, sin carga de archivos/imágenes y sin
 *   sub-secciones complejas (ej. Categoría, Variante, Proveedor, Usuario interno,
 *   Ajuste rápido de Stock, Umbral de alerta).
 * - Página completa (con Breadcrumbs + PageHeader + Card de contenido): Formularios
 *   más extensos, con imágenes/archivos, con múltiples secciones agrupadas mediante
 *   FormSection, o que continúan hacia otro flujo posterior (ej. Producto → Variantes,
 *   Orden de Compra con líneas interactivas, Registro de Venta, Parámetros de Configuración).
 *
 * Creado por el módulo Inventario y Catálogo para reutilización en Compras, Configuración, etc.
 */
export function FormSection({ titulo, descripcion, children, primera = false }: FormSectionProps) {
  return (
    <div className={primera ? 'mb-4' : 'pt-4 mt-2 border-top mb-4'}>
      <div className="mb-3">
        <h2
          className="h6 fw-semibold mb-0"
          style={{ color: 'var(--sm-ink)', fontSize: 'var(--sm-text-sm)' }}
        >
          {titulo}
        </h2>
        {descripcion && (
          <p className="text-muted small mb-0 mt-1">{descripcion}</p>
        )}
      </div>
      <div className="ps-0">
        {children}
      </div>
    </div>
  );
}
