import { ProductosPage } from './ProductosPage';

/**
 * /admin/categorias renderiza la misma página de Catálogo, con la pestaña de Categorías activa
 * de entrada. Evita una segunda implementación paralela de la misma pantalla.
 */
export function CategoriasPage() {
  return <ProductosPage defaultTab="categorias" />;
}
