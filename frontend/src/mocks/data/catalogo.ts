/**
 * Datos de demostración para el módulo Catálogo (Inventario + Catálogo).
 * Data realista de una tienda de ropa masculina en Chiclayo, Perú.
 * Fuente de verdad para esta fase visual — MSW intercepta las peticiones y devuelve estos arrays.
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
  sku: string;
  precioEspecifico: number | null; // null = usa el precio base del producto
  estado: EstadoProducto;
  fechaCreacion: string;
}

// ── Categorías ─────────────────────────────────────────────────────────────────
export let CATEGORIAS: Categoria[] = [
  {
    id: 1,
    nombre: 'Camisas',
    descripcion: 'Todo tipo de camisas para hombre',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: true,
    fechaCreacion: '2025-01-15T08:00:00',
  },
  {
    id: 2,
    nombre: 'Camisas Formales',
    descripcion: 'Camisas de vestir para ocasiones formales y de oficina',
    categoriaPadreId: 1,
    categoriaPadreNombre: 'Camisas',
    activo: true,
    fechaCreacion: '2025-01-15T08:05:00',
  },
  {
    id: 3,
    nombre: 'Camisas Casuales',
    descripcion: 'Camisas para el día a día y salidas informales',
    categoriaPadreId: 1,
    categoriaPadreNombre: 'Camisas',
    activo: true,
    fechaCreacion: '2025-01-15T08:10:00',
  },
  {
    id: 4,
    nombre: 'Pantalones',
    descripcion: 'Pantalones formales y casuales',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: true,
    fechaCreacion: '2025-01-15T08:15:00',
  },
  {
    id: 5,
    nombre: 'Pantalones Formales',
    descripcion: 'Pantalones de vestir en gabardina y drill',
    categoriaPadreId: 4,
    categoriaPadreNombre: 'Pantalones',
    activo: true,
    fechaCreacion: '2025-01-15T08:20:00',
  },
  {
    id: 6,
    nombre: 'Jeans',
    descripcion: 'Jeans y pantalones de mezclilla',
    categoriaPadreId: 4,
    categoriaPadreNombre: 'Pantalones',
    activo: true,
    fechaCreacion: '2025-01-15T08:25:00',
  },
  {
    id: 7,
    nombre: 'Polos',
    descripcion: 'Polos y camisetas para hombre',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: true,
    fechaCreacion: '2025-01-15T08:30:00',
  },
  {
    id: 8,
    nombre: 'Trajes y Abrigos',
    descripcion: 'Trajes completos, blazers y casacas de sastrería',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: true,
    fechaCreacion: '2025-01-15T09:00:00',
  },
  {
    id: 9,
    nombre: 'Accesorios',
    descripcion: 'Cinturones, corbatas y complementos',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: true,
    fechaCreacion: '2025-01-15T09:10:00',
  },
  {
    id: 10,
    nombre: 'Cinturones',
    descripcion: 'Cinturones de cuero y sintéticos',
    categoriaPadreId: 9,
    categoriaPadreNombre: 'Accesorios',
    activo: true,
    fechaCreacion: '2025-01-15T09:15:00',
  },
  {
    id: 11,
    nombre: 'Corbatas',
    descripcion: 'Corbatas de seda, poliéster y tejido',
    categoriaPadreId: 9,
    categoriaPadreNombre: 'Accesorios',
    activo: true,
    fechaCreacion: '2025-01-15T09:20:00',
  },
  {
    id: 12,
    nombre: 'Ropa Deportiva',
    descripcion: 'Shorts, buzos y ropa para entrenar',
    categoriaPadreId: null,
    categoriaPadreNombre: null,
    activo: false,
    fechaCreacion: '2025-01-15T09:30:00',
  },
];

// ── Productos ──────────────────────────────────────────────────────────────────
export let PRODUCTOS: Producto[] = [
  {
    id: 1,
    nombre: 'Camisa Oxford Slim Fit Celeste',
    descripcion:
      'Camisa de algodón Oxford 100%, corte slim, ideal para reuniones de negocios y eventos formales. Con botones de nácar y puños dobles.',
    categoriaId: 2,
    categoriaNombre: 'Camisas Formales',
    marca: 'Pierre Cardin',
    precioBase: 189.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-01T10:00:00',
  },
  {
    id: 2,
    nombre: 'Camisa Cuadros Casual Azul Marino',
    descripcion:
      'Camisa de cuadros en franela suave. Perfecta para salidas casuales de fin de semana. Corte regular con bolsillo frontal.',
    categoriaId: 3,
    categoriaNombre: 'Camisas Casuales',
    marca: 'San Miguel',
    precioBase: 129.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-03T10:00:00',
  },
  {
    id: 3,
    nombre: 'Jean Clásico Lavado Oscuro',
    descripcion:
      'Jean de mezclilla 98% algodón con lavado oscuro permanente. Corte recto, cinco bolsillos. Resistente y duradero.',
    categoriaId: 6,
    categoriaNombre: 'Jeans',
    marca: "Levi's",
    precioBase: 219.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1542272604-780c96856592?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-05T10:00:00',
  },
  {
    id: 4,
    nombre: 'Pantalón Gabardina Gris Plomo',
    descripcion:
      'Pantalón de vestir en gabardina premium color gris plomo. Corte recto clásico, forro interno parcial. Ideal para el trabajo.',
    categoriaId: 5,
    categoriaNombre: 'Pantalones Formales',
    marca: 'Hugo Boss',
    precioBase: 279.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-07T10:00:00',
  },
  {
    id: 5,
    nombre: 'Polo Piqué Manga Corta Blanco',
    descripcion:
      'Polo de algodón piqué 100%. Cuello y puños en contraste. Bordado del logo en el pecho. Fresco y elegante.',
    categoriaId: 7,
    categoriaNombre: 'Polos',
    marca: 'Lacoste',
    precioBase: 159.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-10T10:00:00',
  },
  {
    id: 6,
    nombre: 'Polo Cuello Redondo Negro',
    descripcion:
      'Polo básico de algodón jersey suave. Cuello redondo reforzado. Versátil y cómodo para el día a día.',
    categoriaId: 7,
    categoriaNombre: 'Polos',
    marca: 'San Miguel',
    precioBase: 59.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-12T10:00:00',
  },
  {
    id: 7,
    nombre: 'Traje Completo Gris Acero',
    descripcion:
      'Traje de dos piezas (saco + pantalón) en lana-poliéster gris acero. Corte italiano, forro completo, bolsillos interiores.',
    categoriaId: 8,
    categoriaNombre: 'Trajes y Abrigos',
    marca: 'San Miguel Premium',
    precioBase: 849.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-15T10:00:00',
  },
  {
    id: 8,
    nombre: 'Cinturón Cuero Genuino Negro',
    descripcion:
      'Cinturón de cuero genuino vacuno, acabado mate. Hebilla de acero inoxidable. Disponible en tallas 32–42.',
    categoriaId: 10,
    categoriaNombre: 'Cinturones',
    marca: 'Montblanc',
    precioBase: 129.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-18T10:00:00',
  },
  {
    id: 9,
    nombre: 'Corbata Seda Azul Marino con Rayas',
    descripcion:
      'Corbata de seda natural 100%, patrón de rayas diagonales blancas sobre azul marino. Ancho estándar 8 cm.',
    categoriaId: 11,
    categoriaNombre: 'Corbatas',
    marca: 'Hermès',
    precioBase: 189.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1589756823695-278bc923f962?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-20T10:00:00',
  },
  {
    id: 10,
    nombre: 'Camisa Manga Corta Lino Beige',
    descripcion:
      'Camisa de lino natural, manga corta, color beige arena. Ideal para días calurosos. Con botones de concha.',
    categoriaId: 3,
    categoriaNombre: 'Camisas Casuales',
    marca: 'Zara Man',
    precioBase: 149.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-02-22T10:00:00',
  },
  {
    id: 11,
    nombre: 'Blazer Sport Azul Marino',
    descripcion:
      'Blazer de corte sport en tejido príncipe de gales azul marino. Ideal para combinar con jeans o pantalón chino.',
    categoriaId: 8,
    categoriaNombre: 'Trajes y Abrigos',
    marca: 'San Miguel Premium',
    precioBase: 499.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-03-01T10:00:00',
  },
  {
    id: 12,
    nombre: 'Pantalón Chino Beige',
    descripcion:
      'Pantalón chino de algodón elástico, color beige. Corte slim. Cómodo y versátil para cualquier ocasión.',
    categoriaId: 5,
    categoriaNombre: 'Pantalones Formales',
    marca: 'San Miguel',
    precioBase: 169.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-01-20T10:00:00',
  },
  {
    id: 13,
    nombre: 'Casaca Bomber Urbana Impermeable',
    descripcion:
      'Casaca bomber ligera en tejido repelente al agua. Cuello y puños acanalados elásticos. Forro térmico transpirable.',
    categoriaId: 8,
    categoriaNombre: 'Trajes y Abrigos',
    marca: 'San Miguel',
    precioBase: 229.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-03-02T10:00:00',
  },
  {
    id: 14,
    nombre: 'Camisa Guayabera Lino Manga Larga Blanco',
    descripcion:
      'Clásica guayabera formal con alforzas frontales finamente cosidas. Confeccionada en lino 100% puro para máxima frescura en eventos y recepciones.',
    categoriaId: 2,
    categoriaNombre: 'Camisas Formales',
    marca: 'San Miguel Premium',
    precioBase: 199.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-03-03T10:00:00',
  },
  {
    id: 15,
    nombre: 'Polo Pima Cuello V Azul Petróleo',
    descripcion:
      'Polo elaborado en auténtico algodón pima peruano 50/1. Suavidad inigualable, caída impecable y resistencia a lavados intensivos.',
    categoriaId: 7,
    categoriaNombre: 'Polos',
    marca: 'San Miguel',
    precioBase: 79.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-03-04T10:00:00',
  },
  {
    id: 16,
    nombre: 'Pantalón Jogger Drill Stretch Caqui',
    descripcion:
      'Pantalón jogger casual en drill confort con elastano. Cintura elasticada con cordón ajustable y puños cónicos.',
    categoriaId: 5,
    categoriaNombre: 'Pantalones Formales',
    marca: 'San Miguel',
    precioBase: 149.9,
    estado: 'activo',
    imagenes: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=700&auto=format&fit=crop&q=80'],
    fechaCreacion: '2025-03-05T10:00:00',
  },
];

// ── Variantes ──────────────────────────────────────────────────────────────────
export let VARIANTES: Variante[] = [
  // Producto 1 — Camisa Oxford Slim Fit Celeste
  { id: 1,  productoId: 1, talla: 'S',   color: 'Celeste', sku: 'CAM-OXF-CEL-S',   precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:30:00' },
  { id: 2,  productoId: 1, talla: 'M',   color: 'Celeste', sku: 'CAM-OXF-CEL-M',   precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:31:00' },
  { id: 3,  productoId: 1, talla: 'L',   color: 'Celeste', sku: 'CAM-OXF-CEL-L',   precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:32:00' },
  { id: 4,  productoId: 1, talla: 'XL',  color: 'Celeste', sku: 'CAM-OXF-CEL-XL',  precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:33:00' },
  { id: 5,  productoId: 1, talla: 'S',   color: 'Blanco',  sku: 'CAM-OXF-BLA-S',   precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:34:00' },
  { id: 6,  productoId: 1, talla: 'M',   color: 'Blanco',  sku: 'CAM-OXF-BLA-M',   precioEspecifico: null,  estado: 'activo', fechaCreacion: '2025-02-01T10:35:00' },
  // Producto 2 — Camisa Cuadros Casual
  { id: 7,  productoId: 2, talla: 'S',   color: 'Azul/Blanco', sku: 'CAM-CUA-AZB-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-03T10:30:00' },
  { id: 8,  productoId: 2, talla: 'M',   color: 'Azul/Blanco', sku: 'CAM-CUA-AZB-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-03T10:31:00' },
  { id: 9,  productoId: 2, talla: 'L',   color: 'Azul/Blanco', sku: 'CAM-CUA-AZB-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-03T10:32:00' },
  { id: 10, productoId: 2, talla: 'XL',  color: 'Azul/Blanco', sku: 'CAM-CUA-AZB-XL', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-03T10:33:00' },
  // Producto 3 — Jean Clásico
  { id: 11, productoId: 3, talla: '28',  color: 'Azul Oscuro', sku: 'JEA-CLA-OSC-28', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-05T10:30:00' },
  { id: 12, productoId: 3, talla: '30',  color: 'Azul Oscuro', sku: 'JEA-CLA-OSC-30', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-05T10:31:00' },
  { id: 13, productoId: 3, talla: '32',  color: 'Azul Oscuro', sku: 'JEA-CLA-OSC-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-05T10:32:00' },
  { id: 14, productoId: 3, talla: '34',  color: 'Azul Oscuro', sku: 'JEA-CLA-OSC-34', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-05T10:33:00' },
  { id: 15, productoId: 3, talla: '36',  color: 'Azul Oscuro', sku: 'JEA-CLA-OSC-36', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-05T10:34:00' },
  // Producto 4 — Pantalón Gabardina
  { id: 16, productoId: 4, talla: '30',  color: 'Gris Plomo', sku: 'PAN-GAB-GRI-30', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-07T10:30:00' },
  { id: 17, productoId: 4, talla: '32',  color: 'Gris Plomo', sku: 'PAN-GAB-GRI-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-07T10:31:00' },
  { id: 18, productoId: 4, talla: '34',  color: 'Gris Plomo', sku: 'PAN-GAB-GRI-34', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-07T10:32:00' },
  { id: 19, productoId: 4, talla: '30',  color: 'Negro',      sku: 'PAN-GAB-NEG-30', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-07T10:33:00' },
  { id: 20, productoId: 4, talla: '32',  color: 'Negro',      sku: 'PAN-GAB-NEG-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-07T10:34:00' },
  // Producto 5 — Polo Piqué
  { id: 21, productoId: 5, talla: 'S',   color: 'Blanco', sku: 'POL-PIQ-BLA-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:30:00' },
  { id: 22, productoId: 5, talla: 'M',   color: 'Blanco', sku: 'POL-PIQ-BLA-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:31:00' },
  { id: 23, productoId: 5, talla: 'L',   color: 'Blanco', sku: 'POL-PIQ-BLA-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:32:00' },
  { id: 24, productoId: 5, talla: 'XL',  color: 'Blanco', sku: 'POL-PIQ-BLA-XL', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:33:00' },
  { id: 25, productoId: 5, talla: 'S',   color: 'Navy',   sku: 'POL-PIQ-NAV-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:34:00' },
  { id: 26, productoId: 5, talla: 'M',   color: 'Navy',   sku: 'POL-PIQ-NAV-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-10T10:35:00' },
  // Producto 6 — Polo Cuello Redondo
  { id: 27, productoId: 6, talla: 'S',   color: 'Negro', sku: 'POL-RED-NEG-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:30:00' },
  { id: 28, productoId: 6, talla: 'M',   color: 'Negro', sku: 'POL-RED-NEG-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:31:00' },
  { id: 29, productoId: 6, talla: 'L',   color: 'Negro', sku: 'POL-RED-NEG-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:32:00' },
  { id: 30, productoId: 6, talla: 'XL',  color: 'Negro', sku: 'POL-RED-NEG-XL', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:33:00' },
  { id: 31, productoId: 6, talla: 'S',   color: 'Blanco', sku: 'POL-RED-BLA-S', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:34:00' },
  { id: 32, productoId: 6, talla: 'M',   color: 'Blanco', sku: 'POL-RED-BLA-M', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-12T10:35:00' },
  // Producto 7 — Traje Completo
  { id: 33, productoId: 7, talla: '38',  color: 'Gris Acero', sku: 'TRA-GRI-ACE-38', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-15T10:30:00' },
  { id: 34, productoId: 7, talla: '40',  color: 'Gris Acero', sku: 'TRA-GRI-ACE-40', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-15T10:31:00' },
  { id: 35, productoId: 7, talla: '42',  color: 'Gris Acero', sku: 'TRA-GRI-ACE-42', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-15T10:32:00' },
  { id: 36, productoId: 7, talla: '44',  color: 'Gris Acero', sku: 'TRA-GRI-ACE-44', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-15T10:33:00' },
  // Producto 8 — Cinturón
  { id: 37, productoId: 8, talla: '32',  color: 'Negro', sku: 'CIN-CUE-NEG-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-18T10:30:00' },
  { id: 38, productoId: 8, talla: '34',  color: 'Negro', sku: 'CIN-CUE-NEG-34', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-18T10:31:00' },
  { id: 39, productoId: 8, talla: '36',  color: 'Negro', sku: 'CIN-CUE-NEG-36', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-18T10:32:00' },
  { id: 40, productoId: 8, talla: '38',  color: 'Negro', sku: 'CIN-CUE-NEG-38', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-18T10:33:00' },
  // Producto 9 — Corbata
  { id: 41, productoId: 9, talla: 'Único', color: 'Azul Marino', sku: 'COR-SED-AZM-U',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-20T10:30:00' },
  { id: 42, productoId: 9, talla: 'Único', color: 'Rojo Borgoña', sku: 'COR-SED-RBG-U', precioEspecifico: 199.9, estado: 'activo', fechaCreacion: '2025-02-20T10:31:00' },
  // Producto 10 — Camisa Manga Corta Lino
  { id: 43, productoId: 10, talla: 'S',   color: 'Beige', sku: 'CAM-LIN-BEI-S',   precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-22T10:30:00' },
  { id: 44, productoId: 10, talla: 'M',   color: 'Beige', sku: 'CAM-LIN-BEI-M',   precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-22T10:31:00' },
  { id: 45, productoId: 10, talla: 'L',   color: 'Beige', sku: 'CAM-LIN-BEI-L',   precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-22T10:32:00' },
  { id: 46, productoId: 10, talla: 'XL',  color: 'Beige', sku: 'CAM-LIN-BEI-XL',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-02-22T10:33:00' },
  // Producto 11 — Blazer
  { id: 47, productoId: 11, talla: '38',  color: 'Azul Marino', sku: 'BLA-SPO-AZM-38', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-01T10:30:00' },
  { id: 48, productoId: 11, talla: '40',  color: 'Azul Marino', sku: 'BLA-SPO-AZM-40', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-01T10:31:00' },
  { id: 49, productoId: 11, talla: '42',  color: 'Azul Marino', sku: 'BLA-SPO-AZM-42', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-01T10:32:00' },
  // Producto 12 — Pantalón Chino Beige (activado)
  { id: 50, productoId: 12, talla: '30',  color: 'Beige', sku: 'PAN-CHI-BEI-30', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T10:30:00' },
  { id: 51, productoId: 12, talla: '32',  color: 'Beige', sku: 'PAN-CHI-BEI-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T10:31:00' },
  { id: 52, productoId: 12, talla: '34',  color: 'Beige', sku: 'PAN-CHI-BEI-34', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T10:32:00' },
  // Producto 13 — Casaca Bomber Urbana
  { id: 53, productoId: 13, talla: 'M',   color: 'Negro', sku: 'CAS-BOM-NEG-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T11:00:00' },
  { id: 54, productoId: 13, talla: 'L',   color: 'Negro', sku: 'CAS-BOM-NEG-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T11:01:00' },
  { id: 55, productoId: 13, talla: 'XL',  color: 'Negro', sku: 'CAS-BOM-NEG-XL', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-02T11:02:00' },
  // Producto 14 — Guayabera Lino
  { id: 56, productoId: 14, talla: 'S',   color: 'Blanco', sku: 'GUA-LIN-BLA-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-03T11:00:00' },
  { id: 57, productoId: 14, talla: 'M',   color: 'Blanco', sku: 'GUA-LIN-BLA-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-03T11:01:00' },
  { id: 58, productoId: 14, talla: 'L',   color: 'Blanco', sku: 'GUA-LIN-BLA-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-03T11:02:00' },
  { id: 59, productoId: 14, talla: 'XL',  color: 'Blanco', sku: 'GUA-LIN-BLA-XL', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-03T11:03:00' },
  // Producto 15 — Polo Pima Cuello V
  { id: 60, productoId: 15, talla: 'S',   color: 'Azul Petróleo', sku: 'POL-V-PET-S',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-04T11:00:00' },
  { id: 61, productoId: 15, talla: 'M',   color: 'Azul Petróleo', sku: 'POL-V-PET-M',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-04T11:01:00' },
  { id: 62, productoId: 15, talla: 'L',   color: 'Azul Petróleo', sku: 'POL-V-PET-L',  precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-04T11:02:00' },
  // Producto 16 — Pantalón Jogger Drill
  { id: 63, productoId: 16, talla: '30',  color: 'Caqui', sku: 'JOG-DRI-CAQ-30', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-05T11:00:00' },
  { id: 64, productoId: 16, talla: '32',  color: 'Caqui', sku: 'JOG-DRI-CAQ-32', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-05T11:01:00' },
  { id: 65, productoId: 16, talla: '34',  color: 'Caqui', sku: 'JOG-DRI-CAQ-34', precioEspecifico: null, estado: 'activo', fechaCreacion: '2025-03-05T11:02:00' },
];

let _nextCategoriaId = CATEGORIAS.length + 1;
let _nextProductoId = PRODUCTOS.length + 1;
let _nextVarianteId = VARIANTES.length + 1;

export function nextCategoriaId() { return _nextCategoriaId++; }
export function nextProductoId()  { return _nextProductoId++; }
export function nextVarianteId()  { return _nextVarianteId++; }
