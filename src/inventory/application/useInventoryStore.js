import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ProductService } from "./product.service.js";
import { DishService } from "./dish.service.js";

const dishService = new DishService();
const productService = new ProductService();

export const useInventoryStore = defineStore('inventory', () => {
    const dishes = ref([]);
    const products = ref([]);
    const errors = ref([]);
    const dishesLoaded = ref(false);
    const productsLoaded = ref(false);

    const dishesCount = computed(() => dishes.value.length);
    const productsCount = computed(() => products.value.length);

    // Dishes
    async function fetchDishes() {
        if (dishesLoaded.value) return;
        try {
            const fetched = await dishService.getDishes();
            dishes.value = fetched;
            dishesLoaded.value = true;
        } catch (e) {
            errors.value.push(e);
        }
    }
    async function addDish(dishEntity) {
        try {
            const newDish = await dishService.createDish(dishEntity);
            dishes.value.push(newDish);
            return newDish;
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }
    async function updateDish(dishEntity) {
        try {
            const updated = await dishService.updateDish(dishEntity);
            const idx = dishes.value.findIndex(d => d.id === updated.id);
            if (idx !== -1) dishes.value[idx] = updated;
            return updated;
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }
    async function deleteDish(id) {
        try {
            await dishService.deleteDish(id);
            const idx = dishes.value.findIndex(d => d.id === id);
            if (idx !== -1) dishes.value.splice(idx, 1);
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }

    // Products
    async function fetchProducts() {
        if (productsLoaded.value) return;
        try {
            const fetched = await productService.getProducts();
            products.value = fetched;
            productsLoaded.value = true;
        } catch (e) {
            errors.value.push(e);
        }
    }
    async function addProduct(productEntity) {
        try {
            const created = await productService.createProduct(productEntity);
            products.value.push(created);
            return created;
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }
    async function updateProduct(productEntity) {
        try {
            const updated = await productService.updateProduct(productEntity);
            const idx = products.value.findIndex(p => p.id === updated.id);
            if (idx !== -1) products.value[idx] = updated;
            return updated;
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }
    async function deleteProduct(id) {
        try {
            await productService.deleteProduct(id);
            const idx = products.value.findIndex(p => p.id == id);
            if (idx !== -1) products.value.splice(idx, 1);
        } catch (e) {
            errors.value.push(e);
            throw e;
        }
    }

    return {
        dishes, products, errors,
        dishesLoaded, productsLoaded,
        dishesCount, productsCount,
        fetchDishes, addDish, updateDish, deleteDish,
        fetchProducts, addProduct, updateProduct, deleteProduct
    };
});
