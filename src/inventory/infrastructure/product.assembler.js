import Product from '../domain/model/product.entity.js';

export class ProductAssembler {
    static toDomain(resource = {}) {
        const domainData = {
            id: resource?.id ?? resource?._id ?? null,
            name: resource?.name ?? '',
            unitPrice: resource?.unitPrice ?? 0,
            totalPrice: resource?.totalPrice ?? (resource?.unitPrice ?? 0) * (resource?.quantity ?? 0),
            quantity: resource?.quantity ?? 0,
            expirationDate: resource?.expirationDate ?? null,
            category: resource?.category ?? '',
            deleted: resource?.deleted ?? false,
        };
        return new Product(domainData);
    }

    static toDomainList(response) {
        let resources = null;

        if (Array.isArray(response)) {
            resources = response;
        } else if (response && Array.isArray(response.data)) {
            resources = response.data;
        } else if (response && Array.isArray(response.data?.products)) {
            resources = response.data.products;
        } else if (response && Array.isArray(response.products)) {
            resources = response.products;
        } else {
            console.warn("ProductAssembler: respuesta API sin lista de productos reconocible.");
            return [];
        }

        return resources.map(resource => ProductAssembler.toDomain(resource));
    }

    static toResource(productEntity) {
        const resource = {
            name: productEntity.name,
            unitPrice: productEntity.unitPrice,
            quantity: productEntity.quantity,
            expirationDate: productEntity.expirationDate,
            category: productEntity.category,
            deleted: productEntity.deleted ?? false,
        };

        if (productEntity.id !== null && productEntity.id !== undefined) {
            resource.id = productEntity.id;
        }

        return resource;
    }
}
