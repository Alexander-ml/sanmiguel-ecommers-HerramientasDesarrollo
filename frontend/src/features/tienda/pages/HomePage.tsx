import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarritoStore, selectTotalItems } from '../../carrito/store/carritoStore';
import { HeroSection } from '../components/HeroSection';
import { NovedadesSection } from '../components/NovedadesSection';
import { CategoriasDestacadasSection } from '../components/CategoriasDestacadasSection';
import { BeneficiosSection } from '../components/BeneficiosSection';
import { ModalSeleccionRapida } from '../components/ModalSeleccionRapida';
import type { Producto } from '../../catalogo/types';

function CarritoFlotante() {
  const total = useCarritoStore(selectTotalItems);
  if (total === 0) return null;

  return (
    <Link
      to="/carrito"
      className="btn btn-lg d-flex align-items-center gap-2 shadow-lg"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: 'var(--sm-primary)',
        borderColor: 'var(--sm-primary)',
        color: '#ffffff',
        borderRadius: 50,
        zIndex: 1030,
        padding: '0.75rem 1.5rem',
      }}
      aria-label={`Ver carrito con ${total} prendas`}
    >
      <i className="bi bi-bag-check-fill fs-5" />
      <span className="fw-semibold">{total} en carrito</span>
    </Link>
  );
}

/**
 * Portada Principal de la Tienda San Miguel (SRP / SOLID / Bloque A).
 * Orquesta Hero de marca, Novedades prioritarias con productos reales,
 * Categorías secundarias y Beneficios de confianza.
 */
export function HomePage() {
  const [productoRapido, setProductoRapido] = useState<Producto | null>(null);

  return (
    <>
      <HeroSection />

      {/* Novedades prioritarias con productos reales de confección 2026 */}
      <NovedadesSection onComprarRapido={(prod) => setProductoRapido(prod)} />

      {/* Exploración secundaria por tipo de prenda */}
      <CategoriasDestacadasSection />

      {/* Pilares de confianza y compra segura */}
      <BeneficiosSection />

      {/* Modal para agregar al carrito sin abandonar la página */}
      <ModalSeleccionRapida
        producto={productoRapido}
        onCerrar={() => setProductoRapido(null)}
      />

      <CarritoFlotante />
    </>
  );
}
