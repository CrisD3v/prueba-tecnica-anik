/**
 * Hook personalizado para manejo de filtros de productos
 */

import { useState, useMemo } from 'react';
import { Product, ProductFilters, FilterState } from '../types';
import { filterAndSortProducts } from '../utils';
import { PRICE_RANGE, SORT_OPTIONS } from '../constants/filters';

interface UseProductFiltersProps {
  products: Product[];
}

interface UseProductFiltersReturn extends FilterState {
  updateSearchTerm: (term: string) => void;
  updatePriceRange: (range: [number, number]) => void;
  updateSortOrder: (isAscending: boolean) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook para gestionar filtros y búsqueda de productos
 * @param products - Array de productos a filtrar
 * @returns Estado y funciones para manejar filtros
 */
export const useProductFilters = ({ 
  products 
}: UseProductFiltersProps): UseProductFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>(PRICE_RANGE.DEFAULT);
  const [isAscending, setIsAscending] = useState(SORT_OPTIONS.ASCENDING);

  // Memoizar productos filtrados para optimizar rendimiento
  const filteredProducts = useMemo(() => {
    const filters: ProductFilters = {
      searchTerm,
      priceRange,
      isAscending,
    };
    
    return filterAndSortProducts(products, filters);
  }, [products, searchTerm, priceRange, isAscending]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== '' ||
      priceRange[0] !== PRICE_RANGE.MIN ||
      priceRange[1] !== PRICE_RANGE.MAX
    );
  }, [searchTerm, priceRange]);

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const updatePriceRange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const updateSortOrder = (ascending: boolean) => {
    setIsAscending(ascending);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange(PRICE_RANGE.DEFAULT);
  };

  return {
    searchTerm,
    priceRange,
    isAscending,
    filteredProducts,
    totalProducts: products.length,
    updateSearchTerm,
    updatePriceRange,
    updateSortOrder,
    clearFilters,
    hasActiveFilters,
  };
};