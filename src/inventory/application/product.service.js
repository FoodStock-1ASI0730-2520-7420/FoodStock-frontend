import { InventoryApi } from '../infrastructure/inventory-api';

/**
 * ProductService: Orquesta operaciones de negocio para la entidad Product.
 * Depende de InventoryApi para persistencia.
 */
export class ProductService {
    #inventoryApi;

    constructor(inventoryApi = new InventoryApi()) {
        this.#inventoryApi = inventoryApi;
    }

    /**
     * Obtiene todos los productos.
     * @returns {Promise<Product[]>}
     */
    async getProducts() {
        console.log("ProductService: Ejecutando caso de uso 'getProducts'...");
        return this.#inventoryApi.getProducts();
    }

    /**
     * Crea un nuevo producto.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async createProduct(productEntity) {
        console.log("ProductService: Ejecutando caso de uso 'createProduct'...");
        if (!productEntity.name) {
            throw new Error("ProductServiceError: El nombre del producto no puede estar vacío.");
        }
        return this.#inventoryApi.createProduct(productEntity);
    }

    /**
     * Actualiza un producto existente.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async updateProduct(productEntity) {
        if (!productEntity.id) {
            throw new Error("ProductServiceError: El ID del producto es requerido para actualizar.");
        }
        console.log("ProductService: Ejecutando caso de uso 'updateProduct'...");
        return this.#inventoryApi.updateProduct(productEntity);
    }

    /**
     * Elimina un producto por ID.
     * @param {number|string} id
     * @returns {Promise<any>}
     */
    deleteProduct(id) {
        console.log(`ProductService: Ejecutando caso de uso 'deleteProduct' con ID: ${id}`);
        return this.#inventoryApi.deleteProduct(id);
    }

    /**
     * Consume stock de un producto.
     * @param {number|string} id
     * @param {number} amount
     * @returns {Promise<Product>}
     */
    async consumeProduct(id, amount) {
        if (!id || amount <= 0) {
            throw new Error("ProductServiceError: ID y cantidad válidos son requeridos para consumir stock.");
        }
        console.log(`ProductService: Ejecutando caso de uso 'consumeProduct' con ID: ${id}, amount: ${amount}`);
        return this.#inventoryApi.consumeProduct(id, { amount });
    }
}
