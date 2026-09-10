import { useState } from 'react';

interface GaleriaProductoProps {
  imagenes: string[];
  nombre: string;
}

/**
 * Galería de imágenes del producto con zoom y miniaturas interactivas.
 */
export function GaleriaProducto({ imagenes, nombre }: GaleriaProductoProps) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const lista = imagenes && imagenes.length > 0 ? imagenes : [];

  return (
    <div className="d-flex flex-column gap-3">
      {/* Imagen Principal */}
      <div
        className="rounded-4 overflow-hidden border shadow-sm d-flex align-items-center justify-content-center"
        style={{
          background: 'var(--sm-bone)',
          aspectRatio: '4/4',
          maxHeight: 520,
        }}
      >
        {lista[imagenActiva] ? (
          <img
            src={lista[imagenActiva]}
            alt={nombre}
            className="w-100 h-100 object-fit-cover"
          />
        ) : (
          <i className="bi bi-image text-muted" style={{ fontSize: '4rem', opacity: 0.3 }} />
        )}
      </div>

      {/* Miniaturas */}
      {lista.length > 1 && (
        <div className="d-flex gap-2 overflow-x-auto pb-1">
          {lista.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`btn p-0 rounded-3 overflow-hidden border-2 flex-shrink-0 ${
                imagenActiva === idx ? 'border-primary shadow-sm' : 'border-light opacity-75'
              }`}
              style={{ width: 68, height: 68 }}
              onClick={() => setImagenActiva(idx)}
              aria-label={`Ver foto ${idx + 1}`}
            >
              <img src={img} alt={`Vista ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
