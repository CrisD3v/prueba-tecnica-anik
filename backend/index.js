/**
 * Punto de entrada principal de la aplicación
 * 
 * Este archivo configura e inicializa toda la aplicación siguiendo el patrón de
 * arquitectura hexagonal con inyección de dependencias.
 * 
 * Flujo de inicialización:
 * 1. Conexión y autenticación con la base de datos
 * 2. Construcción del contenedor de dependencias (IoC)
 * 3. Sincronización de modelos de Sequelize
 * 4. Configuración del servidor Express
 * 5. Registro de middlewares y rutas
 * 6. Inicio del servidor HTTP
 * 
 * @author Backend Team
 * @version 1.0.0
 */

import express from 'express';
import { buildContainer } from './Config/container.js';
import { sequelize } from './Config/Db.js';
import { env } from './Config/env.js';
import { globalErrorHandler } from './Shared/errorHandler.js';

/**
 * Función principal que inicializa la aplicación
 * 
 * Maneja todo el proceso de bootstrap de la aplicación, incluyendo:
 * - Configuración de la base de datos
 * - Inyección de dependencias
 * - Configuración del servidor web
 * 
 * @async
 * @function main
 * @throws {Error} Si falla algún paso crítico de la inicialización
 */
async function main() {
  try {
    // === FASE 1: INICIALIZACIÓN DE BASE DE DATOS ===
    console.log('Conectando a la base de datos...');
    
    // Verifica que la conexión a PostgreSQL sea válida
    // Lanza excepción si no puede conectar
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    // === FASE 2: CONFIGURACIÓN DE DEPENDENCIAS ===
    console.log('Construyendo contenedor de dependencias...');
    
    // Construye el contenedor IoC con todas las dependencias registradas
    // Esto incluye repositorios, servicios, casos de uso y routers
    const container = buildContainer();
    
    // === FASE 3: SINCRONIZACIÓN DE ESQUEMA ===
    console.log('Sincronizando modelos...');
    
    // Sincroniza los modelos de Sequelize con la base de datos
    // force: false evita recrear tablas existentes
    // En producción, usar migraciones en lugar de sync()
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados.');

    // === FASE 4: CONFIGURACIÓN DEL SERVIDOR EXPRESS ===
    const app = express();
    
    // Middleware para parsear JSON en requests
    // Límite por defecto: 100kb
    app.use(express.json());

    // === FASE 5: REGISTRO DE RUTAS ===
    // Los routers se resuelven desde el contenedor IoC
    // Esto permite inyección automática de dependencias
    app.use('/api/products', container.resolve('productRouter'));

    // === FASE 6: MIDDLEWARE DE MANEJO DE ERRORES ===
    // Debe ser el último middleware registrado
    // Captura todos los errores no manejados en las rutas
    app.use(globalErrorHandler);

    // === FASE 7: INICIO DEL SERVIDOR ===
    app.listen(env.PORT, () => {
      console.log(`🚀 API ejecutándose en http://localhost:${env.PORT}`);
      console.log(`📚 Documentación disponible en /docs`);
      console.log(`🔧 Ambiente: ${env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  }
}

// Ejecuta la función principal y maneja errores fatales
main().catch((error) => {
  console.error('💥 Error fatal:', error);
  
  // Cierra la conexión a la base de datos si existe
  if (sequelize) {
    sequelize.close();
  }
  
  // Termina el proceso con código de error
  process.exit(1);
});
