/**
 * Utilidades para manejo de productos
 */

import { Product, ProductFilters } from '../types';
import { normalizeText } from './textUtils';

/**
 * Filtra productos basado en criterios de búsqueda y precio
 * @param products - Array de productos
 * @param filters - Filtros a aplicar
 * @returns Array de productos filtrados
 */
export const filterProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  const { searchTerm, priceRange } = filters;

  return products.filter((product) => {
    const normalizedProductName = normalizeText(product.name);
    const normalizedSearchTerm = normalizeText(searchTerm);

    const matchesSearch = normalizedProductName.includes(normalizedSearchTerm);
    const matchesPrice = 
      product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesPrice;
  });
};

/**
 * Ordena productos por precio
 * @param products - Array de productos
 * @param isAscending - Si el orden es ascendente
 * @returns Array de productos ordenados
 */
export const sortProductsByPrice = (
  products: Product[],
  isAscending: boolean
): Product[] => {
  return [...products].sort((a, b) => {
    return isAscending ? a.price - b.price : b.price - a.price;
  });
};

/**
 * Filtra y ordena productos en una sola operación
 * @param products - Array de productos
 * @param filters - Filtros a aplicar
 * @returns Array de productos filtrados y ordenados
 */
export const filterAndSortProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  const filtered = filterProducts(products, filters);
  return sortProductsByPrice(filtered, filters.isAscending);
};