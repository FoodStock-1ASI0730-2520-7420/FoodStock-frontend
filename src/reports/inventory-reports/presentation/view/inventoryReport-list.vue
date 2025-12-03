<script setup>
import { onMounted, computed, ref } from "vue";
import { useInventoryReportStore } from "../../application/inventoryReport.store.js";
import InventoryReportExport from "./inventoryReportExport.vue";

const store = useInventoryReportStore();

// Modal states
const showAllProductsModal = ref(false);
const showAllItemsModal = ref(false);

onMounted(async () => {
  await store.fetchInventoryData();
});

const products = computed(() => store.products);
const items = computed(() => store.items);
const summary = computed(() => store.summary);

const formatCurrency = (v) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(v) || 0);
</script>

<template>
  <div class="report-container">
    <!-- General Summary -->
    <section class="card">
      <h3>General Summary</h3>
      <div class="overview-grid">
        <div class="overview-item">
          <p>Total Products</p>
          <h4>{{ summary.totalProducts || 0 }}</h4>
        </div>
        <div class="overview-item">
          <p>Total Quantity</p>
          <h4>{{ summary.totalQuantity || 0 }}</h4>
        </div>
        <div class="overview-item">
          <p>Total Value</p>
          <h4>{{ formatCurrency(summary.totalValue || 0) }}</h4>
        </div>
      </div>
    </section>

    <!-- Products Table -->
    <section class="card">
      <div class="header">
        <h3>Products</h3>
        <a href="#" @click.prevent="showAllProductsModal = true">View More</a>
      </div>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Expiration Date</th>
          <th>Total Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in products.slice(0, 4)" :key="p.idProduct">
          <td>{{ p.idProduct }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.category || '-' }}</td>
          <td>{{ p.quantity || 0 }}</td>
          <td>{{ p.expirationDate || '-' }}</td>
          <td>{{ formatCurrency(p.totalPrice || p.unitPrice * p.quantity || 0) }}</td>
        </tr>
        </tbody>
      </table>
    </section>
    <!-- Items Table -->
    <section class="card">
      <div class="header">
        <h3>Ingredients</h3>
        <a href="#" @click.prevent="showAllItemsModal = true">View More</a>
      </div>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="i in items.slice(0, 4)" :key="i.id">
          <td>{{ i.id }}</td>
          <td>{{ i.name }}</td>
          <td>{{ formatCurrency(i.price) }}</td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- Export Buttons -->
    <InventoryReportExport />

    <!-- Modal — All Products -->
    <div
        v-if="showAllProductsModal"
        class="modal-overlay"
        @click.self="showAllProductsModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>All Products</h3>
          <button class="close-btn" @click="showAllProductsModal = false">X</button>
        </div>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Total Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in products" :key="p.idProduct">
            <td>{{ p.idProduct }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.category || '-' }}</td>
            <td>{{ p.quantity || 0 }}</td>
            <td>{{ p.expirationDate || '-' }}</td>
            <td>{{ formatCurrency(p.totalPrice || p.unitPrice * p.quantity || 0) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal — All Items -->
    <div
        v-if="showAllItemsModal"
        class="modal-overlay"
        @click.self="showAllItemsModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>All Items</h3>
          <button class="close-btn" @click="showAllItemsModal = false">X</button>
        </div>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="i in items" :key="i.id">
            <td>{{ i.id }}</td>
            <td>{{ i.name }}</td>
            <td>{{ formatCurrency(i.price) }}</td>
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
  gap: 18px;
}

.card {
  background: #fff;
  padding: 14px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.header a:hover {
  text-decoration: underline;
}

.overview-grid {
  display: flex;
  gap: 16px;
}

.overview-item p {
  margin: 0;
  color: #666;
}

.overview-item h4 {
  margin: 4px 0 0;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

thead {
  background: #f8f9fa;
}

th,
td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
}

th {
  color: #555;
  font-weight: 600;
}

tbody tr:hover {
  background: #f3f6fa;
}

/* Modal */
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