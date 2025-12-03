export class Dish {
    constructor({ id = null, name = '', priceUnit = 0, ingredients = [] } = {}) {
        this.id = id;
        this.name = name;
        this.priceUnit = priceUnit; // ✅ agregado para alinearse al backend
        // ingredients: [{ productId, quantity }]
        this.ingredients = Array.isArray(ingredients) ? ingredients : [];
    }
}
