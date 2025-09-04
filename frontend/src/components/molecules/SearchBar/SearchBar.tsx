/**
 * SearchBar - Componente molecule para búsqueda de productos
 * Combina Input con icono de búsqueda
 */

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '../../ui/input';
import { SEARCH_CONFIG } from '../../../constants/filters';

interface SearchBarProps {
  /** Valor actual del término de búsqueda */
  value: string;
  /** Función callback cuando cambia el valor */
  onChange: (value: string) => void;
  /** Placeholder personalizado (opcional) */
  placeholder?: string;
  /** Clase CSS adicional (opcional) */
  className?: string;
}

/**
 * Barra de búsqueda con icono integrado
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = SEARCH_CONFIG.PLACEHOLDER,
  className = 'w-96',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        className="w-full pl-10"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};