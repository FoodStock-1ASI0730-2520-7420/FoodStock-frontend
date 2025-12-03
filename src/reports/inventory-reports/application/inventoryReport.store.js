import { defineStore } from 'pinia';
import { ref } from 'vue';
import { InventoryReportService } from '../domain/services/inventoryReport.service.js';

const service = new InventoryReportService();

export const useInventoryReportStore = defineStore('inventoryReport', () => {
    const items = ref([]);
    const products = ref([]);
    const summary = ref({});
    const errors = ref([]);
    const loading = ref(false);

    async function fetchInventoryData() {
        loading.value = true;
        try {
            const [allItems, allProducts] = await Promise.all([
                service.getAllItems(),
                service.getAllProducts(),
            ]);

            items.value = allItems;
            products.value = allProducts;
            summary.value = await service.getInventorySummary(allItems, allProducts);
        } catch (error) {
            console.error('InventoryReportStore error:', error);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    return {
        items,
        products,
        summary,
        errors,
        loading,
        fetchInventoryData,
    };
});
