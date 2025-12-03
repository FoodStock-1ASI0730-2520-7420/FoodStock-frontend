import { defineStore } from "pinia";
import { ref } from "vue";
import { SalesReportService } from "../domain/services/salesReport.service.js";

const service = new SalesReportService();

export const useSalesReportStore = defineStore("salesReport", () => {
    const reports = ref([]);
    const saleItems = ref([]);
    const paymentSummary = ref([]); //Payment methods summary state
    const errors = ref([]);
    const loading = ref(false);

    //Fetch all sales reports
    async function fetchReports() {
        loading.value = true;
        try {
            const data = await service.getAllReports();
            reports.value = data;
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching reports:", error);
        } finally {
            loading.value = false;
        }
    }

    // Fetch all sale items
    async function fetchSaleItems() {
        loading.value = true;
        try {
            const data = await service.getSaleItems();
            saleItems.value = data;
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching sale items:", error);
        } finally {
            loading.value = false;
        }
    }

    //Fetch summary of payment methods
    async function fetchPaymentSummary() {
        loading.value = true;
        try {
            const data = await service.getPaymentMethodsSummary();
            paymentSummary.value = data;
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching payment summary:", error);
        } finally {
            loading.value = false;
        }
    }

    //Fetch best selling dishes with percentages
    async function fetchBestSellingDishes() {
        loading.value = true;
        try {
            saleItems.value = await service.getBestSellingDishes();
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching best selling dishes:", error);
        } finally {
            loading.value = false;
        }
    }

    return {
        reports,
        saleItems,
        paymentSummary,
        errors,
        loading,
        fetchReports,             // Fetch all sales reports
        fetchSaleItems,           // Fetch all sale items
        fetchPaymentSummary,      // Fetch summary of payment methods
        fetchBestSellingDishes,   // Fetch best selling dishes with percentages
    };
});
