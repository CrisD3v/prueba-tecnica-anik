/**
 * Caso de Uso: Obtener Productos
 * 
 * Implementa la lógica de negocio para la consulta de productos en el sistema.
 * Encapsula las reglas de acceso a datos y transformaciones necesarias
 * para la presentación de información de productos.
 * 
 * Responsabilidades:
 * - Obtener la lista completa de productos
 * - Aplicar reglas de negocio para filtrado (futuro)
 * - Manejar casos donde no existen productos
 * - Garantizar consistencia de lectura mediante transacciones
 * - Retornar resultados tipados
 * 
 * Consideraciones de Rendimiento:
 * - Usa transacciones de solo lectura para mejor rendimiento
 * - Preparado para implementar paginación en el futuro
 * - Optimizado para consultas frecuentes
 * 
 * @class GetProductUseCase
 * @author Backend Team
 */

import { ok, fail } from "../../../Shared/Result.js";
import { AppError } from "../../../Shared/AppError.js";

export class GetProductUseCase {
  
  /**
   * Constructor del caso de uso
   * 
   * @param {Object} dependencies - Dependencias inyectadas
   * @param {ProductRepository} dependencies.productRepository - Repositorio de productos
   * @param {UnitOfWork} dependencies.unitOfWork - Manejador de transacciones
   */
  constructor({ productRepository, unitOfWork }) {
    /**
     * Repositorio para operaciones de consulta de productos
     * @type {ProductRepository}
     * @private
     */
    this.productRepository = productRepository;
    
    /**
     * Unit of Work para manejo transaccional
     * Aunque es una operación de lectura, usar transacciones garantiza
     * consistencia y aislamiento de datos
     * @type {UnitOfWork}
     * @private
     */
    this.unitOfWork = unitOfWork;
  }

  /**
   * Ejecuta el caso de uso de consulta de productos
   * 
   * Proceso:
   * 1. Inicia una transacción de solo lectura
   * 2. Consulta todos los productos disponibles
   * 3. Valida que existan productos en el sistema
   * 4. Retorna la lista de productos o un error apropiado
   * 
   * 
   * @returns {Promise<Result<Product[], AppError>>} Lista de productos o error
   * 
   * @example
   * const result = await getProductUseCase.execute();
   * 
   * if (result.isSuccess) {
   *   console.log(`Encontrados ${result.value.length} productos`);
   *   result.value.forEach(product => {
   *     console.log(`- ${product.name}: $${product.price}`);
   *   });
   * } else {
   *   console.error('Error:', result.error.message);
   * }
   */
  async execute() {
    // Ejecutar la consulta dentro de una transacción
    // Esto garantiza una vista consistente de los datos
    return this.unitOfWork.run(async (transaction) => {
      
      // === CONSULTA DE DATOS ===
      
      // Obtener todos los productos del repositorio
      // El repositorio maneja los detalles de la consulta SQL
      const products = await this.productRepository.getAll(transaction);
      
      // === VALIDACIÓN DE RESULTADOS ===
      
      // Verificar si se encontraron productos
      // Nota: Una lista vacía es diferente a null/undefined
      if (!products || products.length === 0) {
        return fail(
          new AppError(
            "PRODUCT_NOT_FOUND", 
            "No se encontraron productos en el sistema", 
            404
          )
        );
      }
      
      // === RESULTADO EXITOSO ===
      
      // Retornar la lista de productos
      // Los productos ya vienen como entidades de dominio desde el repositorio
      return ok(products);
    });
  }
}
