/**
 * PriceRangeFilter - Componente molecule para filtro de rango de precios
 * Combina Slider con labels y display de valores
 */

import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Slider } from '../../ui/slider';
import { PRICE_RANGE } from '../../../constants/filters';

interface PriceRangeFilterProps {
  /** Rango de precios actual [min, max] */
  value: [number, number];
  /** Función callback cuando cambia el rango */
  onChange: (value: [number, number]) => void;
  /** Precio mínimo permitido */
  min?: number;
  /** Precio máximo permitido */
  max?: number;
  /** Paso del slider */
  step?: number;
}

/**
 * Filtro de rango de precios con slider
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  value,
  onChange,
  min = PRICE_RANGE.MIN,
  max = PRICE_RANGE.MAX,
  step = 1,
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <CurrencyDollarIcon className="w-5 h-5" />
        Rango de Precio
      </h3>
      <div className="space-y-4">
        <div className="px-2">
          <Slider
            value={value}
            onValueChange={onChange}
            max={max}
            min={min}
            step={step}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>${value[0]}</span>
          <span>${value[1]}</span>
        </div>
      </div>
    </div>
  );
};