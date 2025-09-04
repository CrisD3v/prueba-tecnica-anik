# Guía de Componentes - Atomic Design

Esta guía proporciona documentación detallada de todos los componentes organizados según Atomic Design.

## 🔧 Componentes UI (Atoms)

Los componentes UI se mantienen en su ubicación original `/components/ui/` y sirven como los átomos básicos de la aplicación.

Estos componentes hacen parte de la libreria shad/cn

---

## 🧬 Molecules

### SearchBar

**Ubicación**: `/components/molecules/SearchBar/`

**Propósito**: Barra de búsqueda con icono integrado para filtrar productos.

**Props**:
```typescript
interface SearchBarProps {
  value: string;           // Valor actual del término de búsqueda
  onChange: (value: string) => void;  // Callback cuando cambia el valor
  placeholder?: string;    // Placeholder personalizado (opcional)
  className?: string;      // Clase CSS adicional (opcional)
}
```

**Ejemplo de uso**:
```tsx
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Buscar productos..."
  className="w-96"
/>
```

---

### PriceRangeFilter

**Ubicación**: `/components/molecules/PriceRangeFilter/`

**Propósito**: Control deslizante para filtrar productos por rango de precios.

**Props**:
```typescript
interface PriceRangeFilterProps {
  value: [number, number];  // Rango actual [min, max]
  onChange: (value: [number, number]) => void;  // Callback cuando cambia
  min?: number;            // Precio mínimo permitido
  max?: number;            // Precio máximo permitido
  step?: number;           // Paso del slider
}
```

**Ejemplo de uso**:
```tsx
<PriceRangeFilter
  value={[15, 65]}
  onChange={setPriceRange}
  min={10}
  max={100}
  step={1}
/>
```

---

### SortToggle

**Ubicación**: `/components/molecules/SortToggle/`

**Propósito**: Control para alternar entre orden ascendente y descendente por precio.

**Props**:
```typescript
interface SortToggleProps {
  isAscending: boolean;    // Si el orden es ascendente
  onChange: (isAscending: boolean) => void;  // Callback cuando cambia
}
```

**Ejemplo de uso**:
```tsx
<SortToggle
  isAscending={true}
  onChange={setIsAscending}
/>
```

---

### FilterStats

**Ubicación**: `/components/molecules/FilterStats/`

**Propósito**: Muestra estadísticas sobre los filtros aplicados y productos encontrados.

**Props**:
```typescript
interface FilterStatsProps {
  filteredCount: number;   // Número de productos filtrados
  totalCount: number;      // Número total de productos
  searchTerm?: string;     // Término de búsqueda actual
}
```

**Ejemplo de uso**:
```tsx
<FilterStats
  filteredCount={25}
  totalCount={100}
  searchTerm="laptop"
/>
```

---

### ProductCard

**Ubicación**: `/components/molecules/ProductCard/`

**Propósito**: Tarjeta individual que muestra información de un producto.

**Props**:
```typescript
interface ProductCardProps {
  product: Product;        // Datos del producto
  searchTerm?: string;     // Término para resaltar en el nombre
  onAddToCart?: (product: Product) => void;  // Callback agregar al carrito
}
```

**Ejemplo de uso**:
```tsx
<ProductCard
  product={{
    id: 1,
    name: "Laptop Gaming",
    price: 999.99,
    image: "/laptop.jpg"
  }}
  searchTerm="laptop"
  onAddToCart={handleAddToCart}
/>
```

---

### EmptyState

**Ubicación**: `/components/molecules/EmptyState/`

**Propósito**: Estado vacío cuando no se encuentran productos que coincidan con los filtros.

**Props**:
```typescript
interface EmptyStateProps {
  searchTerm?: string;     // Término de búsqueda actual
  title?: string;          // Título personalizado
  description?: string;    // Descripción personalizada
}
```

**Ejemplo de uso**:
```tsx
<EmptyState
  searchTerm="producto inexistente"
  title="No hay resultados"
  description="Intenta con otros términos de búsqueda"
/>
```

---

## 🏢 Organisms

### Header

**Ubicación**: `/components/organisms/Header/`

**Propósito**: Encabezado de la aplicación con título, búsqueda y acciones.

**Props**:
```typescript
interface HeaderProps {
  title?: string;          // Título de la aplicación
  searchValue: string;     // Valor del término de búsqueda
  onSearchChange: (value: string) => void;  // Callback cambio búsqueda
}
```

**Ejemplo de uso**:
```tsx
<Header
  title="Mi Tienda"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

---

### FilterSidebar

**Ubicación**: `/components/organisms/FilterSidebar/`

**Propósito**: Barra lateral completa con todos los controles de filtros.

**Props**:
```typescript
interface FilterSidebarProps {
  priceRange: [number, number];
  isAscending: boolean;
  filteredCount: number;
  totalCount: number;
  searchTerm: string;
  hasActiveFilters: boolean;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortOrderChange: (isAscending: boolean) => void;
  onClearFilters: () => void;
}
```

**Ejemplo de uso**:
```tsx
<FilterSidebar
  priceRange={[15, 65]}
  isAscending={true}
  filteredCount={25}
  totalCount={100}
  searchTerm="laptop"
  hasActiveFilters={true}
  onPriceRangeChange={setPriceRange}
  onSortOrderChange={setIsAscending}
  onClearFilters={clearFilters}
