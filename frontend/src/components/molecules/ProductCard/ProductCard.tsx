/**
 * ProductCard - Componente molecule para mostrar información de un producto
 * Combina Card, imagen, título, precio y botón de acción
 */

import React from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Product } from '../../../types';
import { highlightSearchTerm } from '../../../utils';

interface ProductCardProps {
  /** Datos del producto */
  product: Product;
  /** Término de búsqueda para resaltar */
  searchTerm?: string;
  /** Función callback al hacer clic en agregar al carrito */
  onAddToCart?: (product: Product) => void;
}

/**
 * Tarjeta de producto con imagen, información y acción
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  searchTerm = '',
  onAddToCart,
}) => {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const displayName = searchTerm
    ? highlightSearchTerm(product.name, searchTerm)
    : product.name;

  return (
    <Card className="w-full max-w-xs transition-shadow duration-300 border-none shadow-none">
      <Card.Content className="p-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md hover:scale-105 transition-transform duration-300"
        />
      </Card.Content>
      <Card.Footer>
        <Card.Action className="flex flex-col gap-2 w-full">
          <Card.Title className="text-sm font-semibold truncate">
            {searchTerm ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: displayName,
                }}
              />
            ) : (
              product.name
            )}
          </Card.Title>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-foreground">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </Button>
        </Card.Action>
      </Card.Footer>
    </Card>
  );
};