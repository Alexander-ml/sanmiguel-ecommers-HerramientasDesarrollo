import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useVariantesRapidas } from '../hooks/useTiendaCatalogo';
import { useCarritoStore } from '../../carrito/store/carritoStore';
import { formatearMoneda } from '../../../lib/format';
import { Button } from '../../../components/ui/Button';
import type { Producto, Variante } from '../../catalogo/types';

interface ModalSeleccionRapidaProps {
  producto: Producto | null;
  onCerrar: () => void;
}

/**
 * Modal emergente para selección rápida de talla, color y agregado al carrito
 * sin abandonar la cuadrícula de productos (Design System §3).
 */
export function ModalSeleccionRapida({ producto, onCerrar }: ModalSeleccionRapidaProps) {
  const navigate = useNavigate();
  const { agregar } = useCarritoStore();

  const [tallaSelec, setTallaSelec] = useState<string | null>(null);
  const [colorSelec, setColorSelec] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregadoExito, setAgregadoExito] = useState(false);

  const { data: variantesData, isLoading } = useVariantesRapidas(producto?.id ?? null);

  const rawActivas = (variantesData ?? []).filter((v) => v.estado === 'activo');
  const variantesActivas: Variante[] =
    rawActivas.length > 0
      ? rawActivas
      : producto
      ? [
          {
            id: -(producto.id),
            productoId: producto.id,
            talla: 'Estándar',
            color: 'Único',
            sku: `SKU-${producto.id}`,
            precioEspecifico: producto.precioBase,
            estado: 'activo' as const,
            fechaCreacion: new Date().toISOString(),
          },
        ]
      : [];

  const tallas = [...new Set(variantesActivas.map((v) => v.talla))];

  useEffect(() => {
    if (variantesActivas.length > 0) {
      setTallaSelec(variantesActivas[0].talla);
      setColorSelec(variantesActivas[0].color);
      setCantidad(1);
      setAgregadoExito(false);
    }
  }, [variantesData, producto]);

  if (!producto) return null;

  const coloresDisponibles = variantesActivas.filter((v) => !tallaSelec || v.talla === tallaSelec);
  const coloresUnicos = [...new Set(coloresDisponibles.map((v) => v.color))];

  const varianteActual =
    variantesActivas.find((v) => v.talla === tallaSelec && v.color === colorSelec) ??
    variantesActivas.find((v) => v.talla === tallaSelec) ??
    variantesActivas[0];

  const precioMostrar = varianteActual?.precioEspecifico ?? producto.precioBase;

  const handleAgregar = () => {
    if (!varianteActual) return;
    agregar(
      {
        varianteId: varianteActual.id,
        productoId: producto.id,
        productoNombre: producto.nombre,
        marca: producto.marca,
        talla: varianteActual.talla,
        color: varianteActual.color,
        sku: varianteActual.sku,
        imagenUrl: producto.imagenes?.[0] ?? null,
        precioUnitario: precioMostrar,
      },
      cantidad,
    );
    setAgregadoExito(true);
  };

  return (
    <Modal show={!!producto} onHide={onCerrar} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h5 fw-bold text-dark">
          {agregadoExito ? '¡Prenda Agregada a tu Carrito!' : 'Selecciona Talla y Color'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-3">
        {/* Ficha rápida de la prenda */}
        <div className="d-flex gap-3 align-items-center mb-3 p-2 rounded bg-light border">
          <div
            className="rounded overflow-hidden flex-shrink-0"
            style={{ width: 68, height: 68, background: '#e2e8f0' }}
          >
            {producto.imagenes?.[0] && (
              <img src={producto.imagenes[0]} alt={producto.nombre} className="w-100 h-100 object-fit-cover" />
            )}
          </div>
          <div className="flex-grow-1 min-w-0">
            <span className="text-muted small fw-semibold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
              {producto.marca}
            </span>
            <h4 className="h6 fw-bold mb-1 text-truncate text-dark">{producto.nombre}</h4>
            <span className="fw-bold text-primary fs-5" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatearMoneda(precioMostrar)}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm" role="status" />
            <span className="ms-2 small text-muted">Cargando opciones disponibles…</span>
          </div>
        ) : agregadoExito ? (
          <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 text-center mb-2">
            <i className="bi bi-bag-check-fill text-success fs-3 d-block mb-1" />
            <p className="fw-semibold text-success small mb-1">
              Agregaste {cantidad}x {producto.nombre} (Talla: {tallaSelec}, Color: {colorSelec})
            </p>
            <p className="text-muted small mb-0">Subtotal: {formatearMoneda(precioMostrar * cantidad)}</p>
          </div>
        ) : (
          <>
            {/* Tallas */}
            {tallas.length > 0 && (
              <div className="mb-3">
                <label className="fw-semibold small text-dark d-block mb-2">
                  Talla: <strong className="text-primary">{tallaSelec}</strong>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {tallas.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`btn btn-sm px-3 py-1 ${
                        tallaSelec === t ? 'btn-primary text-white' : 'btn-outline-secondary'
                      }`}
                      style={{ borderRadius: 6 }}
                      onClick={() => {
                        setTallaSelec(t);
                        const coloresParaT = variantesActivas.filter((v) => v.talla === t).map((v) => v.color);
                        if (colorSelec && !coloresParaT.includes(colorSelec)) {
                          setColorSelec(coloresParaT[0] ?? null);
                        }
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {coloresUnicos.length > 0 && (
              <div className="mb-3">
                <label className="fw-semibold small text-dark d-block mb-2">
                  Color: <strong className="text-primary">{colorSelec}</strong>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {coloresUnicos.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`btn btn-sm px-3 py-1 ${
                        colorSelec === c ? 'btn-dark text-white' : 'btn-outline-secondary'
                      }`}
                      style={{ borderRadius: 6 }}
                      onClick={() => setColorSelec(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="d-flex align-items-center gap-3 mb-2">
              <label className="fw-semibold small text-dark mb-0">Cantidad:</label>
              <div className="d-flex align-items-center border rounded-3 p-1">
                <button
                  className="btn btn-sm btn-link text-dark p-0 px-2"
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  aria-label="Reducir cantidad"
                >
                  <i className="bi bi-dash" />
                </button>
                <span className="px-2 fw-bold small" style={{ minWidth: 20, textAlign: 'center' }}>
                  {cantidad}
                </span>
                <button
                  className="btn btn-sm btn-link text-dark p-0 px-2"
                  type="button"
                  onClick={() => setCantidad(cantidad + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <i className="bi bi-plus" />
                </button>
              </div>
              {varianteActual && (
                <span className="text-muted small ms-auto">
                  SKU: <code>{varianteActual.sku}</code>
                </span>
              )}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex gap-2">
        {agregadoExito ? (
          <>
            <Button variant="secondary" size="sm" className="flex-grow-1" onClick={onCerrar}>
              Seguir Explorando
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-grow-1"
              icon={<i className="bi bi-bag-check" />}
              onClick={() => {
                onCerrar();
                navigate('/carrito');
              }}
            >
              Ver Carrito y Pagar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-grow-1"
              icon={<i className="bi bi-bag-plus-fill" />}
              onClick={handleAgregar}
              disabled={isLoading || !varianteActual}
            >
              Confirmar y Agregar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
