/**
 * Unit of Work - Implementación con Sequelize
 * 
 * Implementa el patrón Unit of Work para manejar transacciones de base de datos
 * de manera consistente y garantizar las propiedades ACID en operaciones complejas.
 * 
 * El patrón Unit of Work:
 * - Mantiene una lista de objetos afectados por una transacción de negocio
 * - Coordina la escritura de cambios y resuelve problemas de concurrencia
 * - Garantiza que todas las operaciones se completen exitosamente o se reviertan
 * - Proporciona un punto único de control para transacciones
 * 
 * Beneficios:
 * - Garantiza consistencia ACID en operaciones múltiples
 * - Simplifica el manejo de transacciones en casos de uso
 * - Reduce el acoplamiento entre lógica de negocio y detalles de persistencia
 * - Facilita el testing con transacciones mock
 * 
 * Casos de uso típicos:
 * - Crear un producto y actualizar inventario
 * - Procesar una orden con múltiples productos
 * - Operaciones que afectan múltiples entidades relacionadas
 * 
 * @class SequelizeUnitOfWork
 * @author Backend Team
 */

import { Transaction } from 'sequelize';

export class SequelizeUnitOfWork {
  
  /**
   * Constructor del Unit of Work
   * 
   * @param {Sequelize} sequelize - Instancia configurada de Sequelize
   */
  constructor(sequelize) {
    /**
     * Instancia de Sequelize para manejo de transacciones
     * @type {Sequelize}
     * @private
     */
    this.sequelize = sequelize;
  }

  /**
   * Ejecuta una función dentro de una transacción de base de datos
   * 
   * Proporciona un contexto transaccional seguro donde todas las operaciones
   * de base de datos se ejecutan de manera atómica. Si cualquier operación
   * falla, toda la transacción se revierte automáticamente.
   * 
   * Características:
   * - Aislamiento: Las operaciones no son visibles hasta el commit
   * - Consistencia: Se mantiene la integridad referencial
   * - Atomicidad: Todo se ejecuta o nada se ejecuta
   * - Durabilidad: Los cambios confirmados persisten
   * 
   * @param {Function} fn - Función que contiene las operaciones transaccionales
   * @param {Transaction} fn.transaction - Objeto de transacción de Sequelize
   * @returns {Promise<any>} Resultado de la función ejecutada
   * 
   * @throws {Error} Si cualquier operación dentro de la transacción falla
   * 
   * @example
   * // Uso básico
   * const result = await unitOfWork.run(async (tx) => {
   *   const product = await productRepository.create(newProduct, tx);
   *   await inventoryRepository.updateStock(product.id, initialStock, tx);
   *   return product;
   * });
   * 
   * @example
   * // Manejo de errores
   * try {
   *   await unitOfWork.run(async (tx) => {
   *     // Operaciones que pueden fallar
   *     await repository1.create(data1, tx);
   *     await repository2.update(data2, tx);
   *   });
   * } catch (error) {
   *   console.error('Transacción fallida:', error.message);
   *   // La transacción ya fue revertida automáticamente
   * }
   */
  async run(fn) {
    // Iniciar una nueva transacción con configuración básica
    const transaction = await this.sequelize.transaction();

    try {
      // === EJECUCIÓN DE LA FUNCIÓN TRANSACCIONAL ===
      
      // Ejecutar la función proporcionada pasando la transacción
      // Todas las operaciones de repositorio deben usar esta transacción
      const result = await fn(transaction);
      
      // === CONFIRMACIÓN DE LA TRANSACCIÓN ===
      
      // Si llegamos aquí, todas las operaciones fueron exitosas
      // Confirmar todos los cambios en la base de datos
      await transaction.commit();
      
      // Logging de éxito en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Transacción confirmada exitosamente');
      }
      
      return result;
      
    } catch (error) {
      // === MANEJO DE ERRORES Y ROLLBACK ===
      
      try {
        // Revertir todos los cambios realizados en la transacción
        await transaction.rollback();
        
        // Logging de rollback en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Transacción revertida debido a error:', error.message);
        }
        
      } catch (rollbackError) {
        // Error crítico: no se pudo revertir la transacción
        console.error('💥 Error crítico en rollback:', rollbackError);
        
        // En producción, esto debería alertar al equipo de operaciones
        // TODO: Implementar alertas de monitoreo
      }
      
      // Re-lanzar el error original para que el llamador pueda manejarlo
      throw error;
    }
  }
}
