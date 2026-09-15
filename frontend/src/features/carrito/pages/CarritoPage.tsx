import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarritoStore, selectSubtotal, selectTotalItems } from '../store/carritoStore';
import { EnvioGratisBar } from '../components/EnvioGratisBar';
import { CarritoItemList } from '../components/CarritoItemList';
import { CarritoResumen } from '../components/CarritoResumen';
import { Button } from '../../../components/ui/Button';

/**
 * Página de Carrito de Compras (SRP / SOLID / Bloque B).
 * Orquesta la barra de envío gratis, la lista de prendas y el resumen tributario.
 */
export function CarritoPage() {
  const navigate = useNavigate();
  const { items, cambiarCantidad, quitar, vaciar } = useCarritoStore();
  const subtotal = useCarritoStore(selectSubtotal);
  const totalItems = useCarritoStore(selectTotalItems);

  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const umbralEnvioGratis = 250;
  const faltaParaGratis = Math.max(0, umbralEnvioGratis - subtotal);
  const montoDescuento = subtotal * descuentoPorcentaje;
  const subtotalConDescuento = subtotal - montoDescuento;
  const igvCalculado = subtotalConDescuento * (18 / 118); // 18% incluido
  const subtotalNeto = subtotalConDescuento - igvCalculado;

  if (items.length === 0) {
    return (
      <>
        <div className="py-4" style={{ backgroundColor: 'var(--sm-ink)', color: '#fff' }}>
          <div className="container">
            <h1 className="sm-font-display mb-0" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700 }}>
              Tu Bolsa de Compras
            </h1>
          </div>
        </div>
        <div className="container py-5 text-center my-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 90, height: 90, backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--sm-primary)' }}
          >
            <i className="bi bi-bag-x fs-1" />
          </div>
          <h2 className="h4 fw-bold text-dark mb-2">Tu carrito está vacío</h2>
          <p className="text-muted small mb-4" style={{ maxWidth: 460, margin: '0 auto' }}>
            Aún no has agregado prendas a tu bolsa de compra. Explora nuestras colecciones masculinas y encuentra tu estilo ideal.
          </p>
          <Link
            to="/colecciones"
            className="btn btn-primary px-4 py-2 fw-semibold"
            style={{ borderRadius: 8 }}
          >
            <i className="bi bi-grid me-2" />
            Explorar Colecciones
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Encabezado */}
      <div className="py-4" style={{ backgroundColor: 'var(--sm-ink)', color: '#fff' }}>
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="sm-font-display mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700 }}>
              Bolsa de Compras
            </h1>
            <p className="small mb-0 text-white-50">
              Tienes <strong>{totalItems}</strong> prenda{totalItems !== 1 ? 's' : ''} seleccionada{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="text-white border-light border-opacity-25"
            icon={<i className="bi bi-trash" />}
            onClick={vaciar}
          >
            Vaciar Carrito
          </Button>
        </div>
      </div>

      <div className="container py-5">
        {/* Barra de progreso de envío gratis */}
        <EnvioGratisBar subtotal={subtotal} umbral={umbralEnvioGratis} />

        <div className="row g-4 align-items-start">
          {/* Lista de prendas */}
          <div className="col-12 col-lg-8">
            <CarritoItemList
              items={items}
              onCambiarCantidad={cambiarCantidad}
              onQuitar={quitar}
            />

            <div className="mt-3">
              <Link
                to="/colecciones"
                className="text-primary small fw-semibold text-decoration-none d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-arrow-left" />
                Continuar comprando prendas
              </Link>
            </div>
          </div>

          {/* Resumen del pedido y botón a checkout */}
          <div className="col-12 col-lg-4">
            <CarritoResumen
              subtotalNeto={subtotalNeto}
              igvCalculado={igvCalculado}
              descuentoPorcentaje={descuentoPorcentaje}
              montoDescuento={montoDescuento}
              subtotalConDescuento={subtotalConDescuento}
              faltaParaGratis={faltaParaGratis}
              onProcederCheckout={() => navigate('/carrito/checkout')}
              onAplicarCupon={setDescuentoPorcentaje}
            />
          </div>
        </div>
      </div>
    </>
  );
}
