import { http, HttpResponse } from 'msw';
import {
  CATEGORIAS, PRODUCTOS, VARIANTES,
  nextCategoriaId, nextProductoId, nextVarianteId,
  type Categoria, type Producto, type Variante,
} from '../data/catalogo';

const PAGE_SIZE = 10;

// ── Handlers de Categorías ─────────────────────────────────────────────────────
const categoriaHandlers = [
  http.get('/api/categorias', ({ request }) => {
    const url = new URL(request.url);
    const activo = url.searchParams.get('activo');
    const busqueda = url.searchParams.get('q')?.toLowerCase() ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    let resultado = [...CATEGORIAS];
    if (activo !== null && activo !== '')
      resultado = resultado.filter((c) => String(c.activo) === activo);
    if (busqueda)
      resultado = resultado.filter((c) => c.nombre.toLowerCase().includes(busqueda));

    const total = resultado.length;
    const datos = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  http.get('/api/categorias/:id', ({ params }) => {
    const categoria = CATEGORIAS.find((c) => c.id === Number(params.id));
    if (!categoria) return HttpResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    return HttpResponse.json(categoria);
  }),

  http.post('/api/categorias', async ({ request }) => {
    const body = (await request.json()) as Omit<Categoria, 'id' | 'fechaCreacion' | 'categoriaPadreNombre'>;
    const padre = body.categoriaPadreId ? CATEGORIAS.find((c) => c.id === body.categoriaPadreId) : null;
    const nueva: Categoria = {
      ...body,
      id: nextCategoriaId(),
      categoriaPadreNombre: padre?.nombre ?? null,
      fechaCreacion: new Date().toISOString(),
    };
    CATEGORIAS.push(nueva);
    return HttpResponse.json(nueva, { status: 201 });
  }),

  http.put('/api/categorias/:id', async ({ params, request }) => {
    const idx = CATEGORIAS.findIndex((c) => c.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    const body = (await request.json()) as Partial<Categoria>;
    const padre = body.categoriaPadreId ? CATEGORIAS.find((c) => c.id === body.categoriaPadreId) : null;
    CATEGORIAS[idx] = {
      ...CATEGORIAS[idx],
      ...body,
      categoriaPadreNombre: padre?.nombre ?? CATEGORIAS[idx].categoriaPadreNombre,
    };
    return HttpResponse.json(CATEGORIAS[idx]);
  }),

  http.delete('/api/categorias/:id', ({ params }) => {
    const idx = CATEGORIAS.findIndex((c) => c.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    const tieneProductosActivos = PRODUCTOS.some(
      (p) => p.categoriaId === Number(params.id) && p.estado === 'activo',
    );
    if (tieneProductosActivos) {
      return HttpResponse.json(
        { message: 'No se puede dar de baja una categoría con productos activos asociados.' },
        { status: 409 },
      );
    }
    CATEGORIAS[idx] = { ...CATEGORIAS[idx], activo: false };
    return HttpResponse.json(CATEGORIAS[idx]);
  }),
];

// ── Handlers de Productos ──────────────────────────────────────────────────────
const productoHandlers = [
  http.get('/api/productos', ({ request }) => {
    const url = new URL(request.url);
    const categoriaId = url.searchParams.get('categoriaId');
    const estado = url.searchParams.get('estado');
    const busqueda = url.searchParams.get('q')?.toLowerCase() ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    let resultado = [...PRODUCTOS];
    if (categoriaId) resultado = resultado.filter((p) => p.categoriaId === Number(categoriaId));
    if (estado)     resultado = resultado.filter((p) => p.estado === estado);
    if (busqueda)   resultado = resultado.filter(
      (p) => p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda),
    );

    const total = resultado.length;
    const datos = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return HttpResponse.json({ datos, total, pagina: page, totalPaginas: Math.ceil(total / PAGE_SIZE) });
  }),

  http.get('/api/productos/:id', ({ params }) => {
    const producto = PRODUCTOS.find((p) => p.id === Number(params.id));
    if (!producto) return HttpResponse.json({ message: 'Producto no encontrado.' }, { status: 404 });
    return HttpResponse.json(producto);
  }),

  http.post('/api/productos', async ({ request }) => {
    const body = (await request.json()) as Omit<Producto, 'id' | 'fechaCreacion' | 'categoriaNombre'>;
    const categoria = CATEGORIAS.find((c) => c.id === body.categoriaId);
    const nuevo: Producto = {
      ...body,
      id: nextProductoId(),
      categoriaNombre: categoria?.nombre ?? '',
      estado: 'activo',
      fechaCreacion: new Date().toISOString(),
    };
    PRODUCTOS.push(nuevo);
    return HttpResponse.json(nuevo, { status: 201 });
  }),

  http.put('/api/productos/:id', async ({ params, request }) => {
    const idx = PRODUCTOS.findIndex((p) => p.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Producto no encontrado.' }, { status: 404 });
    const body = (await request.json()) as Partial<Producto>;
    const categoria = body.categoriaId ? CATEGORIAS.find((c) => c.id === body.categoriaId) : null;
    PRODUCTOS[idx] = {
      ...PRODUCTOS[idx],
      ...body,
      categoriaNombre: categoria?.nombre ?? PRODUCTOS[idx].categoriaNombre,
    };
    return HttpResponse.json(PRODUCTOS[idx]);
  }),

  // Baja lógica (DELETE = desactivar, no eliminar físicamente)
  http.delete('/api/productos/:id', ({ params }) => {
    const idx = PRODUCTOS.findIndex((p) => p.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Producto no encontrado.' }, { status: 404 });
    PRODUCTOS[idx] = { ...PRODUCTOS[idx], estado: 'inactivo' };
    return HttpResponse.json(PRODUCTOS[idx]);
  }),
];

// ── Handlers de Variantes ──────────────────────────────────────────────────────
const varianteHandlers = [
  http.get('/api/productos/:id/variantes', ({ params }) => {
    const variantesProducto = VARIANTES.filter((v) => v.productoId === Number(params.id));
    return HttpResponse.json(variantesProducto);
  }),

  http.post('/api/productos/:id/variantes', async ({ params, request }) => {
    const body = (await request.json()) as Omit<Variante, 'id' | 'productoId' | 'fechaCreacion'>;
    // Verificar SKU único en todo el sistema
    const skuExiste = VARIANTES.some((v) => v.sku === body.sku);
    if (skuExiste) {
      return HttpResponse.json({ message: `El SKU '${body.sku}' ya está en uso por otra variante.` }, { status: 409 });
    }
    const nueva: Variante = {
      ...body,
      id: nextVarianteId(),
      productoId: Number(params.id),
      estado: 'activo',
      fechaCreacion: new Date().toISOString(),
    };
    VARIANTES.push(nueva);
    return HttpResponse.json(nueva, { status: 201 });
  }),

  http.put('/api/variantes/:id', async ({ params, request }) => {
    const idx = VARIANTES.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Variante no encontrada.' }, { status: 404 });
    const body = (await request.json()) as Partial<Variante>;
    // El SKU NO se puede modificar (RN-INV-02)
    const { sku: _sku, ...resto } = body;
    VARIANTES[idx] = { ...VARIANTES[idx], ...resto };
    return HttpResponse.json(VARIANTES[idx]);
  }),

  http.delete('/api/variantes/:id', ({ params }) => {
    const idx = VARIANTES.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ message: 'Variante no encontrada.' }, { status: 404 });
    VARIANTES[idx] = { ...VARIANTES[idx], estado: 'inactivo' };
    return HttpResponse.json(VARIANTES[idx]);
  }),
];

export const catalogoHandlers = [
  ...categoriaHandlers,
  ...productoHandlers,
  ...varianteHandlers,
];
