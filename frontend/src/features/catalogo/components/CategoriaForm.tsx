import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { categoriaSchema, type CategoriaFormValues } from '../schemas/categoria.schema';
import { useGuardarCategoria, useCategorias } from '../hooks/useCategorias';
import type { Categoria } from '../types';

interface CategoriaFormProps {
  show: boolean;
  categoriaEditar?: Categoria | null;
  onCerrar: () => void;
}

export function CategoriaForm({ show, categoriaEditar, onCerrar }: CategoriaFormProps) {
  const esEdicion = !!categoriaEditar;
  const { data: listaCategorias } = useCategorias({ activo: 'true' });
  const { mutate: guardar, isPending, error } = useGuardarCategoria();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nombre: '', descripcion: '', categoriaPadreId: null },
  });

  useEffect(() => {
    if (categoriaEditar) {
      reset({
        nombre: categoriaEditar.nombre,
        descripcion: categoriaEditar.descripcion,
        categoriaPadreId: categoriaEditar.categoriaPadreId,
      });
    } else {
      reset({ nombre: '', descripcion: '', categoriaPadreId: null });
    }
  }, [categoriaEditar, reset]);

  const onSubmit = (valores: CategoriaFormValues) => {
    guardar(
      { id: categoriaEditar?.id, valores },
      { onSuccess: () => { reset(); onCerrar(); } },
    );
  };

  const opcionesPadre = (listaCategorias?.datos ?? []).filter(
    (c) => !categoriaEditar || c.id !== categoriaEditar.id,
  );

  return (
    <Modal show={show} onHide={onCerrar} backdrop="static" centered>
      <Modal.Header closeButton className="bg-white border-bottom px-4 py-3">
        <Modal.Title as="h5" className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--sm-ink)' }}>
          <i className="bi bi-tag text-primary" />
          <span>{esEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</span>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--sm-bone, #f8fafc)' }}>
          {error && (
            <div className="alert alert-danger small mb-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2" />
              {error.message}
            </div>
          )}

          {/* ── Tarjeta de Llenado Interactivo (Fondo Blanco) ── */}
          <div
            className="card border mb-0 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--sm-border)',
              borderRadius: 'var(--sm-radius-md, 8px)',
            }}
          >
            <div className="card-header bg-white border-bottom py-2 px-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sm-primary)',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                <span className="fw-bold small" style={{ color: 'var(--sm-ink)' }}>
                  Datos de la Categoría
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Zona para llenar
              </span>
            </div>

            <div className="card-body p-3">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="cat-nombre" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                  Nombre de la Categoría <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="cat-nombre"
                  type="text"
                  placeholder="ej. Camisas Formales, Pantalones, etc."
                  className="bg-white border form-control-sm"
                  isInvalid={!!errors.nombre}
                  {...register('nombre')}
                />
                <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="cat-descripcion" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  id="cat-descripcion"
                  as="textarea"
                  rows={2}
                  placeholder="Descripción breve de la categoría (opcional)..."
                  className="bg-white border form-control-sm"
                  isInvalid={!!errors.descripcion}
                  {...register('descripcion')}
                />
                <Form.Control.Feedback type="invalid">{errors.descripcion?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="cat-padre" className="small fw-medium" style={{ color: 'var(--sm-ink)' }}>
                  Categoría Padre (Jerarquía)
                </Form.Label>
                <Form.Select
                  id="cat-padre"
                  className="bg-white border form-select-sm"
                  onChange={(e) => setValue('categoriaPadreId', e.target.value ? Number(e.target.value) : null)}
                  defaultValue={categoriaEditar?.categoriaPadreId ?? ''}
                >
                  <option value="">Sin categoría padre (categoría raíz principal)</option>
                  {opcionesPadre.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top px-4 py-3">
          <Button variant="secondary" onClick={onCerrar} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isPending}
            loadingText="Guardando…"
            icon={<i className="bi bi-check2-circle" />}
          >
            {esEdicion ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
