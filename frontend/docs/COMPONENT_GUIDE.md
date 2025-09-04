# Guía de Componentes - Atomic Design

Esta guía proporciona documentación detallada de todos los componentes implementados, organizados según los principios de Atomic Design y las mejores prácticas de React 19 con TypeScript.

## 📋 Estado de Implementación

### ✅ Completamente Implementados
- Todos los componentes molecules (SearchBar, ProductCard, etc.)
- Todos los componentes organisms (Header, FilterSidebar, ProductGrid)
- Template principal (ProductCatalogTemplate)
- Página principal (ProductCatalogPage)
- Hooks personalizados (useProductFilters, useProducts)
- Utilidades completas (textUtils, productUtils)

### 🔄 En Desarrollo
- Testing unitario de componentes
- Storybook para documentación visual
- Componentes adicionales para CRUD

### 📋 Roadmap
- Componentes de formulario avanzados
- Componentes de navegación
- Componentes de feedback (loading, error states)

## 🔧 Componentes UI (Atoms)

Los componentes UI se mantienen en su ubicación original `/components/ui/` y sirven como los átomos básicos de la aplicación.

### shadcn/ui Components Utilizados

**✅ Implementados:**
- `Button` - Botones con variantes y tamaños
- `Input` - Campos de entrada con validación
- `Card` - Contenedores con header, content y footer
- `Slider` - Control deslizante para rangos
- `Switch` - Interruptor on/off
- `Popover` - Elementos emergentes posicionados
- `Label` - Etiquetas accesibles para formularios

**🎨 Características:**
- Totalmente accesibles (ARIA compliant)
- Variantes configurables con class-variance-authority
- Theming con CSS variables
- TypeScript nativo
- Composables y extensibles

**📦 Instalación:**
```bash
npx shadcn@latest add button input card slider switch popover label
```

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

### useProducts

**Ubicación**: `/hooks/useProductFilters.ts`

**Propósito**: Hook para obtener productos de la API con fallback automático a datos mock.

**Características**:
- ✅ TanStack Query para caché inteligente
- ✅ Retry automático (1 intento)
- ✅ Fallback a mock si API no disponible
- ✅ Stale time de 5 minutos
- ✅ Manejo de estados de loading y error

**Ejemplo de uso**:
```tsx
const { data: products = [], isLoading, error } = useProducts();
```

### useCreateProduct

**Ubicación**: `/hooks/useProductFilters.ts`

**Propósito**: Hook para crear productos con optimistic updates.

**Características**:
- ✅ Mutación con TanStack Query
- ✅ Optimistic updates para mejor UX
- ✅ Invalidación automática de caché
- ✅ Manejo de errores integrado

**Ejemplo de uso**:
```tsx
const createProductMutation = useCreateProduct();

const handleCreate = (productData) => {
  createProductMutation.mutate(productData);
};
```

### useProductFilters

**Ubicación**: `/hooks/useProductFilters.ts`

**Propósito**: Hook que encapsula toda la lógica de filtros y búsqueda de productos.

**Características Avanzadas**:
- ✅ Memoización con useMemo para performance
- ✅ Detección automática de filtros activos
- ✅ Normalización de texto para búsquedas
- ✅ Filtrado y ordenamiento optimizado

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

**Ejemplo de uso completo**:
```tsx
const {
  searchTerm,
  priceRange,
  isAscending,
  filteredProducts,
  hasActiveFilters,
  updateSearchTerm,
  updatePriceRange,
  updateSortOrder,
  clearFilters
} = useProductFilters({ products });

// Uso en componente
<SearchBar value={searchTerm} onChange={updateSearchTerm} />
<PriceRangeFilter value={priceRange} onChange={updatePriceRange} />
<SortToggle isAscending={isAscending} onChange={updateSortOrder} />
{hasActiveFilters && <Button onClick={clearFilters}>Limpiar</Button>}
```

---

## 🛠️ Utilidades

### textUtils

**Ubicación**: `/utils/textUtils.ts`

**Funciones implementadas**:

#### `normalizeText(text: string): string`
Normaliza texto removiendo acentos, caracteres especiales y convirtiendo a minúsculas.

**Características**:
- ✅ Maneja acentos españoles (á, é, í, ó, ú, ñ)
- ✅ Convierte a minúsculas
- ✅ Optimizado para búsquedas

```tsx
const normalized = normalizeText("Lápiz Azúl"); // "lapiz azul"
const search = normalizeText("Niño"); // "nino"
```

#### `highlightSearchTerm(text: string, searchTerm: string): string`
Resalta términos de búsqueda en un texto, considerando normalización.

**Características**:
- ✅ Búsqueda insensible a acentos
- ✅ Resaltado con HTML mark
- ✅ Clases TailwindCSS aplicadas

