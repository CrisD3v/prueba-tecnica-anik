import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, productQueries } from '../lib/api';
import { useState, useMemo } from 'react';
import type { Product, ProductFilters, FilterState } from '../types';
import { filterAndSortProducts } from '../utils';
import { PRICE_RANGE, SORT_OPTIONS } from '../constants/filters';

// Hook para obtener productos (con fallback automático al mock)
export const useProducts = () => {
  return useQuery({
    queryKey: productQueries.lists(),
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo reintentar una vez antes de usar mock
  });
};

// Hook para crear productos
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Actualizar cache local si la API no está disponible
      queryClient.setQueryData(productQueries.lists(), (oldData: Product[] | undefined) => {
        if (!oldData) return [newProduct];
        return [...oldData, newProduct];
      });
      
      // También invalidar para refrescar desde la API si está disponible
      queryClient.invalidateQueries({ queryKey: productQueries.lists() });
    },
  });
};

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
  const [isAscending, setIsAscending] = useState<boolean>(SORT_OPTIONS.ASCENDING);

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