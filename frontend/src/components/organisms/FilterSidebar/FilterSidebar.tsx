/**
 * FilterSidebar - Componente organism para barra lateral de filtros
 * Combina múltiples molecules para crear una sección completa de filtros
 */

import React, { useMemo } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/button';
import { 
  PriceRangeFilter, 
  SortToggle, 
  FilterStats 
} from '../../molecules';
import type { Product } from '../../../types';

interface FilterSidebarProps {
  /** Rango de precios actual */
  priceRange: [number, number];
  /** Si el orden es ascendente */
  isAscending: boolean;
  /** Número de productos filtrados */
  filteredCount: number;
  /** Número total de productos */
  totalCount: number;
  /** Término de búsqueda actual */
  searchTerm: string;
  /** Si hay filtros activos */
  hasActiveFilters: boolean;
  /** Array de productos para calcular rango dinámico */
  products: Product[];
  /** Función para actualizar rango de precios */
  onPriceRangeChange: (range: [number, number]) => void;
  /** Función para cambiar orden */
  onSortOrderChange: (isAscending: boolean) => void;
  /** Función para limpiar filtros */
  onClearFilters: () => void;
}

/**
 * Barra lateral con todos los controles de filtros
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  priceRange,
  isAscending,
  filteredCount,
  totalCount,
  searchTerm,
  hasActiveFilters,
  products,
  onPriceRangeChange,
  onSortOrderChange,
  onClearFilters,
}) => {
  // Calcular rango dinámico de precios basado en los productos disponibles
  const dynamicPriceRange = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 100 }; // Valores por defecto si no hay productos
    }
    
    const prices = products.map(product => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Agregar un pequeño margen para mejor UX
    const margin = (maxPrice - minPrice) * 0.05; // 5% de margen
    
    return {
      min: Math.max(0, Math.floor(minPrice - margin)),
      max: Math.ceil(maxPrice + margin)
    };
  }, [products]);

  return (
    <div className="col-span-2 p-4 border-r bg-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <AdjustmentsHorizontalIcon className="w-6 h-6" />
        Filtros
      </h2>
      
      <div className="space-y-6">
        {/* Filtro por rango de precio */}
        <PriceRangeFilter
          value={priceRange}
          onChange={onPriceRangeChange}
          min={dynamicPriceRange.min}
          max={dynamicPriceRange.max}
        />

        {/* Toggle para orden */}
        <SortToggle
          isAscending={isAscending}
          onChange={onSortOrderChange}
        />

        {/* Estadísticas de filtros */}
        <FilterStats
          filteredCount={filteredCount}
          totalCount={totalCount}
          searchTerm={searchTerm}
        />

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onClearFilters}
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};