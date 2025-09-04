/**
 * Caso de Uso: Crear Producto
 * 
 * Implementa la lógica de negocio para la creación de productos en el sistema.
 * Sigue el patrón Command y encapsula todas las reglas de negocio relacionadas
 * con la creación de productos.
 * 
 * Responsabilidades:
 * - Validar que el producto no exista previamente
 * - Crear la entidad de dominio con validaciones
 * - Persistir el producto usando el repositorio
 * - Manejar transacciones para garantizar consistencia
 * - Retornar resultados tipados (Success/Failure)
 * 
 * Reglas de Negocio:
 * - No pueden existir dos productos con el mismo nombre
 * - Todos los datos del producto deben ser válidos
 * - La operación debe ser transaccional
 * 
 * @class CreateProductUseCase
 * @author Backend Team
 */

import { Product } from "../../../Domain/Products/Entities/Product.js";
import { AppError } from "../../../Shared/AppError.js";
import { ok, fail } from "../../../Shared/Result.js";

export class CreateProductUseCase {
  
  /**
   * Constructor del caso de uso
   * 
   * Recibe las dependencias necesarias a través de inyección de dependencias.
   * Esto permite testing fácil y desacoplamiento de la infraestructura.
   * 
   * @param {Object} dependencies - Dependencias inyectadas
   * @param {ProductRepository} dependencies.productRepository - Repositorio de productos
   * @param {UnitOfWork} dependencies.unitOfWork - Manejador de transacciones
   */
  constructor({ productRepository, unitOfWork }) {
    /**
     * Repositorio para operaciones de persistencia de productos
     * @type {ProductRepository}
     * @private
     */
    this.productRepository = productRepository;
    
    /**
     * Unit of Work para manejo transaccional
     * @type {UnitOfWork}
     * @private
     */
    this.uow = unitOfWork;
  }

  /**
   * Ejecuta el caso de uso de creación de producto
   * 
   * Proceso:
   * 1. Inicia una transacción de base de datos
   * 2. Verifica que no exista un producto con el mismo nombre
   * 3. Crea la entidad de dominio (con validaciones automáticas)
   * 4. Persiste el producto en la base de datos
   * 5. Confirma la transacción si todo es exitoso
   * 6. Revierte la transacción si hay algún error
   * 
   * @param {Object} productData - Datos del producto a crear
   * @param {string} productData.name - Nombre del producto
   * @param {number} productData.price - Precio del producto
   * @param {number} productData.stock - Cantidad en inventario
   * 
   * @returns {Promise<Result<Product, AppError>>} Resultado de la operación
   * 
   * @example
   * const result = await createProductUseCase.execute({
   *   name: "Laptop Gaming",
   *   price: 1299.99,
   *   stock: 15
   * });
   * 
   * if (result.isSuccess) {
   *   console.log('Producto creado:', result.value);
   * } else {
   *   console.error('Error:', result.error.message);
   * }
   */
  async execute(productData) {
    // Ejecutar toda la operación dentro de una transacción
    // Esto garantiza consistencia ACID
    return this.uow.run(async (transaction) => {
      
      // === VALIDACIÓN DE REGLAS DE NEGOCIO ===
      
      // Verificar que no exista un producto con el mismo nombre
      // Esta es una regla de negocio crítica para mantener unicidad
      const existingProduct = await this.productRepository.findByName(
        productData.name, 
        transaction
      );
      
      if (existingProduct) {
        return fail(
          new AppError(
            "PRODUCT_ALREADY_EXISTS", 
            `Ya existe un producto con el nombre "${productData.name}"`, 
            400
          )
        );
      }

      // === CREACIÓN DE ENTIDAD DE DOMINIO ===
      
      try {
        // La entidad Product se auto-valida en el constructor
        // Si los datos son inválidos, lanzará una excepción
        const productEntity = new Product(productData);
        
        // === PERSISTENCIA ===
        
        // Delegar la persistencia al repositorio
        // El repositorio maneja los detalles de la base de datos
        const createdProduct = await this.productRepository.create(
          productEntity, 
          transaction
        );
        
        // Verificar que la persistencia fue exitosa
        if (!createdProduct) {
          return fail(
            new AppError(
              "PRODUCT_NOT_CREATED",
              "El producto no pudo ser creado en la base de datos",
              500
            )
          );
        }
        
        // === RESULTADO EXITOSO ===
        return ok(createdProduct);
        
      } catch (domainError) {
        // Capturar errores de validación de la entidad de dominio
        return fail(
          new AppError(
            "VALIDATION_ERROR",
            `Datos del producto inválidos: ${domainError.message}`,
            400
          )
        );
      }
    });
  }
}
