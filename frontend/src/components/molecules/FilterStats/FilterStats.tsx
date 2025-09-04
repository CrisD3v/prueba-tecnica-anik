/**
 * FilterStats - Componente molecule para mostrar estadísticas de filtros
 * Muestra información sobre productos filtrados y búsqueda activa
 */

import React from 'react';

interface FilterStatsProps {
  /** Número de productos filtrados */
  filteredCount: number;
  /** Número total de productos */
  totalCount: number;
  /** Término de búsqueda actual */
  searchTerm?: string;
}

/**
 * Estadísticas de filtros aplicados
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const FilterStats: React.FC<FilterStatsProps> = ({
  filteredCount,
  totalCount,
  searchTerm,
}) => {
  return (
    <div className="space-y-2">
      {/* Indicador de productos filtrados */}
      <div className="text-sm text-gray-500 text-center p-2 bg-blue-50 rounded-lg">
        <div className="font-medium">
          Mostrando {filteredCount} de {totalCount} productos
        </div>
        {searchTerm && (
          <div className="text-xs mt-1 text-blue-600">
            Búsqueda: "{searchTerm}"
          </div>
        )}
      </div>

      {/* Información sobre búsqueda inteligente */}
      {searchTerm && (
        <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded-lg">
          💡 Búsqueda inteligente: ignora acentos y caracteres especiales
        </div>
      )}
    </div>
  );
};