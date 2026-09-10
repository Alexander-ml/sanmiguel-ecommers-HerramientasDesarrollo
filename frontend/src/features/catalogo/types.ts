/**
 * Tipos del dominio Catálogo.
 * Reflejan exactamente los campos definidos en el documento fuente del módulo (sección 3.1).
 * No se inventa ningún campo extra — todo campo nuevo debe aparecer en el documento fuente primero.
 */

export type EstadoProducto = 'activo' | 'inactivo';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaPadreId: number | null;
  categoriaPadreNombre: string | null;
  activo: boolean;
  fechaCreacion: string;
}

/** Respuesta paginada genérica */
export interface PaginaRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  marca: string;
  precioBase: number;
  estado: EstadoProducto;
  imagenes: string[];
  fechaCreacion: string;
}

export interface Variante {
  id: number;
  productoId: number;
  talla: string;
  color: string;
  /** SKU único en todo el sistema — no editable tras creación (RN-INV-02) */
  sku: string;
  /** null = usa el precio base del producto */
  precioEspecifico: number | null;
  estado: EstadoProducto;
  fechaCreacion: string;
}
