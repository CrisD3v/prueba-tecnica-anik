/**
 * Script de Inicialización de Base de Datos
 * 
 * Script utilitario para configurar la base de datos desde cero,
 * incluyendo la creación de tablas y datos de ejemplo para desarrollo.
 * 
 * Funcionalidades:
 * - Verifica la conexión a PostgreSQL
 * - Registra todos los modelos de Sequelize
 * - Crea/recrea las tablas de la base de datos
 * - Inserta datos de ejemplo para desarrollo
 * - Maneja errores y limpia recursos apropiadamente
 * 
 * Uso:
 * - Desarrollo: Configuración inicial del entorno
 * - Testing: Preparación de base de datos de pruebas
 * - CI/CD: Inicialización automática en pipelines
 * 
 * ADVERTENCIA: Este script usa { force: true } que ELIMINA
 * todas las tablas existentes. NO usar en producción.
 * 
 * @module InitDatabase
 * @author Backend Team
 */

import { sequelize } from '../Config/Db.js';
import { buildProductModel } from '../Infraestructure/Products/Models/ProductModel.js';

/**
 * Función principal de inicialización de la base de datos
 * 
 * Ejecuta todo el proceso de configuración de la base de datos
 * de manera secuencial, manejando errores y limpiando recursos.
 * 
 * Proceso:
 * 1. Verificar conexión a PostgreSQL
 * 2. Registrar modelos de Sequelize
 * 3. Sincronizar esquema (crear/recrear tablas)
 * 4. Insertar datos de ejemplo
 * 5. Cerrar conexión limpiamente
 * 
 * @async
 * @function initDatabase
 * @throws {Error} Si falla algún paso crítico de la inicialización
 */
