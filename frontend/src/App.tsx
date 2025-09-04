/**
 * App - Componente principal de la aplicación
 * Refactorizado para usar Atomic Design y Clean Architecture
 */

import './App.css';
import { ProductCatalogPage } from './pages';
import { useProducts } from './hooks/useProductFilters';

/**
 * Componente principal de la aplicación
 * @returns JSX.Element
 */
function App() {
  // Obtener productos de la API (con fallback automático al mock)
  const { data: products = [], isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Error al cargar productos: {error.message}
        </div>
      </div>
    );
  }

  return (
    <ProductCatalogPage 
      products={products}
      title="Prueba Tecnica ANI-K"
    />
  );
}

export default App;
