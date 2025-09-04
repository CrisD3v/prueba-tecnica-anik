/**
 * ProductCatalogPage - Página principal del catálogo de productos
 * Maneja la lógica de estado y conecta con el template
 */

import React from 'react';
import { Product } from '../../types';
import { useProductFilters } from '../../hooks';
import { ProductCatalogTemplate } from '../../components/templates';

interface ProductCatalogPageProps {
  /** Array de productos */
  products: Product[];
  /** Título de la página */
  title?: string;
}

/**
 * Página del catálogo de productos con lógica de filtros
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  products,
  title = 'Prueba Tecnica ANI-K',
}) => {
  // Hook personalizado para manejo de filtros
  const {
    searchTerm,
    priceRange,
    isAscending,
    filteredProducts,
    totalProducts,
    hasActiveFilters,
    updateSearchTerm,
    updatePriceRange,
    updateSortOrder,
    clearFilters,
  } = useProductFilters({ products });

  /**
   * Maneja la acción de agregar producto al carrito
   * @param product - Producto a agregar
   */
  const handleAddToCart = (product: Product) => {
    // TODO: Implementar lógica de carrito
    console.log('Agregando al carrito:', product);
  };

  return (
    <ProductCatalogTemplate
      title={title}
      searchValue={searchTerm}
      priceRange={priceRange}
      isAscending={isAscending}
      products={filteredProducts}
      totalProducts={totalProducts}
      hasActiveFilters={hasActiveFilters}
      onSearchChange={updateSearchTerm}
      onPriceRangeChange={updatePriceRange}
      onSortOrderChange={updateSortOrder}
      onClearFilters={clearFilters}
      onAddToCart={handleAddToCart}
    />
  );
};