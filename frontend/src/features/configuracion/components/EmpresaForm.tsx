import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import { Button } from '../../../components/ui/Button';
import { empresaSchema, type EmpresaFormValues } from '../schemas/configuracion.schema';
import { useActualizarEmpresa } from '../hooks/useConfiguracion';
import type { EmpresaConfig } from '../types';

interface EmpresaFormProps {
  datos: EmpresaConfig;
}

export function EmpresaForm({ datos }: EmpresaFormProps) {
  const { mutate: actualizar, isPending, isSuccess } = useActualizarEmpresa();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: datos,
  });

  useEffect(() => {
    reset(datos);
  }, [datos, reset]);

  const onSubmit = (valores: EmpresaFormValues) => {
    actualizar(valores);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSuccess && (
        <div className="alert alert-success small mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle fs-5" />
          <span>Datos de la empresa actualizados exitosamente. Los cambios se reflejarán de inmediato en comprobantes y tienda.</span>
        </div>
      )}

      {/* ── Sección 1: Identificación y Marca ────────────────────────────── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div
          className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom"
          style={{ borderColor: 'var(--sm-border)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
            >
              1
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Identificación y Marca
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Datos fiscales del emisor y nombres comerciales visibles en comprobantes y tienda en línea
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
            <div className="col-md-4">
              <Form.Label htmlFor="emp-ruc" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                RUC de la Empresa <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-ruc"
                className="bg-white border"
                placeholder="20608912341"
                isInvalid={!!errors.ruc}
                {...register('ruc')}
              />
              <Form.Control.Feedback type="invalid">{errors.ruc?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-8">
              <Form.Label htmlFor="emp-rz" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Razón Social <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-rz"
                className="bg-white border"
                placeholder="CONFECCIONES SAN MIGUEL S.A.C."
                isInvalid={!!errors.razonSocial}
                {...register('razonSocial')}
              />
              <Form.Control.Feedback type="invalid">{errors.razonSocial?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="emp-nc" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Nombre Comercial <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-nc"
                className="bg-white border"
                placeholder="SAN MIGUEL Ropa Urbana"
                isInvalid={!!errors.nombreComercial}
                {...register('nombreComercial')}
              />
              <Form.Control.Feedback type="invalid">{errors.nombreComercial?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="emp-lema" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Lema o Frase Institucional
              </Form.Label>
              <Form.Control
                id="emp-lema"
                className="bg-white border"
                placeholder="ej. Prendas urbanas de alta durabilidad"
                isInvalid={!!errors.lema}
                {...register('lema')}
              />
              <Form.Control.Feedback type="invalid">{errors.lema?.message}</Form.Control.Feedback>
            </div>

            <div className="col-12">
              <Form.Label htmlFor="emp-logo" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Ruta o URL del Logotipo
              </Form.Label>
              <Form.Control
                id="emp-logo"
                className="bg-white border"
                placeholder="/logo.png"
                isInvalid={!!errors.logoUrl}
                {...register('logoUrl')}
              />
              <Form.Control.Feedback type="invalid">{errors.logoUrl?.message}</Form.Control.Feedback>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección 2: Domicilio Fiscal ─────────────────────────────────── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div
          className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom"
          style={{ borderColor: 'var(--sm-border)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
            >
              2
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Domicilio Fiscal
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Dirección oficial declarada ante la administración tributaria (SUNAT)
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
            <div className="col-md-12">
              <Form.Label htmlFor="emp-dir" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Dirección Fiscal Completa <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-dir"
                className="bg-white border"
                placeholder="Jr. Gamarra 1045, Piso 2, Int. 204"
                isInvalid={!!errors.direccionFiscal}
                {...register('direccionFiscal')}
              />
              <Form.Control.Feedback type="invalid">{errors.direccionFiscal?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="emp-dep" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Departamento <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-dep"
                className="bg-white border"
                isInvalid={!!errors.departamento}
                {...register('departamento')}
              />
              <Form.Control.Feedback type="invalid">{errors.departamento?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="emp-prov" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Provincia <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-prov"
                className="bg-white border"
                isInvalid={!!errors.provincia}
                {...register('provincia')}
              />
              <Form.Control.Feedback type="invalid">{errors.provincia?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-4">
              <Form.Label htmlFor="emp-dist" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Distrito <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-dist"
                className="bg-white border"
                isInvalid={!!errors.distrito}
                {...register('distrito')}
              />
              <Form.Control.Feedback type="invalid">{errors.distrito?.message}</Form.Control.Feedback>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección 3: Canales de Contacto Oficiales ─────────────────────── */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--sm-border)',
          borderRadius: 'var(--sm-radius-md, 8px)',
        }}
      >
        <div
          className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom"
          style={{ borderColor: 'var(--sm-border)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
            >
              3
            </span>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: 'var(--sm-ink)' }}>
                Canales de Contacto Oficiales
              </h6>
              <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>
                Teléfono y correo electrónico para atención a clientes, proveedores y auditorías
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
            <div className="col-md-6">
              <Form.Label htmlFor="emp-tel" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Teléfono / Celular de Contacto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-tel"
                className="bg-white border"
                placeholder="987654321"
                isInvalid={!!errors.telefono}
                {...register('telefono')}
              />
              <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
            </div>

            <div className="col-md-6">
              <Form.Label htmlFor="emp-mail" className="fw-medium small" style={{ color: 'var(--sm-ink)' }}>
                Correo Institucional <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="emp-mail"
                type="email"
                className="bg-white border"
                placeholder="contacto@sanmiguel.pe"
                isInvalid={!!errors.correo}
                {...register('correo')}
              />
              <Form.Control.Feedback type="invalid">{errors.correo?.message}</Form.Control.Feedback>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          isLoading={isPending}
          loadingText="Guardando cambios…"
          icon={<i className="bi bi-save" />}
        >
          Guardar datos fiscales
        </Button>
      </div>
    </Form>
  );
}
