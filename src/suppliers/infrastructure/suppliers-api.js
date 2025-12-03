// src/suppliers/infrastructure/suppliers-api.js

import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { SupplierAssembler } from "./suppliers.assembler.js";

const suppliersEndpointPath = import.meta.env.VITE_SUPPLIERS_ENDPOINT_PATH || 'suppliers';

export class SuppliersApi extends BaseApi {
    #suppliersEndpoint;

    constructor() {
        super();
        this.#suppliersEndpoint = new BaseEndpoint(this, suppliersEndpointPath);
    }

    /**
     * Obtiene todos los proveedores.
     * @returns {Promise<Supplier[]>}
     */
    async getSuppliers() {
        const response = await this.#suppliersEndpoint.getAll();
        return SupplierAssembler.toDomainList(response);
    }

    /**
     * Obtiene un proveedor por su ID.
     * @param {number|string} id
     * @returns {Promise<Supplier>}
     */
    async getSupplierById(id) {
        const response = await this.#suppliersEndpoint.getById(id);
        return SupplierAssembler.toDomain(response.data);
    }

    /**
     * Crea un nuevo proveedor.
     * @param {Supplier} supplierDto
     * @returns {Promise<Supplier>}
     */
    async createSupplier(supplierDto) {
        const supplierEntity = SupplierAssembler.toDomain(supplierDto);
        const resource = SupplierAssembler.toResource(supplierEntity);
        const response = await this.#suppliersEndpoint.create(resource);
        return SupplierAssembler.toDomain(response.data);
    }

    /**
     * Actualiza un proveedor existente.
     * @param {Supplier} supplierEntity
     * @returns {Promise<Supplier>}
     */
    async updateSupplier(supplierEntity) {
        if (!supplierEntity.idSupplier) throw new Error("Supplier ID is required for update.");
        const resource = SupplierAssembler.toResource(supplierEntity);
        const response = await this.#suppliersEndpoint.update(supplierEntity.idSupplier, resource);
        return SupplierAssembler.toDomain(response.data);
    }

    /**
     * Elimina un proveedor por su ID.
     * @param {number|string} id
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteSupplier(id) {
        return this.#suppliersEndpoint.delete(id);
    }
}
