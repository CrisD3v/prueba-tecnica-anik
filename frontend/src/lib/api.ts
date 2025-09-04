import axios from 'axios';
import type { Product } from '../types/product';
import mockProducts from '../../public/product-mock.json';

const API_BASE_URL = 'http://localhost:3000/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos para las operaciones
export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
}

// GET - Obtener productos combinando API y mock
export const getProducts = async (): Promise<Product[]> => {
  let apiProducts: Product[] = [];
  let hasApiData = false;
  
  try {
    const response = await api.get<Product[]>('/products');
    apiProducts = response.data;
    hasApiData = true;
    console.log('✅ Datos obtenidos de la API:', apiProducts.length, 'productos');
  } catch (error) {
    console.warn('⚠️ API no disponible:', error);
  }
  
  // Siempre incluir datos del mock
  const mockData = mockProducts as Product[];
  console.log('📦 Datos del mock:', mockData.length, 'productos');
  
  if (hasApiData) {
    // Combinar datos: API + Mock (evitando duplicados por ID)
    const combinedProducts = [...apiProducts];
    
    // Agregar productos del mock que no estén en la API
    mockData.forEach(mockProduct => {
      const existsInApi = apiProducts.some(apiProduct => 
        apiProduct.id.toString() === mockProduct.id.toString()
      );
      
      if (!existsInApi) {
        combinedProducts.push(mockProduct);
      }
    });
    
    console.log('🔄 Datos combinados:', combinedProducts.length, 'productos totales');
    return combinedProducts;
  } else {
    // Solo datos del mock si la API no está disponible
    console.log('📦 Solo datos del mock');
    return mockData;
  }
};

// POST - Crear un nuevo producto
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  const productWithId = {
    id: crypto.randomUUID(),
    ...productData,
  };
  
  try {
    const response = await api.post<Product>('/products', productWithId);
    console.log('✅ Producto creado en API:', response.data);
    return response.data;
  } catch (error) {
    console.warn('⚠️ API no disponible, simulando creación:', error);
    return productWithId as Product;
  }
};

// Hooks de TanStack Query
export const productQueries = {
  all: () => ['products'] as const,
  lists: () => [...productQueries.all(), 'list'] as const,
};