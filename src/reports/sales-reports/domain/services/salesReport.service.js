// src/sales-reports/domain/services/salesReport.service.js
import { SalesApi } from "../../../../sales/infrastructure/sales-api.js";
import { SaleAssembler } from "../../../../sales/infrastructure/sale.assembler.js";
import { SaleItemAssembler } from "../../../../sales/infrastructure/saleItem.assembler.js";

export class SalesReportService {
    constructor() {
        this.salesApi = new SalesApi();
    }

    // Get all sales using SalesApi and SaleAssembler
    async getAllReports() {
        const response = await this.salesApi.getSales();
        // Use the real method defined in sales
        return SaleAssembler.toEntitiesFromResponse(response);
    }

    // Get all sale items using SalesApi and SaleItemAssembler
    async getSaleItems() {
        const response = await this.salesApi.getAllSaleItems();
        return SaleItemAssembler.toEntitiesFromResponse(response);
    }

    // Generate a summary of payment methods
    async getPaymentMethodsSummary() {
        const sales = await this.getAllReports();
        const summary = {};

        for (const sale of sales) {
            const rawMethod = sale.paymentMethod || "unknown";
            const method =
                rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1).toLowerCase();

            if (!summary[method]) summary[method] = { transactions: 0, total: 0 };

            summary[method].transactions++;
            summary[method].total += Number(sale.total) || 0;
        }

        return Object.entries(summary).map(([method, data]) => ({
            method,
            ...data,
        }));
    }

    // Get best selling dishes with percentages
    async getBestSellingDishes() {
        const items = await this.getSaleItems();

        // Group items by dish name (or ID if preferred)
        const grouped = {};
        items.forEach(item => {
            const key = item.name || "Unknown";
            if (!grouped[key]) {
                grouped[key] = { ...item, quantity: 0, subtotal: 0 };
            }
            grouped[key].quantity += item.quantity || 0;
            grouped[key].subtotal += item.subtotal || 0;
        });

        // Convert to array and calculate percentage
        const totalQuantity = Object.values(grouped).reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        return Object.values(grouped)
            .map(item => ({
                ...item,
                salesPercent: totalQuantity ? ((item.quantity / totalQuantity) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.quantity - a.quantity); // Descending order
    }
}
