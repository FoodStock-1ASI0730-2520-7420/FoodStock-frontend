import {SalesApi} from "../infrastructure/sales-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SaleAssembler} from "../infrastructure/sale.assembler.js";
import {SaleItemAssembler} from "../infrastructure/saleItem.assembler.js";

const salesApi = new SalesApi();

const useSalesStore= defineStore('sales', () => {

    const sales = ref([]);
    const errors = ref([]);
    const salesLoaded = ref(false);
    const salesCount = computed(() =>
        salesLoaded.value ? sales.value.length : 0);

    function fetchSales() {
        salesApi.getSales().then(response => {
            sales.value = SaleAssembler.toEntitiesFromResponse(response);
            salesLoaded.value = true;
            console.log(salesLoaded.value);
            console.log(sales.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getSaleById(id) {
        let idNum = parseInt(id);
        return sales.value.find(sale => sale["id"] === idNum);
    }

    function addSale(sale) {
        return salesApi.createSale(sale).then(response => {
            const resource = response.data;
            const newSale = SaleAssembler.toEntityFromResource(resource);
            sales.value.push(newSale);
            return response;
        }).catch(error => {
            errors.value.push(error);
            throw  error;
        });
    }

    function updateSale(sale) {
        salesApi.updateSale(sale).then(response => {
            const resource = response.data;
            const updatedSale = SaleAssembler.toEntityFromResource(resource);
            const index = sales.value.findIndex(s => s["id"] === updatedSale.id);
            if (index !== -1) sales.value[index] = updatedSale;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteSale(sale) {
        salesApi.deleteSale(sale.id).then(() => {
            const index = sales.value.findIndex(s => s["id"] === sale.id);
            if (index !== -1) sales.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        sales,
        errors,
        salesLoaded,
        salesCount,
        fetchSales,
        getSaleById,
        addSale,
        updateSale,
        deleteSale,
    }
});

export default useSalesStore;