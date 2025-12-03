import { InventoryApi } from '../../../../inventory/infrastructure/inventory-api.js';

export class InventoryReportService {
    constructor() {
        this.inventoryApi = new InventoryApi();
    }

    async getAllItems() {
        return await this.inventoryApi.getItems();
    }

    async getAllProducts() {
        return await this.inventoryApi.getProducts();
    }

    async getInventorySummary(items = [], products = []) {
        const allProducts = products.length ? products : await this.getAllProducts();
        const allItems = items.length ? items : await this.getAllItems();

        const totalProducts = allProducts.length + allItems.length;

        // Total only considers quantities and prices of products
        const totalQuantity = allProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);

        const totalValue =
            allProducts.reduce((sum, p) => {
                const price =
                    Number(p.totalPrice) || (Number(p.unitPrice) || 0) * (Number(p.quantity) || 0);
                return sum + price;
            }, 0) +
            allItems.reduce((sum, i) => sum + (Number(i.price) || 0), 0); // Only uses price

        return {
            totalProducts,
            totalQuantity,
            totalValue,
        };
    }
}