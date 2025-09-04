/**
 * Definiciones de tipos para productos
 */

export interface Product {
  id: string | number; // Compatible con mock (number) y API (string)
  name: string;
  price: number;
  image?: string; // Opcional para compatibilidad
  stock?: number; // Opcional, solo para productos de la API
}

export interface ProductFilters {
  searchTerm: string;
  priceRange: [number, number];
  isAscending: boolean;
}

export interface FilterState extends ProductFilters {
  filteredProducts: Product[];
  totalProducts: number;
}