async function initDatabase() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Iniciando configuración de base de datos...');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🌍 Ambiente:', process.env.NODE_ENV || 'development');
    
    // === FASE 1: VERIFICACIÓN DE CONEXIÓN ===
    console.log('\n📡 Verificando conexión a PostgreSQL...');
    
    try {
      // Intentar autenticación con la base de datos
      await sequelize.authenticate();
      console.log('✅ Conexión a PostgreSQL establecida correctamente');
      
      // Mostrar información de la conexión
      const dbConfig = sequelize.config;
      console.log(`   📊 Base de datos: ${dbConfig.database}`);
      console.log(`   🏠 Host: ${dbConfig.host}:${dbConfig.port || 5432}`);
      console.log(`   👤 Usuario: ${dbConfig.username}`);
      
    } catch (connectionError) {
      console.error('❌ Error de conexión a PostgreSQL:');
      console.error('   Mensaje:', connectionError.message);
      console.error('   Código:', connectionError.original?.code);
      
      // Sugerencias de solución comunes
      console.error('\n💡 Posibles soluciones:');
      console.error('   - Verificar que PostgreSQL esté ejecutándose');
      console.error('   - Revisar credenciales en el archivo .env');
      console.error('   - Confirmar que la base de datos existe');
      console.error('   - Verificar configuración de red/firewall');
      
      throw connectionError;
    }

    // === FASE 2: REGISTRO DE MODELOS ===
    console.log('\n📋 Registrando modelos de Sequelize...');
    
    try {
      // Construir y registrar el modelo Product
      const ProductModel = buildProductModel(sequelize);
      console.log('✅ Modelo Product registrado correctamente');
      
      // TODO: Registrar modelos adicionales aquí
      // const UserModel = buildUserModel(sequelize);
      // const OrderModel = buildOrderModel(sequelize);
      
      console.log(`   📊 Total de modelos registrados: 1`);
      
    } catch (modelError) {
      console.error('❌ Error registrando modelos:', modelError.message);
      throw modelError;
    }

    // === FASE 3: SINCRONIZACIÓN DE ESQUEMA ===
    console.log('\n🔄 Sincronizando esquema de base de datos...');
    
    // ADVERTENCIA: force: true elimina todas las tablas existentes
    console.log('⚠️  ADVERTENCIA: Se eliminarán todas las tablas existentes');
    
    try {
      // Sincronizar con force: true para recrear tablas
      // En producción, usar migraciones en lugar de sync()
      await sequelize.sync({ 
        force: true,  // PELIGROSO: Elimina tablas existentes
        logging: (sql) => console.log(`   🔍 SQL: ${sql}`)
      });
      
      console.log('✅ Esquema sincronizado correctamente');
      console.log('   📋 Todas las tablas han sido creadas/recreadas');
      
    } catch (syncError) {
      console.error('❌ Error sincronizando esquema:', syncError.message);
      throw syncError;
    }

    // === FASE 4: INSERCIÓN DE DATOS DE EJEMPLO ===
    console.log('\n📦 Insertando datos de ejemplo...');
    
    try {
      // Obtener el modelo registrado
      const ProductModel = sequelize.models.Product;
      
      // Datos de ejemplo para desarrollo
      const sampleProducts = [
        {
          name: 'Laptop Gaming ROG Strix',
          price: 1299.99,
          stock: 15
        },
        {
          name: 'Mouse Inalámbrico Logitech',
          price: 79.99,
          stock: 50
        },
        {
          name: 'Teclado Mecánico RGB',
          price: 149.99,
          stock: 25
        },
        {
          name: 'Monitor 4K 27 pulgadas',
          price: 399.99,
          stock: 8
        },
        {
          name: 'Auriculares Gaming',
          price: 199.99,
          stock: 30
        }
      ];
      
      // Insertar productos de ejemplo
      const createdProducts = await ProductModel.bulkCreate(sampleProducts);
      
      console.log(`✅ ${createdProducts.length} productos de ejemplo creados:`);
      createdProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`);
      });
      
    } catch (dataError) {
      console.error('❌ Error insertando datos de ejemplo:', dataError.message);
      
      // Los datos de ejemplo no son críticos, continuar
      console.log('⚠️  Continuando sin datos de ejemplo...');
    }

    // === FINALIZACIÓN EXITOSA ===
    const duration = Date.now() - startTime;
    console.log('\n🎉 Inicialización completada exitosamente!');
    console.log(`⏱️  Tiempo total: ${duration}ms`);
    console.log('🚀 La base de datos está lista para usar');
    
  } catch (error) {
    // === MANEJO DE ERRORES CRÍTICOS ===
    const duration = Date.now() - startTime;
    
    console.error('\n💥 Error crítico durante la inicialización:');
    console.error('   Mensaje:', error.message);
    console.error('   Tipo:', error.constructor.name);
    console.error(`   Tiempo transcurrido: ${duration}ms`);
    
    // Mostrar stack trace en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('\n📋 Stack trace:');
      console.error(error.stack);
    }
    
    // Sugerir acciones de recuperación
    console.error('\n🔧 Acciones sugeridas:');
    console.error('   1. Verificar configuración en .env');
    console.error('   2. Confirmar que PostgreSQL esté ejecutándose');
    console.error('   3. Revisar permisos de base de datos');
    console.error('   4. Consultar logs de PostgreSQL');
    
    // Re-lanzar el error para que el proceso termine con código de error
    throw error;
    
  } finally {
    // === LIMPIEZA DE RECURSOS ===
    console.log('\n🧹 Cerrando conexión a la base de datos...');
    
    try {
      // Cerrar todas las conexiones de Sequelize
      await sequelize.close();
      console.log('✅ Conexión cerrada correctamente');
      
    } catch (closeError) {
      console.error('⚠️  Error cerrando conexión:', closeError.message);
      // No re-lanzar, ya que es limpieza
    }
  }
}

// === EJECUCIÓN DEL SCRIPT ===

// Ejecutar la función principal y manejar el resultado
initDatabase()
  .then(() => {
    console.log('\n✨ Script completado exitosamente');
    process.exit(0); // Salir con código de éxito
  })
  .catch((error) => {
    console.error('\n💀 Script falló:', error.message);
    process.exit(1); // Salir con código de error
  });

// === MANEJO DE SEÑALES DEL SISTEMA ===

// Manejar interrupción del usuario (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n⚠️  Interrupción detectada, cerrando conexiones...');
  
  try {
    await sequelize.close();
    console.log('✅ Conexiones cerradas correctamente');
  } catch (error) {
    console.error('❌ Error cerrando conexiones:', error.message);
  }
  
  process.exit(0);
});

// Manejar terminación del proceso
process.on('SIGTERM', async () => {
  console.log('\n⚠️  Terminación solicitada, limpiando recursos...');
  
  try {
    await sequelize.close();
    console.log('✅ Recursos limpiados correctamente');
  } catch (error) {
    console.error('❌ Error limpiando recursos:', error.message);
  }
  
  process.exit(0);
});