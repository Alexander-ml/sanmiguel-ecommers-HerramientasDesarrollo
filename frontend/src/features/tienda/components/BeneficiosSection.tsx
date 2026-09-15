/**
 * Sección de Beneficios y Confianza Comercial (Design System §3).
 */
export function BeneficiosSection() {
  const beneficios = [
    {
      icono: 'bi-truck',
      titulo: 'Envíos a todo el Perú',
      descripcion: 'Despachos seguros y rápidos a nivel nacional vía Olva Courier y Shalom.',
    },
    {
      icono: 'bi-shield-check',
      titulo: 'Garantía de Confección',
      descripcion: 'Telas de primera calidad: 100% Algodón Pima, lino puro y acabados reforzados.',
    },
    {
      icono: 'bi-receipt',
      titulo: 'Comprobantes SUNAT',
      descripcion: 'Emitimos Boleta o Factura electrónica en todas tus compras formalmente.',
    },
    {
      icono: 'bi-whatsapp',
      titulo: 'Asesoría Personalizada',
      descripcion: 'Atención directa por WhatsApp para dudas sobre tallas, telas y entalles.',
    },
  ];

  return (
    <section className="py-5 bg-white border-top border-bottom">
      <div className="container py-2">
        <div className="row g-4">
          {beneficios.map((b) => (
            <div key={b.titulo} className="col-12 col-sm-6 col-lg-3">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    color: 'var(--sm-primary)',
                  }}
                >
                  <i className={`bi ${b.icono} fs-4`} />
                </div>
                <div>
                  <h4 className="h6 fw-bold mb-1 text-dark">{b.titulo}</h4>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.4 }}>
                    {b.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
