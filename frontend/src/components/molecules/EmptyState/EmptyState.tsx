/**
 * EmptyState - Componente molecule para mostrar estado vacío
 * Muestra mensaje cuando no hay productos que coincidan con los filtros
 */

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  /** Término de búsqueda actual */
  searchTerm?: string;
  /** Título personalizado */
  title?: string;
  /** Descripción personalizada */
  description?: string;
}

/**
 * Estado vacío cuando no se encuentran productos
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  title = 'No se encontraron productos',
  description,
}) => {
  const defaultDescription = searchTerm
    ? `No hay productos que coincidan con "${searchTerm}"`
    : 'Ajusta los filtros para ver más productos';

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <MagnifyingGlassIcon className="w-16 h-16 mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-center">
        {description || defaultDescription}
      </p>
      {searchTerm && (
        <p className="text-xs text-gray-400 mt-2">
          Tip: La búsqueda ignora acentos (ej: "lapiz" encuentra "lápiz")
        </p>
      )}
    </div>
  );
};