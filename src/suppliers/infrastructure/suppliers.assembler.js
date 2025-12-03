// src/suppliers/infrastructure/suppliers.assembler.js
import Supplier from '../domain/model/supplier.entity.js';

export class SupplierAssembler {
    /**
     * Convierte un DTO en una entidad Supplier.
     * @param {Object} resource - El objeto DTO del proveedor.
     * @returns {Supplier}
     */
    static toDomain(resource) {
        return new Supplier({
            idSupplier: resource.idSupplier ?? resource.id, // <-- mapea ambos
            name: resource.name,
            contact: resource.contact,
            type: resource.type,
            email: resource.email
        });
    }

    /**
     * Convierte una respuesta de la API en una lista de entidades Supplier.
     * @param {import('axios').AxiosResponse} response
     * @returns {Supplier[]}
     */
    static toDomainList(response) {
        if (response.status !== 200) {
            console.error(`Error ${response.status}: ${response.statusText} al obtener la lista de proveedores.`);
            return [];
        }

        let resources = Array.isArray(response.data) ? response.data : response.data.suppliers;

        if (!resources) {
            console.warn("La respuesta de la API no tiene la propiedad 'suppliers' o no es un array.");
            return [];
        }

        return resources.map(resource => SupplierAssembler.toDomain(resource));
    }

    /**
     * Convierte una entidad Supplier en un recurso listo para la API.
     * @param {Supplier} supplierEntity
     * @returns {object}
     */
    static toResource(supplierEntity) {
        const resource = {
            name: supplierEntity.name,
            contact: supplierEntity.contact,
            type: supplierEntity.type,
            email: supplierEntity.email
        };

        if (supplierEntity.idSupplier !== null && supplierEntity.idSupplier !== undefined) {
            resource.idSupplier = supplierEntity.idSupplier;
        }

        return resource;
    }
}

