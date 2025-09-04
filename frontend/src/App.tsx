/**
 * App - Componente principal de la aplicación
 * Refactorizado para usar Atomic Design y Clean Architecture
 */

import React from 'react';
import './App.css';
import { ProductCatalogPage } from './pages';
import { Product } from './types';
import mock from '../public/product-mock.json';

/**
 * Componente principal de la aplicación
 * @returns JSX.Element
 */
function App() {
  // Convertir mock data al tipo Product
  const products: Product[] = mock as Product[];

  return (
    <ProductCatalogPage 
      products={products}
      title="Prueba Tecnica ANI-K"
    />
  );
}

export default App;
