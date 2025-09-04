/**
 * Header - Componente organism para el encabezado de la aplicación
 * Incluye título y barra de búsqueda
 */

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { SearchBar } from "../../molecules";
import { useCreateProduct } from "../../../hooks/useProductFilters";
import type { Product } from "../../../types";
import { toast } from "sonner";

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
  title = "Prueba Tecnica ANI-K",
  searchValue,
  onSearchChange,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const createProductMutation = useCreateProduct();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert("Por favor, completa al menos el nombre y precio del producto");
      return;
    }

    const newProduct: Omit<Product, "id"> = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: formData.stock ? parseInt(formData.stock) : undefined,
    };

    try {
      await createProductMutation.mutateAsync(newProduct);
      // Limpiar formulario
      setFormData({ name: "", price: "", stock: "" });
      setIsPopoverOpen(false);

      toast.success("Producto creado exitosamente", {
        description:
          'El producto se ha creado exitosamente por lo que aparecera en el listado con la imagen "Test"',
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear el producto");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", price: "", stock: "" });
    setIsPopoverOpen(false);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-bold">{title}</h1>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="flex justify-center items-center space-x-5 max-w-full w-full">
            <SearchBar value={searchValue} onChange={onSearchChange} />

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Popover.Trigger>
                <Button>Agregar</Button>
              </Popover.Trigger>
              <Popover.Content className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Crear Producto</h4>
                    <p className="text-muted-foreground text-sm">
                      Crea un nuevo producto.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="productName">Nombre *</Label>
                      <Input
                        id="productName"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Nombre del producto"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="productPrice">Precio *</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="0.00"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="productStock">Stock</Label>
                      <Input
                        id="productStock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          handleInputChange("stock", e.target.value)
                        }
                        placeholder="Cantidad disponible"
                        className="col-span-2 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={createProductMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={
                        createProductMutation.isPending ||
                        !formData.name ||
                        !formData.price
                      }
                    >
                      {createProductMutation.isPending ? "Creando..." : "Crear"}
                    </Button>
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