/>
```

---

### ProductGrid

**Ubicación**: `/components/organisms/ProductGrid/`

**Propósito**: Grid que muestra productos o estado vacío según corresponda.

**Props**:
```typescript
interface ProductGridProps {
  products: Product[];     // Array de productos a mostrar
  searchTerm?: string;     // Término para resaltar
  onAddToCart?: (product: Product) => void;  // Callback agregar al carrito
}
```

**Ejemplo de uso**:
```tsx
<ProductGrid
  products={filteredProducts}
  searchTerm="laptop"
  onAddToCart={handleAddToCart}
/>
```

---

## 📄 Templates

### ProductCatalogTemplate

**Ubicación**: `/components/templates/ProductCatalogTemplate/`

**Propósito**: Template principal que define el layout completo del catálogo.

**Props**:
```typescript
interface ProductCatalogTemplateProps {
  title?: string;
  searchValue: string;
  priceRange: [number, number];
  isAscending: boolean;
  products: Product[];
  totalProducts: number;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortOrderChange: (isAscending: boolean) => void;
  onClearFilters: () => void;
  onAddToCart?: (product: Product) => void;
}
```

---

## 📱 Pages

### ProductCatalogPage

**Ubicación**: `/pages/ProductCatalogPage/`

**Propósito**: Página principal que maneja toda la lógica de estado del catálogo.

**Props**:
```typescript
interface ProductCatalogPageProps {
  products: Product[];     // Array de productos
  title?: string;          // Título de la página
}
```

**Ejemplo de uso**:
```tsx
<ProductCatalogPage
  products={mockProducts}
  title="Mi Catálogo"
/>
```

---

## 🎣 Hooks Personalizados

### useProductFilters

**Ubicación**: `/hooks/useProductFilters.ts`

**Propósito**: Hook que encapsula toda la lógica de filtros y búsqueda de productos.

**Parámetros**:
```typescript
interface UseProductFiltersProps {
  products: Product[];     // Array de productos a filtrar
}
```

**Retorna**:
```typescript
interface UseProductFiltersReturn {
  // Estado actual
  searchTerm: string;
  priceRange: [number, number];
  isAscending: boolean;
  filteredProducts: Product[];
  totalProducts: number;
  hasActiveFilters: boolean;
  
  // Funciones de actualización
  updateSearchTerm: (term: string) => void;
  updatePriceRange: (range: [number, number]) => void;
  updateSortOrder: (isAscending: boolean) => void;
  clearFilters: () => void;
}
```

**Ejemplo de uso**:
```tsx
const {
  searchTerm,
  priceRange,
  filteredProducts,
  updateSearchTerm,
  updatePriceRange,
  clearFilters
} = useProductFilters({ products: mockProducts });
```

---

## 🛠️ Utilidades

### textUtils

**Funciones disponibles**:

#### `normalizeText(text: string): string`
Normaliza texto removiendo acentos y caracteres especiales.

```tsx
const normalized = normalizeText("Lápiz Azúl"); // "lapiz azul"
```

#### `highlightSearchTerm(text: string, searchTerm: string): string`
Resalta términos de búsqueda en un texto, considerando normalización.

```tsx
const highlighted = highlightSearchTerm("Lápiz Azul", "lapiz");
// Retorna: '<mark class="bg-yellow-200 px-1 rounded">Lápiz</mark> Azul'
```

### productUtils

**Funciones disponibles**:

#### `filterProducts(products: Product[], filters: ProductFilters): Product[]`
Filtra productos basado en criterios de búsqueda y precio.

#### `sortProductsByPrice(products: Product[], isAscending: boolean): Product[]`
Ordena productos por precio.

#### `filterAndSortProducts(products: Product[], filters: ProductFilters): Product[]`
Operación combinada optimizada que filtra y ordena en una sola pasada.

---

## 📊 Constantes

### filters.ts

**Constantes disponibles**:

```typescript
export const PRICE_RANGE = {
  MIN: 15,
  MAX: 65,
  DEFAULT: [15, 65] as [number, number],
} as const;

export const SEARCH_CONFIG = {
  PLACEHOLDER: 'Buscar producto... (ej: lapiz, mascara, labial)',
  MIN_SEARCH_LENGTH: 0,
} as const;

export const SORT_OPTIONS = {
  ASCENDING: true,
  DESCENDING: false,
} as const;
```

---

## 🎯 Mejores Prácticas Implementadas

### 1. **Separación de Responsabilidades**
- Cada componente tiene una responsabilidad específica
- Lógica separada en hooks y utilidades
- Presentación separada de la lógica de negocio

### 2. **Reutilización de Código**
- Componentes atómicos reutilizables
- Hooks personalizados para lógica compartida
- Utilidades para operaciones comunes

### 3. **Tipado Fuerte**
- Todas las props están tipadas con TypeScript
- Interfaces bien definidas para cada nivel
- Tipos exportados para reutilización

### 4. **Documentación**
- JSDoc en todos los componentes
- Comentarios explicativos en código complejo
- Ejemplos de uso en esta guía

### 5. **Performance**
- useMemo para cálculos costosos
- Componentes optimizados para re-renders
- Separación de estado para evitar renders innecesarios

### 6. **Accesibilidad**
- Labels apropiados en formularios
- Estructura semántica correcta
- Navegación por teclado considerada

### 7. **Mantenibilidad**
- Estructura de carpetas clara y consistente
- Nombres descriptivos y convenciones consistentes
- Exportaciones centralizadas para fácil importación