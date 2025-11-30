import { Dish } from '../domain/model/dish.entity.js';

export class DishAssembler {
    static toDomain(resource = {}) {
        const domainData = {
            id: resource.id ?? null,
            name: resource.name ?? '',
            priceUnit: resource.priceUnit ?? 0, // ✅ agregado
            ingredients: Array.isArray(resource.ingredients) ? resource.ingredients : [],
        };
        return new Dish(domainData);
    }

    static toDomainList(response) {
        if (response.status !== 200) {
            console.error(`Error ${response.status}: ${response.statusText} al obtener dishes.`);
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : [];
        if (!resources) return [];
        return resources.map(r => DishAssembler.toDomain(r));
    }

    static toResource(dishEntity) {
        const resource = {
            name: dishEntity.name,
            priceUnit: dishEntity.priceUnit, // ✅ agregado
            ingredients: dishEntity.ingredients || [],
        };
        if (dishEntity.id !== null && dishEntity.id !== undefined) {
            resource.id = dishEntity.id;
        }
        return resource;
    }
}
