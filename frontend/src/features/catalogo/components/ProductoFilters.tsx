import type { ReactNode } from 'react';
import { FiltersBar, type FiltroSelect } from '../../../components/ui/FiltersBar';
import type { Categoria } from '../types';

interface ProductoFiltersProps {
  busqueda: string;
  categoriaId: string;
  estado: string;
  categorias: Categoria[];
  onBusquedaChange: (v: string) => void;
  onCategoriaChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
  acciones?: ReactNode;
}

export function ProductoFilters({
  busqueda,
  categoriaId,
  estado,
  categorias,
  onBusquedaChange,
  onCategoriaChange,
  onEstadoChange,
  acciones,
}: ProductoFiltersProps) {
  const filtros: FiltroSelect[] = [
    {
      nombre: 'Todas las categorías',
      etiqueta: 'Categoría de producto',
      opciones: categorias.map((c) => ({ valor: String(c.id), etiqueta: c.nombre })),
      valor: categoriaId,
      onChange: onCategoriaChange,
    },
    {
      nombre: 'Todos los estados',
      etiqueta: 'Estado operativo',
      opciones: [
        { valor: 'activo', etiqueta: 'Activo' },
        { valor: 'inactivo', etiqueta: 'Inactivo' },
      ],
      valor: estado,
      onChange: onEstadoChange,
    },
  ];

  return (
    <FiltersBar
      etiquetaBusqueda="Buscar prenda (nombre o marca)"
      busqueda={busqueda}
      placeholderBusqueda="ej. Camisa Oxford, Jean Clásico…"
      onBusquedaChange={onBusquedaChange}
      filtros={filtros}
      acciones={acciones}
    />
  );
}
