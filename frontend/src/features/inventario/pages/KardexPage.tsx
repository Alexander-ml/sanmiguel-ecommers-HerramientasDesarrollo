import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { BREADCRUMB_INVENTARIO } from '../../../components/layout/breadcrumbsCons';
import { Pagination } from '../../../components/ui/Pagination';
import { KardexTable } from '../components/KardexTable';
import { KardexFilters } from '../components/KardexFilters';
import { AjusteStockForm } from '../components/AjusteStockForm';
import { Button } from '../../../components/ui/Button';
import { useMovimientos, useStock } from '../hooks/useInventario';

export function KardexPage() {
  const { varianteId } = useParams<{ varianteId: string }>();
  const varId = Number(varianteId);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [tipo, setTipo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [pagina, setPagina] = useState(1);

  // ── Datos ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useMovimientos({ varianteId: varId, tipo, fechaDesde, fechaHasta, page: pagina });

  // Stock de la variante (para mostrar contexto y botón de ajuste)
  const { data: stockData } = useStock({ page: 1 });
  const stockVariante = stockData?.datos.find((s) => s.varianteId === varId) ?? null;

  // ── Ajuste rápido ──────────────────────────────────────────────────────────
  const [mostrarAjuste, setMostrarAjuste] = useState(false);

  const breadcrumbs = [
    ...BREADCRUMB_INVENTARIO,
    {
      etiqueta: stockVariante
        ? `${stockVariante.productoNombre} (${stockVariante.talla}/${stockVariante.color})`
        : 'Variante',
      esDato: true,
    },
    { etiqueta: 'Kardex' },
  ];

  return (
    <div>
      <Breadcrumbs migas={breadcrumbs} />

      <PageHeader
        titulo="Kardex de Movimientos"
        descripcion={
          stockVariante
            ? `${stockVariante.productoNombre} · Talla: ${stockVariante.talla} / Color: ${stockVariante.color} · SKU: ${stockVariante.sku}`
            : 'Historial de movimientos de inventario'
        }
        accion={
          <Button
            variant="secondary"
            size="sm"
            icon={<i className="bi bi-pencil-square" />}
            onClick={() => setMostrarAjuste(true)}
          >
            Registrar ajuste
          </Button>
        }
      />

      {/* Panel de contexto de stock actual de la variante */}
      {stockVariante && (
        <div className="row g-3 mb-4">
          {/* 1. Stock Físico */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="p-3 rounded h-100"
              style={{
                background: 'var(--sm-surface)',
                border: '1px solid var(--sm-border)',
                borderRadius: 'var(--sm-radius-md)',
                boxShadow: 'var(--sm-shadow-sm)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold" style={{ fontSize: 'var(--sm-text-xs)' }}>
                  Stock físico en almacén
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 30, height: 30, background: 'var(--sm-bone)', color: 'var(--sm-ink)' }}
                >
                  <i className="bi bi-box-seam" style={{ fontSize: '0.9rem' }} />
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fw-bold text-dark" style={{ fontSize: '1.65rem', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {stockVariante.cantidadFisica}
                </span>
                <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>prendas</span>
              </div>
              <div className="mt-2 pt-2 border-top text-muted text-truncate" style={{ fontSize: '0.73rem' }}>
                Conteo total en estantería
              </div>
            </div>
          </div>

          {/* 2. Reservado */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="p-3 rounded h-100"
              style={{
                background: 'var(--sm-surface)',
                border: '1px solid var(--sm-border)',
                borderRadius: 'var(--sm-radius-md)',
                boxShadow: 'var(--sm-shadow-sm)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold" style={{ fontSize: 'var(--sm-text-xs)' }}>
                  Stock reservado
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 30, height: 30, background: 'var(--sm-bone)', color: 'var(--sm-ink-soft)' }}
                >
                  <i className="bi bi-lock-fill" style={{ fontSize: '0.9rem' }} />
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fw-bold" style={{ fontSize: '1.65rem', fontVariantNumeric: 'tabular-nums', color: 'var(--sm-ink-soft)', lineHeight: 1 }}>
                  {stockVariante.cantidadReservada}
                </span>
                <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>prendas</span>
              </div>
              <div className="mt-2 pt-2 border-top text-muted text-truncate" style={{ fontSize: '0.73rem' }}>
                Comprometidas en pedidos
              </div>
            </div>
          </div>

          {/* 3. Disponible para venta */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="p-3 rounded h-100"
              style={{
                background: 'var(--sm-surface)',
                border: `1px solid ${
                  stockVariante.cantidadDisponible === 0
                    ? 'rgba(239, 68, 68, 0.3)'
                    : stockVariante.estadoStock === 'bajo'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'var(--sm-border)'
                }`,
                borderRadius: 'var(--sm-radius-md)',
                boxShadow: 'var(--sm-shadow-sm)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold" style={{ fontSize: 'var(--sm-text-xs)' }}>
                  Disponible para venta
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 30,
                    height: 30,
                    background: stockVariante.cantidadDisponible === 0
                      ? 'rgba(239, 68, 68, 0.1)'
                      : stockVariante.estadoStock === 'bajo'
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'rgba(16, 185, 129, 0.1)',
                    color: stockVariante.cantidadDisponible === 0
                      ? 'var(--sm-danger)'
                      : stockVariante.estadoStock === 'bajo'
                      ? 'var(--sm-warning)'
                      : 'var(--sm-success)',
                  }}
                >
                  <i
                    className={`bi ${
                      stockVariante.cantidadDisponible === 0
                        ? 'bi-x-circle-fill'
                        : stockVariante.estadoStock === 'bajo'
                        ? 'bi-exclamation-triangle-fill'
                        : 'bi-check-circle-fill'
                    }`}
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span
                  className="fw-bold"
                  style={{
                    fontSize: '1.65rem',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    color: stockVariante.cantidadDisponible === 0
                      ? 'var(--sm-danger)'
                      : stockVariante.estadoStock === 'bajo'
                      ? 'var(--sm-warning)'
                      : 'var(--sm-success)',
                  }}
                >
                  {stockVariante.cantidadDisponible}
                </span>
                <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>prendas</span>
              </div>
              <div className="mt-2 pt-2 border-top text-truncate" style={{ fontSize: '0.73rem' }}>
                {stockVariante.cantidadDisponible === 0 ? (
                  <span className="text-danger fw-semibold">¡Agotado! Sin stock comercial</span>
                ) : stockVariante.estadoStock === 'bajo' ? (
                  <span className="text-warning fw-semibold">Stock bajo (alerta activa)</span>
                ) : (
                  <span className="text-success fw-semibold">Stock operativo normal</span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Umbral Mínimo */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="p-3 rounded h-100"
              style={{
                background: 'var(--sm-surface)',
                border: '1px solid var(--sm-border)',
                borderRadius: 'var(--sm-radius-md)',
                boxShadow: 'var(--sm-shadow-sm)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold" style={{ fontSize: 'var(--sm-text-xs)' }}>
                  Umbral mínimo configurado
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 30, height: 30, background: 'var(--sm-bone)', color: 'var(--sm-primary)' }}
                >
                  <i className="bi bi-bell-fill" style={{ fontSize: '0.9rem' }} />
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fw-bold text-dark" style={{ fontSize: '1.65rem', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {stockVariante.umbralMinimo}
                </span>
                <span className="text-muted" style={{ fontSize: 'var(--sm-text-xs)' }}>límite mín.</span>
              </div>
              <div className="mt-2 pt-2 border-top text-muted text-truncate" style={{ fontSize: '0.73rem' }}>
                Dispara alerta al caer a este nivel
              </div>
            </div>
          </div>
        </div>
      )}

      <KardexFilters
        tipo={tipo}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onTipoChange={(v) => { setTipo(v); setPagina(1); }}
        onFechaDesdeChange={(v) => { setFechaDesde(v); setPagina(1); }}
        onFechaHastaChange={(v) => { setFechaHasta(v); setPagina(1); }}
      />

      {isLoading && <LoadingState etiqueta="Cargando movimientos…" />}

      {isError && (
        <ErrorState
          mensaje="No se pudo cargar el historial de movimientos."
          onReintentar={refetch}
        />
      )}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-clock-history"
            titulo="Sin movimientos registrados"
            descripcion={
              tipo || fechaDesde || fechaHasta
                ? 'No hay movimientos con los filtros aplicados. Prueba con otros criterios.'
                : 'Esta variante aún no tiene movimientos de inventario.'
            }
          />
        ) : (
          <>
            <KardexTable movimientos={data.datos} />
            <Pagination
              paginaActual={pagina}
              totalPaginas={data.totalPaginas}
              totalItems={data.total}
              itemsPorPagina={15}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <AjusteStockForm
        show={mostrarAjuste}
        stockSeleccionado={stockVariante}
        onCerrar={() => setMostrarAjuste(false)}
      />
    </div>
  );
}
