
<script setup>
import SalesReportList from "../sales-reports/presentation/view/salesReport-list.vue";
import InventoryReportList from "../inventory-reports/presentation/view/inventoryReport-list.vue";
</script>

<template>
  <div class="reports-container">
    <h1 class="title">Reportes</h1>
    <div class="reports-grid">
      <div class="report-card">
        <h2>Reports de Ventas</h2>
        <SalesReportList />
      </div>
      <div class="report-card">
        <h2>Reports de Inventario</h2>
        <InventoryReportList />
      </div>
    </div>
  </div>
</template>



<style scoped>
.reports-container {
  width: 100%;
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.report-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
