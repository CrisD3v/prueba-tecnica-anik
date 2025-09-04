/**
 * SortToggle - Componente molecule para alternar orden de productos
 * Combina Switch con labels para ordenamiento
 */

import React from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';

interface SortToggleProps {
  /** Si el orden es ascendente */
  isAscending: boolean;
  /** Función callback cuando cambia el orden */
  onChange: (isAscending: boolean) => void;
}

/**
 * Toggle para cambiar orden de productos por precio
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const SortToggle: React.FC<SortToggleProps> = ({
  isAscending,
  onChange,
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <ArrowsUpDownIcon className="w-5 h-5" />
        Ordenar por Precio
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <Switch
            id="priceSortDesc"
            className="bg-white"
            checked={!isAscending}
            onCheckedChange={(checked) => onChange(!checked)}
          />
          <Label htmlFor="priceSortDesc">Mayor a Menor</Label>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <Switch
            id="priceSortAsc"
            className="bg-white"
            checked={isAscending}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <Label htmlFor="priceSortAsc">Menor a Mayor</Label>
        </div>
      </div>
    </div>
  );
};