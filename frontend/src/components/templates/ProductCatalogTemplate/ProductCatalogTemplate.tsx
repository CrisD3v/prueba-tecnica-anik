/**
 * ProductCatalogTemplate - Template para el catálogo de productos
 * Define la estructura de layout con header, sidebar y contenido principal
 */

import React from 'react';
import type { Product } from '../../../types';
import { Header, FilterSidebar, ProductGrid } from '../../organisms';

interface ProductCatalogTemplateProps {
  /** Título de la aplicación */
  title?: string;
  /** Valor del término de búsqueda */
  searchValue: string;
  /** Rango de precios actual */
  priceRange: [number, number];
  /** Si el orden es ascendente */
  isAscending: boolean;
  /** Productos filtrados */
  products: Product[];
  /** Número total de productos */
  totalProducts: number;
  /** Si hay filtros activos */
  hasActiveFilters: boolean;
  /** Array de todos los productos (sin filtrar) para calcular rango dinámico */
  allProducts: Product[];
  /** Función para actualizar término de búsqueda */
  onSearchChange: (value: string) => void;
  /** Función para actualizar rango de precios */
  onPriceRangeChange: (range: [number, number]) => void;
  /** Función para cambiar orden */
  onSortOrderChange: (isAscending: boolean) => void;
  /** Función para limpiar filtros */
  onClearFilters: () => void;
  /** Función para agregar al carrito */
  onAddToCart?: (product: Product) => void;
}

/**
 * Template principal del catálogo de productos
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const ProductCatalogTemplate: React.FC<ProductCatalogTemplateProps> = ({
  title,
  searchValue,
  priceRange,
  isAscending,
  products,
  totalProducts,
  hasActiveFilters,
  allProducts,
  onSearchChange,
  onPriceRangeChange,
  onSortOrderChange,
  onClearFilters,
  onAddToCart,
}) => {
  return (
    <div className="container space-y-5">
      {/* Header con título y búsqueda */}
      <Header
        title={title}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />

      {/* Layout principal con sidebar y contenido */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="grid grid-cols-12">
            {/* Sidebar de filtros */}
            <FilterSidebar
              priceRange={priceRange}
              isAscending={isAscending}
              filteredCount={products.length}
              totalCount={totalProducts}
              searchTerm={searchValue}
              hasActiveFilters={hasActiveFilters}
              products={allProducts}
              onPriceRangeChange={onPriceRangeChange}
              onSortOrderChange={onSortOrderChange}
              onClearFilters={onClearFilters}
            />

            {/* Grid de productos */}
            <div className="col-span-10">
              <ProductGrid
                products={products}
                searchTerm={searchValue}
                onAddToCart={onAddToCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};