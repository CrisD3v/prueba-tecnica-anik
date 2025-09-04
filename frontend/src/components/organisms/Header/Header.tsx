/**
 * Header - Componente organism para el encabezado de la aplicación
 * Incluye título y barra de búsqueda
 */

import React from 'react';
import { Button } from '../../ui/button';
import { Popover } from '../../ui/popover';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { SearchBar } from '../../molecules';

interface HeaderProps {
  /** Título de la aplicación */
  title?: string;
  /** Valor del término de búsqueda */
  searchValue: string;
  /** Función para actualizar término de búsqueda */
  onSearchChange: (value: string) => void;
}

/**
 * Encabezado de la aplicación con título y búsqueda
 * @param props - Propiedades del componente
 * @returns JSX.Element
 */
export const Header: React.FC<HeaderProps> = ({
  title = 'Prueba Tecnica ANI-K',
  searchValue,
  onSearchChange,
}) => {
  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-bold">{title}</h1>
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="flex justify-center items-center space-x-5 max-w-full w-full">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
            />
            
            <Popover>
              <Popover.Trigger>
                <Button>Agregar</Button>
              </Popover.Trigger>
              <Popover.Content className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Dimensions</h4>
                    <p className="text-muted-foreground text-sm">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        defaultValue="100%"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxWidth">Max. width</Label>
                      <Input
                        id="maxWidth"
                        defaultValue="300px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        defaultValue="25px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxHeight">Max. height</Label>
                      <Input
                        id="maxHeight"
                        defaultValue="none"
                        className="col-span-2 h-8"
                      />
                    </div>
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};