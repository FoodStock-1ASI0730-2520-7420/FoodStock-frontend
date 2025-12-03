import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { ProductAssembler } from './product.assembler.js';
import { DishAssembler } from './dish.assembler.js';
import {BaseApi} from "../../shared/infrastructure/base-api.js";

const productsEndpointPath = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH || 'products';
const dishesEndpointPath = import.meta.env.VITE_DISHES_ENDPOINT_PATH || 'dishes';

export class InventoryApi extends BaseApi {
    #productsEndpoint;
    #dishesEndpoint;

    constructor() {
        super();
        this.#productsEndpoint = new BaseEndpoint(this, productsEndpointPath);
        this.#dishesEndpoint = new BaseEndpoint(this, dishesEndpointPath);
    }

    // Products
    async getProducts() {
        const response = await this.#productsEndpoint.getAll();
        return ProductAssembler.toDomainList(response);
    }

    async getProductById(id) {
        const response = await this.#productsEndpoint.getById(id);
        return ProductAssembler.toDomain(response.data);
    }

    async createProduct(productEntity) {
        const resource = ProductAssembler.toResource(productEntity);
        const response = await this.#productsEndpoint.create(resource);
        return ProductAssembler.toDomain(response.data);
    }

    async updateProduct(productEntity) {
        if (!productEntity.id) throw new Error("Product ID is required for update."); // ✅ corregido
        const resource = ProductAssembler.toResource(productEntity);
        const response = await this.#productsEndpoint.update(productEntity.id, resource);
        return ProductAssembler.toDomain(response.data);
    }

    deleteProduct(id) {
        return this.#productsEndpoint.delete(id);
    }

    async consumeProduct(id, resource) {
        if (!id) throw new Error("Product ID is required for consume.");
        const response = await this.#productsEndpoint.update(`${id}/consume`, resource); // ✅ usa endpoint /consume
        return ProductAssembler.toDomain(response.data);
    }

    // Dishes
    async getDishes() {
        const response = await this.#dishesEndpoint.getAll();
        return DishAssembler.toDomainList(response);
    }

    async getDishById(id) {
        const response = await this.#dishesEndpoint.getById(id);
        return DishAssembler.toDomain(response.data);
    }

    async createDish(dishEntity) {
        const resource = DishAssembler.toResource(dishEntity);
        const response = await this.#dishesEndpoint.create(resource);
        return DishAssembler.toDomain(response.data);
    }

    async updateDish(dishEntity) {
        if (!dishEntity.id) throw new Error("Dish ID is required for update.");
        const resource = DishAssembler.toResource(dishEntity);
        const response = await this.#dishesEndpoint.update(dishEntity.id, resource);
        return DishAssembler.toDomain(response.data);
    }

    deleteDish(id) {
        return this.#dishesEndpoint.delete(id);
    }
}
