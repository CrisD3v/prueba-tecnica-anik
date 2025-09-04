/**
 * Definiciones de tipos para productos
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
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