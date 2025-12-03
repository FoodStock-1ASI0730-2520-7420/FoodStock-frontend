<script setup>
import { onMounted, ref, computed } from "vue";
import { useSalesReportStore } from "../../application/salesReport.store.js";
import ReportExport from "./salesReportExport.vue";

const store = useSalesReportStore();

const fromDate = ref("");
const toDate = ref("");
const showAllDishesModal = ref(false);
const showAllPaymentsModal = ref(false);

// Load data on mount
onMounted(async () => {
  await store.fetchReports();           // Sales
  await store.fetchPaymentSummary();    // Summary by payment method
  await store.fetchBestSellingDishes(); // Best-selling dishes
});

// Computed properties for store data
const saleItems = computed(() => store.saleItems || []);
const paymentSummary = computed(() => store.paymentSummary || []);

// Inventory-like summary
const salesSummary = computed(() => {
  const reports = store.reports || [];
  const totalRevenue = reports.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
  const totalProfit = reports.reduce((sum, r) => sum + (Number(r.profit) || 0), 0);
  const totalSales = reports.length;
  return { totalRevenue, totalProfit, totalSales };
});

// Total amount across all payment methods
const totalAmountAllMethods = computed(() => {
  return paymentSummary.value.reduce(
      (sum, method) => sum + (Number(method.total) || 0),
      0
  );
});

// Currency formatting
const formatCurrency = (value) => {
  if (!value) return "S/. 0.00";
  return `S/. ${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>

<template>
  <div class="report-container">
    <!-- General Summary -->
    <section class="card overview">
      <h2>General Overview</h2>
      <div class="overview-grid">
        <div class="overview-item">
          <p>Total Revenue</p>
          <h3>{{ formatCurrency(salesSummary.totalRevenue) }}</h3>
        </div>
        <div class="overview-item">
          <p>Net Profit</p>
          <h3>{{ formatCurrency(salesSummary.totalProfit) }}</h3>
        </div>
        <div class="overview-item">
          <p>Total Sales</p>
          <h3>{{ salesSummary.totalSales }}</h3>
        </div>
      </div>
    </section>

    <!-- Popular Payment Methods -->
    <section class="card items">
      <div class="header">
        <h2>Popular Payment Methods</h2>
        <a href="#" @click.prevent="showAllPaymentsModal = true">View All</a>
      </div>
      <table>
        <thead>
        <tr>
          <th>Payment Method</th>
          <th>Transactions</th>
          <th>Total Amount</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(method, index) in paymentSummary.slice(0,4)" :key="index">
          <td>{{ method.method || "Unknown" }}</td>
          <td>{{ method.transactions || 0 }}</td>
          <td>{{ formatCurrency(method.total) }}</td>
        </tr>
        <tr style="font-weight:bold; border-top:2px solid #ddd;">
          <td>Total</td>
          <td></td>
          <td>{{ formatCurrency(totalAmountAllMethods) }}</td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- Best-Selling Dishes -->
    <section class="card items">
      <div class="header">
        <h2>Best Selling Dishes</h2>
        <a href="#" @click.prevent="showAllDishesModal = true">View All</a>
      </div>
      <table>
        <thead>
        <tr>
          <th>Dish</th>
          <th>Item ID</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Profit</th>
          <th>Sales (%)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in saleItems.slice(0,4)" :key="item.id">
          <td>{{ item.name || "Unknown" }}</td>
          <td>{{ item.id }}</td>
          <td>{{ item.category || "N/A" }}</td>
          <td>{{ item.quantity || 0 }}</td>
          <td>{{ formatCurrency(item.subtotal) }}</td>
          <td class="percent">{{ item.salesPercent }}%</td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- Export -->
    <ReportExport />

    <!-- Modal — All Payments -->
    <div v-if="showAllPaymentsModal" class="modal-overlay" @click.self="showAllPaymentsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>All Payment Transactions</h3>
          <button class="close-btn" @click="showAllPaymentsModal = false">X</button>
        </div>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Sale Type</th>
            <th>Payment Method</th>
            <th>Total</th>
            <th>Waiter</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="sale in store.reports" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td>{{ sale.creationDate }}</td>
            <td>{{ sale.creationTime }}</td>
            <td>{{ sale.saleType }}</td>
            <td>{{ sale.paymentMethod }}</td>
            <td>{{ formatCurrency(sale.total) }}</td>
            <td>{{ sale.waiter }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal — All Dishes -->
    <div v-if="showAllDishesModal" class="modal-overlay" @click.self="showAllDishesModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>All Dishes</h3>
          <button class="close-btn" @click="showAllDishesModal = false">X</button>
        </div>
        <table>
          <thead>
          <tr>
            <th>Dish</th>
            <th>Item ID</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Profit</th>
            <th>Sales (%)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in saleItems" :key="item.id">
            <td>{{ item.name || "Unknown" }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.category || "N/A" }}</td>
            <td>{{ item.quantity || 0 }}</td>
            <td>{{ formatCurrency(item.subtotal) }}</td>
            <td class="percent">{{ item.salesPercent }}%</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
}

.overview-item h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.overview-item p {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.overview-date {
  text-align: right;
  font-weight: bold;
  color: #555;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  background: #f4f6f8;
  padding: 10px;
  font-weight: 600;
}

td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.percent {
  color: green;
}

.export-grid {
  display: flex;
  align-items: center;
  gap: 16px;
}

input[type="date"] {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

button.excel {
  background-color: #007bff;
}

button.pdf {
  background-color: #dc3545;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>