// P U E R T O  (contrato que la Infra debe cumplir)
/**
 * @typedef {import('../Entities/Product.js').Product} Product
 * @interface ProductRepositoryPort
 * create(product: Product, tx?): Promise<Product>
 * getAll(tx?): Promise<Product|null>
 */
export const ProductRepositoryPort = {}; // marcador, contrato por documentación
