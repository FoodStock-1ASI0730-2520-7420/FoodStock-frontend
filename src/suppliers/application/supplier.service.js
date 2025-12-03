
import { SuppliersApi } from '../infrastructure/suppliers-api.js';

/**
 * SupplierService: Orquesta operaciones de negocio para la entidad Supplier.
 * Depende de SuppliersApi para persistencia.
 */
export class SupplierService {
    #suppliersApi;

    /**
     * Inicializa el servicio con la API.
     * @param {SuppliersApi} [suppliersApi=new SuppliersApi()]
     */
    constructor(suppliersApi = new SuppliersApi()) {
        this.#suppliersApi = suppliersApi;
    }

    /**
     * Obtiene todos los proveedores.
     * @returns {Promise<Supplier[]>}
     */
    async getSuppliers() {
        console.log("SupplierService: Ejecutando caso de uso 'getSuppliers'...");
        return this.#suppliersApi.getSuppliers();
    }

    /**
     * Crea un nuevo proveedor.
     * @param {Supplier} supplierEntity
     * @returns {Promise<Supplier>}
     */
    async createSupplier(supplierEntity) {
        console.log("SupplierService: Ejecutando caso de uso 'createSupplier'...");
        if (!supplierEntity.name) {
            throw new Error("SupplierServiceError: El nombre del proveedor no puede estar vacío.");
        }
        return this.#suppliersApi.createSupplier(supplierEntity);
    }

    /**
     * Actualiza un proveedor existente.
     * @param {Supplier} supplierEntity
     * @returns {Promise<Supplier>}
     */
    async updateSupplier(supplierEntity) {
        if (!supplierEntity.idSupplier) {
            throw new Error("SupplierServiceError: El ID del proveedor es requerido para actualizar.");
        }
        console.log("SupplierService: Ejecutando caso de uso 'updateSupplier'...");
        return this.#suppliersApi.updateSupplier(supplierEntity);
    }

    /**
     * Elimina un proveedor por ID.
     * @param {number|string} id
     * @returns {Promise<any>}
     */
    deleteSupplier(id) {
        console.log(`SupplierService: Ejecutando caso de uso 'deleteSupplier' con ID: ${id}`);
        return this.#suppliersApi.deleteSupplier(id);
    }
}
