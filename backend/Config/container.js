/**
 * Configuración del Contenedor de Inyección de Dependencias
 * 
 * Este módulo implementa el patrón Inversion of Control (IoC) usando Awilix
 * para gestionar todas las dependencias de la aplicación de manera centralizada.
 * 
 * Beneficios:
 * - Desacoplamiento entre componentes
 * - Facilita testing mediante inyección de mocks
 * - Gestión centralizada del ciclo de vida de objetos
 * - Configuración declarativa de dependencias
 * 
 * Tipos de registro:
 * - asValue: Para valores constantes (configuración, instancias pre-creadas)
 * - asClass: Para clases que requieren instanciación automática
 * - asFunction: Para funciones factory que crean instancias
 * 
 * @module Container
 * @author Backend Team
 */

import { asClass, asFunction, asValue, createContainer, InjectionMode, Lifetime } from 'awilix';

// === IMPORTACIONES DE CONFIGURACIÓN ===
import { env } from './env.js';
import { sequelize } from './Db.js';

// === IMPORTACIONES DE INFRAESTRUCTURA ===
import { buildProductModel } from '../Infraestructure/Products/Models/ProductModel.js';
import { SequelizeUnitOfWork } from '../Infraestructure/UoW/SequelizeUnitOfWork.js';
import { SequelizeProductRepository } from '../Infraestructure/Products/Repositories/SequelizeProductRepository.js';

// === IMPORTACIONES DE APLICACIÓN ===
import { CreateProductUseCase } from '../Application/Products/UseCases/CreateProductUseCase.js';
import { GetProductUseCase } from '../Application/Products/UseCases/GetProductUseCase.js';
import { ProductService } from '../Application/Products/Services/ProductServices.js';

// === IMPORTACIONES DE PRESENTACIÓN ===
import { buildProductRouter } from '../Routes/Product.routes.js';

/**
 * Construye y configura el contenedor de inyección de dependencias
 * 
 * Registra todas las dependencias necesarias para la aplicación siguiendo
 * el principio de inversión de dependencias. Las capas superiores dependen
 * de abstracciones, no de implementaciones concretas.
 * 
 * Orden de registro:
 * 1. Configuración y servicios base
 * 2. Modelos de datos
 * 3. Repositorios e infraestructura
 * 4. Casos de uso de aplicación
 * 5. Servicios de aplicación
 * 6. Controladores y routers
 * 
 * @function buildContainer
 * @returns {AwilixContainer} Contenedor configurado con todas las dependencias
 */
export function buildContainer() {
  // Crear contenedor con modo PROXY para mejor rendimiento
  // PROXY permite inyección lazy y mejor manejo de dependencias circulares
  const container = createContainer({ 
    injectionMode: InjectionMode.PROXY 
  });

  // === CONSTRUCCIÓN DE MODELOS ===
  // Los modelos se construyen una sola vez durante la inicialización
  // para evitar problemas de registro múltiple en Sequelize
  const ProductModel = buildProductModel(sequelize);

  // === REGISTRO DE DEPENDENCIAS ===
  container.register({
    
    // === CONFIGURACIÓN Y SERVICIOS BASE ===
    // Valores constantes que no requieren instanciación
    env: asValue(env),
    sequelize: asValue(sequelize),
    
    // === CAPA DE INFRAESTRUCTURA ===
    // Adaptadores que implementan las interfaces del dominio
    
    /**
     * Repository para operaciones de persistencia de productos
     * Implementa el patrón Repository para abstraer el acceso a datos
     */
    productRepository: asValue(new SequelizeProductRepository(ProductModel)),
    
    /**
     * Unit of Work para manejo transaccional
     * Garantiza consistencia ACID en operaciones complejas
     */
    unitOfWork: asValue(new SequelizeUnitOfWork(sequelize)),

    // === CAPA DE APLICACIÓN ===
    // Casos de uso que implementan la lógica de negocio
    
    /**
     * Caso de uso para crear productos
     * Singleton para reutilizar la misma instancia en toda la aplicación
     */
    createProductUseCase: asClass(CreateProductUseCase, { 
      lifetime: Lifetime.SINGLETON 
    }),
    

    
    /**
     * Servicio de aplicación que orquesta casos de uso
     * Actúa como fachada para operaciones relacionadas con productos
     */
    productService: asClass(ProductService, { 
      lifetime: Lifetime.SINGLETON 
    }),

    // === CAPA DE PRESENTACIÓN ===
    // Routers y controladores HTTP
    
    /**
     * Router para endpoints de productos
     * Función factory que recibe dependencias inyectadas
     */
    productRouter: asFunction(buildProductRouter, { 
      lifetime: Lifetime.SINGLETON 
    }),
  });

  return container;
}
