/**
 * ProductGrid - Componente organism para mostrar grid de productos
 * Maneja la visualización de productos o estado vacío
 */

import React from 'react';
import { Product } from '../../../types';
import { ProductCard, EmptyState } from '../../molecules';

interface ProductGridProps {
  /** Array de productos a mostrar */
  products: Product[];
  /** Término de búsqueda para resaltar */
  searchTerm?: string;
  /** Función callback al agregar producto al carrito */
  onAddToCart?: (product: Product) => void;
}

/**
 * Grid de productos con manejo de estado vacío
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  searchTerm = '',
  onAddToCart,
}) => {
  if (products.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="flex flex-wrap justify-center w-max-sm w-full gap-2 space-y-2 space-x-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          searchTerm={searchTerm}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};