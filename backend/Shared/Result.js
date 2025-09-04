/**
 * Patrón Result - Manejo Explícito de Errores
 * 
 * Implementa el patrón Result (también conocido como Either) para manejar
 * operaciones que pueden fallar sin usar excepciones. Esto hace que el
 * manejo de errores sea explícito y parte del flujo normal del programa.
 * 
 * Beneficios del patrón Result:
 * - Hace que los errores sean explícitos en las firmas de métodos
 * - Elimina la necesidad de try/catch en muchos casos
 * - Mejora la legibilidad y mantenibilidad del código
 * - Facilita la composición de operaciones que pueden fallar
 * - Previene errores no manejados accidentalmente
 * 
 * Inspirado en:
 * - Rust's Result<T, E>
 * - F#'s Result type
 * - Haskell's Either monad
 * 
 * @class Result
 * @template T - Tipo del valor en caso de éxito
 * @template E - Tipo del error en caso de falla
 * @author Backend Team
 */

export class Result {
  
  /**
   * Constructor privado de Result
   * 
   * No debe usarse directamente. Usar los métodos estáticos
   * success() y failure() para crear instancias.
   * 
   * @param {boolean} isSuccess - Indica si la operación fue exitosa
   * @param {T|null} value - Valor en caso de éxito
   * @param {E|null} error - Error en caso de falla
   * 
   * @private
   */
  constructor(isSuccess, value, error) {
    /**
     * Indica si la operación fue exitosa
     * @type {boolean}
     * @readonly
     */
    this.isSuccess = isSuccess;
    
    /**
     * Indica si la operación falló (inverso de isSuccess)
     * @type {boolean}
     * @readonly
     */
    this.isFailure = !isSuccess;
    
    /**
     * Valor resultante en caso de éxito
     * Solo debe accederse si isSuccess es true
     * @type {T|null}
     * @readonly
     */
    this.value = value;
    
    /**
     * Error en caso de falla
     * Solo debe accederse si isFailure es true
     * @type {E|null}
     * @readonly
     */
    this.error = error;
    
    // Congelar el objeto para inmutabilidad
    Object.freeze(this);
  }

  /**
   * Crea un Result exitoso con un valor
   * 
   * @template T
   * @param {T} value - Valor del resultado exitoso
   * @returns {Result<T, never>} Result que representa éxito
   * 
   * @static
   * @example
   * const result = Result.success("Operación completada");
   * console.log(result.isSuccess); // true
   * console.log(result.value); // "Operación completada"
   */
  static success(value) {
    return new Result(true, value, null);
  }

  /**
   * Crea un Result fallido con un error
   * 
   * @template E
   * @param {E} error - Error que causó la falla
   * @returns {Result<never, E>} Result que representa falla
   * 
   * @static
   * @example
   * const result = Result.failure(new Error("Algo salió mal"));
   * console.log(result.isFailure); // true
   * console.log(result.error.message); // "Algo salió mal"
   */
  static failure(error) {
    return new Result(false, null, error);
  }
  
  /**
   * Métodos de utilidad para trabajar con Results:
   */
  
  /**
   * Transforma el valor si el Result es exitoso
   * 
   * @template U
   * @param {function(T): U} fn - Función de transformación
   * @returns {Result<U, E>} Nuevo Result con valor transformado
   * 
   * @example
   * const result = Result.success(5);
   * const doubled = result.map(x => x * 2);
   * console.log(doubled.value); // 10
   */
  map(fn) {
    if (this.isSuccess) {
      try {
        return Result.success(fn(this.value));
      } catch (error) {
        return Result.failure(error);
      }
    }
    return this;
  }
  
  /**
   * Transforma el error si el Result es fallido
   * 
   * @template F
   * @param {function(E): F} fn - Función de transformación del error
   * @returns {Result<T, F>} Nuevo Result con error transformado
   * 
   * @example
   * const result = Result.failure(new Error("Error original"));
   * const mapped = result.mapError(err => new AppError("MAPPED", err.message));
   */
  mapError(fn) {
    if (this.isFailure) {
      try {
        return Result.failure(fn(this.error));
      } catch (error) {
        return Result.failure(error);
      }
    }
    return this;
  }
  
