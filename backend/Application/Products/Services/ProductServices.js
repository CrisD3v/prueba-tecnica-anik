/**
 * Servicio de Aplicación: ProductService
 * 
 * Actúa como una fachada que orquesta múltiples casos de uso relacionados
 * con productos. Proporciona una interfaz simplificada para las capas
 * superiores (controladores, APIs) sin exponer la complejidad interna
 * de los casos de uso individuales.
 * 
 * Responsabilidades:
 * - Coordinar casos de uso relacionados
 * - Proporcionar una API coherente para operaciones de productos
 * - Manejar flujos de trabajo complejos que involucran múltiples casos de uso
 * - Actuar como punto de entrada único para la lógica de productos
 * 
 * Beneficios del patrón Service:
 * - Simplifica la interfaz para los controladores
 * - Permite reutilización de lógica entre diferentes puntos de entrada
 * - Facilita la implementación de flujos de trabajo complejos
 * - Mantiene los casos de uso enfocados en una sola responsabilidad
 * 
 * @class ProductService
 * @author Backend Team
 */

import { CreateProductUseCase } from '../UseCases/CreateProductUseCase.js';
import { GetProductUseCase } from '../UseCases/GetProductUseCase.js';

export class ProductService {

  /**
   * Constructor del servicio de productos
   * 
   * Recibe los casos de uso necesarios a través de inyección de dependencias.
   * Esto permite testing fácil y composición flexible de funcionalidades.
   * 
   * @param {Object} dependencies - Casos de uso inyectados
   * @param {CreateProductUseCase} dependencies.createProductUseCase - Caso de uso para crear productos
   * @param {GetProductUseCase} dependencies.getProductUseCase - Caso de uso para obtener productos
   */
  constructor({ createProductUseCase, getProductUseCase }) {
    /**
     * Caso de uso para la creación de productos
     * @type {CreateProductUseCase}
     * @private
     */
    this.createProductUseCase = createProductUseCase;
    
    /**
     * Caso de uso para la consulta de productos
     * @type {GetProductUseCase}
     * @private
     */
    this.getProductUseCase = getProductUseCase;
  }

  /**
   * Crea un nuevo producto en el sistema
   * 
   * Delega la operación al caso de uso correspondiente, actuando como
   * un proxy que puede agregar lógica adicional en el futuro (logging,
   * validaciones de nivel de servicio, etc.).
   * 
   * @param {Object} productData - Datos del producto a crear
   * @param {string} productData.name - Nombre del producto
   * @param {number} productData.price - Precio del producto
   * @param {number} productData.stock - Cantidad en inventario
   * 
   * @returns {Promise<Result<Product, AppError>>} Resultado de la creación
   * 
   * @example
   * const result = await productService.create({
   *   name: "Smartphone Pro",
   *   price: 899.99,
   *   stock: 25
   * });
   */
  async create(productData) {
    return this.createProductUseCase.execute(productData);
  }

  /**
   * Obtiene todos los productos disponibles en el sistema
   * 
   * Delega la operación al caso de uso correspondiente. En el futuro
   * puede agregar lógica de caché, transformaciones adicionales o
   * filtrado de datos sensibles.
   * 
   * @returns {Promise<Result<Product[], AppError>>} Lista de productos
   * 
   * @example
   * const result = await productService.getAll();
   * 
   * if (result.isSuccess) {
   *   console.log(`Total de productos: ${result.value.length}`);
   * }
   */
  async getAll() {
    return this.getProductUseCase.execute();
  }
}