```tsx
const highlighted = highlightSearchTerm("Lápiz Azul", "lapiz");
// Retorna: '<mark class="bg-yellow-200 px-1 rounded">Lápiz</mark> Azul'
```

### productUtils

**Ubicación**: `/utils/productUtils.ts`

**Funciones optimizadas**:

#### `filterProducts(products: Product[], filters: ProductFilters): Product[]`
Filtra productos por término de búsqueda y rango de precios.

**Algoritmo**:
- Normalización de texto para búsqueda insensible a acentos
- Filtrado por rango de precios inclusivo
- Optimizado para arrays grandes

#### `sortProductsByPrice(products: Product[], isAscending: boolean): Product[]`
Ordena productos por precio de forma eficiente.

**Características**:
- ✅ Ordenamiento estable
- ✅ Manejo de precios decimales
- ✅ Inmutable (no modifica array original)

#### `filterAndSortProducts(products: Product[], filters: ProductFilters): Product[]`
Operación combinada optimizada que filtra y ordena en una sola pasada.

**Performance**:
- ✅ Una sola iteración sobre el array
- ✅ Memoización recomendada en componentes
- ✅ Optimizado para re-renders frecuentes

```tsx
// Uso típico en hook
const filteredProducts = useMemo(() => {
  return filterAndSortProducts(products, {
    searchTerm,
    priceRange,
    isAscending
  });
}, [products, searchTerm, priceRange, isAscending]);
```

### API Utils

**Ubicación**: `/lib/api.ts`

**Funciones de API**:

#### `getProducts(): Promise<Product[]>`
Obtiene productos de la API con fallback automático.

**Características**:
- ✅ Fallback a datos mock si API no disponible
- ✅ Manejo de errores de red
- ✅ Timeout configurado
- ✅ Retry logic integrado

#### `createProduct(product: Omit<Product, 'id'>): Promise<Product>`
Crea un nuevo producto en la API.

**Características**:
- ✅ Validación de datos
- ✅ Manejo de errores HTTP
- ✅ Respuesta tipada
- ✅ Integración con TanStack Query

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
- ✅ Cada componente tiene una responsabilidad específica
- ✅ Lógica separada en hooks y utilidades
- ✅ Presentación separada de la lógica de negocio
- ✅ Estado del servidor manejado por TanStack Query

### 2. **Reutilización de Código**
- ✅ Componentes atómicos reutilizables (shadcn/ui)
- ✅ Hooks personalizados para lógica compartida
- ✅ Utilidades para operaciones comunes
- ✅ Tipos TypeScript exportados y reutilizados

### 3. **Tipado Fuerte y Seguridad**
- ✅ TypeScript estricto en toda la aplicación
- ✅ Interfaces bien definidas para cada nivel
- ✅ Tipos de utilidad para mejor DX
- ✅ Validación en tiempo de compilación

### 4. **Performance Optimizada**
- ✅ useMemo para cálculos costosos de filtros
- ✅ useCallback para funciones estables
- ✅ TanStack Query para caché inteligente
- ✅ Componentes optimizados para re-renders mínimos

### 5. **Accesibilidad (a11y)**
- ✅ Componentes shadcn/ui con ARIA completo
- ✅ Labels apropiados en todos los formularios
- ✅ Estructura semántica correcta
- ✅ Navegación por teclado funcional
- ✅ Contraste de colores adecuado

### 6. **User Experience (UX)**
- ✅ Estados de carga bien definidos
- ✅ Manejo graceful de errores
- ✅ Fallback automático a datos mock
- ✅ Feedback visual inmediato
- ✅ Animaciones suaves con TailwindCSS

### 7. **Developer Experience (DX)**
- ✅ Hot Module Replacement con Vite
- ✅ TypeScript con autocompletado inteligente
- ✅ ESLint configurado para mejores prácticas
- ✅ Estructura de carpetas intuitiva
- ✅ Documentación JSDoc completa

### 8. **Mantenibilidad y Escalabilidad**
- ✅ Atomic Design para crecimiento ordenado
- ✅ Convenciones de naming consistentes
- ✅ Exportaciones centralizadas
- ✅ Separación clara de concerns
- ✅ Patrones establecidos para nuevas features

### 9. **Testing Ready**
- ✅ Componentes aislados y testeable
- ✅ Props bien definidas para mocking
- ✅ Lógica separada en utilidades puras
- ✅ Hooks personalizados testeable independientemente

### 10. **Modern React Patterns**
- ✅ React 19 con las últimas características
- ✅ Functional components exclusivamente
- ✅ Custom hooks para lógica reutilizable
- ✅ Composition over inheritance
- ✅ Immutable state patterns