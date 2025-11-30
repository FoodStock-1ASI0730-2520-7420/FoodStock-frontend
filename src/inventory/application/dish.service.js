// javascript
// file: `src/inventory/application/dish.service.js`
import { InventoryApi } from '../infrastructure/inventory-api.js';

export class DishService {
    #inventoryApi;

    constructor(inventoryApi = new InventoryApi()) {
        this.#inventoryApi = inventoryApi;
    }

    async getDishes() {
        return this.#inventoryApi.getDishes();
    }

    async getDishById(id) {
        return this.#inventoryApi.getDishById(id);
    }

    async createDish(dishEntity) {
        if (!dishEntity || !dishEntity.name) {
            throw new Error('DishServiceError: El nombre del plato es requerido.');
        }

        if (!this.#inventoryApi || typeof this.#inventoryApi.createDish !== 'function' ||
            typeof this.#inventoryApi.getProducts !== 'function' ||
            typeof this.#inventoryApi.consumeProduct !== 'function') {
            throw new Error('DishServiceError: inventoryApi no tiene los métodos necesarios (createDish/getProducts/consumeProduct).');
        }

        // ingredientes como array
        const ingredients = Array.isArray(dishEntity.ingredients)
            ? dishEntity.ingredients
            : (() => { try { return JSON.parse(dishEntity.ingredients || '[]'); } catch { return []; } })();

        // import dinámico del assembler
        let Assembler = null;
        try {
            const mod = await import('../infrastructure/dish.assembler.js');
            Assembler = mod?.DishAssembler ?? mod?.default ?? null;
        } catch {
            console.warn('[DishService] dish.assembler.js no disponible, usando fallback');
        }

        const AssemblerSafe = Assembler ?? {
            toResource: (e) => ({
                name: e.name,
                priceUnit: e.priceUnit ?? 0,
                ingredients: e.ingredients ?? [],
            }),
        };

        // convertir entidad a resource
        const resource = AssemblerSafe.toResource(dishEntity);
        resource.ingredients = ingredients; // mantener array

        console.log('[DishService] createDish -> resource (body):', resource);

        let createdDish;
        try {
            const res = await this.#inventoryApi.createDish(resource);
            createdDish = res?.data ?? res;
            console.log('[DishService] plato creado (raw):', createdDish);

            createdDish.ingredients = ingredients;
        } catch (err) {
            console.error('[DishService] create dish failed', err?.response ?? err);
            if (err?.response?.data) console.error('[DishService] response data:', err.response.data);
            throw err;
        }

        // consumir stock usando backend
        try {
            await Promise.all(ingredients.map(async ing => {
                if (!ing.productId) {
                    console.warn('[DishService] ingredient sin productId, se omite:', ing);
                    return;
                }
                console.log('[DishService] consumiendo producto', ing.productId, 'cantidad:', ing.quantity);
                await this.#inventoryApi.consumeProduct(ing.productId, { amount: ing.quantity });
            }));
            return createdDish;
        } catch (err) {
            console.error('[DishService] consume products failed, rolling back dish', err);
            try {
                const id = createdDish?.id ?? createdDish?._id;
                if (id) {
                    await this.#inventoryApi.deleteDish(id);
                    console.log('[DishService] rollback successful, deleted dish id:', id);
                }
            } catch (rollbackErr) {
                console.error('[DishService] rollback delete failed', rollbackErr);
            }
            throw err;
        }
    }

    async updateDish(dishEntity) {
        if (!dishEntity?.id) throw new Error('DishServiceError: ID requerido para actualizar.');
        return this.#inventoryApi.updateDish(dishEntity);
    }

    deleteDish(id) {
        return this.#inventoryApi.deleteDish(id);
    }
}
