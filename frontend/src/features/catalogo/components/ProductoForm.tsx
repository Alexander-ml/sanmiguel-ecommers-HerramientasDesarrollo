import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { productoSchema, type ProductoFormValues } from '../schemas/producto.schema';
import { useGuardarProducto } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import type { Producto } from '../types';

interface ProductoFormProps {
  productoEditar?: Producto | null;
  onGuardado: (p: Producto) => void;
  onCancelar: () => void;
}

export function ProductoForm({ productoEditar, onGuardado, onCancelar }: ProductoFormProps) {
  const esEdicion = !!productoEditar;
  const { data: categoriasData } = useCategorias({ activo: 'true' });
  const { mutate: guardar, isPending, error } = useGuardarProducto();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      categoriaId: undefined,
      marca: '',
      precioBase: undefined,
      imagenes: [],
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: 'imagenes' as never,
  });

  useEffect(() => {
    if (productoEditar) {
      reset({
        nombre: productoEditar.nombre,
        descripcion: productoEditar.descripcion,
        categoriaId: productoEditar.categoriaId,
        marca: productoEditar.marca,
        precioBase: productoEditar.precioBase,
        imagenes: productoEditar.imagenes,
      });
    } else {
      reset({ nombre: '', descripcion: '', categoriaId: undefined, marca: '', precioBase: undefined, imagenes: [] });
    }
  }, [productoEditar, reset]);

  const onSubmit = (valores: ProductoFormValues) => {
    guardar(
      { id: productoEditar?.id, valores },
      { onSuccess: (p) => onGuardado(p) },
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* ── Banner de contexto cuando se edita un producto existente ── */}
      {esEdicion && productoEditar && (
        <div
          className="p-3 mb-4 rounded d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{
            backgroundColor: 'var(--sm-bone, #f8fafc)',
            border: '1px solid var(--sm-border, #e2e8f0)',
            borderRadius: 'var(--sm-radius-md, 8px)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 38,
                height: 38,
                backgroundColor: 'var(--sm-primary-subtle, #dbeafe)',
                color: 'var(--sm-primary, #2563eb)',
                fontSize: '1.2rem',
              }}
            >
              <i className="bi bi-box-seam" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="fw-bold" style={{ color: 'var(--sm-ink)' }}>
                  {productoEditar.nombre}
                </span>
                <span className="badge bg-secondary-subtle text-secondary border small">
                  ID #{productoEditar.id}
                </span>
              </div>
              <div className="text-muted small mt-1">
                {productoEditar.marca} · Categoría: <strong>{productoEditar.categoriaNombre}</strong> · Las tarjetas con fondo blanco son editables.
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger small mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2" />
          {error.message}
        </div>
      )}

      {/* ── Tarjeta 1: Información General (Fondo Blanco) ── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary)',
                fontSize: '0.75rem',
              }}
            >
              1
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Información General del Producto
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Datos identificatorios del producto en el catálogo y tienda oficial
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12">
              <Form.Label htmlFor="prod-nombre" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Nombre del Producto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="prod-nombre"
                type="text"
                className="bg-white border"
                placeholder="ej. Camisa Oxford Slim Fit Celeste"
                isInvalid={!!errors.nombre}
                {...register('nombre')}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="prod-marca" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Marca <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="prod-marca"
                type="text"
                className="bg-white border"
                placeholder="ej. Pierre Cardin, Arrow, etc."
                isInvalid={!!errors.marca}
                {...register('marca')}
              />
              <Form.Control.Feedback type="invalid">{errors.marca?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="prod-categoria" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Categoría <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                id="prod-categoria"
                className="bg-white border"
                isInvalid={!!errors.categoriaId}
                {...register('categoriaId', { valueAsNumber: true })}
              >
                <option value="">Selecciona una categoría…</option>
                {(categoriasData?.datos ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.categoriaId?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="prod-desc" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Descripción Detallada
              </Form.Label>
              <Form.Control
                id="prod-desc"
                as="textarea"
                rows={3}
                className="bg-white border"
                placeholder="Composición de tela, estilo, cuidados de lavado..."
                isInvalid={!!errors.descripcion}
                {...register('descripcion')}
              />
              <Form.Control.Feedback type="invalid">{errors.descripcion?.message}</Form.Control.Feedback>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tarjeta 2: Precios (Fondo Blanco) ── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary)',
                fontSize: '0.75rem',
              }}
            >
              2
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Política de Precios de Venta
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Precio base sugerido al público (las variantes pueden tener precio específico)
              </span>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
            <i className="bi bi-pencil-square me-1" />
            Zona para llenar
          </span>
        </div>

        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <Form.Label htmlFor="prod-precio" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Precio Base al Público (S/) <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light fw-bold text-muted">S/</span>
                <Form.Control
                  id="prod-precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="bg-white border text-end fw-bold"
                  isInvalid={!!errors.precioBase}
                  {...register('precioBase', { valueAsNumber: true })}
                />
                <Form.Control.Feedback type="invalid">{errors.precioBase?.message}</Form.Control.Feedback>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div
                className="p-2 rounded small text-muted"
                style={{
                  backgroundColor: 'var(--sm-bone, #f8fafc)',
                  border: '1px solid var(--sm-border, #e2e8f0)',
                }}
              >
                <i className="bi bi-info-circle text-primary me-1" />
                Este precio servirá por defecto para todas las tallas y colores creados posteriormente en Variantes.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tarjeta 3: Galería de Imágenes (Fondo Blanco) ── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary)',
                fontSize: '0.75rem',
              }}
            >
              3
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Galería de Imágenes del Producto
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                URLs directas a fotos de la prenda que se visualizarán en catálogo y tienda
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => addImage('')}
            icon={<i className="bi bi-plus-lg me-1" />}
          >
            Añadir imagen
          </Button>
        </div>

        <div className="card-body p-4">
          {imageFields.length === 0 ? (
            <div
              className="text-center py-3 border rounded text-muted small"
              style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}
            >
              <i className="bi bi-card-image fs-4 d-block mb-1 text-muted opacity-50" />
              Sin imágenes añadidas. Puedes presionar <strong>"Añadir imagen"</strong> para ingresar URLs de fotos.
            </div>
          ) : (
            imageFields.map((field, idx) => (
              <div key={field.id} className="input-group mb-2">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-image" />
                </span>
                <Form.Control
                  type="url"
                  className="bg-white border"
                  placeholder="https://ejemplo.com/fotos/prenda-1.jpg"
                  {...register(`imagenes.${idx}` as const)}
                />
                <Button variant="ghost" size="sm" className="text-danger border" onClick={() => removeImage(idx)} title="Eliminar URL">
                  <i className="bi bi-trash" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Acciones Finales ── */}
      <div className="d-flex gap-2 justify-content-end pt-3">
        <Button variant="secondary" type="button" onClick={onCancelar} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          loadingText="Guardando prenda…"
          icon={<i className="bi bi-check2-circle" />}
        >
          {esEdicion ? 'Guardar cambios del producto' : 'Registrar producto'}
        </Button>
      </div>
    </Form>
  );
}