  /**
   * Encadena operaciones que retornan Result
   * 
   * @template U
   * @param {function(T): Result<U, E>} fn - Función que retorna Result
   * @returns {Result<U, E>} Result de la operación encadenada
   * 
   * @example
   * const result = Result.success(5)
   *   .flatMap(x => x > 0 ? Result.success(x * 2) : Result.failure("Negative"))
   *   .flatMap(x => Result.success(x.toString()));
   */
  flatMap(fn) {
    if (this.isSuccess) {
      try {
        return fn(this.value);
      } catch (error) {
        return Result.failure(error);
      }
    }
    return this;
  }
  
  /**
   * Obtiene el valor o un valor por defecto
   * 
   * @param {T} defaultValue - Valor por defecto si el Result es fallido
   * @returns {T} El valor del Result o el valor por defecto
   * 
   * @example
   * const success = Result.success("hello");
   * const failure = Result.failure("error");
   * 
   * console.log(success.getOrElse("default")); // "hello"
   * console.log(failure.getOrElse("default")); // "default"
   */
  getOrElse(defaultValue) {
    return this.isSuccess ? this.value : defaultValue;
  }
  
  /**
   * Obtiene el valor o lanza el error
   * 
   * @returns {T} El valor del Result
   * @throws {E} El error si el Result es fallido
   * 
   * @example
   * const success = Result.success("hello");
   * const failure = Result.failure(new Error("oops"));
   * 
   * console.log(success.unwrap()); // "hello"
   * failure.unwrap(); // Lanza Error("oops")
   */
  unwrap() {
    if (this.isSuccess) {
      return this.value;
    }
    throw this.error;
  }
  
  /**
   * Convierte el Result a una representación JSON
   * 
   * @returns {Object} Representación JSON del Result
   */
  toJSON() {
    return {
      isSuccess: this.isSuccess,
      isFailure: this.isFailure,
      value: this.value,
      error: this.error
    };
  }
  
  /**
   * Representación en string del Result
   * 
   * @returns {string} Representación textual
   */
  toString() {
    if (this.isSuccess) {
      return `Result.Success(${JSON.stringify(this.value)})`;
    } else {
      return `Result.Failure(${this.error})`;
    }
  }
}

// === FUNCIONES DE CONVENIENCIA ===

/**
 * Función de conveniencia para crear un Result exitoso
 * 
 * @template T
 * @param {T} value - Valor del resultado exitoso
 * @returns {Result<T, never>} Result exitoso
 * 
 * @example
 * const result = ok("Success!");
 * // Equivalente a: Result.success("Success!")
 */
export const ok = (value) => Result.success(value);

/**
 * Función de conveniencia para crear un Result fallido
 * 
 * @template E
 * @param {E} error - Error que causó la falla
 * @returns {Result<never, E>} Result fallido
 * 
 * @example
 * const result = fail(new Error("Something went wrong"));
 * // Equivalente a: Result.failure(new Error("Something went wrong"))
 */
export const fail = (error) => Result.failure(error);

// === FUNCIONES DE UTILIDAD PARA MÚLTIPLES RESULTS ===

/**
 * Combina múltiples Results en uno solo
 * Si todos son exitosos, retorna un Result con array de valores
 * Si alguno falla, retorna el primer fallo encontrado
 * 
 * @template T
 * @param {Result<T, any>[]} results - Array de Results a combinar
 * @returns {Result<T[], any>} Result combinado
 * 
 * @example
 * const results = [ok(1), ok(2), ok(3)];
 * const combined = Result.combine(results);
 * console.log(combined.value); // [1, 2, 3]
 * 
 * @static
 * @todo Implementar en versión futura
 */
// Result.combine = function(results) {
//   const values = [];
//   for (const result of results) {
//     if (result.isFailure) {
//       return result;
//     }
//     values.push(result.value);
//   }
//   return Result.success(values);
// };